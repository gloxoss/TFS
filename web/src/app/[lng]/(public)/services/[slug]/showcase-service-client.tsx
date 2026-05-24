"use client"

/**
 * Showcase Service Client
 * 
 * Alternative service page template with:
 * - Hero slider (instead of single image)
 * - Content sections (reused from default template)
 * - Video section (before contact)
 * - Downloads section (grouped PDFs)
 * - Contact CTA
 * 
 * Used by: Sports, Digital, and other services with template="showcase"
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import type { Service } from '@/services/services/interface'
import ShowcaseHeroSlider from '@/components/marketing/services/showcase-hero-slider'
import ShowcaseVideoSection from '@/components/marketing/services/showcase-video-section'
import ShowcaseDownloadsSection from '@/components/marketing/services/showcase-downloads-section'
import ServiceContentSection from '@/components/marketing/services/service-content-section'
import ServiceStatsSection from '@/components/marketing/services/service-stats-section'
import ServiceFeaturesSection from '@/components/marketing/services/service-features-section'
import ServiceContactSection from '@/components/marketing/services/service-contact-section'
import { PartnersCarousel } from '@/components/ui/partners-carousel'

interface ShowcaseServiceClientProps {
    service: Service
    lng: string
}

export default function ShowcaseServiceClient({ service, lng }: ShowcaseServiceClientProps) {
    const [showFloatingButton, setShowFloatingButton] = useState(false)

    // Get localized content
    const title = lng === 'fr' && service.titleFr ? service.titleFr : service.title
    const briefDescription = lng === 'fr' && service.briefDescriptionFr
        ? service.briefDescriptionFr
        : service.briefDescription

    // Check if there is structured content
    const hasStructuredContent = (service.sections && service.sections.length > 0) ||
        (service.stats && service.stats.length > 0) ||
        (service.features && service.features.length > 0)

    // Get slider images - fallback to heroImage or images if sliderImages not set
    const sliderImages = service.sliderImages && service.sliderImages.length > 0
        ? service.sliderImages
        : service.heroImage
            ? [service.heroImage]
            : service.images && service.images.length > 0
                ? service.images
                : []

    // Show floating equipment button after scroll
    useEffect(() => {
        const handleScroll = () => {
            setShowFloatingButton(window.scrollY > 300)
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <main className="min-h-screen bg-black text-white">
            {/* Floating Equipment Button */}
            <AnimatePresence>
                {showFloatingButton && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="fixed right-6 bottom-28 z-50"
                    >
                        <Link
                            href={`/${lng}/equipment`}
                            className="flex items-center gap-2 px-5 py-3 bg-[#D00000] hover:bg-[#B00000] text-white rounded-full font-medium transition-all shadow-lg shadow-black/30 text-sm"
                        >
                            {lng === 'fr' ? 'Voir Équipements' : 'View Equipment'}
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Slider Section */}
            <ShowcaseHeroSlider
                title={title}
                images={sliderImages}
                lng={lng}
            />

            {/* Description Section - Second Section */}
            {briefDescription && (
                <section className="relative py-20 bg-zinc-950 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(220,38,38,0.03)_0%,_transparent_70%)]" />
                    <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <p className="text-xl md:text-2xl lg:text-3xl text-zinc-300 leading-relaxed font-light">
                                {briefDescription}
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* Content Sections (reused from default template) */}
            {service.sections && service.sections.length > 0 && (
                <ServiceContentSection
                    sections={service.sections}
                    lng={lng}
                    serviceId={service.id}
                />
            )}

            {/* Stats Section (reused from default template) */}
            {service.stats && service.stats.length > 0 && (
                <ServiceStatsSection
                    stats={service.stats}
                    lng={lng}
                />
            )}

            {/* Features Section (reused from default template) */}
            {service.features && service.features.length > 0 && (
                <ServiceFeaturesSection
                    features={service.features}
                    tags={service.tags}
                    lng={lng}
                />
            )}

            {/* Video Section - Before downloads */}
            {service.videoUrl && (
                <ShowcaseVideoSection
                    videoUrl={service.videoUrl}
                    lng={lng}
                />
            )}

            {/* Downloads Section */}
            {service.downloads && service.downloads.length > 0 && (
                <ShowcaseDownloadsSection
                    downloads={service.downloads}
                    lng={lng}
                />
            )}

            {/* Partners Carousel - Sport services */}
            {service.slug?.includes('sport') && (
                <PartnersCarousel lng={lng} />
            )}

            {/* Contact Actions Section (reused from default template) */}
            <ServiceContactSection
                lng={lng}
                showCatalog={hasStructuredContent}
            />
        </main>
    )
}
