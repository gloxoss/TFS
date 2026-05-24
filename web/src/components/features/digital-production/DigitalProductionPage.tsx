"use client"

import { Service } from '@/services/services/interface'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ServiceHeroSection from '@/components/marketing/services/service-hero-section'
import ServiceContactSection from '@/components/marketing/services/service-contact-section'
import DOMPurify from 'isomorphic-dompurify'
import { Check, ArrowRight, ArrowUpRight } from 'lucide-react'

interface DigitalProductionPageProps {
    service: Service
    lng: string
}

export default function DigitalProductionPage({ service, lng }: DigitalProductionPageProps) {
    const [showFloatingButton, setShowFloatingButton] = useState(false);

    const title = lng === 'fr' && service.titleFr ? service.titleFr : service.title
    const description = lng === 'fr' && service.briefDescriptionFr ? service.briefDescriptionFr : service.briefDescription

    // Show floating button after scrolling
    useEffect(() => {
        const handleScroll = () => {
            setShowFloatingButton(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <main className="min-h-screen bg-black text-white">
            {/* Floating Equipment Button */}
            <AnimatePresence>
                {showFloatingButton && (
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.3 }}
                        className="fixed bottom-28 right-6 z-50"
                    >
                        <Link
                            href={`/${lng}/equipment`}
                            className="inline-flex items-center gap-2 px-5 py-3 bg-[#D00000] rounded-full text-white text-sm font-medium hover:bg-[#B00000] transition-all duration-300 group shadow-[0_0_20px_rgba(208,0,0,0.4)]"
                        >
                            {lng === 'fr' ? 'Voir Équipements' : 'View Equipment'}
                            <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <ServiceHeroSection
                title={title}
                description={description}
                heroImage={service.heroImage}
                lng={lng}
                serviceId={service.id}
            />

            {/* Custom Sections Renderer */}
            <div className="flex flex-col">
                {service.sections?.map((section, index) => {
                    const sectionTitle = lng === 'fr' && section.titleFr ? section.titleFr : section.title
                    const sectionContent = lng === 'fr' && section.contentFr ? section.contentFr : section.content

                    // Image URL helper
                    const getImageUrl = (image: string) => {
                        if (!image) return null
                        if (image.startsWith('/') || image.startsWith('http')) return image
                        return `${process.env.NEXT_PUBLIC_POCKETBASE_URL || ''}/api/files/services/${service.id}/${image}`
                    }

                    if (section.type === 'text_only') {
                        return (
                            <section key={index} className="relative py-32 overflow-hidden">
                                {/* Ambient Background */}
                                <div className="absolute inset-0 bg-zinc-950">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
                                </div>

                                <div className="container relative z-10 mx-auto px-6 md:px-24 lg:px-40">
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className="max-w-5xl mx-auto text-center"
                                    >
                                        {/* Decorative Element */}
                                        <div className="w-16 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto mb-12 opacity-80" />

                                        {sectionTitle && (
                                            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-10 tracking-tight">
                                                {sectionTitle}
                                            </h2>
                                        )}
                                        {sectionContent && (
                                            <div className="prose prose-invert prose-2xl text-zinc-200 mx-auto">
                                                <p className="leading-relaxed font-light text-2xl md:text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                                                    {sectionContent}
                                                </p>
                                            </div>
                                        )}
                                    </motion.div>
                                </div>
                            </section>
                        )
                    }

                    // Render Features Section
                    if (section.type === 'features') {
                        return (
                            <section key={index} className="py-32 bg-zinc-950 relative overflow-hidden">
                                {/* Ambient Background */}
                                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.05)_0%,transparent_40%)] pointer-events-none" />

                                <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
                                    {sectionTitle && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            className="text-center mb-20"
                                        >
                                            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
                                                {sectionTitle}
                                            </h2>
                                            <div className="w-24 h-1 bg-red-600/80 mx-auto rounded-full" />
                                        </motion.div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                                        {section.items?.map((item, i) => {
                                            const itemTitle = lng === 'fr' && item.titleFr ? item.titleFr : item.title
                                            const itemDesc = lng === 'fr' && item.descriptionFr ? item.descriptionFr : item.description

                                            return (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, y: 30 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="group relative p-8 md:p-10 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-red-600/30 hover:bg-zinc-900/60 transition-all duration-500 overflow-hidden"
                                                >
                                                    {/* Hover Gradient */}
                                                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                                    <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-start">
                                                        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600/20 to-red-900/20 flex items-center justify-center text-red-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_-5px_rgba(220,38,38,0.3)] transition-all duration-500 border border-red-500/10">
                                                            <Check className="w-7 h-7" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
                                                                {itemTitle}
                                                            </h3>
                                                            {itemDesc && (
                                                                <p className="text-zinc-400 leading-relaxed text-base">
                                                                    {itemDesc}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </section>
                        )
                    }

                    // Render Text + Image Section (Standard)
                    const isReversed = section.layout === 'left'
                    const imageUrl = section.image ? getImageUrl(section.image) : null

                    return (
                        <section
                            key={index}
                            className="relative min-h-[90vh] flex items-center overflow-hidden bg-black"
                        >
                            {/* Background Image with Cinematic Overlay */}
                            {imageUrl && (
                                <>
                                    <div className="absolute inset-0 z-0">
                                        <Image
                                            src={imageUrl}
                                            alt={sectionTitle || "Service image"}
                                            fill
                                            className="object-cover transition-transform duration-1000 hover:scale-105"
                                            sizes="100vw"
                                            quality={95}
                                            priority
                                        />
                                    </div>
                                    <div className={`absolute inset-0 z-10 transition-all duration-500 ${isReversed
                                        ? 'bg-gradient-to-l from-black via-zinc-950/95 to-transparent'
                                        : 'bg-gradient-to-r from-black via-zinc-950/95 to-transparent'
                                        }`}
                                    />
                                    <div className="absolute inset-0 z-10 bg-black/20" /> {/* General dim */}
                                </>
                            )}

                            <div className={`container relative z-20 mx-auto px-6 md:px-24 lg:px-40 py-24 flex ${isReversed ? 'justify-end' : 'justify-start'}`}>
                                <motion.div
                                    initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className={`max-w-3xl ${isReversed ? 'text-right' : 'text-left'}`}
                                >
                                    <div className={`inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md ${isReversed ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                                        <span className="text-sm font-medium text-white/80 uppercase tracking-widest">Digital Production</span>
                                    </div>

                                    {sectionTitle && (
                                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-10 leading-[0.95] tracking-tight drop-shadow-2xl">
                                            {sectionTitle}
                                        </h2>
                                    )}
                                    {sectionContent && (
                                        <div className="prose prose-invert prose-2xl text-zinc-300">
                                            <p className="leading-relaxed font-light drop-shadow-lg">
                                                {sectionContent}
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                        </section>
                    )
                })}
            </div>

            {/* Contact Section */}
            <ServiceContactSection lng={lng} />
        </main>
    )
}
