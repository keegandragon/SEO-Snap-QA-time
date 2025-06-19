import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Content-Type': 'application/json'
};

interface GenerateRequest {
  image: string; // base64 encoded image
  userId: string;
  usageLimit: number;
  isPremium: boolean;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const GOOGLE_API_KEY = Deno.env.get('GOOGLE_AI_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
      },
    });

    const { image, userId, usageLimit, isPremium }: GenerateRequest = await req.json();

    if (!image || !userId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: image and userId' 
        }),
        { 
          status: 400, 
          headers: corsHeaders
        }
      );
    }

    // Check if Google AI API key is configured
    if (!GOOGLE_API_KEY) {
      console.error('Google AI API key not configured');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'AI service not configured. Please contact support.' 
        }),
        { 
          status: 500, 
          headers: corsHeaders
        }
      );
    }

    // Check user's current usage
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('usage_count, usage_limit, is_premium')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to verify user account' 
        }),
        { 
          status: 500, 
          headers: corsHeaders
        }
      );
    }

    // Check usage limits
    if (!userData.is_premium && userData.usage_count >= userData.usage_limit) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Monthly usage limit exceeded. Please upgrade your plan.' 
        }),
        { 
          status: 429, 
          headers: corsHeaders
        }
      );
    }

    // Determine plan features
    let maxTags = 5;
    let maxWords = 150;
    
    if (isPremium) {
      if (usageLimit === 50) { // Starter plan
        maxTags = 10;
        maxWords = 300;
      } else if (usageLimit === 200) { // Pro plan
        maxTags = 15;
        maxWords = 500;
      }
    }

    // Call Google Gemini Vision API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analyze this product image and generate:
1. A compelling product title (max 60 characters)
2. A detailed product description (max ${maxWords} words)
3. Exactly ${maxTags} SEO-optimized tags/keywords

The description should be engaging, highlight key features and benefits, and be optimized for e-commerce. Focus on what makes this product appealing to potential buyers.

Format your response as JSON with these exact keys:
{
  "title": "Product title here",
  "description": "Detailed product description here",
  "seoTags": ["tag1", "tag2", "tag3", ...]
}

Make sure the description is compelling for online shoppers and includes relevant keywords naturally.`
                },
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: image
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        })
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      
      if (geminiResponse.status === 400 && errorText.includes('safety')) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Image content was blocked by safety filters. Please try a different image.' 
          }),
          { 
            status: 400, 
            headers: corsHeaders
          }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'AI service temporarily unavailable. Please try again.' 
        }),
        { 
          status: 500, 
          headers: corsHeaders
        }
      );
    }

    const geminiData = await geminiResponse.json();
    
    if (!geminiData.candidates || geminiData.candidates.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No content generated. Please try a different image.' 
        }),
        { 
          status: 400, 
          headers: corsHeaders
        }
      );
    }

    const generatedText = geminiData.candidates[0].content.parts[0].text;
    
    // Parse the JSON response from Gemini
    let parsedResponse;
    try {
      // Extract JSON from the response (sometimes it's wrapped in markdown)
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      console.error('Raw response:', generatedText);
      
      // Fallback: create a basic response
      parsedResponse = {
        title: 'Product Description',
        description: generatedText.slice(0, maxWords * 6), // Rough word estimate
        seoTags: ['product', 'quality', 'buy', 'shop', 'online']
      };
    }

    // Ensure we have the required fields
    const title = parsedResponse.title || 'Product Description';
    const description = parsedResponse.description || generatedText.slice(0, maxWords * 6);
    const seoTags = Array.isArray(parsedResponse.seoTags) 
      ? parsedResponse.seoTags.slice(0, maxTags)
      : ['product', 'quality', 'buy', 'shop', 'online'].slice(0, maxTags);

    // Store the generation in the database
    const { error: insertError } = await supabase
      .from('ai_outputs')
      .insert({
        upload_id: null, // We're not using uploads table in this simplified version
        product_description: description,
        seo_tags: seoTags
      });

    if (insertError) {
      console.error('Error storing AI output:', insertError);
      // Don't fail the request if we can't store the output
    }

    return new Response(
      JSON.stringify({
        success: true,
        title: title,
        description: description,
        seoTags: seoTags
      }),
      {
        headers: corsHeaders
      }
    );

  } catch (error) {
    console.error('Error in generate-description function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error. Please try again.' 
      }),
      { 
        status: 500, 
        headers: corsHeaders
      }
    );
  }
});