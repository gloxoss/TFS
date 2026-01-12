'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useFormContext } from 'react-hook-form'
import { User, Mail, Phone, Building, LogIn } from 'lucide-react'
import { useAuthStore } from '@/stores'
import { QuoteFormData } from '@/lib/schemas/quote'
import { cn } from '@/lib/utils'

interface QuoteContactStepProps {
    existingAccountEmail: string | null
    lng: string
}

export function QuoteContactStep({ existingAccountEmail, lng }: QuoteContactStepProps) {
    const { register, formState: { errors } } = useFormContext<QuoteFormData>()
    const user = useAuthStore((state) => state.user)

    return (
        <motion.div
            key="contact"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
        >
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-zinc-400" />
                Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">First Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                        <input
                            {...register('firstName')}
                            className={cn(
                                'w-full pl-10 pr-4 py-2.5 bg-zinc-800 border rounded-lg text-white placeholder:text-zinc-500',
                                'focus:outline-none focus:ring-2 focus:ring-white/20',
                                errors.firstName ? 'border-red-500' : 'border-zinc-700'
                            )}
                            placeholder="Jane"
                        />
                    </div>
                    {errors.firstName && (
                        <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
                    )}
                </div>

                {/* Last Name */}
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">Last Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                        <input
                            {...register('lastName')}
                            className={cn(
                                'w-full pl-10 pr-4 py-2.5 bg-zinc-800 border rounded-lg text-white placeholder:text-zinc-500',
                                'focus:outline-none focus:ring-2 focus:ring-white/20',
                                errors.lastName ? 'border-red-500' : 'border-zinc-700'
                            )}
                            placeholder="Doe"
                        />
                    </div>
                    {errors.lastName && (
                        <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>
                    )}
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                        <input
                            {...register('email')}
                            type="email"
                            className={cn(
                                'w-full pl-10 pr-4 py-2.5 bg-zinc-800 border rounded-lg text-white placeholder:text-zinc-500',
                                'focus:outline-none focus:ring-2 focus:ring-white/20',
                                errors.email ? 'border-red-500' : 'border-zinc-700'
                            )}
                            placeholder="jane@example.com"
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                    )}
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">Phone Number</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                        <input
                            {...register('phone')}
                            type="tel"
                            className={cn(
                                'w-full pl-10 pr-4 py-2.5 bg-zinc-800 border rounded-lg text-white placeholder:text-zinc-500',
                                'focus:outline-none focus:ring-2 focus:ring-white/20',
                                errors.phone ? 'border-red-500' : 'border-zinc-700'
                            )}
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>
                    {errors.phone && (
                        <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
                    )}
                </div>

                {/* Company */}
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                        Company <span className="text-zinc-500 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                        <Building className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                        <input
                            {...register('company')}
                            className={cn(
                                'w-full pl-10 pr-4 py-2.5 bg-zinc-800 border rounded-lg text-white placeholder:text-zinc-500',
                                'focus:outline-none focus:ring-2 focus:ring-white/20',
                                errors.company ? 'border-red-500' : 'border-zinc-700'
                            )}
                            placeholder="Production Co."
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
