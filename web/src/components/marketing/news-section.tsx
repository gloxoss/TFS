"use client";

import React, { useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsSectionProps {
    title: string;
    lng?: string;
    items: {
        category: string;
        title: string;
        slug?: string;
        image?: string;
        videoUrl?: string;
    }[];
}

const MediaDisplay = ({ item }: { item: NewsSectionProps['items'][0] }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [imgError, setImgError] = useState(false);

    // Helper to get video ID
    const getVideoId = (url: string) => {
        if (url.includes('youtube') || url.includes('youtu.be')) {
            return url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
        } else if (url.includes('vimeo.com')) {
            return url.split('vimeo.com/')[1]?.split('/')[0];
        }
        return null;
    };

    // 1. If playing, show Video Iframe
    if (isPlaying && item.videoUrl) {
        let videoSrc = '';
        if (item.videoUrl.includes('youtube') || item.videoUrl.includes('youtu.be')) {
            const videoId = getVideoId(item.videoUrl);
            videoSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        } else if (item.videoUrl.includes('vimeo.com')) {
            const videoId = getVideoId(item.videoUrl);
            videoSrc = `https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0`;
        }

        return (
            <div className="relative w-full h-full bg-black">
                <iframe
                    src={videoSrc}
                    title={item.title || "Video player"}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        );
    }

    // 2. Default: Show Image with Play Button (if video exists)
    if (item.image && !imgError) {
        return (
            <div className="relative w-full h-full group/media cursor-pointer" onClick={() => item.videoUrl && setIsPlaying(true)}>
                <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 85vw, (max-width: 1200px) 50vw, 33vw"
                    onError={() => setImgError(true)}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                {/* Play Button Overlay */}
                {item.videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover/media:scale-110 group-hover/media:bg-red-600 group-hover/media:border-red-500 transition-all duration-300 shadow-xl">
                            <Play className="w-6 h-6 text-white fill-current ml-1" />
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // 3. Fallback to Text/Pattern (if no image or image error)
    return (
        <div className="relative w-full h-full bg-zinc-900 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            <span className="text-zinc-700 font-mono text-xs uppercase tracking-widest z-10 px-4 text-center">
                {item.videoUrl ? (
                    <button
                        onClick={() => setIsPlaying(true)}
                        className="flex items-center gap-2 hover:text-white transition-colors"
                    >
                        <Play className="w-4 h-4" /> Watch Video
                    </button>
                ) : (
                    item.category
                )}
            </span>
        </div>
    );
};

export default function NewsSection({ title, items, lng = 'en' }: NewsSectionProps) {
    const [api, setApi] = useState<CarouselApi>();

    return (
        <div className="py-24 bg-black border-t border-white/5 relative overflow-hidden">
            {/* Vignette */}
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end">
                <h2 className="text-sm font-bold tracking-widest text-white/50 font-mono uppercase">{title}</h2>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => api?.scrollPrev()}
                        className="w-10 h-10 rounded-full border border-white/10 bg-zinc-900/50 flex items-center justify-center hover:bg-white hover:text-black transition-all disabled:opacity-50"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => api?.scrollNext()}
                        className="w-10 h-10 rounded-full border border-white/10 bg-zinc-900/50 flex items-center justify-center hover:bg-white hover:text-black transition-all disabled:opacity-50"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative">
                <div className="[mask-image:linear-gradient(to_right,transparent,white_5%,white_95%,transparent)]">
                    <Carousel
                        setApi={setApi}
                        className="w-full"
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                    >
                        <CarouselContent className="-ml-6 py-4">
                            {items.map((item, index) => (
                                <CarouselItem key={index} className="pl-6 basis-[85%] md:basis-1/2 lg:basis-1/3">
                                    <Link
                                        href={item.slug ? `/${lng}/blog/${item.slug}` : '#'}
                                        className="block group h-full"
                                    >
                                        <div className="h-full relative rounded-2xl border border-white/10 bg-zinc-950/50 p-6 transition-all duration-300 hover:border-red-600/30 hover:bg-zinc-900 flex flex-col justify-between">
                                            <div>
                                                {/* Media Container - Fixed Aspect Ratio */}
                                                <div className="relative aspect-video w-full mb-6 overflow-hidden rounded-lg bg-black border border-white/5">
                                                    <MediaDisplay item={item} />
                                                    <div className="absolute inset-0 border-inset border border-white/5 rounded-lg pointer-events-none" />
                                                </div>

                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-xs font-mono uppercase text-[#D00000] tracking-widest">{item.category}</span>
                                                </div>

                                                <h3 className="text-xl font-display font-bold text-white uppercase leading-tight mb-4 min-h-[3rem] line-clamp-2">
                                                    {item.title}
                                                </h3>
                                            </div>

                                            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                                                <span className="text-sm text-zinc-500 font-light flex items-center gap-2 group-hover:text-white transition-colors">
                                                    Read Article <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </div>
        </div>
    );
}
