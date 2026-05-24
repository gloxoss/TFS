'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Clapperboard, Tv, Radio, MonitorPlay, Mic2, Camera, Video, Settings, LayoutGrid, HardDrive, Truck, MapPin, Users, FileCheck, Utensils, Hotel, Car, UserCheck, Package, Palette, Shirt, Box, Paintbrush, ShieldAlert } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { EvervaultCard, Icon } from "@/components/ui/evervault-card"
import type { Service } from '@/services/services/interface'

// Icon mapping based on service slug
const ICON_MAP: Record<string, React.ReactNode> = {
    'equipment-hire': <Package className="w-6 h-6" />,
    'film-shipping': <Truck className="w-6 h-6" />,
    'film-permits': <FileCheck className="w-6 h-6" />,
    'crewing': <Users className="w-6 h-6" />,
    'scouting': <MapPin className="w-6 h-6" />,
    'catering': <Utensils className="w-6 h-6" />,
    'accommodation': <Hotel className="w-6 h-6" />,
    'transportation': <Car className="w-6 h-6" />,
    'casting': <UserCheck className="w-6 h-6" />,
    // New Services
    'makeup-hair': <Palette className="w-6 h-6" />,
    'costume-wardrobe': <Shirt className="w-6 h-6" />,
    'props-set-dressing': <Box className="w-6 h-6" />,
    'production-design': <Paintbrush className="w-6 h-6" />,
    'security-management': <ShieldAlert className="w-6 h-6" />,
    // Legacy icons for fallback
    'sporting-events': <TrophyIcon className="w-6 h-6" />,
    'film-production': <Clapperboard className="w-6 h-6" />,
    'tv-recording': <Tv className="w-6 h-6" />,
    'live-events': <Mic2 className="w-6 h-6" />,
    'studio-infrastructure': <LayoutGrid className="w-6 h-6" />,
    'ob-vans': <Radio className="w-6 h-6" />,
    'consulting-design': <Settings className="w-6 h-6" />,
    'post-production': <MonitorPlay className="w-6 h-6" />,
    'equipment-rental': <Camera className="w-6 h-6" />,
    'digital-storage': <HardDrive className="w-6 h-6" />,
}

// Default images for services without images
const DEFAULT_IMAGES: Record<string, string> = {
    'equipment-hire': 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?q=75&w=800&auto=format&fit=crop',
    'film-shipping': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=75&w=800&auto=format&fit=crop',
    'film-permits': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=75&w=800&auto=format&fit=crop',
    'crewing': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=75&w=800&auto=format&fit=crop',
    'scouting': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=75&w=800&auto=format&fit=crop',
    'catering': 'https://images.unsplash.com/photo-1555244162-803834f70033?q=75&w=800&auto=format&fit=crop',
    'accommodation': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=75&w=800&auto=format&fit=crop',
    'transportation': 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=75&w=800&auto=format&fit=crop',
    'casting': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=75&w=800&auto=format&fit=crop',
    // New Services Defaults
    'makeup-hair': 'https://images.unsplash.com/photo-1487412947132-26c5c1b151d1?q=75&w=800&auto=format&fit=crop',
    'costume-wardrobe': 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?q=75&w=800&auto=format&fit=crop',
    'props-set-dressing': 'https://images.unsplash.com/photo-1531346300883-e08739665243?q=75&w=800&auto=format&fit=crop',
    'production-design': 'https://images.unsplash.com/photo-1531844251246-9a1bfaaeeb9a?q=75&w=800&auto=format&fit=crop',
    'security-management': 'https://images.unsplash.com/photo-1555952494-efd681c7a3f9?q=75&w=800&auto=format&fit=crop',
}

// Mapped service type for the component
interface MappedService {
    id: string
    slug: string
    title: string
    description: string
    icon: React.ReactNode
    image: string
}

function mapServicesToDisplay(services: Service[], lng: string): MappedService[] {
    return services.map((service) => ({
        id: service.id,
        slug: service.slug,
        title: lng === 'fr' && service.titleFr ? service.titleFr : service.title,
        description: lng === 'fr' && service.briefDescriptionFr ? service.briefDescriptionFr : (service.briefDescription || ''),
        icon: ICON_MAP[service.slug] || <Camera className="w-6 h-6" />,
        image: service.heroImage || service.images?.[0] || DEFAULT_IMAGES[service.slug] || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=75&w=800&auto=format&fit=crop',
    }))
}

function TrophyIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
    )
}

function ExpandingCardRow({ items, startIndex, lng }: { items: MappedService[], startIndex: number, lng: string }) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [tappedIndex, setTappedIndex] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Check if mobile on mount and resize
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Handle tap on mobile - toggle expansion
    const handleCardTap = (index: number, e: React.MouseEvent | React.TouchEvent) => {
        if (!isMobile) return; // Desktop uses hover, not tap

        e.preventDefault(); // Prevent navigation on first tap

        if (tappedIndex === index) {
            // If already expanded, navigate to the link
            const item = items[index];
            const href = item.slug === 'equipment-hire'
                ? `/${lng}/equipment`
                : `/${lng}/services/${item.slug}`;
            window.location.href = href;
        } else {
            // Expand this card, collapse others
            setTappedIndex(index);
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 w-full h-[800px] md:h-[500px]">
            {items.map((item, index) => {
                // Desktop: hover ONLY. Mobile: tap to expand
                const isHovered = hoveredIndex === index;
                const isTapped = isMobile && tappedIndex === index;
                const isActive = isHovered || isTapped;

                // Equipment Hire links to the equipment page, others to services
                const href = item.slug === 'equipment-hire'
                    ? `/${lng}/equipment`
                    : `/${lng}/services/${item.slug}`;

                const cardContent = (
                    <motion.div
                        onClick={(e) => handleCardTap(index, e)}
                        onHoverStart={() => !isMobile && setHoveredIndex(index)}
                        onHoverEnd={() => !isMobile && setHoveredIndex(null)}
                        className={cn(
                            "relative overflow-hidden rounded-2xl cursor-pointer border border-white/10 group transition-all duration-700 ease-out",
                            "flex flex-col justify-end p-6",
                        )}
                        initial={{ flex: 1 }}
                        animate={{
                            flex: isActive ? 3 : 1,
                        }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Background Image */}
                        <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className={cn(
                                "object-cover absolute inset-0 z-0 transition-transform duration-700",
                                isActive ? "scale-110 blur-[1px]" : "grayscale scale-100"
                            )}
                        />
                        <div className={cn("absolute inset-0 bg-black/40 z-10 transition-opacity duration-500", isActive ? "opacity-60" : "opacity-30")} />

                        {/* Evervault Effect Overlay (Only on active) */}
                        <div className={cn(
                            "absolute inset-0 z-20 opacity-0 transition-opacity duration-300 pointer-events-none mix-blend-screen",
                            isActive ? "opacity-100" : ""
                        )}>
                            <EvervaultCard className="w-full h-full" />
                        </div>

                        {/* Corner Icons (Decorative) */}
                        <Icon className="absolute h-6 w-6 top-3 left-3 text-white/50 z-30" />
                        <Icon className="absolute h-6 w-6 bottom-3 left-3 text-white/50 z-30" />
                        <Icon className="absolute h-6 w-6 top-3 right-3 text-white/50 z-30" />
                        <Icon className="absolute h-6 w-6 bottom-3 right-3 text-white/50 z-30" />

                        {/* Content */}
                        <div className="relative z-30">
                            <motion.h3
                                layout
                                className="text-xl md:text-2xl font-bold font-display uppercase tracking-wider text-white drop-shadow-lg leading-tight mb-2"
                            >
                                {item.title}
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: isActive ? 1 : 0, height: isActive ? 'auto' : 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-sm text-zinc-300 font-medium overflow-hidden"
                            >
                                {item.description}
                            </motion.p>
                            {/* Tap hint on mobile when expanded */}
                            {isMobile && isActive && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-3 flex items-center gap-2 text-white/70 text-xs"
                                >
                                    <ArrowRight className="w-3 h-3" />
                                    <span>Tap again to view</span>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                );

                // On desktop, wrap in Link. On mobile, handle tap manually
                if (isMobile) {
                    return (
                        <div key={item.id} className="contents">
                            {cardContent}
                        </div>
                    );
                }

                return (
                    <Link
                        key={item.id}
                        href={href}
                        className="contents"
                    >
                        {cardContent}
                    </Link>
                )
            })}
        </div>
    )
}

// Translations
const translations = {
    en: {
        title: 'Our Services',
        subtitle: 'At TFS (TV Film Solutions), we provide end-to-end production solutions across cinema, television, and digital media — from technical planning and equipment rental to full-scale production and broadcast delivery.',
        viewAll: 'View all services'
    },
    fr: {
        title: 'Nos Services',
        subtitle: 'Chez TFS (TV Film Solutions), nous proposons des solutions de production complètes pour le cinéma, la télévision et les médias numériques — de la planification technique et la location d’équipements à la production intégrale et à la diffusion broadcast.',
        viewAll: 'Voir tous les services'
    }
}

interface ProductionServicesProps {
    lng?: string
    services?: Service[]
}

export function ProductionServices({ lng = 'en', services = [] }: ProductionServicesProps) {
    // Map services to display format with icons and images
    const mappedServices = mapServicesToDisplay(services, lng);

    // Split into rows (5-5-5 pattern for 15 items)
    const row1 = mappedServices.slice(0, 5);
    const row2 = mappedServices.slice(5, 10);
    const row3 = mappedServices.slice(10, 15);

    const t = translations[lng as keyof typeof translations] || translations.en;

    // If no services, don't render the section
    if (mappedServices.length === 0) {
        return null;
    }

    return (
        <section className="py-24 bg-black relative overflow-hidden px-4 md:px-0">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-900/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <div className="max-w-[1400px] mx-auto relative z-10">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{t.title}</h2>
                        <p className="text-zinc-400 text-lg">
                            {t.subtitle}
                        </p>
                    </div>

                </div>

                <div className="flex flex-col gap-6">
                    {row1.length > 0 && <ExpandingCardRow items={row1} startIndex={0} lng={lng} />}
                    {row2.length > 0 && <ExpandingCardRow items={row2} startIndex={5} lng={lng} />}
                    {row3.length > 0 && <ExpandingCardRow items={row3} startIndex={10} lng={lng} />}
                </div>
            </div>
        </section>
    )
}

