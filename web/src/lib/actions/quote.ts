/**
 * Quote Request Server Action
 * 
 * Creates a quote request via the QuoteService.
 * Returns structured result per architecture rules (no raw throws).
 * 
 * BLIND QUOTE MODE:
 * - NO pricing information sent from client
 * - Admin will calculate and provide pricing
 * 
 * Uses 'quotes' collection per TDD specification.
 */

'use server'

import { cookies } from 'next/headers'
import PocketBase from 'pocketbase'
import { QuoteFormData } from '@/lib/schemas/quote'
import { getQuoteService, getEmailService } from '@/services'
import { getEmailConfig } from '@/services/email/templates/config'
import { createServerClient, createAdminClient } from '@/lib/pocketbase/server'
import type { CreateQuotePayload, QuoteResult, QuoteEmailItem } from '@/services'
import { ENABLE_DIGITAL_SIGNATURE } from '@/lib/config'

// BLIND QUOTE: Simplified cart item - no pricing data
interface SubmissionCartItem {
  id: string
  product: {
    id: string
    name: string
    slug: string
    imageUrl?: string
  }
  quantity: number
  dates: {
    start: string
    end: string
  }
  groupId?: string
  kitTemplateId?: string
  kitSelections?: { [slotId: string]: string[] }
  selectedVariants?: Record<string, string>
}

interface QuoteSubmissionData {
  formData: QuoteFormData
  items?: SubmissionCartItem[] // Optional for users (will fetch from DB)
  guestCartItems?: SubmissionCartItem[] // For guests
  globalDates?: {
    start: string
    end: string
  } | null
  lng: string
}

export async function submitQuote(submission: QuoteSubmissionData): Promise<QuoteResult> {
  try {
    const { formData, items, guestCartItems, globalDates, lng } = submission

    let cartItems: SubmissionCartItem[]

    if (guestCartItems) {
      // Guest: Use provided cart items
      cartItems = guestCartItems
    } else if (items) {
      // Legacy: Use provided items (for users)
      cartItems = items
    } else {
      // User: Fetch from DB cart
      // This would require implementing user cart fetching
      // For now, return error
      return {
        success: false,
        error: 'No cart items provided. Please add items to your cart.',
      }
    }

    // Validate items exist
    if (!cartItems || cartItems.length === 0) {
      return {
        success: false,
        error: 'Your cart is empty. Please add items before submitting.',
      }
    }

    // Validate dates exist (either global or per-item)
    const hasValidDates = globalDates || cartItems.every((item) => item.dates)
    if (!hasValidDates) {
      return {
        success: false,
        error: 'Please select rental dates for your items.',
      }
    }

    // Initialize PocketBase with server cookies for authenticated requests
    const pb = await createServerClient(true)
    let userId: string | undefined

    // Validate auth state if present
    if (pb.authStore.isValid) {
      try {
        await pb.collection('users').authRefresh()
        userId = pb.authStore.model?.id
      } catch {
        // Auth invalid, continue as guest
        pb.authStore.clear()
      }
    }

    // Calculate date range from first item or global dates
    const startDate = globalDates?.start || cartItems[0]?.dates?.start || new Date().toISOString()
    const endDate = globalDates?.end || cartItems[0]?.dates?.end || new Date().toISOString()

    // BLIND QUOTE: Prepare items WITHOUT pricing (admin will calculate)
    const quoteItems = cartItems.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      slug: item.product.slug,
      quantity: item.quantity,
      imageUrl: item.product.imageUrl,
      kitSelections: item.kitSelections,
      selectedVariants: item.selectedVariants,
    }))

    // Build payload
    const payload: CreateQuotePayload = {
      // ... existing fields
      clientName: `${formData.firstName} ${formData.lastName}`.trim(),
      clientEmail: formData.email,
      clientPhone: formData.phone,
      clientCompany: formData.company || undefined,

      // LINK USER ID
      userId: userId,

      items: quoteItems,
      // ... rest of payload

      // Dates (TDD: rental_start_date, rental_end_date)
      rentalStartDate: startDate,
      rentalEndDate: endDate,

      // Project details (TDD: project_description, special_requests)
      projectDescription: formData.projectDescription
        ? `[${formData.projectType}] ${formData.projectDescription}`
        : `Project type: ${formData.projectType}`,
      specialRequests: [
        formData.deliveryPreference ? `Delivery: ${formData.deliveryPreference}` : '',
        formData.notes || '',
      ].filter(Boolean).join('\n'),

      // Location (dedicated field)
      location: formData.location || undefined,

      // Language
      language: lng,
    }

    // Use quote service (with injected PB client)
    const quoteServiceInstance = getQuoteService(pb)
    const result = await quoteServiceInstance.createQuote(payload)

    // Send confirmation emails (non-blocking - don't fail quote if email fails)
    if (result.success && result.data) {
      const emailService = getEmailService()
      const customerName = `${formData.firstName} ${formData.lastName}`.trim()
      const emailItems: QuoteEmailItem[] = quoteItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
        slug: item.slug,
      }))

      // Type guard: check if we have the quoteId (new quote creation result)
      const quoteId = 'quoteId' in result.data ? result.data.quoteId : result.data.id
      const accessToken = 'accessToken' in result.data ? result.data.accessToken : undefined
      const confirmationNumber = 'confirmationNumber' in result.data ? result.data.confirmationNumber : ''

      const emailConfig = getEmailConfig()

      // Send customer confirmation email
      try {
        await emailService.sendQuoteConfirmation({
          to: formData.email,
          subject: `Quote Request Received - ${confirmationNumber}`,
          customerName,
          confirmationNumber: confirmationNumber || '',
          items: emailItems,
          rentalStartDate: startDate,
          rentalEndDate: endDate,
          projectDescription: payload.projectDescription,
          specialRequests: payload.specialRequests,
          replyTo: emailConfig.adminEmail,
          // Magic link data for quote tracking
          quoteId,
          accessToken,
          language: lng,
        })
      } catch (emailError) {
        // Log but don't fail the quote submission
        console.error('Failed to send customer confirmation email:', emailError)
      }

      // Send admin notification email
      try {
        await emailService.sendAdminQuoteNotification({
          to: emailConfig.adminEmails,
          subject: `🎬 New Quote Request: ${confirmationNumber}`,
          customerName,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          customerCompany: formData.company,
          confirmationNumber: confirmationNumber || '',
          items: emailItems,
          rentalStartDate: startDate,
          rentalEndDate: endDate,
          projectDescription: payload.projectDescription,
          specialRequests: payload.specialRequests,
          quoteId,
        })
      } catch (emailError) {
        // Log but don't fail the quote submission
        console.error('Failed to send admin notification email:', emailError)
      }
    }

    return result
  } catch (error) {
    console.error('Quote submission error:', error)

    // Return user-friendly error
    return {
      success: false,
      error: 'Unable to submit your quote request. Please try again or contact us directly.',
    }
  }
}

/**
 * Accept Quote with Digital Signature
 * 
 * Allows a client to accept a quote by signing it electronically.
 * Updates quote status to 'confirmed' and stores the signature.
 */
export async function acceptQuote(
  quoteId: string,
  accessToken: string,
  signatureFormData?: FormData
): Promise<QuoteResult> {
  try {
    console.log('[AUDIT] acceptQuote START', { quoteId, hasToken: !!accessToken, hasSignature: !!signatureFormData })

    // Validate inputs
    if (!quoteId || !accessToken) {
      return {
        success: false,
        error: 'Invalid quote reference. Please use the link from your email.',
      }
    }

    // Only require signature when digital signature feature is enabled
    console.log('[AUDIT] ENABLE_DIGITAL_SIGNATURE =', ENABLE_DIGITAL_SIGNATURE)
    if (ENABLE_DIGITAL_SIGNATURE) {
      const signatureFile = signatureFormData?.get('signature') as File | null
      if (!signatureFile || signatureFile.size === 0) {
        return {
          success: false,
          error: 'Please provide your signature to accept the quote.',
        }
      }
    }

    // Initialize PocketBase with admin auth for server-side operations
    console.log('[AUDIT] Creating admin client...')
    let pb
    try {
      pb = await createAdminClient()
      console.log('[AUDIT] Admin client created. authStore.isValid:', pb.authStore.isValid)
    } catch (authErr: any) {
      console.error('[AUDIT] ADMIN AUTH FAILED:', authErr?.message || authErr)
      return { success: false, error: `[AUDIT] Admin auth failed: ${authErr?.message}` }
    }

    // Fetch the quote and validate access token
    console.log('[AUDIT] Fetching quote:', quoteId)
    let quote
    try {
      quote = await pb.collection('quotes').getOne(quoteId)
      console.log('[AUDIT] Quote fetched OK:', { status: quote.status, is_locked: quote.is_locked, hasToken: !!quote.access_token })
    } catch (fetchErr: any) {
      console.error('[AUDIT] QUOTE FETCH FAILED:', fetchErr?.message || fetchErr)
      return { success: false, error: `[AUDIT] Quote fetch failed: ${fetchErr?.message}` }
    }

    // Validate access token
    if (quote.access_token !== accessToken) {
      console.error('[acceptQuote] Token mismatch', { expected: quote.access_token, got: accessToken })
      return {
        success: false,
        error: 'Invalid access token. Please use the link from your email.',
      }
    }

    // Normalize status (PB select fields can return arrays)
    const currentStatus = Array.isArray(quote.status) ? quote.status[0] : quote.status
    console.log('[acceptQuote] Quote fetched', { quoteId, currentStatus, rawStatus: quote.status, isLocked: quote.is_locked })

    // Validate quote status - must be 'quoted' to accept
    if (currentStatus !== 'quoted') {
      if (currentStatus === 'confirmed') {
        return {
          success: false,
          error: 'This quote has already been accepted.',
        }
      }
      return {
        success: false,
        error: `This quote cannot be accepted at this time (status: ${currentStatus}). Please contact us.`,
      }
    }

    // Update quote status (with or without signature)
    try {
      if (ENABLE_DIGITAL_SIGNATURE && signatureFormData) {
        const signatureFile = signatureFormData.get('signature') as File
        const updateData = new FormData()
        updateData.append('signature', signatureFile)
        updateData.append('signed_at', new Date().toISOString())
        updateData.append('status', 'confirmed')
        await pb.collection('quotes').update(quoteId, updateData)
      } else {
        // Simple status update without signature
        await pb.collection('quotes').update(quoteId, {
          status: 'confirmed',
        })
      }
      console.log('[acceptQuote] Quote updated to confirmed successfully')
    } catch (updateError: any) {
      console.error('[acceptQuote] PB update failed:', updateError?.response || updateError)
      throw updateError
    }

    // Send admin notification email
    try {
      const emailService = getEmailService()
      await emailService.sendAdminQuoteNotification({
        to: process.env.ADMIN_EMAIL || '',
        subject: `✅ Quote Signed! - ${quote.confirmation_number || quoteId}`,
        customerName: quote.client_name || 'Customer',
        customerEmail: quote.client_email || '',
        customerPhone: quote.client_phone || '',
        confirmationNumber: quote.confirmation_number || quoteId,
        items: [],
        rentalStartDate: quote.rental_start_date,
        rentalEndDate: quote.rental_end_date,
        projectDescription: 'The client has signed and accepted this quote.',
        specialRequests: '',
        quoteId,
      })
    } catch (emailError) {
      console.error('Failed to send admin notification for signed quote:', emailError)
      // Don't fail the operation if email fails
    }

    return {
      success: true,
      data: {
        quoteId: quoteId,
        confirmationNumber: quote.confirmation_number,
      },
    }
  } catch (error: any) {
    console.error('[AUDIT] UNCAUGHT ERROR in acceptQuote:', error?.message, error?.response || error)
    return {
      success: false,
      error: `[AUDIT] Uncaught: ${error?.message || 'Unknown error'}`,
    }
  }
}

/**
 * Reject Quote with Optional Reason
 * 
 * Allows a client to reject a quote via their magic link.
 * Stores rejection reason for admin follow-up.
 */
export async function rejectQuote(
  quoteId: string,
  accessToken: string,
  reason?: string
): Promise<QuoteResult> {
  try {
    // Validate inputs
    if (!quoteId || !accessToken) {
      return {
        success: false,
        error: 'Invalid quote reference. Please use the link from your email.',
      }
    }

    // Initialize PocketBase with admin auth
    const pb = await createAdminClient()

    // Fetch the quote and validate access token
    let quote
    try {
      quote = await pb.collection('quotes').getOne(quoteId)
    } catch {
      return {
        success: false,
        error: 'Quote not found. Please check your link and try again.',
      }
    }

    // Validate access token
    if (quote.access_token !== accessToken) {
      return {
        success: false,
        error: 'Invalid access token. Please use the link from your email.',
      }
    }

    // Validate quote status - must be 'quoted' to reject
    if (quote.status !== 'quoted') {
      if (quote.status === 'confirmed') {
        return {
          success: false,
          error: 'This quote has already been accepted and cannot be rejected.',
        }
      }
      if (quote.status === 'rejected') {
        return {
          success: false,
          error: 'This quote has already been rejected.',
        }
      }
      return {
        success: false,
        error: 'This quote cannot be rejected at this time. Please contact us.',
      }
    }

    // Update quote with rejection via service
    const quoteService = getQuoteService(pb)
    const rejectionNote = reason
      ? `${quote.internal_notes || ''}\n\n[REJECTION REASON - ${new Date().toISOString()}]:\n${reason}`.trim()
      : quote.internal_notes

    const updatedQuote = await quoteService.updateQuoteStatus(quoteId, 'rejected', rejectionNote)

    // Send admin notification email
    try {
      const emailService = getEmailService()
      await emailService.sendAdminQuoteNotification({
        to: process.env.ADMIN_EMAIL || '',
        subject: `❌ Quote Rejected - ${quote.confirmation_number || quoteId}`,
        customerName: quote.client_name || 'Customer',
        customerEmail: quote.client_email || '',
        customerPhone: quote.client_phone || '',
        confirmationNumber: quote.confirmation_number || quoteId,
        items: [],
        rentalStartDate: quote.rental_start_date,
        rentalEndDate: quote.rental_end_date,
        projectDescription: reason ? `Rejection Reason: ${reason}` : 'No reason provided.',
        specialRequests: '',
        quoteId,
      })
    } catch (emailError) {
      console.error('Failed to send admin notification for rejected quote:', emailError)
    }

    return {
      success: true,
      data: updatedQuote,
    }
  } catch (error) {
    console.error('Reject quote error:', error)
    return {
      success: false,
      error: 'Unable to reject the quote. Please try again or contact us.',
    }
  }
}

