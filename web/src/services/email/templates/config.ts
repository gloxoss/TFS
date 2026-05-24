export function getEmailConfig() {
    const adminEmailRaw = process.env.ADMIN_EMAIL || ''
    const adminEmails = adminEmailRaw
        .split(',')
        .map((e) => e.trim())
        .filter(Boolean)

    return {
        apiKey: process.env.RESEND_API_KEY || '',
        fromEmail: process.env.EMAIL_FROM || 'Cinema Rentals <noreply@example.com>',
        adminEmail: adminEmails[0] || '',      // First email (backward compat)
        adminEmails,                            // All emails as array
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Cinema Equipment Rentals',
    }
}
