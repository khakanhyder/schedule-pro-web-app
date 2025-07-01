import { MailService } from '@sendgrid/mail';

// Configure SendGrid with proper API key
const mailService = new MailService();

if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.startsWith('SG.')) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
  console.log("✅ SendGrid email service configured successfully");
} else {
  console.log("⚠️ Valid SendGrid API key not found - email previews only");
}

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_API_KEY.startsWith('SG.')) {
    console.log("⚠️ SendGrid not configured - showing preview only");
    return false;
  }

  try {
    await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text || '',
      html: params.html || '',
    });
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
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
    to: clientEmail,
    from: 'noreply@scheduled.app', // Default sender - can be customized
    subject: `Please share your experience with ${businessName}`,
    text: textContent,
    html: htmlContent
  });
}