"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, X } from 'lucide-react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from '@/components/ui/carousel'

/**
 * Hub Video Slider
 *
 * Displays Vimeo videos in a carousel format for the sports page.
 * Videos play inline in a modal overlay when clicked.
 */

interface VideoItem {
    id: string
    title: string
    titleFr?: string
    vimeoUrl: string
    thumbnail?: string
    description?: string
    descriptionFr?: string
}

interface HubVideoSliderProps {
    videos: VideoItem[]
    lng: string
}

// Extract Vimeo video ID from URL
function getVimeoId(url: string): string | null {
    const match = url.match(/vimeo\.com\/(\d+)/)
    return match ? match[1] : null
}

// Get Vimeo thumbnail URL
function getVimeoThumbnail(videoId: string): string {
    return `https://vumbnail.com/${videoId}.jpg`
}

// Get embed URL for Vimeo
function getVimeoEmbedUrl(url: string): string | null {
    const vimeoId = getVimeoId(url)
    if (vimeoId) {
        return `https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0`
    }
    return null
}

export default function HubVideoSlider({ videos, lng }: HubVideoSliderProps) {
    const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null)

    const handlePlayVideo = (video: VideoItem) => {
        setActiveVideo(video)
    }

    const handleCloseVideo = () => {
        setActiveVideo(null)
    }

    // Coming Soon state when no videos
    if (!videos || videos.length === 0) {
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
                            {lng === 'fr' ? 'Nos Réalisations' : 'Our Work'}
                        </h2>
                        <p className="text-zinc-400 max-w-2xl mx-auto">
                            {lng === 'fr'
                                ? 'Découvrez nos productions sportives et événements couverts'
                                : 'Explore our sports productions and covered events'
                            }
                        </p>
                    </motion.div>

                    {/* Coming Soon Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="flex flex-col items-center justify-center py-16 md:py-24 border border-dashed border-zinc-700 rounded-2xl bg-zinc-900/20"
                    >
                        <div className="w-20 h-20 rounded-full bg-red-600/10 border border-red-600/30 flex items-center justify-center mb-6">
                            <Play className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                            {lng === 'fr' ? 'Bientôt Disponible' : 'Coming Soon'}
                        </h3>
                        <p className="text-zinc-400 text-center max-w-md px-4">
                            {lng === 'fr'
                                ? 'Nos vidéos de productions sportives seront bientôt disponibles. Restez à l\'écoute !'
                                : 'Our sports production videos will be available soon. Stay tuned!'
                            }
                        </p>
                    </motion.div>
                </div>
            </section>
        )
    }

    return (
        <>
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
                            {lng === 'fr' ? 'Nos Réalisations' : 'Our Work'}
                        </h2>
                        <p className="text-zinc-400 max-w-2xl mx-auto">
                            {lng === 'fr'
                                ? 'Découvrez nos productions sportives et événements couverts'
                                : 'Explore our sports productions and covered events'
                            }
                        </p>
                    </motion.div>

                    {/* Video Carousel */}
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-2 md:-ml-4">
                            {videos.map((video, index) => {
                                const videoId = getVimeoId(video.vimeoUrl)
                                const thumbnail = video.thumbnail || (videoId ? getVimeoThumbnail(videoId) : '')
                                const title = lng === 'fr' && video.titleFr ? video.titleFr : video.title
                                const description = lng === 'fr' && video.descriptionFr ? video.descriptionFr : video.description

                                return (
                                    <CarouselItem
                                        key={video.id}
                                        className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                                    >
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.05 }}
                                            className="h-full"
                                        >
                                            <div className="group relative h-full bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden hover:bg-zinc-900/80 hover:border-red-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/10">
                                                {/* Video Thumbnail */}
                                                <button
                                                    onClick={() => handlePlayVideo(video)}
                                                    className="relative aspect-video w-full overflow-hidden cursor-pointer"
                                                    aria-label={`Play ${title}`}
                                                >
                                                    {thumbnail && (
                                                        <img
                                                            src={thumbnail}
                                                            alt={title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    )}

                                                    {/* Play Button Overlay */}
                                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                                        <div className="w-16 h-16 rounded-full bg-red-600/90 group-hover:bg-red-500 group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-lg">
                                                            <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                                                        </div>
                                                    </div>
                                                </button>

                                                {/* Content */}
                                                <div className="p-6">
                                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-500 transition-colors duration-300">
                                                        {title}
                                                    </h3>

                                                    {description && (
                                                        <p className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-300 transition-colors line-clamp-3">
                                                            {description}
                                                        </p>
                                                    )}

                                                    {/* Play Badge */}
                                                    <div className="flex items-center justify-between mt-4">
                                                        <span className="text-xs text-zinc-500 uppercase tracking-wider">
                                                            Video
                                                        </span>
                                                        <button
                                                            onClick={() => handlePlayVideo(video)}
                                                            className="flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors"
                                                        >
                                                            <Play className="w-3 h-3" />
                                                            <span className="text-xs font-medium">
                                                                {lng === 'fr' ? 'Regarder' : 'Watch'}
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </CarouselItem>
                                )
                            })}
                        </CarouselContent>

                        <CarouselPrevious className="left-4 bg-zinc-900/80 border-zinc-700 hover:bg-zinc-800 text-white" />
                        <CarouselNext className="right-4 bg-zinc-900/80 border-zinc-700 hover:bg-zinc-800 text-white" />
                    </Carousel>
                </div>
            </section>

            {/* Video Modal */}
            <AnimatePresence>
                {activeVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                        onClick={handleCloseVideo}
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleCloseVideo}
                            className="absolute top-4 right-4 z-50 p-3 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white transition-colors"
                            aria-label="Close video"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Video Container */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-full max-w-5xl rounded-2xl overflow-hidden border border-zinc-700 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* 16:9 Aspect Ratio Container */}
                            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                <iframe
                                    src={getVimeoEmbedUrl(activeVideo.vimeoUrl) || ''}
                                    title={lng === 'fr' && activeVideo.titleFr ? activeVideo.titleFr : activeVideo.title}
                                    className="absolute inset-0 w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}