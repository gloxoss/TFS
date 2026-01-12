/**
 * Security Utilities
 * 
 * Functions for sanitizing user inputs to prevent injection attacks.
 */

/**
 * Escape a string for safe use in PocketBase filter queries.
 * Prevents filter injection by escaping special characters.
 * 
 * @example
 * // Safe usage in filter
 * filter: `email = "${escapePBFilter(userEmail)}"`
 */
export function escapePBFilter(value: string): string {
    if (!value) return ''

    // Escape double quotes and backslashes for PocketBase filter syntax
    return value
        .replace(/\\/g, '\\\\')  // Escape backslashes first
        .replace(/"/g, '\\"')    // Escape double quotes
        .replace(/'/g, "\\'")    // Escape single quotes
}

/**
 * Validate that a string is a valid email format.
 * Use before database queries.
 */
export function isValidEmail(email: string): boolean {
    if (!email || typeof email !== 'string') return false
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Validate that a string is a valid PocketBase record ID.
 * PocketBase IDs are 15-character alphanumeric strings.
 */
export function isValidPBId(id: string): boolean {
    if (!id || typeof id !== 'string') return false
    // PocketBase uses 15-char alphanumeric IDs
    return /^[a-zA-Z0-9]{15}$/.test(id)
}

/**
 * Sanitize a string for safe display.
 * Removes potentially dangerous characters.
 */
export function sanitizeDisplayString(value: string): string {
    if (!value) return ''
    return value
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
}
