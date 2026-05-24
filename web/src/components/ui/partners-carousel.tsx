"use client";

import { useEffect, useState } from "react";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

// Hardcoded partner logos from public/svg folder
const PARTNER_LOGOS = [
    "/svg/CAF.svg",
    "/svg/FIFA.svg",
    "/svg/SNRT.svg",
    "/svg/CHAINE 2M MAROC.svg",
    "/svg/Medi 1 TV.svg",
    "/svg/FRMA.svg",
    "/svg/sorec.svg",
    "/svg/Association Maroc Culture.svg",
];

export function PartnersCarousel({ lng }: { lng?: string }) {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api) {
            return;
        }

        const interval = setTimeout(() => {
            if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
                setCurrent(0);
                api.scrollTo(0);
            } else {
                api.scrollNext();
                setCurrent(current + 1);
            }
        }, 2000);

        return () => clearTimeout(interval);
    }, [api, current]);

    // Triple logos for infinite scroll effect
    const displayLogos = [...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS];

    return (
        <section className="relative w-full py-20 bg-zinc-950 overflow-hidden">
            {/* Subtle radial gradient background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(220,38,38,0.05)_0%,_transparent_70%)]" />

            <div className="container mx-auto px-6">
                <div className="flex flex-col gap-12">
                    {/* Header */}
                    <div className="text-center relative">
                        <div className="inline-block relative">
                            <span className="text-xs font-bold tracking-[0.4em] text-red-500 uppercase mb-4 block">
                                {lng === 'fr' ? 'NOS PARTENAIRES' : 'OUR PARTNERS'}
                            </span>
                            <h2 className="text-3xl md:text-5xl lg:text-6xl tracking-tighter font-display font-bold text-white relative z-10 px-4">
                                Trusted by Leading Broadcasters
                            </h2>
                            {/* Premium header accent */}
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-red-600 rounded-full" />
                        </div>
                    </div>

                    {/* Carousel with edge fades */}
                    <div className="relative">
                        {/* Left fade */}
                        <div className="absolute left-0 top-0 w-24 md:w-40 h-full bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
                        {/* Right fade */}
                        <div className="absolute right-0 top-0 w-24 md:w-40 h-full bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />

                        <Carousel
                            setApi={setApi}
                            opts={{
                                align: "start",
                                loop: true,
                                dragFree: true,
                            }}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-4 md:-ml-8">
                                {displayLogos.map((src, index) => (
                                    <CarouselItem
                                        key={index}
                                        className="pl-4 md:pl-8 basis-1/2 md:basis-1/3 lg:basis-1/4"
                                    >
                                        {(() => {
                                            const isSorec = src.toLowerCase().includes("sorec");
                                            const isSNRT = src.includes("SNRT"); // Al Aoula
                                            const isCAF = src.includes("CAF");
                                            const is2M = src.toLowerCase().includes("2m");

                                            return (
                                                <div className={cn(
                                                    "group relative flex items-center justify-center h-32 md:h-36 rounded-2xl bg-white/90 backdrop-blur-2xl border border-white transition-all duration-500 shadow-2xl hover:shadow-red-600/20 hover:-translate-y-2 overflow-hidden",
                                                    isSorec ? "p-0 overflow-visible" : (isSNRT || isCAF) ? "p-6 md:p-7" : "p-8 md:p-9"
                                                )}>
                                                    {/* Subtitle Red Glow on Hover */}
                                                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 to-red-600/0 group-hover:from-red-600/10 group-hover:to-transparent transition-all duration-500" />

                                                    <img
                                                        src={src}
                                                        alt="Partner Logo"
                                                        className={cn(
                                                            "object-contain opacity-80 group-hover:opacity-100 transition-all duration-500 relative z-10",
                                                            isSorec ? "w-[180%] max-w-none h-[180%] scale-150" : "w-auto group-hover:scale-110",
                                                            (isSNRT || isCAF) ? "max-h-24 md:max-h-28" : "max-h-16 md:max-h-20"
                                                        )}
                                                    />
                                                </div>
                                            );
                                        })()}
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                    </div>

                    {/* Progress dots */}
                    <div className="flex justify-center gap-1.5">
                        {PARTNER_LOGOS.map((_, index) => (
                            <div
                                key={index}
                                className={`h-1 rounded-full transition-all duration-300 ${current % PARTNER_LOGOS.length === index
                                    ? "w-6 bg-red-500"
                                    : "w-1.5 bg-zinc-700"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
        </section>
    );
}
