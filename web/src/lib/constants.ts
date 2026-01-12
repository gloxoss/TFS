/**
 * Application Constants
 * 
 * Centralized configuration values for the TFS platform.
 * Avoids magic numbers scattered throughout the codebase.
 */

// =============================================================================
// UI CONSTANTS
// =============================================================================

export const UI = {
    /** Default debounce delay for search inputs (ms) */
    DEBOUNCE_MS: 300,

    /** Toast notification display duration (ms) */
    TOAST_DURATION_MS: 4000,

    /** Sidebar width in pixels */
    SIDEBAR_WIDTH_PX: 288,

    /** Scroll threshold for sticky elements (px) */
    SCROLL_THRESHOLD_PX: 300,

    /** Animation durations */
    ANIMATION: {
        FAST_MS: 150,
        NORMAL_MS: 300,
        SLOW_MS: 500,
    },
} as const

// =============================================================================
// BUSINESS LOGIC CONSTANTS
// =============================================================================

export const BUSINESS = {
    /** Maximum rental period (days) */
    MAX_RENTAL_DAYS: 365,

    /** Default rental period (days) */
    DEFAULT_RENTAL_DAYS: 1,

    /** Cart sync debounce delay (ms) */
    CART_SYNC_DEBOUNCE_MS: 1000,

    /** Email check debounce delay (ms) */
    EMAIL_CHECK_DEBOUNCE_MS: 800,

    /** API retry attempts */
    API_RETRY_ATTEMPTS: 3,

    /** API retry delay multiplier (ms) */
    API_RETRY_DELAY_MS: 200,
} as const

// =============================================================================
// PAGINATION CONSTANTS
// =============================================================================

export const PAGINATION = {
    /** Default items per page */
    DEFAULT_PER_PAGE: 12,

    /** Admin dashboard items per page */
    ADMIN_PER_PAGE: 20,

    /** Maximum items per page */
    MAX_PER_PAGE: 100,
} as const

// =============================================================================
// HTTP STATUS CODES (for consistency)
// =============================================================================

export const HTTP = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
} as const
