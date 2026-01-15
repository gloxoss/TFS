import AdminSidebar from "@/components/admin/admin-sidebar";
import { verifyInventoryAccess, getCurrentRole, verifyAdminAccess } from "@/services/auth/access-control";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

interface AdminLayoutProps {
    children: React.ReactNode;
    params: Promise<{
        lng: string;
    }>;
}

// Pages that only admins (not products_manager) can access
const ADMIN_ONLY_PATHS = [
    '/admin/users',
    '/admin/settings',
    '/admin/blog',
    '/admin/requests',
];

// The default page for products_manager role
const PRODUCTS_MANAGER_DEFAULT = '/admin/inventory';

export default async function AdminLayout({
    children,
    params,
}: AdminLayoutProps) {
    const { lng } = await params;

    // Get the current path from headers
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') || '';

    // Check if user has any admin-level access
    const hasAccess = await verifyInventoryAccess();
    if (!hasAccess) {
        redirect(`/${lng}/login`);
    }

    // Get current role for path-based restrictions
    const role = await getCurrentRole();
    const isFullAdmin = await verifyAdminAccess();

    // If products_manager trying to access admin-only pages, redirect to inventory
    if (!isFullAdmin) {
        const isAdminOnlyPath = ADMIN_ONLY_PATHS.some(path =>
            pathname.includes(path)
        );

        // Also redirect from dashboard (root admin page) for products_manager
        const isRootAdmin = pathname === `/${lng}/admin` || pathname.endsWith('/admin');

        if (isAdminOnlyPath || isRootAdmin) {
            redirect(`/${lng}${PRODUCTS_MANAGER_DEFAULT}`);
        }
    }

    return (
        <AdminSidebar lng={lng}>
            {children}
        </AdminSidebar>
    );
}
