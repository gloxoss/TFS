import PocketBase, { AuthModel } from 'pocketbase';
import {
    UserRole,
    ROLES,
    PERMISSIONS,
    roleHasPermission,
    hasInventoryAccess as hasInventoryRole
} from '@/types/auth';
import { createServerClient } from '@/lib/pocketbase/server';

// ============================================================================
// Role Extraction
// ============================================================================

/**
 * Extract the role from a PocketBase client/model.
 * Handles the 'users' collection with 'role' field.
 */
export function getCurrentUserRole(model: AuthModel): UserRole | 'guest' {
    if (!model) return 'guest';

    // Check for role field in user model
    if ('role' in model) {
        const role = model.role as string;

        // Validate against known roles
        if (role === ROLES.ADMIN) return ROLES.ADMIN;
        if (role === ROLES.PRODUCTS_MANAGER) return ROLES.PRODUCTS_MANAGER;
    }

    // Default to customer for authenticated users without explicit role
    return ROLES.CUSTOMER;
}

// ============================================================================
// Access Verification (Synchronous - for client components)
// ============================================================================

/**
 * Check if user has full admin access
 */
export function hasAdminAccess(pb: { authStore: PocketBase['authStore'] }): boolean {
    if (!pb.authStore.isValid || !pb.authStore.model) {
        return false;
    }
    const role = getCurrentUserRole(pb.authStore.model);
    return role === ROLES.ADMIN;
}

/**
 * Check if user has inventory access (admin or products_manager)
 */
export function hasInventoryAccess(pb: { authStore: PocketBase['authStore'] }): boolean {
    if (!pb.authStore.isValid || !pb.authStore.model) {
        return false;
    }
    const role = getCurrentUserRole(pb.authStore.model);
    return hasInventoryRole(role);
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(
    pb: { authStore: PocketBase['authStore'] },
    permission: string
): boolean {
    if (!pb.authStore.isValid || !pb.authStore.model) {
        return false;
    }
    const role = getCurrentUserRole(pb.authStore.model);
    return roleHasPermission(role, permission);
}

// ============================================================================
// Server-Side Verification (Async - for server components/actions)
// ============================================================================

/**
 * Get current user's role from server-side cookie
 */
export async function getCurrentRole(): Promise<UserRole | 'guest'> {
    const pb = await createServerClient(false);
    if (!pb.authStore.isValid || !pb.authStore.model) {
        return 'guest';
    }
    return getCurrentUserRole(pb.authStore.model);
}

/**
 * Verify full admin access server-side
 */
export async function verifyAdminAccess(): Promise<boolean> {
    const pb = await createServerClient(false);
    return hasAdminAccess(pb);
}

/**
 * Verify inventory access server-side (admin or products_manager)
 */
export async function verifyInventoryAccess(): Promise<boolean> {
    const pb = await createServerClient(false);
    return hasInventoryAccess(pb);
}

/**
 * Verify specific permission server-side
 */
export async function verifyPermission(permission: string): Promise<boolean> {
    const pb = await createServerClient(false);
    return hasPermission(pb, permission);
}

/**
 * Check if current user can approve products (admin only)
 */
export async function canApproveProducts(): Promise<boolean> {
    return verifyPermission(PERMISSIONS.INVENTORY_APPROVE);
}

/**
 * Check if current user can delete products (admin only)
 */
export async function canDeleteProducts(): Promise<boolean> {
    return verifyPermission(PERMISSIONS.INVENTORY_DELETE);
}
