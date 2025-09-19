import nodemailer from 'nodemailer';
import type { IStorage } from './storage';

export interface EmailConfig {
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  smtpFromEmail: string;
  smtpFromName: string;
  smtpSecure: boolean;
}

export class EmailService {
  private storage: IStorage;

  constructor(storage: IStorage) {
    this.storage = storage;
  }

  async getEmailConfig(clientId: string): Promise<EmailConfig | null> {
    const config = await this.storage.getSmtpConfig(clientId);
    
    if (!config || !config.smtpEnabled || !config.smtpHost || !config.smtpUsername || !config.smtpPassword) {
      return null;
    }

    return {
      smtpHost: config.smtpHost,
      smtpPort: config.smtpPort || 587,
      smtpUsername: config.smtpUsername,
      smtpPassword: config.smtpPassword,
      smtpFromEmail: config.smtpFromEmail || config.smtpUsername,
      smtpFromName: config.smtpFromName || 'Scheduled Platform',
      smtpSecure: config.smtpSecure !== false // default to true
    };
  }

  async sendTestEmail(clientId: string, testEmail: string): Promise<{ success: boolean; message: string }> {
    try {
      const config = await this.getEmailConfig(clientId);
      
      if (!config) {
        throw new Error('SMTP configuration is not properly configured or not enabled');
      }

      // Create transporter
      const transporter = nodemailer.createTransport({
        host: config.smtpHost,
        port: config.smtpPort,
        secure: config.smtpSecure, // true for 465, false for other ports
        auth: {
          user: config.smtpUsername,
          pass: config.smtpPassword,
        },
        // Additional debug options
        debug: false,
        logger: false,
      });

      // Verify connection configuration
      await transporter.verify();

      // Send test email
      const info = await transporter.sendMail({
        from: `"${config.smtpFromName}" <${config.smtpFromEmail}>`,
        to: testEmail,
        subject: 'SMTP Test Email - Scheduled Platform',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">SMTP Configuration Test</h2>
            <p>This is a test email from your Scheduled platform SMTP configuration.</p>
            <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <h3 style="margin: 0 0 8px 0; color: #374151;">Configuration Details:</h3>
              <p style="margin: 4px 0; color: #6b7280;"><strong>SMTP Host:</strong> ${config.smtpHost}</p>
              <p style="margin: 4px 0; color: #6b7280;"><strong>Port:</strong> ${config.smtpPort}</p>
              <p style="margin: 4px 0; color: #6b7280;"><strong>Security:</strong> ${config.smtpSecure ? 'SSL/TLS' : 'STARTTLS'}</p>
              <p style="margin: 4px 0; color: #6b7280;"><strong>From:</strong> ${config.smtpFromName} &lt;${config.smtpFromEmail}&gt;</p>
            </div>
            <p>If you received this email, your SMTP configuration is working correctly!</p>
            <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
              This email was sent from the Scheduled business management platform.
            </p>
          </div>
        `,
        text: `
SMTP Configuration Test

This is a test email from your Scheduled platform SMTP configuration.

Configuration Details:
- SMTP Host: ${config.smtpHost}
- Port: ${config.smtpPort}
- Security: ${config.smtpSecure ? 'SSL/TLS' : 'STARTTLS'}
- From: ${config.smtpFromName} <${config.smtpFromEmail}>

If you received this email, your SMTP configuration is working correctly!

This email was sent from the Scheduled business management platform.
        `
      });

      return {
        success: true,
        message: `Test email sent successfully to ${testEmail}. Message ID: ${info.messageId}`
      };

    } catch (error) {
      console.error('Email sending error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Provide more specific error messages for common issues
      if (errorMessage.includes('EAUTH')) {
        return {
          success: false,
          message: 'Authentication failed. Please check your username and password.'
        };
      } else if (errorMessage.includes('ECONNECTION')) {
        return {
          success: false,
          message: 'Connection failed. Please check your SMTP host and port settings.'
        };
      } else if (errorMessage.includes('ETIMEDOUT')) {
        return {
          success: false,
          message: 'Connection timeout. Please verify your SMTP settings and network connection.'
        };
      } else {
        return {
          success: false,
          message: `Failed to send test email: ${errorMessage}`
        };
      }
    }
  }

  async sendEmail(
    clientId: string, 
    to: string, 
    subject: string, 
    htmlContent: string, 
    textContent?: string
  ): Promise<{ success: boolean; message: string; messageId?: string }> {
    try {
      const config = await this.getEmailConfig(clientId);
      
      if (!config) {
        throw new Error('SMTP configuration is not properly configured or not enabled');
      }

      const transporter = nodemailer.createTransport({
        host: config.smtpHost,
        port: config.smtpPort,
        secure: config.smtpSecure,
        auth: {
          user: config.smtpUsername,
          pass: config.smtpPassword,
        },
      });

      const info = await transporter.sendMail({
        from: `"${config.smtpFromName}" <${config.smtpFromEmail}>`,
        to,
        subject,
        html: htmlContent,
        text: textContent || htmlContent.replace(/<[^>]*>/g, ''), // Strip HTML if no text provided
      });

      return {
        success: true,
        message: `Email sent successfully to ${to}`,
        messageId: info.messageId
      };

    } catch (error) {
      console.error('Email sending error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      return {
        success: false,
        message: `Failed to send email: ${errorMessage}`
      };
    }
  }
}