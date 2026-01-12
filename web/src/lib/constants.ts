/**
 * Application Constants
 * 
 * Centralized configuration values to avoid magic numbers throughout the codebase.
 */

// ============================================================================
// Pagination
// ============================================================================

export const PAGINATION = {
    /** Default items per page for product listings */
    DEFAULT_PAGE_SIZE: 12,
    /** Default items per page for admin tables */
    ADMIN_PAGE_SIZE: 20,
    /** Maximum items per page allowed */
    MAX_PAGE_SIZE: 100,
} as const;

// ============================================================================
// Cart & Commerce
// ============================================================================

export const CART = {
    /** Maximum quantity per item */
    MAX_ITEM_QUANTITY: 99,
    /** Minimum rental days */
    MIN_RENTAL_DAYS: 1,
    /** Default rental days */
    DEFAULT_RENTAL_DAYS: 1,
    /** Cart expiry in days for guests */
    GUEST_CART_EXPIRY_DAYS: 7,
} as const;

// ============================================================================
// Rate Limiting
// ============================================================================

export const RATE_LIMITS = {
    /** Maximum email checks per minute */
    EMAIL_CHECK_MAX: 10,
    /** Rate limit window in milliseconds */
    RATE_LIMIT_WINDOW_MS: 60 * 1000,
} as const;

// ============================================================================
// Image Dimensions
// ============================================================================

export const IMAGES = {
    /** Product card thumbnail */
    THUMBNAIL: { width: 300, height: 300 },
    /** Product detail hero */
    PRODUCT_HERO: { width: 800, height: 600 },
    /** Category banner */
    CATEGORY_BANNER: { width: 400, height: 300 },
    /** Blog cover */
    BLOG_COVER: { width: 1200, height: 630 },
} as const;

// ============================================================================
// Validation
// ============================================================================

export const VALIDATION = {
    /** Minimum password length */
    MIN_PASSWORD_LENGTH: 8,
    /** Minimum username length */
    MIN_USERNAME_LENGTH: 4,
    /** Maximum username length */
    MAX_USERNAME_LENGTH: 32,
    /** Maximum file upload size in bytes (10MB) */
    MAX_FILE_SIZE: 10 * 1024 * 1024,
} as const;

// ============================================================================
// Timeouts
// ============================================================================

export const TIMEOUTS = {
    /** Debounce delay for search input in ms */
    SEARCH_DEBOUNCE: 300,
    /** Toast notification duration in ms */
    TOAST_DURATION: 3000,
    /** API request timeout in ms */
    API_TIMEOUT: 30000,
} as const;
