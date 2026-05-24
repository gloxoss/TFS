'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Play, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import DOMPurify from 'isomorphic-dompurify';

import ShowcaseHeroSlider from '@/components/marketing/services/showcase-hero-slider';
import { PartnersCarousel } from '@/components/ui/partners-carousel';
import { cn } from '@/lib/utils';
import type { Service, ServiceDownload } from '@/services/services/interface';

interface BroadcastPageProps {
    service: Service;
    locale: string;
}

// Helper component for equipment/download items
function EquipmentItem({ item, serviceId }: { item: { title: string; url: string }; serviceId: string }) {
    const hasFile = item.url && item.url.trim() !== '';
    const ItemWrapper = hasFile ? 'a' : 'div';

    // Resolve filename to full PB URL, passthrough full URLs
    const resolvedUrl = (() => {
        if (!hasFile) return '';
        if (item.url.startsWith('http://') || item.url.startsWith('https://') || item.url.startsWith('/')) return item.url;
        const baseUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
        return `${baseUrl}/api/files/services/${serviceId}/${item.url}`;
    })();

    return (
        <li className="list-none">
            <motion.div
                whileHover={hasFile ? { scale: 1.02, y: -2 } : {}}
                className="w-full"
            >
                <ItemWrapper
                    {...(hasFile ? {
                        href: resolvedUrl,
                        target: '_blank',
                        rel: 'noopener noreferrer'
                    } : {})}
                    className={cn(
                        "group flex items-center justify-between p-4 rounded-xl transition-all duration-300 border backdrop-blur-md",
                        hasFile
                            ? "bg-white/10 hover:bg-white/15 border-white/10 hover:border-red-600/50 cursor-pointer shadow-lg hover:shadow-red-600/10"
                            : "bg-white/5 border-white/10 cursor-not-allowed"
                    )}
                >
                    <span className={cn(
                        "text-sm font-medium transition-colors",
                        hasFile ? "text-white group-hover:text-white" : "text-gray-300"
                    )}>
                        {item.title}
                    </span>
                    <div className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300 border",
                        hasFile
                            ? "bg-zinc-900 border-white/10 group-hover:bg-red-600 group-hover:border-red-500 shadow-inner"
                            : "bg-white/5 border-white/5"
                    )}>
                        <FileText className={cn(
                            "w-5 h-5 transition-transform duration-300",
                            hasFile ? "text-white/60 group-hover:text-white group-hover:scale-110" : "text-white/20"
                        )} />
                    </div>
                </ItemWrapper>
            </motion.div>
        </li>
    );
}

export function BroadcastPage({ service, locale }: BroadcastPageProps) {
    const [showFloatingButton, setShowFloatingButton] = useState(false);

    // Show floating button after scrolling
    useEffect(() => {
        const handleScroll = () => {
            setShowFloatingButton(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Helper to construct PocketBase image URL
    const getImageUrl = (filename: string) => {
        if (!filename) return '';
        if (filename.startsWith('http')) return filename; // Handle absolute URLs
        // Use environment variable or fallback to local
        const baseUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
        return `${baseUrl}/api/files/services/${service.id}/${filename}`;
    };

    // 1. Hero + Slider (Combined)
    const heroSection = service.sections?.find(s => s.type === 'hero_slider') || {
        // Fallback if data not updated yet
        title: service.title,
        description: service.briefDescription,
        images: [service.heroImage || '']
    };

    // 2. Description with Background
    const descriptionSection = service.sections?.find(s => s.type === 'text_image_bg');

    // 3. Partners (SVGs)
    const partnersSection = service.sections?.find(s => s.type === 'partners_svg');

    // 5. Video (Coming Soon)
    const videoSection = service.sections?.find(s => s.type === 'video_featured');

    // Group downloads by category for Equipment section
    const groupedDownloads = useMemo(() => {
        const downloads = service.downloads || [];
        return downloads.reduce((acc, download) => {
            const category = download.category || "Uncategorized";
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(download);
            return acc;
        }, {} as Record<string, ServiceDownload[]>);
    }, [service.downloads]);

    const downloadCategories = Object.keys(groupedDownloads);
    const hasDownloads = downloadCategories.length > 0;

    // Process slider images
    const rawSliderImages = heroSection.images && heroSection.images.length > 0
        ? heroSection.images
        : [service.heroImage || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2000&auto=format&fit=crop'];

    const sliderImages = rawSliderImages.map(img => getImageUrl(img));

    return (
        <main className="min-h-screen bg-black text-white selection:bg-red-500/30">
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
                            href={`/${locale}/equipment`}
                            className="inline-flex items-center gap-2 px-5 py-3 bg-[#D00000] rounded-full text-white text-sm font-medium hover:bg-[#B00000] transition-all duration-300 group shadow-[0_0_20px_rgba(208,0,0,0.4)]"
                        >
                            {locale === 'fr' ? 'Voir Équipements' : 'View Equipment'}
                            <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 1. HERO + SLIDER */}
            <ShowcaseHeroSlider
                title={heroSection.title || service.title}
                description={heroSection.description || service.briefDescription}
                images={sliderImages}
                lng={locale}
            />

            {/* 2. DESCRIPTION WITH BACKGROUND */}
            {descriptionSection && (
                <section className="relative py-32 overflow-hidden">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        {descriptionSection.image && (
                            <img
                                src={getImageUrl(descriptionSection.image)}
                                alt="Background"
                                className="w-full h-full object-cover opacity-40 filter blur-sm scale-110"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black" />
                    </div>

                    <div className="container relative z-10 mx-auto px-6 md:px-12 text-center max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-sm font-bold tracking-[0.3em] text-red-500 uppercase mb-8">
                                {descriptionSection.title}
                            </h2>
                            <div
                                className="prose prose-invert prose-xl md:prose-2xl mx-auto leading-relaxed text-gray-200"
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(descriptionSection.content || '') }}
                            />
                        </motion.div>
                    </div>
                </section>
            )}

            {/* 3. EQUIPMENT & SPECIFICATIONS - Dynamic from downloads field */}
            {hasDownloads && (
                <section id="equipment" className="relative py-24 bg-zinc-950">
                    <div className="container mx-auto px-6 md:px-12">
                        <div className="mb-16 text-center">
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                                {locale === 'fr' ? 'Équipements & Spécifications' : 'Equipment & Specifications'}
                            </h2>
                            <div className="w-20 h-1 bg-red-600 mx-auto" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {downloadCategories.map((category, catIndex) => (
                                <motion.div
                                    key={category}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: catIndex * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <h3 className="text-xl font-bold text-white mb-6 border-l-4 border-red-600 pl-4">
                                        {category}
                                    </h3>
                                    <ul className="space-y-3">
                                        {groupedDownloads[category].map((item, i) => (
                                            <EquipmentItem key={i} item={item} serviceId={service.id} />
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}


            {/* 4. TRUSTED PARTNERS - Shadcn Carousel with Infinite Scroll */}
            <PartnersCarousel lng={locale} />

            {/* 5. VIDEO SECTION - Show video if URL exists, otherwise Coming Soon */}
            <section className="relative w-full py-32 bg-zinc-950 overflow-hidden">
                <div className="container mx-auto px-4 lg:px-0 relative z-10 max-w-6xl text-center">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-12">
                        {videoSection?.title || "Live in Action"}
                    </h2>

                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 group">
                        {service.videoUrl ? (
                            /* Video Player - Show when URL exists */
                            <iframe
                                src={service.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                                title={videoSection?.title || "Service Video"}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute inset-0 w-full h-full"
                            />
                        ) : (
                            /* Coming Soon - Show when no URL */
                            <>
                                {/* Background Placeholder */}
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-700" />

                                {/* Coming Soon Overlay */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 backdrop-blur-[2px]">
                                    <div className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center mb-6 bg-black/50">
                                        <Play className="w-8 h-8 text-white/20 ml-1" />
                                    </div>
                                    <h3 className="text-4xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tight uppercase">
                                        Coming Soon
                                    </h3>
                                    <p className="text-gray-400 mt-4 tracking-widest text-sm uppercase">
                                        Showreel in production
                                    </p>
                                </div>

                                {/* Disabled Interaction Layer */}
                                <div className="absolute inset-0 z-30 cursor-not-allowed" />
                            </>
                        )}
                    </div>
                </div>
            </section>

        </main>
    );
}
