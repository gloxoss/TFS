'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Calendar, User, Briefcase, CheckCircle, Package } from 'lucide-react'
import { cn } from '@/lib/utils'

// Types for the wizard
type Step = 'dates' | 'contact' | 'project' | 'review'

interface WizardProps {
    items: any[]
}

export function QuoteWizardCinematic({ items }: WizardProps) {
    const [step, setStep] = useState<Step>('dates')

    // Mock Form State
    const [formData, setFormData] = useState({
        dates: { start: null, end: null },
        contact: { name: '', email: '', phone: '' },
        project: { name: '', type: '' }
    })

    const steps: { id: Step; label: string; icon: any }[] = [
        { id: 'dates', label: 'Rental Dates', icon: Calendar },
        { id: 'contact', label: 'Contact Details', icon: User },
        { id: 'project', label: 'Project Info', icon: Briefcase },
        { id: 'review', label: 'Final Review', icon: CheckCircle },
    ]

    const handleNext = () => {
        const idx = steps.findIndex(s => s.id === step)
        if (idx < steps.length - 1) setStep(steps[idx + 1].id)
    }

    const handleBack = () => {
        const idx = steps.findIndex(s => s.id === step)
        if (idx > 0) setStep(steps[idx - 1].id)
    }

    return (
        <div className="w-full max-w-7xl mx-auto h-[800px] flex rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl">
            {/* Left Panel - Navigation & Summary */}
            <div className="w-1/3 bg-zinc-950 p-12 flex flex-col justify-between border-r border-zinc-800/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] -z-0" />

                {/* Steps Nav */}
                <div className="relative z-10 space-y-8">
                    <h2 className="text-2xl font-bold text-white mb-8 tracking-tight">Request Quote</h2>
                    <div className="space-y-6">
                        {steps.map((s, idx) => {
                            const isActive = s.id === step
                            const isPast = steps.findIndex(st => st.id === step) > idx

                            return (
                                <div key={s.id} className="flex items-center gap-4 group cursor-pointer" onClick={() => setStep(s.id)}>
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300",
                                        isActive ? "bg-white text-black border-white scale-110 shadow-[0_0_20px_rgba(255,255,255,0.3)]" :
                                            isPast ? "bg-zinc-800 text-zinc-400 border-zinc-700" :
                                                "bg-transparent text-zinc-600 border-zinc-800"
                                    )}>
                                        <s.icon className="w-4 h-4" />
                                    </div>
                                    <span className={cn(
                                        "text-sm font-medium transition-colors duration-300",
                                        isActive ? "text-white" : isPast ? "text-zinc-500" : "text-zinc-700"
                                    )}>{s.label}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Cart Summary Mini */}
                <div className="relative z-10 bg-zinc-900/50 rounded-xl p-6 border border-zinc-800/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3 text-zinc-400 mb-4">
                        <Package className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-widest font-semibold">Equipment List</span>
                    </div>
                    <div className="space-y-3">
                        {items.slice(0, 3).map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                                <span className="text-zinc-300 truncate w-2/3">{item.product.name}</span>
                                <span className="text-zinc-600">x{item.quantity || 1}</span>
                            </div>
                        ))}
                        {items.length > 3 && (
                            <p className="text-xs text-zinc-500 pt-2 border-t border-zinc-800 mt-2">
                                + {items.length - 3} more items
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Panel - Active Form */}
            <div className="flex-1 bg-zinc-900 relative p-12 flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="w-full max-w-lg space-y-8"
                        >
                            {step === 'dates' && (
                                <div className="space-y-6">
                                    <h1 className="text-4xl font-bold text-white">When do you need the gear?</h1>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="h-32 bg-zinc-950 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors flex items-center justify-center cursor-pointer group">
                                            <div className="text-center group-hover:scale-105 transition-transform">
                                                <span className="block text-zinc-500 text-sm mb-1">Start Date</span>
                                                <span className="text-2xl text-zinc-300 font-mono">Select...</span>
                                            </div>
                                        </div>
                                        <div className="h-32 bg-zinc-950 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors flex items-center justify-center cursor-pointer group">
                                            <div className="text-center group-hover:scale-105 transition-transform">
                                                <span className="block text-zinc-500 text-sm mb-1">End Date</span>
                                                <span className="text-2xl text-zinc-300 font-mono">Select...</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 'contact' && (
                                <div className="space-y-6">
                                    <h1 className="text-4xl font-bold text-white">How can we reach you?</h1>
                                    <div className="space-y-4">
                                        <input type="text" placeholder="Full Name" className="w-full bg-zinc-950 border-b border-zinc-800 p-4 text-xl outline-none focus:border-white transition-colors text-white placeholder:text-zinc-700" />
                                        <input type="email" placeholder="Email Address" className="w-full bg-zinc-950 border-b border-zinc-800 p-4 text-xl outline-none focus:border-white transition-colors text-white placeholder:text-zinc-700" />
                                        <input type="tel" placeholder="Phone Number" className="w-full bg-zinc-950 border-b border-zinc-800 p-4 text-xl outline-none focus:border-white transition-colors text-white placeholder:text-zinc-700" />
                                    </div>
                                </div>
                            )}

                            {step === 'project' && (
                                <div className="space-y-6">
                                    <h1 className="text-4xl font-bold text-white">Tell us about the project.</h1>
                                    <div className="space-y-4">
                                        <input type="text" placeholder="Project Name (Optional)" className="w-full bg-zinc-950 border-b border-zinc-800 p-4 text-xl outline-none focus:border-white transition-colors text-white placeholder:text-zinc-700" />
                                        <textarea placeholder="Any special requests or location info?" className="w-full bg-zinc-950 border-b border-zinc-800 p-4 text-xl outline-none focus:border-white transition-colors text-white placeholder:text-zinc-700 h-32 resize-none" />
                                    </div>
                                </div>
                            )}

                            {step === 'review' && (
                                <div className="space-y-6 text-center">
                                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="w-10 h-10 text-emerald-500" />
                                    </div>
                                    <h1 className="text-4xl font-bold text-white">Ready to submit?</h1>
                                    <p className="text-zinc-400">Our team will check availability and send you a formal quote within 24 hours.</p>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer Nav */}
                <div className="flex justify-between items-center pt-8 border-t border-zinc-800">
                    <button
                        onClick={handleBack}
                        className={cn("text-zinc-500 hover:text-white transition-colors flex items-center gap-2", step === 'dates' && "invisible")}
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>

                    <button
                        onClick={handleNext}
                        className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-zinc-200 transition-all flex items-center gap-2"
                    >
                        {step === 'review' ? 'Submit Request' : 'Continue'}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
