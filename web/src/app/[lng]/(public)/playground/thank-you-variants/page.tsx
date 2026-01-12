'use client'

import { useState } from 'react'
import { QuoteSuccessMinimal } from '@/components/quote/variants/QuoteSuccessMinimal'
import { QuoteSuccessCinematic } from '@/components/quote/variants/QuoteSuccessCinematic'
import { QuoteSuccessInteractive } from '@/components/quote/variants/QuoteSuccessInteractive'
import { QuoteSuccessHybrid } from '@/components/quote/variants/QuoteSuccessHybrid'
import { QuoteSuccessView } from '@/components/quote/quote-success-view' // Original
import { cn } from '@/lib/utils'

export default function ThankYouVariantsPage() {
    const [activeVariant, setActiveVariant] = useState<'original' | 'minimal' | 'cinematic' | 'interactive' | 'hybrid'>('hybrid')

    // Mock Data
    const mockResult = {
        success: true,
        data: {
            confirmationNumber: 'Q-2024-8821',
            quoteId: 'demo-id',
            accessToken: 'demo-token',
            email: 'client@example.com'
        }
    }

    const mockItems = [
        { product: { name: 'ARRI Alexa Mini LF', imageUrl: 'https://images.unsplash.com/photo-1588483977555-520e588db657?q=80&w=2600&auto=format&fit=crop' } },
        { product: { name: 'Cooke S4/i Prime Lens Set', imageUrl: '' } },
        { product: { name: 'OConnor 2575D Fluid Head', imageUrl: '' } },
    ]

    const mockDateRange = {
        start: new Date(),
        end: new Date(new Date().setDate(new Date().getDate() + 3)) // 3 days later
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Control Bar */}
            <div className="fixed top-0 left-0 w-full z-50 bg-zinc-900/80 backdrop-blur border-b border-zinc-800 p-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <h1 className="text-sm font-bold tracking-widest uppercase text-zinc-400">Variant Playground</h1>

                    <div className="flex gap-2 p-1 bg-black rounded-lg border border-zinc-800">
                        {(['original', 'minimal', 'cinematic', 'interactive', 'hybrid'] as const).map((v) => (
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
            <div className="pt-24 min-h-screen flex flex-col justify-center">
                {activeVariant === 'original' && (
                    <QuoteSuccessView result={mockResult} lng="en" items={mockItems} rentalDates={mockDateRange} />
                )}
                {activeVariant === 'minimal' && (
                    <QuoteSuccessMinimal result={mockResult} lng="en" items={mockItems} rentalDates={mockDateRange} />
                )}
                {activeVariant === 'cinematic' && (
                    <QuoteSuccessCinematic result={mockResult} lng="en" items={mockItems} rentalDates={mockDateRange} />
                )}
                {activeVariant === 'interactive' && (
                    <QuoteSuccessInteractive result={mockResult} lng="en" items={mockItems} rentalDates={mockDateRange} />
                )}
                {activeVariant === 'hybrid' && (
                    <QuoteSuccessHybrid result={mockResult} lng="en" items={mockItems} rentalDates={mockDateRange} />
                )}
            </div>
        </div>
    )
}
