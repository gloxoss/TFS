"use client"

/**
 * Showcase Hero Slider
 * 
 * Full-screen hero with image slider for showcase template.
 * Used by Sports, Digital, and other services.
 * 
 * Features:
 * - 3-5 images auto-cycling (5s interval)
 * - Navigation dots at bottom
 * - Fade transitions with framer-motion
 * - Back button and title overlay
 */

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface ShowcaseHeroSliderProps {
    title: string
    description?: string
    images: string[]
    lng: string
    autoPlayInterval?: number // in ms, default 5000
}

export default function ShowcaseHeroSlider({
    title,
    description,
    images,
    lng,
    autoPlayInterval = 5000
}: ShowcaseHeroSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    // Auto-advance slides
    useEffect(() => {
        if (!isAutoPlaying || images.length <= 1) return

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length)
        }, autoPlayInterval)

        return () => clearInterval(timer)
    }, [isAutoPlaying, images.length, autoPlayInterval])

    const goToSlide = useCallback((index: number) => {
        setCurrentIndex(index)
        setIsAutoPlaying(false)
        // Resume auto-play after 10 seconds of inactivity
        setTimeout(() => setIsAutoPlaying(true), 10000)
    }, [])

    const goNext = useCallback(() => {
        goToSlide((currentIndex + 1) % images.length)
    }, [currentIndex, images.length, goToSlide])

    const goPrev = useCallback(() => {
        goToSlide((currentIndex - 1 + images.length) % images.length)
    }, [currentIndex, images.length, goToSlide])

    // Fallback if no images
    const displayImages = images.length > 0
        ? images
        : ['https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2000&auto=format&fit=crop']

    return (
        <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
            {/* Background Images with Fade Transition */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0"
                >
                    <Image
                        src={displayImages[currentIndex]}
                        alt={`${title} - Slide ${currentIndex + 1}`}
                        fill
                        className="object-cover"
                        priority={currentIndex === 0}
                        sizes="100vw"
                        quality={85}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Gradient Overlays */}
            <div className="absolute bottom-0 left-0 w-full h-[70%] bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-black via-black/0 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

            {/* Back Button - Top Left */}
            <div className="absolute top-24 left-6 md:left-12 z-20">
                <Link
                    href={`/${lng}`}
                    className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors group text-sm"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>{lng === 'fr' ? 'Retour' : 'Back'}</span>
                </Link>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 py-32 text-center max-w-5xl">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-block text-[#D00000] text-sm tracking-widest uppercase mb-6 font-medium"
                >
                    {lng === 'fr' ? 'Nos Services' : 'Our Services'}
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-8 leading-[0.95] uppercase tracking-tight"
                >
                    {title}
                </motion.h1>

                {description && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg md:text-xl text-white max-w-3xl mx-auto leading-relaxed mb-10 px-6 py-4 rounded-lg "
                        style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 0 30px rgba(0,0,0,0.6)' }}
                    >
                        {description}
                    </motion.p>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Link
                        href={`/${lng}/contact`}
                        className="inline-flex items-center gap-3 bg-[#D00000] hover:bg-[#B00000] text-white px-8 py-4 rounded-full font-medium transition-all duration-300 group"
                    >
                        {lng === 'fr' ? 'Nous Contacter' : 'Contact Us'}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>

            {/* Navigation Arrows - Only show if multiple images */}
            {displayImages.length > 1 && (
                <>
                    <button
                        onClick={goPrev}
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={goNext}
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </>
            )}

            {/* Navigation Dots */}
            {displayImages.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
                    {displayImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentIndex
                                ? 'bg-[#D00000] scale-125'
                                : 'bg-white/40 hover:bg-white/60'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
        </section>
    )
}
