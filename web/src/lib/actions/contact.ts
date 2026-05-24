/**
 * Contact Form Server Action
 * 
 * Handles contact form submissions:
 * 1. Validates form data
 * 2. Saves message to PocketBase 'messages' collection
 * 3. Sends email notification to admin (contact@tfs.ma)
 * 
 * Returns structured result (no raw throws).
 */

'use server'

import { getEmailService } from '@/services'
import { getEmailConfig } from '@/services/email/templates/config'

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'

interface ContactFormData {
    name: string
    email: string
    subject: string
    message: string
}

interface ContactResult {
    success: boolean
    error?: string
}

export async function submitContactMessage(data: ContactFormData): Promise<ContactResult> {
    try {
        // Validate required fields
        if (!data.name?.trim() || !data.email?.trim() || !data.subject?.trim() || !data.message?.trim()) {
            return {
                success: false,
                error: 'All fields are required.',
            }
        }

        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(data.email)) {
            return {
                success: false,
                error: 'Please provide a valid email address.',
            }
        }

        // 1. Save to PocketBase messages collection
        const pbResponse = await fetch(`${PB_URL}/api/collections/messages/records`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: data.name.trim(),
                email: data.email.trim(),
                subject: data.subject.trim(),
                message: data.message.trim(),
            }),
        })

        if (!pbResponse.ok) {
            console.error('PocketBase save failed:', await pbResponse.text())
            return {
                success: false,
                error: 'Failed to save your message. Please try again.',
            }
        }

        // 2. Send email notification to admin (non-blocking — don't fail if email fails)
        try {
            const emailService = getEmailService()
            const emailConfig = getEmailConfig()
            await emailService.sendContactNotification({
                to: emailConfig.adminEmails,
                subject: `✉️ Contact Form: ${data.subject.trim()}`,
                senderName: data.name.trim(),
                senderEmail: data.email.trim(),
                messageSubject: data.subject.trim(),
                messageBody: data.message.trim(),
            })
        } catch (emailError) {
            // Log but don't fail the contact submission
            console.error('Failed to send contact notification email:', emailError)
        }

        return { success: true }
    } catch (error) {
        console.error('Contact form submission error:', error)
        return {
            success: false,
            error: 'Something went wrong. Please try again or contact us directly.',
        }
    }
}
