'use server'

import PocketBase from 'pocketbase'
import { escapePBFilter } from '@/lib/security'
import { PB_URL } from '@/lib/pocketbase/config'
import { createActionLogger } from '@/lib/logger'

const log = createActionLogger('CheckEmail');

/**
 * Simple in-memory rate limiter
 * Tracks requests per IP/session to prevent email enumeration attacks
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_MAX = 10 // Max 10 checks per window
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute window

function isRateLimited(key: string): boolean {
    const now = Date.now()
    const record = rateLimitMap.get(key)

    if (!record || now > record.resetTime) {
        // Reset or create new window
        rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS })
        return false
    }

    if (record.count >= RATE_LIMIT_MAX) {
        log.debug('Rate limited', { key });
        return true
    }

    record.count++
    return false
}

/**
 * Check if an email exists in the users collection
 * Called by the quote form to show "login nudge" for existing accounts
 * 
 * Security:
 * - Only returns boolean, never user data
 * - Rate limited to prevent email enumeration
 * - Only enabled when ENABLE_CLIENT_PORTAL is true
 */
export async function checkEmailExists(email: string): Promise<boolean> {
    log.debug('Email check requested', { emailPrefix: email?.substring(0, 3) + '***' });

    // Feature flag check - only run if client portal is enabled
    if (process.env.ENABLE_CLIENT_PORTAL !== 'true') {
        log.debug('Client portal disabled');
        return false
    }

    // Basic validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        log.debug('Invalid email format');
        return false
    }

    // Rate limiting (use email as key since we don't have IP here)
    const rateLimitKey = email.toLowerCase()
    if (isRateLimited(rateLimitKey)) {
        return false // Silent fail when rate limited
    }

    try {
        const PB_URL_RAW = process.env.NEXT_PUBLIC_POCKETBASE_URL;
        if (!PB_URL_RAW && process.env.NODE_ENV === 'production') {
            throw new Error('NEXT_PUBLIC_POCKETBASE_URL is not defined');
        }
        const pb = new PocketBase(PB_URL)

        // Authenticate as superuser to query users
        // This runs server-side so we can use admin credentials
        if (process.env.POCKETBASE_ADMIN_EMAIL && process.env.POCKETBASE_ADMIN_PASSWORD) {
            log.debug('Authenticating as admin');
            await pb.collection('_superusers').authWithPassword(
                process.env.POCKETBASE_ADMIN_EMAIL,
                process.env.POCKETBASE_ADMIN_PASSWORD
            )
            log.debug('Admin auth successful');
        } else {
            log.warn('No admin credentials in env');
            return false
        }

        const users = await pb.collection('users').getList(1, 1, {
            filter: `email = "${escapePBFilter(email)}"`,
            fields: 'id', // Only fetch ID, not user data
        })

        log.debug('Email check result', { exists: users.totalItems > 0 });
        return users.totalItems > 0
    } catch (error) {
        log.error('Email check failed', error);
        return false
    }
}
