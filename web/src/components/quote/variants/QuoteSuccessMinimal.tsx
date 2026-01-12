'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { QuoteResult } from '@/services'
import { t } from '@/data/site-content'
import { DateRange, formatDateRange } from '@/components/ui/date-range-picker'

interface VariantProps {
    result: QuoteResult
    lng: string
    items: any[]
    rentalDates: DateRange | null
}

export function QuoteSuccessMinimal({ result, lng, items, rentalDates }: VariantProps) {
    if (!result.success || !result.data) return null

    const data = result.data as any
    const displayDates = rentalDates ? formatDateRange(rentalDates) : 'TBD'

    return (
        <div className="w-full max-w-2xl mx-auto py-20 px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
            >
                {/* Header - Huge Type */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-4 text-emerald-500 mb-6"
                    >
                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-sm font-mono tracking-widest uppercase">Submission Successful</span>
                    </motion.div>

                    <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tight leading-[0.9]">
                        Quote <br />
                        <span className="text-zinc-600">Received.</span>
                    </h1>
                </div>

                {/* Grid Info */}
                <div className="grid grid-cols-2 gap-12 border-t border-white/10 pt-12">
                    <div className="space-y-2">
                        <p className="text-xs text-zinc-500 uppercase tracking-widest">Reference ID</p>
                        <p className="text-3xl font-mono text-white">{data.confirmationNumber}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs text-zinc-500 uppercase tracking-widest">Est. Dates</p>
                        <p className="text-xl text-zinc-300">{displayDates}</p>
                    </div>
                </div>

                {/* Next Steps - Pure Text */}
                <div className="space-y-6 pt-12">
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg">
                        We're checking availability for <span className="text-white">{items.length} items</span>.
                        You'll receive a detailed rental agreement at <span className="text-white underline decoration-zinc-700 underline-offset-4">{data.email || 'your email'}</span> shortly.
                    </p>

                    <div className="flex items-center gap-8 pt-6">
                        <Link
                            href={`/${lng}`}
                            className="group flex items-center gap-3 text-white text-lg font-medium hover:text-emerald-400 transition-colors"
                        >
                            Return Home
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
