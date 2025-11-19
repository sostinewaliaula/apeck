import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter | null = null;

  constructor(private readonly configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const host = this.configService.get<string>('email.host', 'mail.apeck.co.ke');
    const port = this.configService.get<number>('email.port', 465);
    const secure = this.configService.get<boolean>('email.secure', true);
    const user = this.configService.get<string>('email.user', '');
    const password = this.configService.get<string>('email.password', '');

    if (!user || !password) {
      this.logger.warn('Email configuration incomplete. Email sending will be disabled.');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure, // true for port 465 (SSL/TLS), false for port 587 (STARTTLS)
      auth: {
        user,
        pass: password,
      },
      // Add connection timeout settings
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000, // 10 seconds
      socketTimeout: 10000, // 10 seconds
      // For port 465 with SSL/TLS, we might need tls options
      tls: {
        // Do not fail on invalid certificates (useful for self-signed certs)
        rejectUnauthorized: false,
      },
    });

    // Verify connection asynchronously (don't block startup)
    // Use a timeout to prevent hanging
    const verifyTimeout = setTimeout(() => {
      this.logger.warn('Email transporter verification timed out. Email sending may not work until configuration is fixed.');
    }, 15000); // 15 second timeout

    this.transporter.verify((error) => {
      clearTimeout(verifyTimeout);
      if (error) {
        this.logger.warn('Email transporter verification failed. Email sending will be disabled until configuration is fixed.');
        this.logger.debug('SMTP Error details:', error.message);
        // Don't set transporter to null - keep it so we can try to send and get better error messages
        // The sendEmail method will check if it's actually working
      } else {
        this.logger.log('Email transporter configured and verified successfully');
      }
    });
  }

  async sendEmail(options: {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
  }): Promise<boolean> {
    if (!this.transporter) {
      this.logger.warn('Email transporter not configured. Skipping email send.');
      return false;
    }

    const from = this.configService.get<string>('email.from', 'noreply@apeck.org');

    try {
      // Add timeout to prevent hanging
      const sendPromise = this.transporter.sendMail({
        from,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || options.html.replace(/<[^>]*>/g, ''),
      });

      // Add a timeout wrapper
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Email send timeout after 30 seconds')), 30000);
      });

      const info = await Promise.race([sendPromise, timeoutPromise]);

      this.logger.log(`Email sent successfully: ${info.messageId}`);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to send email: ${errorMessage}`);
      
      // If it's a connection error, log it but don't crash
      if (errorMessage.includes('ETIMEDOUT') || errorMessage.includes('ECONNREFUSED') || errorMessage.includes('Greeting never received')) {
        this.logger.warn('SMTP connection failed. Please check your email configuration (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD)');
      }
      
      return false;
    }
  }

  async sendMembershipApplicationEmail(data: {
    recipientEmails: string[];
    applicantName: string;
    applicantEmail: string;
    paymentReference: string;
    membershipTier: string;
    amountPaid: number;
    formData: {
      fullName: string;
      phone: string;
      idNumber: string;
      email: string;
      county: string;
      subCounty?: string;
      ward?: string;
      diasporaCountry?: string;
      mpesaCode?: string;
    };
  }): Promise<boolean> {
    const recipientEmails = data.recipientEmails;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #8B2332; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; margin-top: 20px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #8B2332; }
          .value { margin-top: 5px; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Membership Application</h1>
          </div>
          <div class="content">
            <p>A new membership application has been submitted with payment confirmation.</p>
            
            <div class="field">
              <div class="label">Payment Reference:</div>
              <div class="value">${data.paymentReference}</div>
            </div>
            
            <div class="field">
              <div class="label">Membership Tier:</div>
              <div class="value">${data.membershipTier}</div>
            </div>
            
            <div class="field">
              <div class="label">Amount Paid:</div>
              <div class="value">KES ${data.amountPaid.toLocaleString()}</div>
            </div>
            
            <h3 style="color: #8B2332; margin-top: 30px;">Applicant Information</h3>
            
            <div class="field">
              <div class="label">Full Name:</div>
              <div class="value">${data.formData.fullName}</div>
            </div>
            
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${data.formData.email}</div>
            </div>
            
            <div class="field">
              <div class="label">Phone:</div>
              <div class="value">${data.formData.phone}</div>
            </div>
            
            <div class="field">
              <div class="label">ID Number:</div>
              <div class="value">${data.formData.idNumber}</div>
            </div>
            
            <div class="field">
              <div class="label">County:</div>
              <div class="value">${data.formData.county}</div>
            </div>
            
            ${data.formData.subCounty ? `
            <div class="field">
              <div class="label">Sub-County:</div>
              <div class="value">${data.formData.subCounty}</div>
            </div>
            ` : ''}
            
            ${data.formData.ward ? `
            <div class="field">
              <div class="label">Ward:</div>
              <div class="value">${data.formData.ward}</div>
            </div>
            ` : ''}
            
            ${data.formData.diasporaCountry ? `
            <div class="field">
              <div class="label">Diaspora / Country:</div>
              <div class="value">${data.formData.diasporaCountry}</div>
            </div>
            ` : ''}
            
            ${data.formData.mpesaCode ? `
            <div class="field">
              <div class="label">Manual M-Pesa Code:</div>
              <div class="value">${data.formData.mpesaCode}</div>
            </div>
            ` : ''}
            
            <div class="footer">
              <p>This is an automated notification from the APECK membership system.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
New Membership Application

A new membership application has been submitted with payment confirmation.

Payment Reference: ${data.paymentReference}
Membership Tier: ${data.membershipTier}
Amount Paid: KES ${data.amountPaid.toLocaleString()}

Applicant Information:
- Full Name: ${data.formData.fullName}
- Email: ${data.formData.email}
- Phone: ${data.formData.phone}
- ID Number: ${data.formData.idNumber}
- County: ${data.formData.county}
${data.formData.subCounty ? `- Sub-County: ${data.formData.subCounty}` : ''}
${data.formData.ward ? `- Ward: ${data.formData.ward}` : ''}
${data.formData.diasporaCountry ? `- Diaspora / Country: ${data.formData.diasporaCountry}` : ''}
${data.formData.mpesaCode ? `- Manual M-Pesa Code: ${data.formData.mpesaCode}` : ''}

This is an automated notification from the APECK membership system.
    `;

    // Send to all admin recipients
    const adminSent = await this.sendEmail({
      to: recipientEmails,
      subject: `New APECK Membership Application - ${data.formData.fullName}`,
      html,
      text,
    });

    // Send confirmation to applicant
    const applicantHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #8B2332; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; margin-top: 20px; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Your Application!</h1>
          </div>
          <div class="content">
            <p>Dear ${data.formData.fullName},</p>
            
            <p>Thank you for submitting your membership application to APECK. We have received your application and payment confirmation.</p>
            
            <p><strong>Payment Reference:</strong> ${data.paymentReference}</p>
            <p><strong>Membership Tier:</strong> ${data.membershipTier}</p>
            <p><strong>Amount Paid:</strong> KES ${data.amountPaid.toLocaleString()}</p>
            
            <p>Our team will review your application and get back to you shortly. If you have any questions, please don't hesitate to contact us.</p>
            
            <p>Blessings,<br>The APECK Team</p>
            
            <div class="footer">
              <p>This is an automated confirmation email. Please do not reply to this message.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const applicantText = `
Thank You for Your Application!

Dear ${data.formData.fullName},

Thank you for submitting your membership application to APECK. We have received your application and payment confirmation.

Payment Reference: ${data.paymentReference}
Membership Tier: ${data.membershipTier}
Amount Paid: KES ${data.amountPaid.toLocaleString()}

Our team will review your application and get back to you shortly. If you have any questions, please don't hesitate to contact us.

Blessings,
The APECK Team

This is an automated confirmation email. Please do not reply to this message.
    `;

    const applicantSent = await this.sendEmail({
      to: data.formData.email,
      subject: 'APECK Membership Application Received',
      html: applicantHtml,
      text: applicantText,
    });

    return adminSent && applicantSent;
  }
}

