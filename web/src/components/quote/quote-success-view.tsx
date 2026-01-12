'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Clock, Check, FileText, Smartphone } from 'lucide-react'
import { QuoteResult } from '@/services'
import { DateRange, formatDateRange } from '@/components/ui/date-range-picker'
import { cn } from '@/lib/utils'

interface QuoteSuccessViewProps {
    result: QuoteResult
    lng: string
    items: any[]
    rentalDates: DateRange | null
}

export function QuoteSuccessView({ result, lng, items, rentalDates }: QuoteSuccessViewProps) {
    if (!result.success || !result.data) return null
    const data = result.data as any
    const displayDates = rentalDates ? formatDateRange(rentalDates) : 'TBD'

    const steps = [
        { icon: Check, label: 'Request Received', status: 'completed', desc: 'We have your gear list.' },
        { icon: Clock, label: 'Availability Check', status: 'current', desc: 'Team is reviewing stock.' },
        { icon: FileText, label: 'Quote Prepared', status: 'pending', desc: 'Sent to your email.' },
    ]

    return (
        <div className="w-full max-w-5xl mx-auto py-20 px-8">
            <div className="grid md:grid-cols-2 gap-20">

                {/* Left Side: Header & Timeline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-16"
                >
                    {/* Minimalist Header */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-4 text-emerald-500"
                        >
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-mono tracking-widest uppercase">System Active</span>
                        </motion.div>

                        <h1 className="text-6xl font-bold text-white tracking-tight leading-[0.9]">
                            Quote <br />
                            <span className="text-zinc-600">Received.</span>
                        </h1>
                    </div>

                    {/* Minimalist Timeline */}
                    <div className="relative pl-4 border-l border-zinc-800 space-y-12">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.15 + 0.3 }}
                                className="relative group"
                            >
                                {/* Dot Indicator */}
                                <div className={cn(
                                    "absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 transition-colors bg-black",
                                    step.status === 'completed' ? "border-emerald-500 bg-emerald-500" :
                                        step.status === 'current' ? "border-white animate-pulse" :
                                            "border-zinc-800"
                                )} />

                                <div>
                                    <h3 className={cn(
                                        "text-lg font-medium tracking-tight mb-1 transition-colors",
                                        step.status === 'pending' ? 'text-zinc-600' : 'text-white'
                                    )}>
                                        {step.label}
                                    </h3>
                                    <p className="text-sm text-zinc-500 font-mono tracking-wide">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Side: Data & Actions (Clean Grid) */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col justify-between space-y-12"
                >
                    {/* Data Grid */}
                    <div className="grid grid-cols-2 gap-x-12 gap-y-8 pt-4">
                        <div className="space-y-2">
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Reference ID</p>
                            <p className="text-2xl font-mono text-white tracking-tight">{data.confirmationNumber}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Total Items</p>
                            <p className="text-2xl text-white">{items.length}</p>
                        </div>
                        <div className="col-span-2 space-y-2">
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Est. Dates</p>
                            <p className="text-xl text-zinc-300">{displayDates}</p>
                        </div>
                    </div>

                    {/* Action Area */}
                    <div className="space-y-6 pt-12 border-t border-zinc-900">
                        <Link
                            href={`/${lng}/quote/${data.quoteId || data.id}?token=${data.accessToken}`}
                            className="group block w-full"
                        >
                            <div className="flex items-center justify-between text-white hover:text-emerald-400 transition-colors mb-2">
                                <span className="text-2xl font-medium tracking-tight">Track Live Status</span>
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </div>
                            <p className="text-sm text-zinc-500">View real-time updates and modify your request.</p>
                        </Link>

                        <div className="flex gap-8 pt-4">
                            <div className="flex items-center gap-3 text-zinc-500">
                                <Smartphone className="w-4 h-4" />
                                <span className="text-xs uppercase tracking-wider">SMS Active</span>
                            </div>
                            <div className="flex items-center gap-3 text-zinc-500">
                                <FileText className="w-4 h-4" />
                                <span className="text-xs uppercase tracking-wider">PDF Sent</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
