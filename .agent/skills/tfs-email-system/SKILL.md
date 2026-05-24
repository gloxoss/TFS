---
name: tfs-email-system
description: "Manage and extend the TFS email system: Resend API integration, HTML templates, contact form notifications, quote emails, and the PocketBase email queue."
triggers:
  - email
  - mail
  - contact form
  - resend
  - notification
  - quote email
  - admin email
---

# TFS Email System Skill

Expert guide for managing, debugging, and extending the email system in the TFS Next.js + PocketBase application.

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│ EMAIL TRIGGERS                                               │
│ ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│ │ Quote Submit │  │Quote Accept │  │ Contact Form Submit │   │
│ │  (quote.ts)  │  │/Reject      │  │   (contact.ts)      │   │
│ └──────┬───────┘  └──────┬──────┘  └──────┬──────────────┘   │
│        │                 │                 │                  │
│        ▼                 ▼                 ▼                  │
│  ┌───────────────────────────────────────────────────────┐   │
│  │              getEmailService()                        │   │
│  │   RESEND_API_KEY set? → ResendEmailService            │   │
│  │   No key?            → ConsoleEmailService (dev)      │   │
│  └────────────────────────┬──────────────────────────────┘   │
│                           │                                  │
│  ┌────────────────────────▼──────────────────────────────┐   │
│  │              HTML Templates                           │   │
│  │  quote-confirmation  │ admin-notification             │   │
│  │  quote-ready         │ contact-message                │   │
│  └───────────────────────────────────────────────────────┘   │
│                           │                                  │
│  ┌────────────────────────▼──────────────────────────────┐   │
│  │              Resend API                               │   │
│  │  https://api.resend.com/emails                        │   │
│  └───────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

---

## File Map

| File | Purpose |
|------|---------|
| `services/email/interface.ts` | Types: `IEmailService`, `EmailPayload`, all payload types |
| `services/email/resend-service.ts` | Production (`ResendEmailService`) + dev mock (`ConsoleEmailService`) |
| `services/email/queue-service.ts` | PocketBase-backed queue with exponential backoff retry |
| `services/email/queue-types.ts` | Queue type definitions (`EmailPayloadType`, `EmailQueueRecord`) |
| `services/email/templates/config.ts` | Reads env vars: `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_EMAIL`, `SITE_URL` |
| `services/email/templates/quote-confirmation.ts` | Customer confirmation HTML |
| `services/email/templates/admin-notification.ts` | Admin alert HTML |
| `services/email/templates/quote-ready.ts` | Quote ready with magic link HTML |
| `services/email/templates/contact-message.ts` | Contact form notification HTML |
| `services/index.ts` | Service factory: `getEmailService()`, type re-exports |
| `lib/actions/quote.ts` | Server action: `submitQuote`, `acceptQuote`, `rejectQuote` |
| `lib/actions/contact.ts` | Server action: `submitContactMessage` |
| `components/marketing/contact/contact-form.tsx` | Contact Us form (calls `submitContactMessage`) |

---

## Environment Variables

```env
# Required for email sending
RESEND_API_KEY=re_xxxx          # Resend API key (https://resend.com)
EMAIL_FROM=TFS <noreply@domain> # Verified sender domain in Resend
ADMIN_EMAIL=contact@tfs.ma      # Admin notification recipient

# Used in email templates
NEXT_PUBLIC_SITE_URL=https://tfs.ma
NEXT_PUBLIC_SITE_NAME=TFS Equipment Rentals
```

> Without `RESEND_API_KEY`, emails fall back to `ConsoleEmailService` (console.log only).

---

## Email Types Sent

| Email | Trigger | From | To | Template |
|-------|---------|------|------|----------|
| Quote Confirmation | `submitQuote` success | `EMAIL_FROM` | Customer email | `quote-confirmation.ts` |
| Admin Notification | `submitQuote` / `acceptQuote` / `rejectQuote` | `EMAIL_FROM` | `ADMIN_EMAIL` | `admin-notification.ts` |
| Quote Ready | Admin sends via dashboard | `EMAIL_FROM` | Customer email | `quote-ready.ts` |
| Contact Notification | `submitContactMessage` | `EMAIL_FROM` | `ADMIN_EMAIL` | `contact-message.ts` |

---

## How To: Add a New Email Type

### Step 1: Define the payload type

In `services/email/interface.ts`, add a new interface:

```typescript
export interface MyNewEmailPayload extends EmailPayload {
  recipientName: string
  customField: string
}
```

### Step 2: Add to IEmailService

```typescript
export interface IEmailService {
  // ... existing methods
  sendMyNewEmail(payload: MyNewEmailPayload): Promise<EmailResult>
}
```

### Step 3: Create HTML template

Create `services/email/templates/my-new-email.ts`:

```typescript
import { MyNewEmailPayload } from '../interface'
import { getEmailConfig } from './config'

export function generateMyNewEmailHtml(payload: MyNewEmailPayload): string {
    const config = getEmailConfig()
    return `<!DOCTYPE html>
<html><body style="background-color: #09090b; font-family: sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background-color: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 32px;">
      <h2 style="color: #fafafa;">Hello ${payload.recipientName}</h2>
      <p style="color: #a1a1aa;">${payload.customField}</p>
    </div>
    <p style="color: #52525b; font-size: 12px; text-align: center; margin-top: 24px;">
      © ${new Date().getFullYear()} ${config.siteName}
    </p>
  </div>
</body></html>`
}
```

### Step 4: Implement in services

In `resend-service.ts`, add to both `ResendEmailService` and `ConsoleEmailService`:

```typescript
async sendMyNewEmail(payload: MyNewEmailPayload): Promise<EmailResult> {
    const html = generateMyNewEmailHtml(payload)
    return this.send({
        to: payload.to,
        subject: payload.subject || 'Default subject',
        html,
        replyTo: payload.replyTo,
    })
}
```

### Step 5: Export type from barrel

In `services/index.ts`, add to the email type exports:

```typescript
export type { MyNewEmailPayload } from './email/interface'
```

### Step 6: Call from server action

```typescript
const emailService = getEmailService()
await emailService.sendMyNewEmail({ to: recipient, ... })
```

---

## Email Queue (Optional)

The email queue (`queue-service.ts`) stores emails in PocketBase `email_queue` collection with:
- Retry logic (exponential backoff: 5min, 10min, 20min)
- Max 3 attempts per email
- Status tracking: `pending` → `sent` / `failed`
- Stats endpoint: `getQueueStats(pb)`

To use the queue instead of direct sending:

```typescript
import { enqueueEmail } from '@/services/email/queue-service'

await enqueueEmail(pb, {
    to: 'recipient@example.com',
    subject: 'Subject',
    html: '<html>...</html>',
    payloadType: 'contact_message',
    payloadData: { name, email, message },
})
```

> The queue requires a cron job calling `processEmailQueue()` to actually send emails.

---

## Template Design Conventions

All templates follow a consistent dark theme:
- **Background:** `#09090b` (body), `#18181b` (card)
- **Borders:** `#27272a`
- **Text:** `#fafafa` (primary), `#a1a1aa` (secondary), `#71717a` (muted)
- **Links:** `#3b82f6` (blue)
- **Max width:** 600px centered
- **Font:** System font stack
- **Header colors:** Yellow (`#f59e0b`) for admin alerts, Blue (`#3b82f6`) for contact, Green for success

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Emails not sending | `RESEND_API_KEY` not set | Set in `.env` |
| "Email service not configured" | Missing env vars | Check `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_EMAIL` |
| Emails land in spam | Domain not verified in Resend | Add SPF/DKIM/DMARC DNS records |
| Console shows `[DEV] Email would be sent` | Using `ConsoleEmailService` | Normal for dev; set `RESEND_API_KEY` for real emails |
| Contact form saves but no email | `ADMIN_EMAIL` empty | Set `ADMIN_EMAIL=contact@tfs.ma` |
| Quote emails work but contact doesn't | Missing `sendContactNotification` implementation | Check `resend-service.ts` has the method |

---

## Resend Domain Setup

To send from `@tfs.ma` (recommended):

1. Go to [Resend Dashboard → Domains](https://resend.com/domains)
2. Add `tfs.ma`
3. Add the DNS records Resend provides (SPF, DKIM, DMARC)
4. Wait for verification
5. Update `EMAIL_FROM=TFS <noreply@tfs.ma>` in `.env`

Currently using `zouskym.com` as verified sender domain.
