"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "@/app/i18n/client";

export default function AboutNarrativeSection({ lng }: { lng: string }) {
    const { t } = useTranslation(lng, "about");
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

    // Construct the paragraphs array strictly from p2 to p5
    const paragraphs = [
        t("story.p2"),
        t("story.p3"),
        t("story.p4"),
        t("story.p5"),
    ];

    return (
        <section
            ref={containerRef}
            className="group relative w-full bg-black py-24 sm:py-32 lg:py-40 overflow-hidden"
        >
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-0 -translate-x-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-0 translate-x-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">

                    {/* Sticky Sidebar (Left) */}
                    <div className="lg:col-span-4 lg:sticky lg:top-40 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="flex flex-col gap-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-[1px] w-12 bg-white/30" />
                                <span className="text-sm uppercase tracking-[0.2em] text-white/50 font-medium">
                                    {t("story.title")}
                                </span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
                                {lng === "fr" ? "Notre" : "Our"} <br className="hidden lg:block" />
                                <span className="text-white/40">{lng === "fr" ? "Évolution" : "Evolution"}</span>
                            </h2>
                        </motion.div>
                    </div>

                    {/* Scrolling Narrative (Right) */}
                    <div className="lg:col-span-1 lg:block hidden" /> {/* Spacer */}

                    <div className="lg:col-span-7 flex flex-col gap-16 md:gap-24 relative z-10">
                        {paragraphs.map((text, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-150px" }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
                                className="relative group/p"
                            >
                                {/* Subtle decorative line next to text */}
                                <div className="absolute -left-6 top-2 bottom-2 w-[2px] bg-white/10 origin-top transform scale-y-0 group-hover/p:scale-y-100 transition-transform duration-700 ease-out hidden md:block" />

                                <p className="text-xl md:text-2xl lg:text-3xl text-white/70 font-light leading-relaxed md:leading-[1.6]">
                                    {text}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>

            {/* Decorative bottom fade */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </section>
    );
}
