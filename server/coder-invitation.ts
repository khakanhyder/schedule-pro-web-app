import { sendEmail } from "./sendgrid";

interface CoderInviteParams {
  coderName: string;
  coderEmail: string;
  projectName: string;
  projectDescription: string;
  estimatedBudget?: string;
  timeline?: string;
  techStack?: string[];
  contactEmail: string;
  contactName: string;
}

export async function sendCoderInvitation(params: CoderInviteParams): Promise<boolean> {
  const {
    coderName,
    coderEmail,
    projectName,
    projectDescription,
    estimatedBudget,
    timeline,
    techStack,
    contactEmail,
    contactName
  } = params;

  const techStackText = techStack && techStack.length > 0 
    ? `\n\n**Tech Stack:**\n${techStack.map(tech => `• ${tech}`).join('\n')}`
    : '';

  const budgetText = estimatedBudget ? `\n\n**Estimated Budget:** ${estimatedBudget}` : '';
  const timelineText = timeline ? `\n\n**Timeline:** ${timeline}` : '';

  const subject = `Project Opportunity: ${projectName}`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333; border-bottom: 2px solid #3b5ac2; padding-bottom: 10px;">
        Project Invitation: ${projectName}
      </h2>
      
      <p>Hi ${coderName},</p>
      
      <p>I hope this email finds you well. I'm reaching out regarding an exciting development opportunity that I believe would be a great fit for your skills.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #3b5ac2; margin-top: 0;">Project Overview</h3>
        <p style="margin-bottom: 10px;"><strong>Project:</strong> ${projectName}</p>
        <p style="line-height: 1.6;">${projectDescription}</p>
        ${budgetText}
        ${timelineText}
        ${techStackText}
      </div>
      
      <p>I'd love to discuss this opportunity with you in more detail. If you're interested, please reply to this email or reach out to me directly.</p>
      
      <p>Looking forward to potentially working together!</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
        <p style="margin-bottom: 5px;"><strong>${contactName}</strong></p>
        <p style="margin-bottom: 5px; color: #666;">Email: <a href="mailto:${contactEmail}">${contactEmail}</a></p>
      </div>
    </div>
  `;

  const textContent = `
Hi ${coderName},

I hope this email finds you well. I'm reaching out regarding an exciting development opportunity that I believe would be a great fit for your skills.

Project: ${projectName}
${projectDescription}
${budgetText}
${timelineText}
${techStackText}

I'd love to discuss this opportunity with you in more detail. If you're interested, please reply to this email or reach out to me directly.

Looking forward to potentially working together!

Best regards,
${contactName}
Email: ${contactEmail}
  `;

  try {
    console.log(`📧 CODER INVITATION EMAIL PREVIEW:`);
    console.log(`═══════════════════════════════════════════════════════════`);
    console.log(`FROM: ${contactEmail}`);
    console.log(`TO: ${coderEmail}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`═══════════════════════════════════════════════════════════`);
    console.log(textContent);
    console.log(`═══════════════════════════════════════════════════════════`);

    const emailSent = await sendEmail({
      to: coderEmail,
      from: 'onboarding@resend.dev',
      subject: subject,
      text: textContent,
      html: htmlContent
    });

    if (emailSent) {
      console.log(`🚀 SUCCESS: Coder invitation sent to ${coderEmail}!`);
      return true;
    } else {
      console.log(`❌ Failed to send invitation to ${coderEmail}`);
      return false;
    }
  } catch (error) {
    console.error('Error sending coder invitation:', error);
    return false;
  }
}