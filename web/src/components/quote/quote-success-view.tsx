'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle, Calendar, Package, ArrowRight, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DateRange, formatDateRange, calculateRentalDays } from '@/components/ui/date-range-picker'
import { QuoteResult } from '@/services'
import { quotePage, t } from '@/data/site-content'

interface QuoteSuccessViewProps {
    result: QuoteResult
    lng: string
    items: any[]
    rentalDates: DateRange | null
}

export function QuoteSuccessView({ result, lng, items, rentalDates }: QuoteSuccessViewProps) {
    if (!result.success || !result.data) return null

    // Handle different data shapes from QuoteResult (service vs action return)
    const data = result.data
    const quoteId = 'quoteId' in data ? (data as any).quoteId : (data as any).id
    const confirmationNumber = 'confirmationNumber' in data ? (data as any).confirmationNumber : undefined
    const accessToken = 'accessToken' in data ? (data as any).accessToken : undefined

    // Helper for display
    const displayDates = rentalDates ? formatDateRange(rentalDates) : t(quotePage.success.rentalPeriod, lng)
    const displayDays = rentalDates ? calculateRentalDays(rentalDates) : 0

    const content = quotePage.success

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
        >
            <div className="bg-zinc-900 border border-green-500/20 rounded-2xl p-8 md:p-12 text-center shadow-2xl shadow-green-900/10 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-green-500/5 blur-[120px] pointer-events-none" />

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300, delay: 0.2 }}
                    className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-green-500/40"
                >
                    <CheckCircle className="w-10 h-10 text-green-400" />
                </motion.div>

                <h1 className="text-3xl font-bold text-white mb-2">{t(content.title, lng)}</h1>
                <p className="text-zinc-400 text-lg mb-8">
                    {t(content.subtitle, lng)}
                </p>

                {/* Confirmation Card */}
                <div className="bg-zinc-800/50 rounded-xl p-6 text-left mb-8 border border-zinc-700/50">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-700/50 pb-4 mb-4 gap-4">
                        <div>
                            <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-1">
                                {t(content.reference, lng)}
                            </p>
                            <p className="text-2xl font-mono text-white font-semibold tracking-tight">
                                {confirmationNumber}
                            </p>
                        </div>
                        <div className="bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                            <span className="text-sm text-green-400 font-medium">{t(content.status, lng)}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-zinc-400 mb-2">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm font-medium">{t(content.rentalPeriod, lng)}</span>
                            </div>
                            <p className="text-white font-medium">
                                {displayDates}
                            </p>
                            <p className="text-xs text-zinc-500 mt-1">
                                {displayDays > 0 ? `${displayDays} days` : ''}
                            </p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-zinc-400 mb-2">
                                <Package className="w-4 h-4" />
                                <span className="text-sm font-medium">{t(content.equipment, lng)}</span>
                            </div>
                            <p className="text-white font-medium">{items.length} {t(content.itemsRequested, lng)}</p>
                            <p className="text-xs text-zinc-500 mt-1">{t(content.includingKits, lng)}</p>
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="grid gap-4 md:grid-cols-2 text-left mb-8">
                    <div className="bg-zinc-800/30 p-4 rounded-lg border border-zinc-700/30">
                        <div className="w-8 h-8 bg-zinc-700/50 rounded-lg flex items-center justify-center mb-3">
                            <span className="text-zinc-300 font-bold">1</span>
                        </div>
                        <h3 className="text-white font-medium mb-1">{t(content.step1Title, lng)}</h3>
                        <p className="text-sm text-zinc-400">
                            {t(content.step1Desc, lng)}
                        </p>
                    </div>
                    <div className="bg-zinc-800/30 p-4 rounded-lg border border-zinc-700/30">
                        <div className="w-8 h-8 bg-zinc-700/50 rounded-lg flex items-center justify-center mb-3">
                            <span className="text-zinc-300 font-bold">2</span>
                        </div>
                        <h3 className="text-white font-medium mb-1">{t(content.step2Title, lng)}</h3>
                        <p className="text-sm text-zinc-400">
                            {t(content.step2Desc, lng)}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href={`/${lng}/quote/${quoteId}?token=${accessToken}`}
                        className="px-8 py-3 bg-white text-zinc-900 font-semibold rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                    >
                        {t(content.trackRequest, lng)}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                        href={`/${lng}`}
                        className="px-8 py-3 bg-zinc-800 text-zinc-300 font-medium rounded-lg hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
                    >
                        {t(content.backToHome, lng)}
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}
