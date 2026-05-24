"use client"

/**
 * Showcase Downloads Section
 * 
 * Displays downloadable files in a grid layout.
 * Used by Sports, Digital, and other services with the showcase template.
 * 
 * Features:
 * - Grouped by category (optional)
 * - Download button style matching equipment page
 * - Grid layout (2-3 columns on desktop)
 */

import { motion } from 'framer-motion'
import { Download, FileText, File } from 'lucide-react'
import type { ServiceDownload } from '@/services/services/interface'

interface ShowcaseDownloadsSectionProps {
    downloads: ServiceDownload[]
    lng: string
}

export default function ShowcaseDownloadsSection({ downloads, lng }: ShowcaseDownloadsSectionProps) {
    if (!downloads || downloads.length === 0) return null

    // Group downloads by category
    const groupedDownloads = downloads.reduce((acc, download) => {
        const category = lng === 'fr' && download.categoryFr
            ? download.categoryFr
            : (download.category || 'Documents')

        if (!acc[category]) {
            acc[category] = []
        }
        acc[category].push(download)
        return acc
    }, {} as Record<string, ServiceDownload[]>)

    const categories = Object.keys(groupedDownloads)

    const getTitle = (download: ServiceDownload) => {
        return lng === 'fr' && download.titleFr ? download.titleFr : download.title
    }

    // Get file extension for icon
    const getFileIcon = (url: string) => {
        if (url.toLowerCase().endsWith('.pdf')) {
            return <FileText className="w-5 h-5 text-red-500" />
        }
        return <File className="w-5 h-5 text-zinc-400" />
    }

    return (
        <section className="py-20 md:py-28 bg-black relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#D00000]/5 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 uppercase tracking-tight">
                        {lng === 'fr' ? 'Ressources à Télécharger' : 'Download Resources'}
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        {lng === 'fr'
                            ? 'Accédez à nos documents et ressources professionnelles.'
                            : 'Access our professional documents and resources.'}
                    </p>
                </motion.div>

                {/* Downloads by Category */}
                <div className="space-y-12">
                    {categories.map((category, catIndex) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                        >
                            {/* Category Header - Only show if multiple categories */}
                            {categories.length > 1 && (
                                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-3">
                                    <span className="w-8 h-px bg-[#D00000]" />
                                    {category}
                                </h3>
                            )}

                            {/* Downloads Grid */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {groupedDownloads[category].map((download, index) => (
                                    <motion.a
                                        key={index}
                                        href={download.url}
                                        download
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="group flex items-center gap-4 p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all duration-300"
                                    >
                                        {/* File Icon */}
                                        <div className="shrink-0 w-12 h-12 rounded-lg bg-zinc-800/50 flex items-center justify-center group-hover:bg-[#D00000]/10 transition-colors">
                                            {getFileIcon(download.url)}
                                        </div>

                                        {/* Title */}
                                        <div className="flex-1 min-w-0">
                                            <span className="text-white font-medium text-sm group-hover:text-[#D00000] transition-colors line-clamp-2">
                                                {getTitle(download)}
                                            </span>
                                            <span className="text-xs text-zinc-500 uppercase mt-1 block">
                                                {download.url.split('.').pop()?.toUpperCase() || 'FILE'}
                                            </span>
                                        </div>

                                        {/* Download Icon */}
                                        <div className="shrink-0">
                                            <Download className="w-5 h-5 text-zinc-500 group-hover:text-red-500 group-hover:scale-110 transition-all" />
                                        </div>
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
