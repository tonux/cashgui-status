import nodemailer from 'nodemailer';

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendEmail({ to, subject, text, html }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"CashGUI Status" <status@cashgui.com>',
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export function generateStatusEmail(serviceName: string, status: number, error?: string) {
  const subject = `🚨 ${serviceName} Status Alert - HTTP ${status}`;
  
  const text = `
Alert: ${serviceName} is not responding normally

Status Code: ${status}
Time: ${new Date().toLocaleString()}
${error ? `Error: ${error}` : ''}

This is an automated message from CashGUI Status Monitor.
`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: sans-serif; line-height: 1.5; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #dc2626; margin-bottom: 20px;">🚨 Service Alert</h1>
    
    <p style="font-size: 16px; margin-bottom: 10px;">
      <strong>${serviceName}</strong> is not responding normally
    </p>

    <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong>Status Code:</strong> ${status}</p>
      <p style="margin: 5px 0;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      ${error ? `<p style="margin: 5px 0; color: #dc2626;"><strong>Error:</strong> ${error}</p>` : ''}
    </div>

    <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
      This is an automated message from CashGUI Status Monitor.
    </p>
  </div>
</body>
</html>
`

  return { subject, text, html };
} 