/**
 * PocketBase Configuration
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * SINGLE SOURCE OF TRUTH for PocketBase connection settings
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Import from '@/lib/pocketbase/config' instead of hardcoding URLs.
 */

// =============================================================================
// BASE URL
// =============================================================================

/**
 * PocketBase server URL
 * - In production: Uses NEXT_PUBLIC_POCKETBASE_URL from environment
 * - In development: Falls back to localhost
 */
export const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'

/**
 * Get the raw PB URL environment variable (may be undefined)
 * Useful for checks before falling back
 */
export const PB_URL_RAW = process.env.NEXT_PUBLIC_POCKETBASE_URL

// =============================================================================
// FILE URLS
// =============================================================================

/**
 * Build a file URL for PocketBase stored files
 * @param collection - Collection name (e.g., 'products', 'quotes')
 * @param recordId - Record ID
 * @param filename - File name from the record
 * @returns Full URL to the file
 */
export function getFileUrl(collection: string, recordId: string, filename: string): string {
    if (!filename) return ''
    return `${PB_URL}/api/files/${collection}/${recordId}/${filename}`
}

/**
 * Build a thumbnail URL with size options
 */
export function getThumbUrl(
    collection: string,
    recordId: string,
    filename: string,
    size: string = '200x200'
): string {
    if (!filename) return ''
    return `${PB_URL}/api/files/${collection}/${recordId}/${filename}?thumb=${size}`
}

// =============================================================================
// CSP HELPERS
// =============================================================================

/**
 * Get allowed image sources for Content Security Policy
 * Includes PocketBase URL dynamically
 */
export function getCSPImageSources(): string {
    // Always include localhost for dev
    const sources = [
        "'self'",
        'blob:',
        'data:',
        PB_URL,
        'http://127.0.0.1:8090',
        'http://localhost:8090',
        'https://*.bhphoto.com',
        'https://*.cloudinary.com',
        'https://*.unsplash.com',
        'https://grainy-gradients.vercel.app',
    ]
    return sources.join(' ')
}

/**
 * Build full CSP header value
 */
export function buildCSPHeader(): string {
    return [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        `img-src ${getCSPImageSources()}`,
        "font-src 'self' https://fonts.gstatic.com https://*.perplexity.ai data:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
    ].join('; ')
}

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Check if PocketBase URL is properly configured
 * Throws in production if not set
 */
export function validatePBUrl(): void {
    if (!PB_URL_RAW && process.env.NODE_ENV === 'production') {
        console.warn('[PocketBase] NEXT_PUBLIC_POCKETBASE_URL is not defined, using fallback')
    }
}

/**
 * Get PB URL with production validation
 */
export function getPBUrl(): string {
    if (!PB_URL_RAW && process.env.NODE_ENV === 'production') {
        throw new Error('NEXT_PUBLIC_POCKETBASE_URL is not defined in production')
    }
    return PB_URL
}
