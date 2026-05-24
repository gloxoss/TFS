/**
 * Authentication and Authorization Types
 * Single Source of Truth for User Roles and Permissions
 */

// ============================================================================
// Roles
// ============================================================================

export type UserRole = 'admin' | 'products_manager' | 'customer';

export const ROLES = {
  ADMIN: 'admin',
  PRODUCTS_MANAGER: 'products_manager',
  CUSTOMER: 'customer',
} as const;

// ============================================================================
// Permissions
// ============================================================================

export const PERMISSIONS = {
  // Inventory/Products
  INVENTORY_VIEW: 'inventory:view',
  INVENTORY_EDIT: 'inventory:edit',
  INVENTORY_ADD: 'inventory:add',
  INVENTORY_DELETE: 'inventory:delete',
  INVENTORY_APPROVE: 'inventory:approve',

  // Admin sections
  DASHBOARD_VIEW: 'dashboard:view',
  USERS_VIEW: 'users:view',
  USERS_EDIT: 'users:edit',
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit',
  QUOTES_VIEW: 'quotes:view',
  QUOTES_EDIT: 'quotes:edit',
  BLOG_VIEW: 'blog:view',
  BLOG_EDIT: 'blog:edit',

  // Broadcast Downloads
  DOWNLOADS_VIEW: 'downloads:view',
  DOWNLOADS_EDIT: 'downloads:edit',

  // Full access
  ADMIN_FULL: '*',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// ============================================================================
// Role-Permission Mapping
// ============================================================================

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['*'], // Full access to everything
  products_manager: [
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.INVENTORY_EDIT,
    PERMISSIONS.INVENTORY_ADD,
    PERMISSIONS.DOWNLOADS_VIEW,
    PERMISSIONS.DOWNLOADS_EDIT,
    // Note: Cannot delete or approve - requires admin
  ],
  customer: [], // No admin permissions
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if a role has a specific permission
 */
export function roleHasPermission(role: UserRole, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role];
  return perms.includes('*') || perms.includes(permission);
}

/**
 * Check if a role has admin-level access
 */
export function isAdminRole(role: UserRole): boolean {
  return role === ROLES.ADMIN;
}

/**
 * Check if a role has any inventory access (admin or products_manager)
 */
export function hasInventoryAccess(role: UserRole): boolean {
  return role === ROLES.ADMIN || role === ROLES.PRODUCTS_MANAGER;
}

// ============================================================================
// User Interface
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
}