import { ContactMessageEmailPayload } from '../interface'
import { getEmailConfig } from './config'

export function generateContactMessageHtml(payload: ContactMessageEmailPayload): string {
    const config = getEmailConfig()

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Message</title>
</head>
<body style="margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    
    <!-- Header -->
    <div style="background-color: #3b82f6; padding: 16px; border-radius: 8px 8px 0 0;">
      <h1 style="color: #fff; font-size: 18px; font-weight: 600; margin: 0;">
        ✉️ New Contact Message
      </h1>
    </div>

    <!-- Main Card -->
    <div style="background-color: #18181b; border: 1px solid #27272a; border-top: none; border-radius: 0 0 12px 12px; padding: 24px;">
      
      <!-- Subject -->
      <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #27272a;">
        <span style="color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Subject</span>
        <p style="color: #fafafa; font-size: 18px; font-weight: 600; margin: 4px 0 0;">
          ${payload.messageSubject}
        </p>
      </div>

      <!-- Sender Info -->
      <div style="margin-bottom: 24px;">
        <h3 style="color: #fafafa; font-size: 14px; font-weight: 600; margin: 0 0 12px;">
          From
        </h3>
        <table style="width: 100%;">
          <tr>
            <td style="color: #71717a; padding: 4px 0; width: 80px;">Name</td>
            <td style="color: #fafafa; padding: 4px 0;">${payload.senderName}</td>
          </tr>
          <tr>
            <td style="color: #71717a; padding: 4px 0;">Email</td>
            <td style="color: #fafafa; padding: 4px 0;">
              <a href="mailto:${payload.senderEmail}" style="color: #3b82f6; text-decoration: none;">
                ${payload.senderEmail}
              </a>
            </td>
          </tr>
        </table>
      </div>

      <!-- Message Body -->
      <div style="margin-bottom: 24px;">
        <h3 style="color: #fafafa; font-size: 14px; font-weight: 600; margin: 0 0 12px;">
          Message
        </h3>
        <div style="background-color: #09090b; border: 1px solid #27272a; border-radius: 8px; padding: 16px;">
          <p style="color: #a1a1aa; font-size: 14px; margin: 0; white-space: pre-wrap; line-height: 1.6;">
            ${payload.messageBody}
          </p>
        </div>
      </div>

      <!-- Reply Button -->
      <div style="text-align: center; margin-top: 32px;">
        <a href="mailto:${payload.senderEmail}?subject=Re: ${encodeURIComponent(payload.messageSubject)}" 
           style="display: inline-block; background-color: #3b82f6; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">
          Reply to ${payload.senderName}
        </a>
      </div>

    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 24px;">
      <p style="color: #52525b; font-size: 12px; margin: 0;">
        ${config.siteName} — Contact Form Notification
      </p>
    </div>

  </div>
</body>
</html>
  `
}
