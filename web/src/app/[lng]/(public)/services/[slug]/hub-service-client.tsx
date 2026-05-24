"use client"

/**
 * Hub Service Client
 * 
 * Template for parent services that display child sub-services as navigation cards.
 * Used by: Digital Services and other hub/category pages.
 * 
 * Structure:
 * - Hero section with title and description
 * - Sub-services grid (2 clickable image cards)
 * - Optional contact CTA
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Service } from '@/services/services/interface'
import HubServicesGrid from '@/components/marketing/services/hub-services-grid'
import HubIconsGrid from '@/components/marketing/services/hub-icons-grid'
import HubVideoSlider from '@/components/marketing/services/hub-video-slider'
import HubContentSection from '@/components/marketing/services/hub-content-section'
import ServiceContactSection from '@/components/marketing/services/service-contact-section'
import { PartnersCarousel } from '@/components/ui/partners-carousel'

interface HubServiceClientProps {
    service: Service
    subServices: Service[]  // Pre-fetched sub-services
    lng: string
}

export default function HubServiceClient({ service, subServices, lng }: HubServiceClientProps) {
    // Get localized content
    const title = lng === 'fr' && service.titleFr ? service.titleFr : service.title
    const briefDescription = lng === 'fr' && service.briefDescriptionFr
        ? service.briefDescriptionFr
        : service.briefDescription

    // Get hero image
    const heroImage = service.heroImage || (service.images && service.images[0]) || null

    // Videos - Coming Soon (will be fetched from database in the future)
    const videos: { id: string; title: string; titleFr?: string; vimeoUrl: string; description?: string; descriptionFr?: string }[] = []

    return (
        <main className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <section className="relative h-dvh flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                {heroImage && (
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${heroImage})` }}
                    />
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black" />

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
                            {title}
                        </h1>

                        {/* Subtitle indicating sub-services */}
                        <p className="mt-8 text-sm uppercase tracking-widest text-[#D00000] font-medium">
                            {lng === 'fr'
                                ? `${subServices.length} Services Disponibles`
                                : `${subServices.length} Services Available`
                            }
                        </p>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
                    </div>
                </motion.div>
            </section>

            {/* Content Section - NOW SECOND (moved from bottom) */}
            {service.template === 'hub_alt' && (
                <HubContentSection
                    service={service}
                    lng={lng}
                />
            )}

            {/* Sub-Services Grid - Switch based on template */}
            {service.template === 'hub_alt' ? (
                <HubIconsGrid
                    services={subServices}
                    lng={lng}
                />
            ) : (
                <HubServicesGrid
                    services={subServices}
                    lng={lng}
                />
            )}

            {/* Partners Carousel - Sport hub pages */}
            {service.template === 'hub_alt' && (
                <PartnersCarousel lng={lng} />
            )}

            {/* Video Slider - Only for hub_alt (sports) template */}
            {service.template === 'hub_alt' && (
                <HubVideoSlider
                    videos={videos}
                    lng={lng}
                />
            )}

            {/* Contact Actions Section */}
            <ServiceContactSection
                lng={lng}
                showCatalog={false}
            />
        </main>
    )
}

