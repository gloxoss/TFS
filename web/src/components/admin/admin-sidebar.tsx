"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react';
import {
    X,
    LayoutDashboard,
    Inbox,
    Package,
    Users,
    Settings,
    LogOut,
    Menu,
    FileText,
    LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { usePocketBase } from '@/components/pocketbase-provider';
import { ROLES, UserRole, PERMISSIONS, roleHasPermission } from '@/types/auth';

interface NavigationItem {
    name: string;
    href: string;
    icon: LucideIcon;
    permission?: string; // Required permission to see this item
}

interface AdminSidebarProps {
    children: React.ReactNode;
    lng: string;
}

export default function AdminSidebar({
    children,
    lng
}: AdminSidebarProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const pathname = usePathname();
    const pb = usePocketBase();
    const router = useRouter();
    const user = pb.authStore.model;

    // Get user role on mount
    useEffect(() => {
        if (user && 'role' in user) {
            setUserRole(user.role as UserRole);
        }
    }, [user]);

    const logout = () => {
        pb.authStore.clear();
        document.cookie = "pb_auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        router.push(`/${lng}/login`);
    };

    // All possible navigation items with required permissions
    const allNavigation: NavigationItem[] = [
        { name: 'Overview', href: `/${lng}/admin`, icon: LayoutDashboard, permission: PERMISSIONS.DASHBOARD_VIEW },
        { name: 'Requests', href: `/${lng}/admin/requests`, icon: Inbox, permission: PERMISSIONS.QUOTES_VIEW },
        { name: 'Inventory', href: `/${lng}/admin/inventory`, icon: Package, permission: PERMISSIONS.INVENTORY_VIEW },
        { name: 'Blog', href: `/${lng}/admin/blog`, icon: FileText, permission: PERMISSIONS.BLOG_VIEW },
        { name: 'Users', href: `/${lng}/admin/users`, icon: Users, permission: PERMISSIONS.USERS_VIEW },
        { name: 'Settings', href: `/${lng}/admin/settings`, icon: Settings, permission: PERMISSIONS.SETTINGS_VIEW },
    ];

    // Filter navigation based on user role
    const navigation = allNavigation.filter(item => {
        if (!userRole) return true; // Show all during loading to prevent flash
        if (!item.permission) return true; // No permission required
        return roleHasPermission(userRole, item.permission);
    });

    // Get role display label
    const getRoleLabel = (role: UserRole | null): string => {
        if (!role) return 'Loading...';
        switch (role) {
            case ROLES.ADMIN: return 'Admin';
            case ROLES.PRODUCTS_MANAGER: return 'Products Manager';
            case ROLES.CUSTOMER: return 'Customer';
            default: return 'User';
        }
    };

    const isCurrent = (href: string) => {
        if (href === `/${lng}/admin` && pathname === href) return true;
        if (href !== `/${lng}/admin` && pathname?.startsWith(href)) return true;
        return false;
    };

    return (
        <div>
            {/* Mobile Sidebar Dialog */}
            <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-zinc-950/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
                />

                <div className="fixed inset-0 flex">
                    <DialogPanel
                        transition
                        className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
                    >
                        <TransitionChild>
                            <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                                <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                                    <span className="sr-only">Close sidebar</span>
                                    <X aria-hidden="true" className="size-6 text-white" />
                                </button>
                            </div>
                        </TransitionChild>

                        {/* Mobile Sidebar Content */}
                        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-zinc-950 px-6 pb-2 ring-1 ring-white/10">
                            <div className="flex h-16 shrink-0 items-center gap-2">
                                <div className="h-8 w-8 rounded bg-red-600 flex items-center justify-center">
                                    <span className="text-white font-bold">A</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl font-bold text-white tracking-widest">ADMIN</span>
                                    {userRole === ROLES.PRODUCTS_MANAGER && (
                                        <span className="text-xs text-amber-500">Products Manager</span>
                                    )}
                                </div>
                            </div>
                            <nav className="flex flex-1 flex-col">
                                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                    <li>
                                        <ul role="list" className="-mx-2 space-y-1">
                                            {navigation.map((item) => (
                                                <li key={item.name}>
                                                    <Link
                                                        href={item.href}
                                                        className={cn(
                                                            isCurrent(item.href)
                                                                ? 'bg-zinc-800 text-red-500'
                                                                : 'text-zinc-400 hover:bg-zinc-800 hover:text-white',
                                                            'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                                                        )}
                                                    >
                                                        <item.icon aria-hidden="true" className="size-6 shrink-0" />
                                                        {item.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

            {/* Static sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-zinc-950 px-6 border-r border-zinc-800">
                    <div className="flex h-16 shrink-0 items-center gap-3">
                        <div className="h-8 w-8 rounded bg-red-600 flex items-center justify-center">
                            <span className="text-white font-bold">A</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-white tracking-widest">ADMIN</span>
                            {userRole === ROLES.PRODUCTS_MANAGER && (
                                <span className="text-xs text-amber-500">Products Manager</span>
                            )}
                        </div>
                    </div>
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {navigation.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    isCurrent(item.href)
                                                        ? 'bg-zinc-900 text-red-500 border-l-2 border-red-500'
                                                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-white border-l-2 border-transparent',
                                                    'group flex gap-x-3 p-2 text-sm/6 font-semibold transition-all',
                                                )}
                                            >
                                                <item.icon aria-hidden="true" className="size-5 shrink-0" />
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            <li className="-mx-6 mt-auto">
                                <div className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-zinc-400 hover:bg-zinc-900 border-t border-zinc-800">
                                    <div className="size-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-red-500 font-bold border border-zinc-700">
                                        {user?.email?.charAt(0).toUpperCase() || 'A'}
                                    </div>
                                    <span className="sr-only">Your profile</span>
                                    <div className="flex flex-col overflow-hidden">
                                        <span aria-hidden="true" className="truncate w-full text-zinc-300">{user?.email || 'Admin'}</span>
                                        <span className="text-xs text-zinc-500">{getRoleLabel(userRole)}</span>
                                        <button onClick={logout} className="text-xs text-zinc-500 text-left hover:text-red-400 flex items-center gap-1 transition-colors mt-1">
                                            <LogOut className="size-3" /> Sign out
                                        </button>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </nav>
                    <div className="px-6 py-4 border-t border-zinc-900">
                        <p className="text-[10px] text-zinc-600 font-mono">
                            System: v1.0.0
                            <br />
                            Eng: <span className="opacity-50 hover:opacity-100 transition-opacity cursor-help" title="System Architecture & Maintenance: EPIOSO.TECH">EPS-88</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Top bar mobile */}
            <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-zinc-950 px-4 py-4 shadow-sm sm:px-6 lg:hidden border-b border-zinc-800">
                <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-zinc-400 lg:hidden">
                    <span className="sr-only">Open sidebar</span>
                    <Menu aria-hidden="true" className="size-6" />
                </button>
                <div className="flex-1 text-sm/6 font-semibold text-white">
                    {userRole === ROLES.PRODUCTS_MANAGER ? 'Products Management' : 'Admin Operations'}
                </div>
                <Link href={`/${lng}/admin/inventory`}>
                    <span className="sr-only">Your profile</span>
                    <div className="size-8 rounded-full bg-red-600 flex items-center justify-center text-xs text-white font-bold">
                        {user?.email?.charAt(0).toUpperCase() || 'A'}
                    </div>
                </Link>
            </div>

            {/* Main Content Area */}
            <main className="py-10 lg:pl-72 bg-zinc-950 min-h-screen">
                <div className="px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
