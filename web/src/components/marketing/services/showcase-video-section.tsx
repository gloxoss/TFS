"use client"

/**
 * Showcase Video Section
 * 
 * Displays an embedded video (YouTube/Vimeo) for the showcase template.
 * Used by Sports, Digital, and other services.
 * 
 * Features:
 * - YouTube and Vimeo embed support
 * - Responsive 16:9 aspect ratio
 * - Optional title above video
 * - Dark background with padding
 */

import { motion } from 'framer-motion'
import { Play } from 'lucide-react'

interface ShowcaseVideoSectionProps {
    videoUrl: string
    title?: string
    lng: string
}

// Extract video ID from YouTube or Vimeo URL
function getEmbedUrl(url: string): string | null {
    if (!url) return null

    // YouTube patterns
    const youtubePatterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    ]

    for (const pattern of youtubePatterns) {
        const match = url.match(pattern)
        if (match) {
            return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1`
        }
    }

    // Vimeo patterns
    const vimeoPattern = /(?:vimeo\.com\/)(\d+)/
    const vimeoMatch = url.match(vimeoPattern)
    if (vimeoMatch) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}?title=0&byline=0&portrait=0`
    }

    // If already an embed URL, return as-is
    if (url.includes('youtube.com/embed') || url.includes('player.vimeo.com')) {
        return url
    }

    return null
}

export default function ShowcaseVideoSection({ videoUrl, title, lng }: ShowcaseVideoSectionProps) {
    const embedUrl = getEmbedUrl(videoUrl)

    if (!embedUrl) return null

    return (
        <section className="py-20 md:py-28 bg-zinc-950 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#D00000]/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="container mx-auto px-6 max-w-5xl relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    {title ? (
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 uppercase tracking-tight">
                            {title}
                        </h2>
                    ) : (
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-[#D00000]/20 flex items-center justify-center">
                                <Play className="w-5 h-5 text-[#D00000]" />
                            </div>
                            <h2 className="text-3xl md:text-5xl font-display font-bold text-white uppercase tracking-tight">
                                {lng === 'fr' ? 'Découvrez Nos Services' : 'Watch Our Work'}
                            </h2>
                        </div>
                    )}
                </motion.div>

                {/* Video Container */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl shadow-black/50"
                >
                    {/* 16:9 Aspect Ratio Container */}
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                            src={embedUrl}
                            title={title || 'Service Video'}
                            className="absolute inset-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
