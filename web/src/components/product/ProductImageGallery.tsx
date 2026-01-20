'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Package } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================================
// TYPES
// ============================================================================

interface ProductImageGalleryProps {
    mainImage?: string
    images?: string[]
    productName: string
    categoryBadge?: string
    className?: string
    /** Compact mode for kit layout (desktop only) */
    compact?: boolean
}

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const imageVariants = {
    enter: { opacity: 0, scale: 0.98 },
    center: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }
    },
    exit: {
        opacity: 0,
        scale: 1.02,
        transition: { duration: 0.2 }
    }
}

// ============================================================================
// COMPONENT
// ============================================================================

export function ProductImageGallery({
    mainImage,
    images = [],
    productName,
    categoryBadge,
    className,
    compact = false
}: ProductImageGalleryProps) {
    // Detect mobile to disable compact mode constraints
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        if (typeof window === 'undefined') return
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // On mobile, ignore compact mode to maximize image visibility
    const effectiveCompact = compact && !isMobile

    // Combine mainImage with images array (mainImage first, deduplicated)
    const allImages = (() => {
        const combined: string[] = []
        if (mainImage) combined.push(mainImage)
        images.forEach(img => {
            if (img && !combined.includes(img)) combined.push(img)
        })
        return combined
    })()

    const [activeIndex, setActiveIndex] = useState(0)

    const hasMultipleImages = allImages.length > 1
    const currentImage = allImages[activeIndex] || null

    // No images at all
    if (allImages.length === 0) {
        return (
            <div className={cn(
                "relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800",
                effectiveCompact ? "w-full max-w-md" : "w-full",
                className
            )}>
                <div className={cn(
                    "flex items-center justify-center aspect-square",
                    effectiveCompact ? "max-h-80" : ""
                )}>
                    <Package className="w-24 h-24 text-zinc-700" />
                </div>
                {categoryBadge && (
                    <span className="absolute top-4 left-4 px-3 py-1.5 text-sm font-medium bg-zinc-900/80 backdrop-blur-sm text-zinc-300 rounded-lg border border-zinc-700/50">
                        {categoryBadge}
                    </span>
                )}
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col gap-4 w-full", className)}>
            {/* Main Image */}
            <div
                className={cn(
                    "relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800",
                    effectiveCompact ? "max-w-md" : "w-full"
                )}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        variants={imageVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="relative aspect-square w-full"
                    >
                        <Image
                            src={currentImage!}
                            alt={`${productName} - Image ${activeIndex + 1}`}
                            fill
                            className="object-contain"
                            sizes={isMobile ? "100vw" : effectiveCompact ? "400px" : "(max-width: 1024px) 100vw, 50vw"}
                            priority
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Category Badge */}
                {categoryBadge && (
                    <span className="absolute top-4 left-4 px-3 py-1.5 text-sm font-medium bg-zinc-900/80 backdrop-blur-sm text-zinc-300 rounded-lg border border-zinc-700/50">
                        {categoryBadge}
                    </span>
                )}

                {/* Image Counter */}
                {hasMultipleImages && (
                    <div className="absolute bottom-4 left-4 px-3 py-1.5 text-sm font-medium bg-zinc-900/80 backdrop-blur-sm text-zinc-300 rounded-lg border border-zinc-700/50">
                        {activeIndex + 1} / {allImages.length}
                    </div>
                )}
            </div>

            {/* Thumbnail Strip */}
            {hasMultipleImages && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {allImages.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={cn(
                                "relative flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200",
                                effectiveCompact ? "w-16 h-16" : "w-20 h-20",
                                index === activeIndex
                                    ? "border-amber-500 ring-2 ring-amber-500/30"
                                    : "border-zinc-700 hover:border-zinc-500"
                            )}
                        >
                            <Image
                                src={img}
                                alt={`${productName} - Thumbnail ${index + 1}`}
                                fill
                                sizes="80px"
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProductImageGallery
