import { Resend } from 'resend';

// Simple test to verify Resend is working
export async function testResendConnection(): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.log("❌ No RESEND_API_KEY found");
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    console.log("🧪 Testing Resend connection...");
    
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'kbkrystalbeeler@gmail.com', // Your email
      subject: 'Resend Connection Test',
      html: '<p>This is a test email to verify Resend is working properly.</p>',
    });

    if (result.data?.id) {
      console.log(`✅ Resend test successful! Email ID: ${result.data.id}`);
    } else {
      console.log(`❌ Resend test failed. Response:`, result);
    }
  } catch (error: any) {
    console.log(`❌ Resend error:`, error.message);
    if (error.message.includes('API key')) {
      console.log("   → Check your Resend API key is correct");
    }
  }
}