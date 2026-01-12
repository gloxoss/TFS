'use client'

import { useState } from 'react'
import { QuoteWizardCinematic } from '@/components/quote/wizard-variants/QuoteWizardCinematic'
import { QuoteWizardModern } from '@/components/quote/wizard-variants/QuoteWizardModern'
import { QuoteWizardFocus } from '@/components/quote/wizard-variants/QuoteWizardFocus'
import { QuoteWizardMinimal } from '@/components/quote/wizard-variants/QuoteWizardMinimal'
import { cn } from '@/lib/utils'

import { useForm, FormProvider } from 'react-hook-form'

export default function QuoteWizardPlayground() {
    const [activeVariant, setActiveVariant] = useState<'cinematic' | 'modern' | 'focus' | 'minimal'>('minimal')

    // Mock Form
    const methods = useForm()

    // Mock Cart Data
    const mockItems = [
        { product: { name: 'ARRI Alexa Mini LF' }, quantity: 1 },
        { product: { name: 'Cooke S4/i Prime Lens Set' }, quantity: 1 },
        { product: { name: 'OConnor 2575D Fluid Head' }, quantity: 1 },
        { product: { name: 'SmallHD 702 Touch' }, quantity: 2 },
    ]

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Control Bar */}
            <div className="fixed top-0 left-0 w-full z-50 bg-zinc-900/80 backdrop-blur border-b border-zinc-800 p-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <h1 className="text-sm font-bold tracking-widest uppercase text-zinc-400">Quote Wizard Playground</h1>

                    <div className="flex gap-2 p-1 bg-black rounded-lg border border-zinc-800">
                        {(['cinematic', 'modern', 'focus', 'minimal'] as const).map((v) => (
                            <button
                                key={v}
                                onClick={() => setActiveVariant(v)}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium rounded-md transition-all",
                                    activeVariant === v
                                        ? "bg-white text-black shadow-lg"
                                        : "text-zinc-500 hover:text-zinc-300"
                                )}
                            >
                                {v.charAt(0).toUpperCase() + v.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Canvas */}
            <div className="pt-24 min-h-screen flex flex-col justify-center px-4">
                {activeVariant === 'cinematic' && <QuoteWizardCinematic items={mockItems} />}
                {activeVariant === 'modern' && <QuoteWizardModern items={mockItems} />}
                {activeVariant === 'focus' && <QuoteWizardFocus items={mockItems} />}
                {activeVariant === 'minimal' && (
                    <FormProvider {...methods}>
                        <QuoteWizardMinimal
                            items={mockItems}
                            rentalDates={{ start: '2024-03-12', end: '2024-03-15' }}
                            onDateSelect={() => { }}
                            onSubmit={() => alert('Submitted!')}
                            isSubmitting={false}
                            lng="en"
                        />
                    </FormProvider>
                )}
            </div>
        </div>
    )
}
