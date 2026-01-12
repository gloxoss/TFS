/**
 * Security Utilities
 * 
 * Centralized security functions for input sanitization and validation.
 */

/**
 * Escape special characters for PocketBase filter queries.
 * Prevents filter injection attacks when using user input in filter strings.
 * 
 * @param value - The string value to escape
 * @returns Escaped string safe for use in PocketBase filter queries
 */
export function escapePBFilter(value: string): string {
    if (!value) return '';
    // Escape backslashes first, then double quotes
    return value
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"');
}

/**
 * Validate email format.
 * Basic validation - for comprehensive validation, use server-side checks.
 */
export function isValidEmail(email: string): boolean {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate PocketBase record ID format.
 * PocketBase IDs are 15-character alphanumeric strings.
 */
export function isValidPBId(id: string): boolean {
    if (!id) return false;
    // PocketBase IDs are exactly 15 characters, alphanumeric
    return /^[a-zA-Z0-9]{15}$/.test(id);
}

/**
 * Sanitize a string for safe display.
 * Escapes HTML entities to prevent XSS when displaying user content.
 */
export function sanitizeDisplayString(value: string): string {
    if (!value) return '';
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
