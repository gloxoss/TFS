"use client"

import { motion } from 'framer-motion'
import { Camera, Radio, Headphones, ArrowRight } from 'lucide-react'
import Link from 'next/link'

/**
 * Hub Content Section
 * 
 * Minimalist, cinematic content section for hub pages.
 * Design: Dark, clean, editorial with subtle accents.
 */

interface HubContentSectionProps {
    service: {
        fullDescription?: string
        fullDescriptionFr?: string
    }
    lng: string
}

const content = {
    en: {
        headline: "TFS – TV Film Solutions | Broadcast Excellence Without Compromise",
        description: "TFS (TV Film Solutions) is a high-end sports broadcasting and production company delivering world-class visual coverage for live events, competitions, and cinematic sports storytelling.\n\nWe specialize in elite broadcast solutions, combining cutting-edge camera systems, advanced motion technology, and professional communication infrastructure to capture sport with precision, intensity, and emotion. From stadiums to circuits, arenas to open fields, TFS transforms sport into a premium visual experience.\n\nTrusted for our technical reliability, creative execution, and broadcast standards, TFS operates at the highest international level—meeting the demands of federations, broadcasters, leagues, and global productions.\n\n⸻\n\nUnmatched Technology. Total Control. Perfect Coverage.\n\nAt TFS, technology is not an option—it's our foundation.",
        sections: [
            {
                label: "01",
                title: "Elite Camera & Stabilization Systems",
                icon: Camera,
                items: ["MK-V Steadicam", "ARRI Artemis 2", "ARRI Trinity"]
            },
            {
                label: "02",
                title: "Advanced Motion & Aerial Solutions",
                icon: Radio,
                items: ["Spidercam – iconic aerial stadium coverage", "Cablecam – dynamic horizontal motion across large venues", "Speedcam – ultra-fast tracking for explosive action", "Electro Moto – precision motorized movement", "AGITO – robotic camera systems for repeatable, cinematic shots"]
            },
            {
                label: "03",
                title: "Professional Broadcast Communication",
                icon: Headphones,
                items: ["Riedel Bolero Intercom", "VOKKERO ELITE", "Clear-Com Systems", "Riedel 64×64 Matrix", "Talkie-Walkies & In-Ear Monitoring"]
            }
        ],
        cta: {
            text: "View Equipment",
            href: "/services/broadcasting-live#equipment"
        },
        tagline: "Every movement is calculated. Every angle is intentional."
    },
    fr: {
        headline: "TFS – TV Film Solutions | Excellence de Diffusion Sans Compromis",
        description: "TFS (TV Film Solutions) est une entreprise de diffusion sportive haut de gamme offrant une couverture visuelle de classe mondiale pour les événements en direct, les compétitions et le storytelling sportif cinématographique.\n\nNous nous spécialisons dans les solutions de diffusion d'élite, combinant des systèmes de caméra de pointe, une technologie de mouvement avancée et une infrastructure de communication professionnelle pour capturer le sport avec précision, intensité et émotion. Des stades aux circuits, des arènes aux champs ouverts, TFS transforme le sport en une expérience visuelle premium.\n\nFidèles à notre fiabilité technique, notre exécution créative et nos normes de diffusion, TFS opère au plus haut niveau international—répondant aux exigences des fédérations, diffuseurs, ligues et productions mondiales.\n\n⸻\n\nTechnologie Inégalée. Contrôle Total. Couverture Parfaite.\n\nChez TFS, la technologie n'est pas une option—c'est notre fondation.",
        sections: [
            {
                label: "01",
                title: "Systèmes de Caméra et Stabilisation d'Élite",
                icon: Camera,
                items: ["MK-V Steadicam", "ARRI Artemis 2", "ARRI Trinity"]
            },
            {
                label: "02",
                title: "Solutions de Mouvement et Aériennes Avancées",
                icon: Radio,
                items: ["Spidercam – couverture aérienne emblématique des stades", "Cablecam – mouvement horizontal dynamique à travers de grands lieux", "Speedcam – suivi ultra-rapide pour l'action explosive", "Electro Moto – mouvement motorisé de précision", "AGITO – systèmes de caméra robotiques pour des plans cinématographiques répétables"]
            },
            {
                label: "03",
                title: "Communication de Diffusion Professionnelle",
                icon: Headphones,
                items: ["Riedel Bolero Intercom", "Systèmes Clear-Com", "Matrice Riedel 64×64", "VOKKERO ELITE", "Talkie-Walkies et Écouteurs"]
            }
        ],
        cta: {
            text: "Voir l'Équipement",
            href: "/services/broadcasting-live#equipment"
        },
        tagline: "Chaque mouvement est calculé. Chaque angle est intentionnel."
    }
}

export default function HubContentSection({ service, lng }: HubContentSectionProps) {
    const t = lng === 'fr' ? content.fr : content.en

    return (
        <section className="py-24 md:py-32 bg-black border-t border-white/5">
            <div className="container mx-auto px-4 max-w-6xl">

                {/* Headline */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        {t.headline}
                    </h2>
                    <div className="w-16 h-px bg-[#D00000] mt-6" />
                </motion.div>

                {/* Description */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-20"
                >
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-lg md:text-xl text-zinc-300 leading-relaxed whitespace-pre-line">
                            {t.description}
                        </p>
                    </div>
                </motion.div>

                {/* Equipment Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 rounded-lg overflow-hidden mb-20">
                    {t.sections.map((section, index) => {
                        const Icon = section.icon
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-zinc-950 p-8 md:p-10"
                            >
                                {/* Number & Icon Row */}
                                <div className="flex items-center justify-between mb-8">
                                    <span className="text-xs font-mono text-zinc-600 tracking-wider">
                                        {section.label}
                                    </span>
                                    <Icon className="w-5 h-5 text-zinc-600" />
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-semibold text-white mb-6">
                                    {section.title}
                                </h3>

                                {/* Items */}
                                <ul className="space-y-3">
                                    {section.items.map((item, i) => (
                                        <li
                                            key={i}
                                            className="text-sm text-zinc-400 pl-4 border-l border-zinc-800 hover:border-[#D00000] hover:text-zinc-200 transition-colors duration-200"
                                        >
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Bottom Row: Tagline + CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                    <p className="text-zinc-500 text-sm tracking-wide">
                        <span className="text-white font-medium">TFS</span> — {t.tagline}
                    </p>

                    <Link
                        href={`/${lng}${t.cta.href}`}
                        className="group inline-flex items-center gap-3 text-sm font-medium text-white hover:text-[#D00000] transition-colors"
                    >
                        {t.cta.text}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

            </div>
        </section>
    )
}
