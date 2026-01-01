'use client'

import { motion } from 'framer-motion'
import { Calendar, Package } from 'lucide-react'
import Image from 'next/image'
import { DateRangePicker, DateRange } from '@/components/ui/date-range-picker'
import { quotePage, t } from '@/data/site-content'

interface CartItemSummary {
    id: string
    product: {
        name?: string
        nameEn?: string
        slug: string
        imageUrl?: string
    }
    quantity: number
}

interface QuoteDatesStepProps {
    rentalDates: DateRange | undefined | null
    onSelect: (range: DateRange | undefined | null) => void
    items?: CartItemSummary[]
    lng?: string
}

export function QuoteDatesStep({ rentalDates, onSelect, items = [], lng = 'en' }: QuoteDatesStepProps) {
    const content = quotePage.datesStep

    return (
        <motion.div
            key="dates"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
        >
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-zinc-400" />
                    {t(content.title, lng)}
                </h2>
                <p className="text-sm text-zinc-400">
                    {t(content.description, lng)}
                </p>
            </div>

            <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/50">
                <DateRangePicker
                    value={rentalDates}
                    onChange={onSelect}
                    className="w-full justify-center"
                />
            </div>

            {/* Cart Items Summary */}
            {items.length > 0 && (
                <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Package className="w-5 h-5 text-zinc-400" />
                        <h3 className="text-sm font-medium text-white">
                            {t(content.yourItems, lng)} ({items.length} {t(content.itemsCount, lng)})
                        </h3>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 p-2 bg-zinc-900/50 rounded-lg">
                                {item.product.imageUrl && (
                                    <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                                        <Image
                                            src={item.product.imageUrl}
                                            alt={item.product.name || item.product.slug}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white truncate">
                                        {item.product.name || item.product.nameEn || item.product.slug}
                                    </p>
                                    <p className="text-xs text-zinc-500">x{item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-amber-900/10 border border-amber-900/20 rounded-lg p-4">
                <p className="text-amber-500/80 text-sm">
                    <span className="font-semibold block mb-1">{t(content.note, lng)}</span>
                    {t(content.noteText, lng)}
                </p>
            </div>
        </motion.div>
    )
}
