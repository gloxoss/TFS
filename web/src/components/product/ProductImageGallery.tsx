'use client'

import { useState } from 'react'
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
    /** Compact mode for kit layout */
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
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
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
                compact ? "w-full max-w-md" : "w-full",
                className
            )}>
                <div className={cn(
                    "flex items-center justify-center",
                    compact ? "h-64" : "h-80 md:h-96"
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
        <div className={cn("flex flex-col gap-4", className)}>
            {/* Main Image */}
            <div
                className={cn(
                    "relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800",
                    compact ? "max-w-md" : "w-full"
                )}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        variants={imageVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="relative"
                    >
                        <Image
                            src={currentImage!}
                            alt={`${productName} - Image ${activeIndex + 1}`}
                            width={compact ? 500 : 600}
                            height={compact ? 400 : 500}
                            className={cn(
                                "block w-full object-contain",
                                compact ? "max-h-[400px]" : "max-h-[500px]"
                            )}
                            sizes={compact ? "(max-width: 768px) 100vw, 500px" : "(max-width: 1024px) 100vw, 50vw"}
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
                                compact ? "w-16 h-16" : "w-20 h-20",
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
