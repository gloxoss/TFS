'use client'

import { motion } from 'framer-motion'
import { useFormContext } from 'react-hook-form'
import { CheckCircle, Calendar } from 'lucide-react'
import { QuoteFormData, projectTypeLabels, deliveryPreferenceLabels } from '@/lib/schemas/quote'
import { formatDateRange, calculateRentalDays } from '@/components/ui/date-range-picker'
import { DateRange } from '@/components/ui/date-range-picker'
import { QuoteResult } from '@/services'
import { cn } from '@/lib/utils'

interface QuoteReviewStepProps {
    items: any[] // Using any to avoid complex type mismatches
    rentalDates: DateRange | undefined
    submitResult: QuoteResult | null
    lng?: string
}

export function QuoteReviewStep({ items, rentalDates, submitResult, lng = 'en' }: QuoteReviewStepProps) {
    const { register, watch, formState: { errors } } = useFormContext<QuoteFormData>()

    // Helper to safely access enum labels
    const projectType = watch('projectType') as keyof typeof projectTypeLabels
    const deliveryPref = watch('deliveryPreference') as keyof typeof deliveryPreferenceLabels

    return (
        <motion.div
            key="review"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
        >
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-zinc-400" />
                Review Your Request
            </h2>

            {/* Rental Period Summary */}
            <div className="bg-amber-900/20 border border-amber-800/30 rounded-lg p-4">
                <h3 className="text-sm font-medium text-amber-400 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Rental Period
                </h3>
                <p className="text-white font-medium">
                    {rentalDates ? formatDateRange(rentalDates) : 'Not selected'}
                </p>
                <p className="text-amber-300/70 text-sm">
                    {rentalDates ? `${calculateRentalDays(rentalDates)} day${calculateRentalDays(rentalDates) !== 1 ? 's' : ''} rental` : ''}
                </p>
            </div>

            {/* Contact Summary */}
            <div className="bg-zinc-800/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-zinc-400 mb-2">Contact</h3>
                <p className="text-white">
                    {watch('firstName')} {watch('lastName')}
                </p>
                <p className="text-zinc-300 text-sm">{watch('email')}</p>
                <p className="text-zinc-300 text-sm">{watch('phone')}</p>
                {watch('company') && (
                    <p className="text-zinc-400 text-sm">{watch('company')}</p>
                )}
            </div>

            {/* Project Summary */}
            <div className="bg-zinc-800/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-zinc-400 mb-2">Project</h3>
                <p className="text-white">
                    {projectTypeLabels[projectType] || projectType}
                </p>
                <p className="text-zinc-400 text-sm">
                    {deliveryPreferenceLabels[deliveryPref] || deliveryPref}
                </p>
                {watch('location') && (
                    <p className="text-zinc-300 text-sm mt-1">📍 {watch('location')}</p>
                )}
                {watch('projectDescription') && (
                    <p className="text-zinc-300 text-sm mt-2">{watch('projectDescription')}</p>
                )}
            </div>

            {/* Items Summary - BLIND QUOTE: No prices shown */}
            <div className="bg-zinc-800/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-zinc-400 mb-2">
                    Equipment ({items.length} items)
                </h3>
                <ul className="space-y-2">
                    {items.map((item) => (
                        <li key={item.id} className="flex justify-between text-sm">
                            <span className="text-zinc-300">
                                {item.product.name || item.product.nameEn || item.product.slug} × {item.quantity}
                            </span>
                            {item.kit_selections && Object.keys(item.kit_selections).length > 0 && (
                                <span className="text-xs text-amber-400">Kit</span>
                            )}
                        </li>
                    ))}
                </ul>
                <div className="border-t border-zinc-700 mt-3 pt-3">
                    <p className="text-sm text-zinc-400 text-center italic">
                        Pricing will be provided in your personalized quote
                    </p>
                </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
                <input
                    {...register('acceptTerms')}
                    type="checkbox"
                    className="mt-1 w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-white focus:ring-white/20"
                />
                <span className="text-sm text-zinc-300">
                    I understand this is a quote request, not a confirmed reservation.
                    Final pricing and availability will be confirmed by the TFS team.
                </span>
            </label>
            {errors.acceptTerms && (
                <p className="text-sm text-red-400">{errors.acceptTerms.message}</p>
            )}

            {/* Error Message */}
            {submitResult?.error && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-300 text-sm">
                    {submitResult.error}
                </div>
            )}
        </motion.div>
    )
}
