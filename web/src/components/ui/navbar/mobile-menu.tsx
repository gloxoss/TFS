"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { 
    Search, Globe, ExternalLink, ChevronDown, Package, Truck, FileCheck, 
    Users, MapPin, Utensils, Hotel, Car, UserCheck, Film, Plane, Wrench,
    Video, Clapperboard, Activity, Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { languages } from "@/app/i18n/settings";
import { motion, AnimatePresence } from "framer-motion";
import { getServicesForNav, type ServiceItem } from "@/lib/actions/services";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenSearch: () => void;
    lng: string;
    navLinks: Array<{ href: string; label: string }>;
    cartItemCount: number;
}

// Icon mapping for services
const SERVICE_ICONS: Record<string, React.ReactNode> = {
    'equipment-hire': <Package className="w-4 h-4" />,
    'film-shipping': <Truck className="w-4 h-4" />,
    'film-permits': <FileCheck className="w-4 h-4" />,
    'crewing': <Users className="w-4 h-4" />,
    'scouting': <MapPin className="w-4 h-4" />,
    'catering': <Utensils className="w-4 h-4" />,
    'accommodation': <Hotel className="w-4 h-4" />,
    'transportation': <Car className="w-4 h-4" />,
    'casting': <UserCheck className="w-4 h-4" />,
    'post-production': <Film className="w-4 h-4" />,
    'aerial-services': <Plane className="w-4 h-4" />,
    'production-support': <Wrench className="w-4 h-4" />,
    'video-production': <Video className="w-4 h-4" />,
    'film-production': <Clapperboard className="w-4 h-4" />,
    'sporting-events': <Activity className="w-4 h-4" />,
    'security-services': <Shield className="w-4 h-4" />,
};

export function MobileMenu({
    isOpen,
    onClose,
    onOpenSearch,
    lng,
    navLinks,
    cartItemCount,
}: MobileMenuProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [servicesExpanded, setServicesExpanded] = useState(false);
    const [services, setServices] = useState<ServiceItem[]>([]);

    // Fetch services using server action (filter out hub/hub_alt sub-services)
    useEffect(() => {
        if (!isOpen) return;

        async function fetchServices() {
            try {
                const allServices = await getServicesForNav();
                
                // Collect all sub-service slugs from hub services (both 'hub' and 'hub_alt' templates)
                const subServiceSlugs = new Set<string>();
                allServices.forEach(service => {
                    if ((service.template === 'hub' || service.template === 'hub_alt') && service.sub_services) {
                        try {
                            const subs = typeof service.sub_services === 'string'
                                ? JSON.parse(service.sub_services)
                                : service.sub_services;
                            if (Array.isArray(subs)) {
                                subs.forEach((slug: string) => subServiceSlugs.add(slug));
                            }
                        } catch (e) { }
                    }
                });

                // Filter out sub-services from menu (they're accessed via hub page)
                const mainServices = allServices.filter(s => !subServiceSlugs.has(s.slug));
                setServices(mainServices);
            } catch (error) {
                console.error('Failed to fetch services:', error);
            }
        }
        fetchServices();
    }, [isOpen]);

    if (!isOpen) return null;

    const getServiceHref = (slug: string) => {
        if (slug === 'equipment-hire') {
            return `/${lng}/equipment`;
        }
        return `/${lng}/services/${slug}`;
    };

    const getTitle = (service: ServiceItem) => {
        if (lng === 'fr' && service.title_fr) {
            return service.title_fr;
        }
        return service.title;
    };

    return (
        <div className="absolute top-full right-0 mt-4 w-72 max-h-[80vh] overflow-y-auto z-[100] bg-zinc-900/95 border border-white/10 rounded-2xl p-4 flex flex-col gap-2 backdrop-blur-xl md:hidden shadow-2xl">
            {/* Mobile Search */}
            <button
                onClick={() => {
                    onClose();
                    onOpenSearch();
                }}
                aria-label="Open search"
                className="flex items-center gap-3 p-3 bg-white/5 rounded-xl text-zinc-400 hover:bg-white/10 transition-colors"
            >
                <Search className="w-4 h-4" />
                <span className="text-sm">Search equipment...</span>
            </button>

            {/* Services Expandable Section */}
            <div>
                <button
                    onClick={() => setServicesExpanded(!servicesExpanded)}
                    className={cn(
                        "w-full flex items-center justify-between p-3 rounded-xl font-medium transition-colors",
                        servicesExpanded || pathname.includes('/services') || pathname.includes('/equipment')
                            ? "bg-white/10 text-white"
                            : "text-white hover:bg-white/10"
                    )}
                >
                    <span>{lng === 'fr' ? 'Services' : 'Services'}</span>
                    <ChevronDown className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        servicesExpanded && "rotate-180"
                    )} />
                </button>

                <AnimatePresence>
                    {servicesExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="pl-3 pt-1 space-y-1">
                                {services.map((service) => {
                                    const href = getServiceHref(service.slug);
                                    const isActive = pathname === href;
                                    const Icon = SERVICE_ICONS[service.slug];

                                    return (
                                        <Link
                                            key={service.id}
                                            href={href}
                                            className={cn(
                                                "flex items-center gap-3 p-2.5 rounded-lg text-sm transition-colors",
                                                isActive
                                                    ? "bg-white/10 text-white"
                                                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                                            )}
                                            onClick={() => onClose()}
                                        >
                                            <span className="w-6 h-6 rounded bg-white/5 flex items-center justify-center">
                                                {Icon || <Package className="w-3.5 h-3.5" />}
                                            </span>
                                            {getTitle(service)}
                                        </Link>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Other Nav Links */}
            {navLinks.map(link => {
                const isActive = pathname === `/${lng}${link.href}` || pathname.startsWith(`/${lng}${link.href}/`);
                return (
                    <Link
                        key={link.href}
                        href={`/${lng}${link.href}`}
                        className={cn(
                            "p-3 rounded-xl font-medium transition-colors",
                            isActive
                                ? "bg-white text-black"
                                : "text-white hover:bg-white/10"
                        )}
                        onClick={() => onClose()}
                    >
                        {link.label}
                    </Link>
                );
            })}

            <div className="h-px bg-white/10 my-2" />

            {/* Language Selector - Mobile */}
            <div className="flex items-center gap-2 p-2">
                <Globe className="w-4 h-4 text-zinc-400" />
                <div className="flex flex-wrap gap-1.5">
                    {languages.map((language) => (
                        <button
                            key={language}
                            onClick={() => {
                                const currentPath = window.location.pathname;
                                const newPath = currentPath === '/' || currentPath === `/${lng}` || currentPath === `/${lng}/`
                                    ? `/${language}`
                                    : currentPath.replace(`/${lng}/`, `/${language}/`);
                                router.push(newPath);
                                onClose();
                            }}
                            aria-label={`Switch to ${language.toUpperCase()}`}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors uppercase",
                                lng === language
                                    ? "bg-white text-black"
                                    : "bg-white/10 text-white/70 hover:bg-white/20"
                            )}
                        >
                            {language}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-px bg-white/10 my-2" />

            {/* Action Buttons - Side by Side */}
            <div className="flex gap-2">
                {/* Request Quote */}
                <Link
                    href={`/${lng}/quote`}
                    className={cn(
                        "flex-1 p-3 rounded-xl font-semibold text-center transition-colors text-sm",
                        cartItemCount > 0
                            ? "bg-white text-black"
                            : "bg-red-600 text-white hover:bg-red-700"
                    )}
                    onClick={() => onClose()}
                >
                    {cartItemCount > 0 ? `Quote (${cartItemCount})` : "Get Quote"}
                </Link>

                {/* IMDB Button */}
                <a
                    href="https://www.imdb.com/fr/user/ur212569790/?ref_=hm_nv_profile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl font-bold bg-[#F5C518] text-black hover:bg-[#E0B015] transition-colors text-sm"
                    onClick={() => onClose()}
                >
                    IMDB
                    <ExternalLink className="w-3.5 h-3.5" />
                </a>
            </div>
        </div>
    );
}
