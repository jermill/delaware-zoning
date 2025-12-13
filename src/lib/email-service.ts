import sgMail from '@sendgrid/mail';
import { serverEnv } from './env.server';

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export async function sendZoningReport(
  customerEmail: string,
  pdfBuffer: Buffer,
  propertyAddress: string
): Promise<void> {
  const emailHtml = createEmailTemplate(propertyAddress);
  
  try {
    const message = {
      to: customerEmail,
      from: {
        email: 'reports@delawarezoning.com',
        name: 'Delaware Zoning'
      },
      subject: `Your Zoning Report - ${propertyAddress}`,
      html: emailHtml,
      attachments: [
        {
          content: pdfBuffer.toString('base64'),
          filename: `Zoning-Report-${Date.now()}.pdf`,
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
    };

    const response = await sgMail.send(message);
    console.log('✅ Email sent successfully via SendGrid:', response[0].statusCode);
  } catch (error: any) {
    console.error('Failed to send email via SendGrid:', error);
    if (error.response) {
      console.error('SendGrid error details:', error.response.body);
    }
    throw new Error(`Email delivery failed: ${error.message}`);
  }
}

function createEmailTemplate(propertyAddress: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Zoning Report is Ready</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    
    .header {
      background: linear-gradient(135deg, #152F50 0%, #82B8DE 100%);
      color: #ffffff;
      padding: 40px 30px;
      text-align: center;
    }
    
    .logo {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    
    .header-text {
      font-size: 18px;
      margin: 0;
    }
    
    .content {
      padding: 40px 30px;
    }
    
    .greeting {
      font-size: 16px;
      color: #1f2937;
      margin-bottom: 20px;
    }
    
    .property-box {
      background: #ecfdf5;
      border: 2px solid #10b981;
      border-radius: 8px;
      padding: 20px;
      margin: 25px 0;
      text-align: center;
    }
    
    .property-label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    
    .property-address {
      font-size: 18px;
      font-weight: bold;
      color: #152F50;
    }
    
    .message {
      font-size: 14px;
      color: #4b5563;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    
    .features {
      background: #f9fafb;
      border-radius: 8px;
      padding: 20px;
      margin: 25px 0;
    }
    
    .features-title {
      font-size: 16px;
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 15px;
    }
    
    .feature-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 12px;
      font-size: 14px;
      color: #4b5563;
    }
    
    .checkmark {
      color: #10b981;
      margin-right: 10px;
      font-size: 18px;
      line-height: 1;
    }
    
    .cta-button {
      display: inline-block;
      background-color: #F2AF29;
      color: #ffffff;
      text-decoration: none;
      padding: 15px 35px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 16px;
      margin: 20px 0;
    }
    
    .support-box {
      background: #fef3c7;
      border: 1px solid #f59e0b;
      border-radius: 8px;
      padding: 20px;
      margin: 25px 0;
    }
    
    .support-title {
      font-weight: bold;
      color: #92400e;
      margin-bottom: 10px;
      font-size: 14px;
    }
    
    .support-text {
      font-size: 13px;
      color: #78350f;
      line-height: 1.5;
      margin: 0;
    }
    
    .footer {
      background: #1f2937;
      color: #9ca3af;
      padding: 30px;
      text-align: center;
      font-size: 12px;
    }
    
    .footer-brand {
      color: #ffffff;
      font-weight: bold;
      margin-bottom: 10px;
    }
    
    .footer-links {
      margin: 15px 0;
    }
    
    .footer-link {
      color: #82B8DE;
      text-decoration: none;
      margin: 0 10px;
    }
    
    .social-links {
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo">Delaware Zoning</div>
      <p class="header-text">Your Professional Zoning Report is Ready</p>
    </div>
    
    <div class="content">
      <p class="greeting">Thank you for your purchase!</p>
      
      <p class="message">
        Your comprehensive zoning report has been generated and is attached to this email as a PDF document.
      </p>
      
      <div class="property-box">
        <div class="property-label">Property Address</div>
        <div class="property-address">${propertyAddress}</div>
      </div>
      
      <div class="features">
        <div class="features-title">Your Report Includes:</div>
        <div class="feature-item">
          <span class="checkmark">✓</span>
          <span>Complete zoning classification and description</span>
        </div>
        <div class="feature-item">
          <span class="checkmark">✓</span>
          <span>Permitted, conditional, and prohibited uses</span>
        </div>
        <div class="feature-item">
          <span class="checkmark">✓</span>
          <span>Dimensional standards (setbacks, height limits, lot coverage)</span>
        </div>
        <div class="feature-item">
          <span class="checkmark">✓</span>
          <span>Required permits and approval processes</span>
        </div>
        <div class="feature-item">
          <span class="checkmark">✓</span>
          <span>FEMA flood zone information (if applicable)</span>
        </div>
        <div class="feature-item">
          <span class="checkmark">✓</span>
          <span>Property location map</span>
        </div>
        <div class="feature-item">
          <span class="checkmark">✓</span>
          <span>County planning office contact information</span>
        </div>
      </div>
      
      <p class="message">
        <strong>Important:</strong> Please verify this information with your local planning department before making 
        any final decisions, as zoning regulations can change and additional restrictions may apply.
      </p>
      
      <div style="text-align: center;">
        <a href="https://delawarezoning.com" class="cta-button">Visit DelawareZoning.com</a>
      </div>
      
      <div class="support-box">
        <div class="support-title">Need More Reports?</div>
        <p class="support-text">
          Subscribe to our Pro plan for unlimited searches and PDF exports starting at just $49/month. 
          Perfect for real estate professionals who need frequent zoning information.
        </p>
      </div>
      
      <p class="message">
        If you have any questions or need assistance, please don't hesitate to contact our support team 
        at <a href="mailto:support@delawarezoning.com" style="color: #152F50;">support@delawarezoning.com</a>
      </p>
      
      <p class="message" style="margin-top: 30px; font-size: 13px; color: #6b7280;">
        Best regards,<br>
        <strong>The Delaware Zoning Team</strong>
      </p>
    </div>
    
    <div class="footer">
      <div class="footer-brand">Delaware Zoning</div>
      <div>Professional Property Research for Delaware Real Estate</div>
      
      <div class="footer-links">
        <a href="https://delawarezoning.com" class="footer-link">Website</a>
        <a href="https://delawarezoning.com/pricing" class="footer-link">Pricing</a>
        <a href="mailto:support@delawarezoning.com" class="footer-link">Support</a>
      </div>
      
      <div style="margin-top: 20px;">
        © ${new Date().getFullYear()} Delaware Zoning. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
