"use client"

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { Service } from '@/services/services/interface'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from '@/components/ui/carousel'

/**
 * Hub Icons Grid
 * 
 * Alternative display for Hub sub-services (sports) as a carousel/slider.
 * Shows cards with:
 * - Background hero image
 * - Custom SVG icon from /images/icons/sports/
 * - Title + Description
 */

interface HubIconsGridProps {
    services: Service[]
    lng: string
}

// Map sport slugs to their SVG icon paths
const SPORT_ICONS: Record<string, string> = {
    "athletics": "/images/icons/sports/athletics.svg",
    "baseball": "/images/icons/sports/baseball.svg",
    "basketball": "/images/icons/sports/basketball.svg",
    "combat-sports": "/images/icons/sports/combat-sports.svg",
    "cycling": "/images/icons/sports/cycling.svg",
    "equestrian": "/images/icons/sports/equestrian.svg",
    "extreme-sports": "/images/icons/sports/extreme-sports.svg",
    "football": "/images/icons/sports/football.svg",
    "motorsports": "/images/icons/sports/motorsports.svg",
    "rugby": "/images/icons/sports/rugby.svg",
    "tennis": "/images/icons/sports/tennis.svg",
}

// Default icon for unknown sports
const DEFAULT_ICON = "/images/icons/sports/athletics.svg"

export default function HubIconsGrid({ services, lng }: HubIconsGridProps) {
    if (!services || services.length === 0) {
        return null
    }

    return (
        <section className="py-16 md:py-24 bg-zinc-950">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        {lng === 'fr' ? 'Nos Divisions Sportives' : 'Our Sports Divisions'}
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        {lng === 'fr'
                            ? 'Expertise spécialisée pour chaque discipline sportive'
                            : 'Specialized expertise for every sport discipline'
                        }
                    </p>
                </motion.div>

                {/* Carousel for mobile/tablet, Grid for desktop */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => {
                        const title = lng === 'fr' && service.titleFr ? service.titleFr : service.title

                        let description = lng === 'fr' && service.briefDescriptionFr
                            ? service.briefDescriptionFr
                            : service.briefDescription

                        if (!description && service.fullDescription) {
                            description = service.fullDescription.replace(/<[^>]*>?/gm, '').substring(0, 120) + '...'
                        }

                        // Get icon path from slug
                        const iconPath = SPORT_ICONS[service.slug] || DEFAULT_ICON

                        // Get hero image for background
                        const heroImage = service.heroImage || (service.images && service.images[0]) || null

                        return (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                className="h-full"
                            >
                                <Link
                                    href={`/${lng}/services/${service.slug}`}
                                    className="group relative flex flex-col h-full min-h-[320px] overflow-hidden rounded-2xl border border-white/10 hover:border-red-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/20"
                                >
                                    {/* Background Image */}
                                    {heroImage && (
                                        <div className="absolute inset-0">
                                            <Image
                                                src={heroImage}
                                                alt={title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            />
                                        </div>
                                    )}

                                    {/* Dark Overlay - stronger at bottom for text readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40 group-hover:from-black group-hover:via-black/80 group-hover:to-black/50 transition-all duration-300" />

                                    {/* Content */}
                                    <div className="relative z-10 flex flex-col h-full p-6">
                                        {/* Icon Header */}
                                        <div className="flex items-start justify-between mb-auto">
                                            <div className="p-3 rounded-xl bg-zinc-900/80 backdrop-blur-sm border border-white/10 group-hover:border-red-500/30 group-hover:bg-red-500/10 transition-all duration-300">
                                                <Image
                                                    src={iconPath}
                                                    alt=""
                                                    width={40}
                                                    height={40}
                                                    className="w-10 h-10 invert opacity-90 group-hover:opacity-100 transition-opacity"
                                                />
                                            </div>

                                            <div className="p-2 rounded-full bg-transparent group-hover:bg-red-500/10 transition-colors duration-300">
                                                <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-red-500 -rotate-45 group-hover:rotate-0 transition-all duration-300" />
                                            </div>
                                        </div>

                                        {/* Text Content - pushed to bottom */}
                                        <div className="mt-auto">
                                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-500 transition-colors duration-300">
                                                {title}
                                            </h3>

                                            {description && (
                                                <p className="text-zinc-300 text-sm leading-relaxed line-clamp-2 group-hover:text-zinc-200 transition-colors">
                                                    {description}
                                                </p>
                                            )}

                                            {/* Link Text */}
                                            <div className="mt-4 pt-3 border-t border-white/10">
                                                <span className="text-sm font-medium text-red-500 flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                                                    {lng === 'fr' ? 'Découvrir' : 'Learn More'}
                                                    <ArrowRight className="w-4 h-4" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>

                <div className="block md:hidden">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-2 md:-ml-4">
                            {services.map((service, index) => {
                                const title = lng === 'fr' && service.titleFr ? service.titleFr : service.title

                                let description = lng === 'fr' && service.briefDescriptionFr
                                    ? service.briefDescriptionFr
                                    : service.briefDescription

                                if (!description && service.fullDescription) {
                                    description = service.fullDescription.replace(/<[^>]*>?/gm, '').substring(0, 120) + '...'
                                }

                                // Get icon path from slug
                                const iconPath = SPORT_ICONS[service.slug] || DEFAULT_ICON

                                // Get hero image for background
                                const heroImage = service.heroImage || (service.images && service.images[0]) || null

                                return (
                                    <CarouselItem
                                        key={service.id}
                                        className="pl-2 md:pl-4 basis-full sm:basis-1/2"
                                    >
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.05 }}
                                            className="h-full"
                                        >
                                            <Link
                                                href={`/${lng}/services/${service.slug}`}
                                                className="group relative flex flex-col h-full min-h-[320px] overflow-hidden rounded-2xl border border-white/10 hover:border-red-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/20"
                                            >
                                                {/* Background Image */}
                                                {heroImage && (
                                                    <div className="absolute inset-0">
                                                        <Image
                                                            src={heroImage}
                                                            alt={title}
                                                            fill
                                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                        />
                                                    </div>
                                                )}

                                                {/* Dark Overlay - stronger at bottom for text readability */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40 group-hover:from-black group-hover:via-black/80 group-hover:to-black/50 transition-all duration-300" />

                                                {/* Content */}
                                                <div className="relative z-10 flex flex-col h-full p-6">
                                                    {/* Icon Header */}
                                                    <div className="flex items-start justify-between mb-auto">
                                                        <div className="p-3 rounded-xl bg-zinc-900/80 backdrop-blur-sm border border-white/10 group-hover:border-red-500/30 group-hover:bg-red-500/10 transition-all duration-300">
                                                            <Image
                                                                src={iconPath}
                                                                alt=""
                                                                width={40}
                                                                height={40}
                                                                className="w-10 h-10 invert opacity-90 group-hover:opacity-100 transition-opacity"
                                                            />
                                                        </div>

                                                        <div className="p-2 rounded-full bg-transparent group-hover:bg-red-500/10 transition-colors duration-300">
                                                            <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-red-500 -rotate-45 group-hover:rotate-0 transition-all duration-300" />
                                                        </div>
                                                    </div>

                                                    {/* Text Content - pushed to bottom */}
                                                    <div className="mt-auto">
                                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-500 transition-colors duration-300">
                                                            {title}
                                                        </h3>

                                                        {description && (
                                                            <p className="text-zinc-300 text-sm leading-relaxed line-clamp-2 group-hover:text-zinc-200 transition-colors">
                                                                {description}
                                                            </p>
                                                        )}

                                                        {/* Link Text */}
                                                        <div className="mt-4 pt-3 border-t border-white/10">
                                                            <span className="text-sm font-medium text-red-500 flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                                                                {lng === 'fr' ? 'Découvrir' : 'Learn More'}
                                                                <ArrowRight className="w-4 h-4" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    </CarouselItem>
                                )
                            })}
                        </CarouselContent>

                        {/* Navigation Controls */}
                        <div className="flex items-center justify-center gap-4 mt-8">
                            <CarouselPrevious className="relative static translate-x-0 translate-y-0 bg-zinc-900 border-white/10 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-500" />
                            <CarouselNext className="relative static translate-x-0 translate-y-0 bg-zinc-900 border-white/10 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-500" />
                        </div>
                    </Carousel>
                </div>
            </div>
        </section>
    )
}
