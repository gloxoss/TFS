'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WizardProps {
    items: any[]
}

const steps = [
    { id: 1, label: 'Dates' },
    { id: 2, label: 'Info' },
    { id: 3, label: 'Details' },
    { id: 4, label: 'Confirm' },
]

export function QuoteWizardModern({ items }: WizardProps) {
    const [step, setStep] = useState(1)

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-12">
                <div className="flex justify-between mb-4">
                    {steps.map((s) => (
                        <div key={s.id} className={cn(
                            "text-sm font-medium transition-colors",
                            step >= s.id ? "text-white" : "text-zinc-600"
                        )}>
                            {s.label}
                        </div>
                    ))}
                </div>
                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / steps.length) * 100}%` }}
                        transition={{ ease: "easeInOut", duration: 0.5 }}
                    />
                </div>
            </div>

            {/* Card Container */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-1 bg-gradient-to-b from-zinc-800/50 to-zinc-900/50 shadow-2xl">
                <div className="bg-zinc-950 rounded-xl p-8 md:p-12 min-h-[400px] relative overflow-hidden flex flex-col">

                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

                    <div className="flex-1">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-8"
                            >
                                <span className="inline-block px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                                    Step 0{step} / 04
                                </span>

                                {step === 1 && (
                                    <div className="space-y-6">
                                        <h2 className="text-3xl font-bold text-white">Rental Period</h2>
                                        <p className="text-zinc-400">Select the dates you'll need the equipment.</p>
                                        <div className="p-8 border-2 border-dashed border-zinc-800 rounded-xl hover:border-zinc-700 hover:bg-zinc-900/50 transition-all cursor-pointer text-center group">
                                            <span className="text-zinc-500 group-hover:text-zinc-300">Open Date Picker</span>
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-6">
                                        <h2 className="text-3xl font-bold text-white">Your Information</h2>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs text-zinc-500 uppercase font-bold">First Name</label>
                                                <input className="w-full bg-zinc-900 rounded-lg p-3 text-white border border-zinc-800 focus:border-indigo-500 outline-none transition-colors" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs text-zinc-500 uppercase font-bold">Last Name</label>
                                                <input className="w-full bg-zinc-900 rounded-lg p-3 text-white border border-zinc-800 focus:border-indigo-500 outline-none transition-colors" />
                                            </div>
                                            <div className="col-span-2 space-y-1">
                                                <label className="text-xs text-zinc-500 uppercase font-bold">Email</label>
                                                <input className="w-full bg-zinc-900 rounded-lg p-3 text-white border border-zinc-800 focus:border-indigo-500 outline-none transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-6">
                                        <h2 className="text-3xl font-bold text-white">Project Details</h2>
                                        <div className="space-y-4">
                                            <label className="flex items-center gap-4 p-4 bg-zinc-900 rounded-xl border border-zinc-800 cursor-pointer hover:border-indigo-500/50 transition-all">
                                                <div className="w-5 h-5 rounded-full border border-zinc-600" />
                                                <span className="text-zinc-300">Commercial Production</span>
                                            </label>
                                            <label className="flex items-center gap-4 p-4 bg-zinc-900 rounded-xl border border-zinc-800 cursor-pointer hover:border-indigo-500/50 transition-all">
                                                <div className="w-5 h-5 rounded-full border border-zinc-600" />
                                                <span className="text-zinc-300">Indie Film / Short</span>
                                            </label>
                                            <label className="flex items-center gap-4 p-4 bg-zinc-900 rounded-xl border border-zinc-800 cursor-pointer hover:border-indigo-500/50 transition-all">
                                                <div className="w-5 h-5 rounded-full border border-zinc-600" />
                                                <span className="text-zinc-300">Personal Project</span>
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {step === 4 && (
                                    <div className="space-y-6">
                                        <h2 className="text-3xl font-bold text-white">Summary</h2>
                                        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-zinc-800">
                                                <span className="text-zinc-400">Total Items</span>
                                                <span className="text-white font-mono">{items.length}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-zinc-400">Est. Duration</span>
                                                <span className="text-white font-mono">3 Days</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Actions */}
                    <div className="pt-8 flex justify-end gap-3">
                        {step > 1 && (
                            <button
                                onClick={() => setStep(s => s - 1)}
                                className="px-6 py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                            >
                                Back
                            </button>
                        )}
                        <button
                            onClick={() => step < 4 && setStep(s => s + 1)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-900/30 flex items-center gap-2"
                        >
                            {step === 4 ? 'Confirm Request' : 'Next Step'}
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
