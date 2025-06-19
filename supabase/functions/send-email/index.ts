import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Content-Type': 'application/json'
};

interface EmailRequest {
  email: string;
  description: {
    title: string;
    text: string;
    keywords: string[];
    seoMetadata: {
      title: string;
      description: string;
      tags: string[];
    };
    createdAt: string;
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    
    const { email, description }: EmailRequest = await req.json();

    if (!email || !description) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: email and description' 
        }),
        { 
          status: 400, 
          headers: corsHeaders
        }
      );
    }

    // Check if email service is configured
    if (!RESEND_API_KEY) {
      console.log('Email service not configured - demo mode');
      
      // In demo mode, just log the email content and return success
      console.log('Demo email would be sent to:', email);
      console.log('Email content:', {
        subject: `Your SEO-Optimized Description: ${description.title}`,
        description: description.text,
        seoTags: description.seoMetadata.tags
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Email sent successfully (demo mode)'
        }),
        {
          headers: corsHeaders
        }
      );
    }

    // Create HTML email content
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your SEO-Optimized Product Description</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e40af, #0d9488); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .section { background: white; padding: 20px; margin: 20px 0; border-radius: 6px; border-left: 4px solid #1e40af; }
        .tag { display: inline-block; background: #dbeafe; color: #1e40af; padding: 4px 8px; margin: 2px; border-radius: 4px; font-size: 12px; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📸 SEO Snap</h1>
        <p>Your AI-Generated Product Description</p>
    </div>
    
    <div class="content">
        <div class="section">
            <h2>📝 Product Title</h2>
            <p><strong>${description.title}</strong></p>
        </div>
        
        <div class="section">
            <h2>📄 Product Description</h2>
            <p>${description.text.replace(/\n/g, '<br>')}</p>
        </div>
        
        <div class="section">
            <h2>🎯 SEO Metadata</h2>
            <p><strong>SEO Title:</strong> ${description.seoMetadata.title}</p>
            <p><strong>Meta Description:</strong> ${description.seoMetadata.description}</p>
        </div>
        
        <div class="section">
            <h2>🏷️ SEO Tags</h2>
            <div>
                ${description.seoMetadata.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
        
        <div class="section">
            <h2>🔑 Keywords</h2>
            <p>${description.keywords.join(', ')}</p>
        </div>
    </div>
    
    <div class="footer">
        <p>Generated on ${new Date(description.createdAt).toLocaleDateString()}</p>
        <p>Powered by <strong>SEO Snap</strong> - AI-Powered Product Descriptions</p>
        <p><a href="https://seosnap.com" style="color: #1e40af;">Visit SEO Snap</a></p>
    </div>
</body>
</html>`;

    // Send email using Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SEO Snap <noreply@seosnap.com>',
        to: [email],
        subject: `Your SEO-Optimized Description: ${description.title}`,
        html: htmlContent,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('Resend API error:', errorText);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to send email. Please try again.' 
        }),
        { 
          status: 500, 
          headers: corsHeaders
        }
      );
    }

    const emailData = await emailResponse.json();
    console.log('Email sent successfully:', emailData.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email sent successfully'
      }),
      {
        headers: corsHeaders
      }
    );

  } catch (error) {
    console.error('Error in send-email function:', error);
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