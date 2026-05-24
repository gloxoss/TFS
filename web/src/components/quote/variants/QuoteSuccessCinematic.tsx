'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Star, Film, CheckCircle2 } from 'lucide-react'
import { QuoteResult } from '@/services'
import { DateRange, formatDateRange } from '@/components/ui/date-range-picker'
import Image from 'next/image'

interface VariantProps {
    result: QuoteResult
    lng: string
    items: any[]
    rentalDates: DateRange | null
}

export function QuoteSuccessCinematic({ result, lng, items, rentalDates }: VariantProps) {
    if (!result.success || !result.data) return null

    const data = result.data as any
    const displayDates = rentalDates ? formatDateRange(rentalDates) : 'TBD'

    // Fallback image if no items
    const heroImage = items[0]?.product?.imageUrl || '/images/hero-bg.jpg'

    return (
        <div className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden rounded-3xl mx-auto my-8 max-w-6xl">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/40 z-10" />
                <Image
                    src={heroImage}
                    alt="Background"
                    fill
                    className="object-cover opacity-50 blur-sm scale-105"
                />
            </div>

            {/* Content Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-20 w-full max-w-xl mx-4 bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-12 rounded-2xl text-center shadow-2xl"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(220,38,38,0.4)]"
                >
                    <CheckCircle2 className="w-8 h-8 text-white" />
                </motion.div>

                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Request Confirmed</h1>
                <p className="text-zinc-300 mb-8 font-light">Your production kit is effectively reserved.</p>

                {/* Ticket Stub Style Details */}
                <div className="bg-black/40 rounded-lg p-6 mb-8 border border-white/5 flex justify-between items-center text-left">
                    <div>
                        <p className="text-xs text-zinc-500 uppercase mb-1">Confirmation</p>
                        <p className="font-mono text-xl text-red-500">{data.confirmationNumber}</p>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div>
                        <p className="text-xs text-zinc-500 uppercase mb-1">Dates</p>
                        <p className="text-zinc-200 text-sm">{displayDates}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Link
                        href={`/${lng}/quote/${data.quoteId || data.id}?token=${data.accessToken}`}
                        className="w-full py-4 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                    >
                        TRACK STATUS
                    </Link>
                    <Link
                        href={`/${lng}`}
                        className="text-zinc-400 hover:text-white text-sm py-2 transition-colors"
                    >
                        Back to Catalog
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
