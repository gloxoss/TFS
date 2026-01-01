'use client'

import { motion } from 'framer-motion'
import { useFormContext } from 'react-hook-form'
import { Film, FileText, Truck, MessageSquare } from 'lucide-react'
import { QuoteFormData, projectTypeLabels, deliveryPreferenceLabels } from '@/lib/schemas/quote'
import { cn } from '@/lib/utils'

interface QuoteProjectStepProps {
    lng?: string
}

export function QuoteProjectStep({ lng = 'en' }: QuoteProjectStepProps) {
    const { register, formState: { errors } } = useFormContext<QuoteFormData>()

    return (
        <motion.div
            key="project"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
        >
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-zinc-400" />
                Project Details
            </h2>

            {/* Project Type */}
            <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">Project Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(Object.keys(projectTypeLabels) as Array<keyof typeof projectTypeLabels>).map((type) => (
                        <label
                            key={type}
                            className={cn(
                                'relative flex items-center justify-center px-4 py-3 rounded-lg border cursor-pointer transition-all',
                                'hover:border-zinc-500 hover:bg-zinc-700/50',
                                // We'll rely on the radio styling for selected state or valid/invalid state roughly
                                'border-zinc-700 bg-zinc-800'
                            )}
                        >
                            <input
                                {...register('projectType')}
                                type="radio"
                                value={type}
                                className="sr-only peer"
                            />
                            <div className="absolute inset-0 rounded-lg border-2 border-transparent peer-checked:border-white peer-checked:bg-white/5 transition-all" />
                            <span className="text-sm font-medium text-zinc-300 peer-checked:text-white z-10">
                                {projectTypeLabels[type]}
                            </span>
                        </label>
                    ))}
                </div>
                {errors.projectType && (
                    <p className="mt-1 text-xs text-red-500">{errors.projectType.message}</p>
                )}
            </div>

            {/* Project Description */}
            <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    <FileText className="w-4 h-4 inline mr-1.5" />
                    Project Name / Description
                </label>
                <textarea
                    {...register('projectDescription')}
                    rows={2}
                    className={cn(
                        'w-full px-4 py-2.5 bg-zinc-800 border rounded-lg text-white placeholder:text-zinc-500',
                        'focus:outline-none focus:ring-2 focus:ring-white/20 resize-none',
                        errors.projectDescription ? 'border-red-500' : 'border-zinc-700'
                    )}
                    placeholder="e.g. 'Summer Campaign Commercial' or 'Indie Feature Film'"
                />
                {errors.projectDescription && (
                    <p className="mt-1 text-xs text-red-500">{errors.projectDescription.message}</p>
                )}
            </div>

            {/* Delivery Preference */}
            <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">
                    <Truck className="w-4 h-4 inline mr-1.5" />
                    Delivery Preference
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(Object.keys(deliveryPreferenceLabels) as Array<keyof typeof deliveryPreferenceLabels>).map((pref) => (
                        <label
                            key={pref}
                            className={cn(
                                'relative flex items-center justify-center px-4 py-3 rounded-lg border cursor-pointer transition-all',
                                'hover:border-zinc-500 hover:bg-zinc-700/50',
                                'border-zinc-700 bg-zinc-800'
                            )}
                        >
                            <input
                                {...register('deliveryPreference')}
                                type="radio"
                                value={pref}
                                className="sr-only peer"
                            />
                            <div className="absolute inset-0 rounded-lg border-2 border-transparent peer-checked:border-white peer-checked:bg-white/5 transition-all" />
                            <span className="text-sm font-medium text-zinc-300 peer-checked:text-white z-10">
                                {deliveryPreferenceLabels[pref]}
                            </span>
                        </label>
                    ))}
                </div>
                {errors.deliveryPreference && (
                    <p className="mt-1 text-xs text-red-500">{errors.deliveryPreference.message}</p>
                )}
            </div>

            {/* Location */}
            <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    <Truck className="w-4 h-4 inline mr-1.5" />
                    Shooting / Delivery Location (Optional)
                </label>
                <input
                    {...register('location')}
                    type="text"
                    className={cn(
                        'w-full px-4 py-2.5 bg-zinc-800 border rounded-lg text-white placeholder:text-zinc-500',
                        'focus:outline-none focus:ring-2 focus:ring-white/20',
                        errors.location ? 'border-red-500' : 'border-zinc-700'
                    )}
                    placeholder="e.g. Casablanca, Ouarzazate, Studio Location..."
                />
                {errors.location && (
                    <p className="mt-1 text-xs text-red-500">{errors.location.message}</p>
                )}
            </div>

            {/* Notes */}
            <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    <MessageSquare className="w-4 h-4 inline mr-1.5" />
                    Additional Notes (Optional)
                </label>
                <textarea
                    {...register('notes')}
                    rows={3}
                    className={cn(
                        'w-full px-4 py-2.5 bg-zinc-800 border rounded-lg text-white placeholder:text-zinc-500',
                        'focus:outline-none focus:ring-2 focus:ring-white/20 resize-none',
                        errors.notes ? 'border-red-500' : 'border-zinc-700'
                    )}
                    placeholder="Any special requirements or questions..."
                />
            </div>
        </motion.div>
    )
}
