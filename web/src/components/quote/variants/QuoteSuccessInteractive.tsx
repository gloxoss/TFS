'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Clock, Check, FileText, Smartphone } from 'lucide-react'
import { QuoteResult } from '@/services'
import { DateRange } from '@/components/ui/date-range-picker'
import { cn } from '@/lib/utils'

interface VariantProps {
    result: QuoteResult
    lng: string
    items: any[]
    rentalDates: DateRange | null
}

export function QuoteSuccessInteractive({ result, lng, items }: VariantProps) {
    if (!result.success || !result.data) return null
    const data = result.data as any

    const steps = [
        { icon: Check, label: 'Request Received', status: 'completed', desc: 'We have your gear list.' },
        { icon: Clock, label: 'Availability Check', status: 'current', desc: 'Team is reviewing stock.' },
        { icon: FileText, label: 'Quote Prepared', status: 'pending', desc: 'Sent to your email.' },
    ]

    return (
        <div className="w-full max-w-4xl mx-auto py-16 px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">

                {/* Left Side: Status */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-medium mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        System Active
                    </div>

                    <h1 className="text-4xl font-bold text-white mb-4">You're all set.</h1>
                    <p className="text-zinc-400 mb-8">
                        Reference <span className="text-white font-mono">{data.confirmationNumber}</span> has been generated.
                        Follow the timeline below for live updates.
                    </p>

                    {/* Timeline */}
                    <div className="space-y-0 relative">
                        {/* Vertical Line */}
                        <div className="absolute left-6 top-4 bottom-4 w-px bg-zinc-800" />

                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.15 + 0.3 }}
                                className="relative flex items-center gap-6 py-4 group cursor-default"
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center border transition-colors z-10",
                                    step.status === 'completed' ? "bg-green-500 border-green-500 text-zinc-900" :
                                        step.status === 'current' ? "bg-zinc-800 border-zinc-700 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]" :
                                            "bg-zinc-950 border-zinc-900 text-zinc-600"
                                )}>
                                    <step.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className={cn("font-medium transition-colors", step.status === 'pending' ? 'text-zinc-600' : 'text-white')}>
                                        {step.label}
                                    </h3>
                                    <p className="text-sm text-zinc-500">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Side: Action Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl"
                >
                    <h3 className="text-xl font-bold text-white mb-6">What's Next?</h3>

                    <div className="space-y-4">
                        <Link
                            href={`/${lng}/quote/${data.quoteId || data.id}?token=${data.accessToken}`}
                            className="block w-full p-4 bg-zinc-800 rounded-xl border border-transparent hover:border-zinc-700 hover:bg-zinc-750 transition-all group"
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-white font-medium">Track Request</span>
                                <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                            </div>
                            <p className="text-xs text-zinc-500">View live status and modify details.</p>
                        </Link>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-900">
                                <Smartphone className="w-5 h-5 text-zinc-400 mb-2" />
                                <p className="text-xs text-zinc-500">SMS Updates</p>
                                <p className="text-sm text-white">Enabled</p>
                            </div>
                            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-900">
                                <FileText className="w-5 h-5 text-zinc-400 mb-2" />
                                <p className="text-xs text-zinc-500">PDF Copy</p>
                                <p className="text-sm text-white">Sent</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
