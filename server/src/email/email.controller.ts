import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendTestEmailDto } from './dto/send-test-email.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('email')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('test')
  async sendTestEmail(@Body() dto: SendTestEmailDto) {
    const subject = dto.subject || 'APECK Email Configuration Test';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #8B2332; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .success { color: #28a745; font-weight: bold; }
          .info { background-color: #e7f3ff; padding: 15px; border-left: 4px solid #2196F3; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Email Test Successful!</h1>
          </div>
          <div class="content">
            <p class="success">Your email configuration is working correctly.</p>
            
            <div class="info">
              <p><strong>Test Details:</strong></p>
              <ul>
                <li>Sent from: APECK CMS</li>
                <li>Recipient: ${dto.to}</li>
                <li>Time: ${new Date().toLocaleString()}</li>
              </ul>
            </div>
            
            <p>If you received this email, it means:</p>
            <ul>
              <li>✅ SMTP server connection is working</li>
              <li>✅ Authentication is successful</li>
              <li>✅ Email sending functionality is operational</li>
            </ul>
            
            <p style="margin-top: 20px; color: #666; font-size: 12px;">
              This is an automated test email from the APECK Content Management System.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Email Test Successful!

Your email configuration is working correctly.

Test Details:
- Sent from: APECK CMS
- Recipient: ${dto.to}
- Time: ${new Date().toLocaleString()}

If you received this email, it means:
✓ SMTP server connection is working
✓ Authentication is successful
✓ Email sending functionality is operational

This is an automated test email from the APECK Content Management System.
    `;

    const success = await this.emailService.sendEmail({
      to: dto.to,
      subject,
      html,
      text,
    });

    return {
      success,
      message: success
        ? 'Test email sent successfully! Please check the recipient inbox.'
        : 'Failed to send test email. Please check the server logs for details.',
    };
  }
}
