'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CornerDownLeft, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WizardProps {
    items: any[]
}

const questions = [
    { id: 1, text: "Let's start with your rental dates.", type: 'dates' },
    { id: 2, text: "What's the best email to send this quote to?", type: 'email', placeholder: 'name@example.com' },
    { id: 3, text: "And your full name?", type: 'text', placeholder: 'John Doe' },
    { id: 4, text: "Anything we should know about this project?", type: 'textarea', placeholder: 'Type your message here...' },
]

export function QuoteWizardFocus({ items }: WizardProps) {
    const [qIndex, setQIndex] = useState(0)

    const currentQ = questions[qIndex]
    const progress = ((qIndex + 1) / questions.length) * 100

    const handleNext = () => {
        if (qIndex < questions.length - 1) setQIndex(i => i + 1)
    }

    return (
        <div className="w-full max-w-4xl mx-auto min-h-[600px] flex flex-col justify-center relative">

            {/* Minimal Progress Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-zinc-900 rounded-full">
                <motion.div
                    className="h-full bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={qIndex}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.4, ease: "circOut" }}
                    className="space-y-8"
                >
                    <div className="flex items-start gap-6">
                        <span className="text-xl text-zinc-600 font-mono pt-2">0{qIndex + 1}</span>
                        <div className="space-y-8 flex-1">
                            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                                {currentQ.text}
                            </h1>

                            {currentQ.type === 'dates' && (
                                <div className="p-6 border-b-2 border-zinc-800 text-zinc-500 font-mono text-xl hover:border-white hover:text-white transition-colors cursor-pointer w-fit">
                                    Select Start & End Date
                                </div>
                            )}

                            {currentQ.type === 'email' && (
                                <input
                                    autoFocus
                                    type="email"
                                    placeholder={currentQ.placeholder}
                                    className="w-full bg-transparent border-b-2 border-zinc-800 py-4 text-3xl md:text-4xl text-white placeholder:text-zinc-800 outline-none focus:border-white transition-colors"
                                />
                            )}

                            {currentQ.type === 'text' && (
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder={currentQ.placeholder}
                                    className="w-full bg-transparent border-b-2 border-zinc-800 py-4 text-3xl md:text-4xl text-white placeholder:text-zinc-800 outline-none focus:border-white transition-colors"
                                />
                            )}

                            {currentQ.type === 'textarea' && (
                                <textarea
                                    autoFocus
                                    placeholder={currentQ.placeholder}
                                    className="w-full bg-transparent border-b-2 border-zinc-800 py-4 text-2xl md:text-3xl text-white placeholder:text-zinc-800 outline-none focus:border-white transition-colors resize-none h-40"
                                />
                            )}

                            {/* Control */}
                            <div className="pt-8">
                                <button
                                    onClick={handleNext}
                                    className="group flex items-center gap-4 bg-white text-zinc-950 px-8 py-4 rounded-lg text-lg font-bold hover:translate-y-[-2px] transition-transform"
                                >
                                    {qIndex === questions.length - 1 ? 'Finish' : 'OK'}
                                    <Check className={cn("w-5 h-5", qIndex !== questions.length - 1 && "hidden")} />
                                    <span className={cn("text-xs text-zinc-400 font-normal uppercase tracking-wider ml-2", qIndex === questions.length - 1 && "hidden")}>
                                        Press Enter
                                        <CornerDownLeft className="inline w-3 h-3 ml-1" />
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Cart Indicator */}
            <div className="fixed bottom-8 right-8 text-zinc-500 text-sm font-mono">
                Running quote for {items.length} items
            </div>
        </div>
    )
}
