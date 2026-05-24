"use client"

import { motion } from 'framer-motion'
import DOMPurify from 'isomorphic-dompurify'
import type { ServiceSection } from '@/services/services/interface'
import Image from 'next/image'

interface ServiceContentSectionProps {
    sections: ServiceSection[]
    lng: string
    serviceId: string
}

export default function ServiceContentSection({ sections, lng, serviceId }: ServiceContentSectionProps) {
    if (!sections || sections.length === 0) return null

    const getImageUrl = (image: string) => {
        if (!image) return null
        if (image.startsWith('/') || image.startsWith('http')) return image
        return `${process.env.NEXT_PUBLIC_POCKETBASE_URL || ''}/api/files/services/${serviceId}/${image}`
    }

    return (
        <div className="bg-black">
            {sections.map((section, index) => {
                const title = lng === 'fr' && section.titleFr ? section.titleFr : section.title
                const content = lng === 'fr' && section.contentFr ? section.contentFr : section.content
                const isReversed = section.layout === 'left'
                const imageUrl = section.image ? getImageUrl(section.image) : null

                return (
                    <section
                        key={index}
                        className="relative min-h-screen flex items-center overflow-hidden"
                    >
                        {/* Background Image */}
                        {imageUrl && (
                            <>
                                <div className="absolute inset-0">
                                    <Image
                                        src={imageUrl}
                                        alt={title || "Service section image"}
                                        fill
                                        className="object-cover transition-transform duration-700 hover:scale-105"
                                        priority={index === 0} // Prioritize first section image
                                        sizes="100vw"
                                        quality={85}
                                    />
                                </div>
                                {/* Dark Overlay - Gradient based on layout */}
                                <div className={`absolute inset-0 z-10 ${isReversed
                                    ? 'bg-gradient-to-l from-black via-black/80 to-black/40'
                                    : 'bg-gradient-to-r from-black via-black/80 to-black/40'
                                    }`} />
                            </>
                        )}

                        {/* Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className={`relative z-10 w-full px-6 md:px-24 lg:px-40 py-24 flex ${isReversed ? 'justify-end' : 'justify-start'}`}
                        >
                            {/* Content Box */}
                            <div className={`max-w-5xl ${isReversed ? 'text-right' : 'text-left'}`}>
                                {title && (
                                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-8 leading-[0.95] uppercase tracking-tight text-balance">
                                        {title}
                                    </h2>
                                )}
                                {content && (
                                    <div
                                        className="prose prose-invert prose-lg md:prose-2xl max-w-none text-zinc-200 leading-relaxed text-pretty"
                                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
                                    />
                                )}

                            </div>
                        </motion.div>
                    </section>
                )
            })}
        </div >
    )
}
