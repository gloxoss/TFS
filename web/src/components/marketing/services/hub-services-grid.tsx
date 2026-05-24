"use client"

/**
 * Hub Services Grid
 * 
 * Displays child sub-services as large clickable image cards.
 * Used by the hub template for parent services like "Digital Services".
 */

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { Service } from '@/services/services/interface'

interface HubServicesGridProps {
    services: Service[]
    lng: string
}

export default function HubServicesGrid({ services, lng }: HubServicesGridProps) {
    if (!services || services.length === 0) {
        return null
    }

    return (
        <section className="py-16 md:py-24 bg-black">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {services.map((service, index) => {
                        const title = lng === 'fr' && service.titleFr ? service.titleFr : service.title
                        const description = lng === 'fr' && service.briefDescriptionFr
                            ? service.briefDescriptionFr
                            : service.briefDescription

                        // Get hero image or first image
                        const image = service.heroImage || (service.images && service.images[0]) || '/images/placeholder.jpg'

                        return (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.15 }}
                            >
                                <Link
                                    href={`/${lng}/services/${service.slug}`}
                                    className="group block relative aspect-[4/3] md:aspect-[16/10] rounded-2xl overflow-hidden"
                                >
                                    {/* Background Image */}
                                    <Image
                                        src={image}
                                        alt={title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/95 transition-all duration-500" />

                                    {/* Content */}
                                    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                                        {/* Title */}
                                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 group-hover:text-[#D00000] transition-colors duration-300">
                                            {title}
                                        </h3>

                                        {/* Description */}
                                        {description && (
                                            <p className="text-white/70 text-sm md:text-base line-clamp-2 mb-4 max-w-md">
                                                {description}
                                            </p>
                                        )}

                                        {/* CTA */}
                                        <div className="flex items-center gap-2 text-[#D00000] font-medium">
                                            <span className="text-sm md:text-base">
                                                {lng === 'fr' ? 'En savoir plus' : 'Learn More'}
                                            </span>
                                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                                        </div>
                                    </div>

                                    {/* Hover Border Accent */}
                                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#D00000]/50 transition-all duration-500" />
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
