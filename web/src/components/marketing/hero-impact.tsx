"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useVelocity } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { homePage, t } from "@/data/site-content";

// Morocco Location Hero Images - Optimized WebP versions (all under 800KB)
const HERO_IMAGES = [
    "/images/hero/sunset-ancient-city-ait-benhaddou-morocco.jpg",
    "/images/hero/high-angle-view-illuminated-buildings-night.jpg",
    "/images/hero/view-medina-essaouira-its-ramparts-facing-sea.jpg",
    "/images/hero/blue-street-houses-chefchaouen-morocco.jpg",
    "/images/hero/scenic-view-man-with-camels-desert-against-clear-sky.jpg",
];

// Animation variant with GPU-accelerated blur (uses opacity composite)
const fadeInBlur = {
    hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.8, ease: "easeOut" as const }
    }
};

// Helper to split text into word components
const AnimatedText = ({ text, className }: { text: string, className?: string }) => (
    <span className={className}>
        {text}
    </span>
);

interface HeroImpactProps {
    lng?: string;
}

export default function HeroImpact({ lng = 'en' }: HeroImpactProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [blurAmount, setBlurAmount] = useState(0);
    const { scrollY } = useScroll();

    const content = homePage.heroImpact;

    // Velocity-Based Motion Blur (GPU-optimized with useSpring damping)
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 100,
        stiffness: 300,
        restDelta: 0.001
    });

    // Update blur via state to avoid direct style recalculation on scroll
    useEffect(() => {
        const unsubscribe = smoothVelocity.on("change", (v) => {
            const blur = Math.min(Math.abs(v / 100), 4);
            setBlurAmount(blur);
        });
        return unsubscribe;
    }, [smoothVelocity]);

    // Parallax Position
    const scale = useTransform(scrollY, [0, 1000], [1, 1.2]);
    const xLeft = useTransform(scrollY, [0, 800], [0, -250]);
    const xRight = useTransform(scrollY, [0, 800], [0, 250]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div ref={containerRef} className="relative h-dvh md:min-h-[720px] w-full isolation-isolate overflow-hidden font-sans selection:bg-red-600 selection:text-white">

            {/* LCP Optimization: Static First Image (Always rendered server-side) */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={HERO_IMAGES[0]}
                    alt="Cinema production set"
                    fill
                    priority
                    loading="eager"
                    className="object-cover"
                    sizes="100vw"
                    quality={90}
                    fetchPriority="high"
                />
            </div>

            {/* Background Slideshow (Fades in/out on top of static image) */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <motion.div style={{ scale }} className="absolute inset-0">
                    <AnimatePresence mode="popLayout">
                        {currentSlide > 0 && (
                            <motion.div
                                key={currentSlide}
                                className="absolute inset-0"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.5 }}
                            >
                                <Image
                                    src={HERO_IMAGES[currentSlide]}
                                    alt="Cinema production set"
                                    fill
                                    className="object-cover"
                                    sizes="100vw"
                                    quality={90}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Gradient Overlays */}
            <div className="absolute bottom-0 left-0 w-full h-[70%] z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-[50%] z-10 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-[30%] z-10 bg-gradient-to-t from-black via-black/0 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-[50%] h-full z-10 bg-gradient-to-l from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-32 z-10 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

            {/* Main Content — pinned to top-right */}
            <div className="relative z-20 w-full max-w-[1440px] mx-auto px-6 md:px-12 pt-28 md:pt-36 pb-32 sm:pb-[22vh]">
                <div className="flex flex-col items-end text-right max-w-xl ml-auto">
                    {/* Headline */}
                    <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-white uppercase leading-[0.85] tracking-tight mb-3 md:mb-5">
                        <div className="block"><AnimatedText text={t(content.headline.line1, lng)} /></div>
                        <div className="block text-white/70"><AnimatedText text={t(content.headline.line2, lng)} /></div>
                    </h2>

                    <motion.p
                        initial="hidden" animate="visible" variants={fadeInBlur} transition={{ delay: 0.8 }}
                        className="text-white text-sm md:text-base leading-relaxed mb-5 md:mb-8 max-w-sm"
                        style={{ textShadow: '0 2px 15px rgba(0,0,0,0.5), 0 0 40px rgba(0,0,0,0.3)' }}
                    >
                        {t(content.description, lng)}
                    </motion.p>

                    {/* Button */}
                    <motion.div initial="hidden" animate="visible" variants={fadeInBlur} transition={{ delay: 1.1 }}>
                        <Link
                            href={`/${lng}${content.cta.href}`}
                            className="group flex items-center gap-2.5 bg-[#D00000] text-white px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wide transition-all hover:bg-[#A00000] hover:scale-105"
                        >
                            {t(content.cta.text, lng)}
                            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:rotate-45" />
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* MEGA TEXT (Bottom Split) — anchored to bottom with safe spacing */}
            <div className="absolute bottom-12 sm:bottom-8 md:bottom-10 left-0 w-full z-10 flex flex-col items-center justify-end pointer-events-none select-none mix-blend-difference text-white">
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                    className="font-display font-bold text-[14vw] sm:text-[15vw] md:text-[13vw] leading-[0.85] text-center tracking-tight uppercase will-change-[transform,filter]"
                    style={{ x: xLeft, filter: `blur(${blurAmount}px)`, transform: 'translate3d(0,0,0)' }}
                >
                    {t(content.megaText.line1, lng)}
                </motion.h1>

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                    className="font-display font-bold text-[14vw] sm:text-[15vw] md:text-[13vw] leading-[0.75] text-center tracking-tight uppercase mt-[0.5vw] will-change-[transform,filter]"
                    style={{ x: xRight, filter: `blur(${blurAmount}px)`, transform: 'translate3d(0,0,0)' }}
                >
                    {t(content.megaText.line2, lng)}
                </motion.h1>
            </div>

        </div>
    )
}
