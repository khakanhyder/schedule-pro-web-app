import { Resend } from 'resend';

// Switch to Resend - much more reliable than SendGrid
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

if (resend) {
  console.log("✅ Resend email service configured successfully");
} else {
  console.log("⚠️ RESEND_API_KEY not found - email previews only");
}

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!resend) {
    console.log("⚠️ Resend not configured - showing preview only");
    return false;
  }

  try {
    console.log(`📧 Attempting to send email to ${params.to} from ${params.from}`);
    
    const result = await resend.emails.send({
      from: params.from,
      to: params.to,
      subject: params.subject,
      text: params.text || '',
      html: params.html || params.text || '',
    });
    
    if (result.data?.id) {
      console.log(`✅ Resend email sent successfully! ID:`, result.data.id);
      return true;
    } else {
      console.log(`⚠️ Resend response unclear:`, result);
      return false;
    }
  } catch (error: any) {
    console.error('❌ Resend email error details:');
    console.error('Message:', error.message);
    return false;
  }
}

export async function sendReviewRequestEmail(
  clientName: string,
  clientEmail: string,
  platform: string,
  customMessage: string,
  businessName: string = "Your Business"
): Promise<boolean> {
  // For testing: Use verified email address instead of client email
  const testEmailMode = true;
  const actualRecipient = testEmailMode ? "kbkrystalbeeler@gmail.com" : clientEmail;
  const platformUrls: Record<string, string> = {
    google: "https://www.google.com/search?q=" + encodeURIComponent(businessName),
    yelp: "https://www.yelp.com/writeareview/biz/" + encodeURIComponent(businessName.toLowerCase().replace(/\s+/g, '-')),
    facebook: "https://www.facebook.com/search/top?q=" + encodeURIComponent(businessName)
  };

  const reviewUrl = platformUrls[platform] || platformUrls.google;
  const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333; text-align: center;">We'd Love Your Feedback!</h2>
      
      <p style="color: #666; font-size: 16px; line-height: 1.5;">
        Hi ${clientName},
      </p>
      
      <p style="color: #666; font-size: 16px; line-height: 1.5;">
        ${customMessage}
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${reviewUrl}" 
           style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
          Leave a Review on ${platformName}
        </a>
      </div>
      
      <p style="color: #999; font-size: 14px; text-align: center;">
        Thank you for choosing ${businessName}!
      </p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #999; font-size: 12px; text-align: center;">
        This email was sent because you recently used our services. 
        If you have any questions, please contact us directly.
      </p>
    </div>
  `;

  const textContent = `
Hi ${clientName},

${customMessage}

Please leave us a review on ${platformName}: ${reviewUrl}

Thank you for choosing ${businessName}!

---
This email was sent because you recently used our services. 
If you have any questions, please contact us directly.
  `;

  return await sendEmail({
    to: actualRecipient,
    from: 'onboarding@resend.dev', // Resend's verified sending domain
    subject: `Please share your experience with ${businessName}`,
    text: textContent,
    html: htmlContent
  });
}