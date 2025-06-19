import { ProductDescription } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { updateUserUsage } from './authService';
import { supabase } from '../lib/supabase';

const MAX_IMAGE_SIZE = 1024; // Maximum dimension in pixels
const IMAGE_QUALITY = 0.8; // JPEG compression quality (0-1)

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
};

// Helper function to resize and compress image
const processImage = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height && width > MAX_IMAGE_SIZE) {
          height = Math.round((height * MAX_IMAGE_SIZE) / width);
          width = MAX_IMAGE_SIZE;
        } else if (height > MAX_IMAGE_SIZE) {
          width = Math.round((width * MAX_IMAGE_SIZE) / height);
          height = MAX_IMAGE_SIZE;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress image
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob'));
            return;
          }
          
          // Create a new File object
          const processedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          
          resolve(processedFile);
        }, 'image/jpeg', IMAGE_QUALITY);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

const generateProductDescription = async (
  imageFile: File, 
  imageSrc: string,
  userId: string,
  usageLimit: number,
  isPremium: boolean = false
): Promise<ProductDescription> => {
  try {
    console.log('Starting image processing...');
    
    // Process and resize the image
    const processedImage = await processImage(imageFile);
    console.log('Image processed successfully');
    
    // Convert the processed image to base64
    const base64Image = await fileToBase64(processedImage);
    console.log('Image converted to base64');

    // Call the Edge Function using the Supabase client
    const { data: functionData, error: functionError } = await supabase.functions.invoke(
      'generate-description',
      {
        body: {
          image: base64Image,
          userId: userId,
          usageLimit: usageLimit,
          isPremium: isPremium
        }
      }
    );

    if (functionError) {
      console.error('Edge function error:', functionError);
      throw new Error(`AI Service Error: ${functionError.message || 'Failed to call AI service'}`);
    }

    if (!functionData || !functionData.success) {
      throw new Error(`AI Generation Failed: ${functionData?.error || 'The AI service failed to generate a description'}`);
    }

    // Update user usage count
    await updateUserUsage(userId);

    // Return formatted product description
    return {
      id: uuidv4(),
      imageId: uuidv4(),
      imageSrc,
      title: functionData.title,
      text: functionData.description,
      keywords: functionData.seoTags,
      createdAt: new Date().toISOString(),
      seoMetadata: {
        title: functionData.title,
        description: functionData.description.slice(0, 155) + '...',
        tags: functionData.seoTags
      }
    };
  } catch (error) {
    console.error('Error generating product description:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Google API key')) {
        throw new Error('AI Service Configuration Error: The Google AI API key is not properly configured. Please contact support.');
      } else if (error.message.includes('safety filters')) {
        throw new Error('Image Content Error: The uploaded image was blocked by content safety filters. Please try a different image.');
      } else if (error.message.includes('Failed to fetch')) {
        throw new Error('Network Error: Unable to connect to the AI service. Please check your internet connection and try again.');
      }
    }
    
    throw new Error(error instanceof Error ? error.message : 'Failed to generate product description. Please try again.');
  }
};

export const sendDescriptionByEmail = async (email: string, description: ProductDescription): Promise<boolean> => {
  try {
    const { data: emailData, error: emailError } = await supabase.functions.invoke(
      'send-email',
      {
        body: {
          email,
          description
        }
      }
    );

    if (emailError) {
      throw new Error(emailError.message || 'Failed to send email');
    }

    if (!emailData || !emailData.success) {
      throw new Error(emailData?.error || 'Failed to send email');
    }

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to send email');
  }
};

export { generateProductDescription };