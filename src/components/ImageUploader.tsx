import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, AlertCircle, Plus } from 'lucide-react';
import { UploadedImage } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';

interface ImageUploaderProps {
  onImageUpload: (images: UploadedImage[]) => void;
  className?: string;
  maxImages?: number;
  planType?: 'free' | 'starter' | 'pro';
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUpload,
  className = '',
  maxImages = 1,
  planType = 'free'
}) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Update parent component whenever uploadedImages changes
  useEffect(() => {
    onImageUpload(uploadedImages);
  }, [uploadedImages, onImageUpload]);

  const uploadToSupabase = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploadError(null);
    
    // Check if adding these files would exceed the limit
    const totalFiles = uploadedImages.length + acceptedFiles.length;
    if (totalFiles > maxImages) {
      setUploadError(`You can only upload ${maxImages} image${maxImages > 1 ? 's' : ''} at a time with your ${planType} plan.`);
      return;
    }

    // Process each file
    const newImages: UploadedImage[] = acceptedFiles.map(file => ({
      id: uuidv4(),
      file,
      preview: URL.createObjectURL(file),
      status: 'uploading' as const
    }));

    // Add new images to the list immediately
    setUploadedImages(prev => [...prev, ...newImages]);

    // Upload each file and update status
    for (let i = 0; i < newImages.length; i++) {
      const newImage = newImages[i];
      try {
        const publicUrl = await uploadToSupabase(newImage.file);
        
        // Update the specific image status to complete
        setUploadedImages(prev => 
          prev.map(img => 
            img.id === newImage.id 
              ? { ...img, status: 'complete' as const, publicUrl }
              : img
          )
        );
      } catch (error) {
        console.error('Upload error:', error);
        
        // Update the specific image status to error
        setUploadedImages(prev => 
          prev.map(img => 
            img.id === newImage.id 
              ? { 
                  ...img, 
                  status: 'error' as const, 
                  error: error instanceof Error ? error.message : 'Upload failed' 
                }
              : img
          )
        );
      }
    }
  }, [uploadedImages, maxImages, planType]);

  const removeImage = (imageId: string) => {
    const imageToRemove = uploadedImages.find(img => img.id === imageId);
    if (imageToRemove?.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 5242880, // 5MB
    multiple: maxImages > 1,
    disabled: uploadedImages.length >= maxImages
  });

  const canUploadMore = uploadedImages.length < maxImages;
  const remainingSlots = maxImages - uploadedImages.length;
  const allImagesComplete = uploadedImages.length > 0 && uploadedImages.every(img => img.status === 'complete');
  const hasUploadingImages = uploadedImages.some(img => img.status === 'uploading');
  const hasErrorImages = uploadedImages.some(img => img.status === 'error');

  return (
    <div className={`space-y-4 ${className}`}>
      {uploadError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span className="text-sm">{uploadError}</span>
        </div>
      )}

      {/* Upload Status Indicator */}
      {uploadedImages.length > 0 && (
        <div className={`p-3 rounded-md border ${
          allImagesComplete 
            ? 'bg-green-50 border-green-200 text-green-800'
            : hasErrorImages
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <div className="flex items-center text-sm">
            {allImagesComplete ? (
              <>
                <div className="w-4 h-4 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                All images uploaded successfully! Ready to generate descriptions.
              </>
            ) : hasUploadingImages ? (
              <>
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                Uploading images... ({uploadedImages.filter(img => img.status === 'complete').length}/{uploadedImages.length} complete)
              </>
            ) : hasErrorImages ? (
              <>
                <AlertCircle className="h-4 w-4 mr-2" />
                Some images failed to upload. Please try again.
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Upload Area */}
      {canUploadMore && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-2">
            <UploadCloud className={`h-10 w-10 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
            <p className="text-sm font-medium text-gray-700">
              {isDragActive
                ? 'Drop the images here...'
                : maxImages > 1
                ? `Drag & drop up to ${remainingSlots} more image${remainingSlots !== 1 ? 's' : ''} here, or click to select`
                : 'Drag & drop a product image here, or click to select'}
            </p>
            <p className="text-xs text-gray-500">
              JPG, PNG, GIF or WebP • Max 5MB each
            </p>
            {maxImages > 1 && (
              <p className="text-xs text-blue-600 font-medium">
                {planType.charAt(0).toUpperCase() + planType.slice(1)} Plan: {uploadedImages.length}/{maxImages} images
              </p>
            )}
          </div>
        </div>
      )}

      {/* Plan Upgrade Hint */}
      {!canUploadMore && maxImages === 1 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-sm text-blue-800 mb-2">
            Want to upload multiple images at once?
          </p>
          <p className="text-xs text-blue-600">
            Upgrade to <strong>Starter</strong> (2 images) or <strong>Pro</strong> (10 images) for batch processing!
          </p>
        </div>
      )}

      {/* Uploaded Images Grid */}
      {uploadedImages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              Uploaded Images ({uploadedImages.length}/{maxImages})
            </h4>
            {canUploadMore && (
              <button
                {...getRootProps()}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add More
              </button>
            )}
          </div>
          
          <div className={`grid gap-4 ${
            maxImages > 1 
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
              : 'grid-cols-1 max-w-sm mx-auto'
          }`}>
            {uploadedImages.map((image) => (
              <div key={image.id} className="relative group card p-2 h-32 flex items-center justify-center overflow-hidden">
                {image.status === 'uploading' ? (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-gray-500">Uploading...</span>
                  </div>
                ) : image.status === 'error' ? (
                  <div className="flex flex-col items-center justify-center space-y-2 text-red-500">
                    <AlertCircle className="h-6 w-6" />
                    <span className="text-xs text-center">{image.error || 'Upload failed'}</span>
                  </div>
                ) : (
                  <>
                    <img 
                      src={image.preview} 
                      alt="Product preview" 
                      className="h-full w-full object-contain"
                    />
                    <div className="absolute top-1 right-1 bg-green-500 rounded-full p-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute top-1 left-1 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3 text-gray-500 hover:text-red-500" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;