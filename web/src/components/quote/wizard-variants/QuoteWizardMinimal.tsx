'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Calendar, User, FileText, Box, Loader2, Building, Truck, MapPin, MessageSquare, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFormContext } from 'react-hook-form'
import { QuoteFormData, projectTypeLabels, deliveryPreferenceLabels } from '@/lib/schemas/quote'
import { DateRange, DateRangePicker, formatDateRange, calculateRentalDays } from '@/components/ui/date-range-picker'
import Link from 'next/link'

interface WizardProps {
    items: any[]
    rentalDates: DateRange | null
    onDateSelect: (range: DateRange | undefined) => void
    onSubmit: () => void
    isSubmitting: boolean
    existingAccountEmail?: string | null
    lng: string
}

type Step = 'dates' | 'contact' | 'project' | 'review'

export function QuoteWizardMinimal({
    items,
    rentalDates,
    onDateSelect,
    onSubmit,
    isSubmitting,
    existingAccountEmail,
    lng
}: WizardProps) {
    const { register, trigger, watch, formState: { errors } } = useFormContext<QuoteFormData>()
    const [step, setStep] = useState<Step>('dates')

    const steps = [
        { id: 'dates', label: '01. Dates', icon: Calendar },
        { id: 'contact', label: '02. Contact', icon: User },
        { id: 'project', label: '03. Project', icon: FileText },
        { id: 'review', label: '04. Review', icon: Box },
    ]

    const nextStep = async () => {
        if (step === 'dates') {
            if (!rentalDates?.start || !rentalDates?.end) {
                // Shake or show error (could add toast later)
                return
            }
            setStep('contact')
        }
        else if (step === 'contact') {
            const valid = await trigger(['firstName', 'lastName', 'email', 'phone', 'company'])
            if (valid) setStep('project')
        }
        else if (step === 'project') {
            const valid = await trigger(['projectType', 'projectDescription', 'deliveryPreference', 'location', 'notes'])
            if (valid) setStep('review')
        }
    }

    const prevStep = () => {
        if (step === 'contact') setStep('dates')
        else if (step === 'project') setStep('contact')
        else if (step === 'review') setStep('project')
    }

    // Watch values for summary
    const values = watch()
    const projectType = watch('projectType') as keyof typeof projectTypeLabels
    const deliveryPref = watch('deliveryPreference') as keyof typeof deliveryPreferenceLabels

    return (
        <div className="w-full max-w-3xl mx-auto px-4">
            {/* Header / Nav */}
            <div className="mb-12 flex items-center justify-between border-b border-zinc-800 pb-6 overflow-x-auto selection-none scrollbar-hide">
                <nav className="flex gap-8 min-w-max">
                    {steps.map((s) => (
                        <button
                            key={s.id}
                            onClick={async () => {
                                // Only allow jumping backward or to immediate next if valid
                                const targetIdx = steps.findIndex(st => st.id === s.id)
                                const currentIdx = steps.findIndex(st => st.id === step)
                                if (targetIdx < currentIdx) {
                                    setStep(s.id as Step)
                                }
                            }}
                            className={cn(
                                "text-sm font-mono uppercase tracking-wider transition-colors",
                                step === s.id ? "text-white font-bold" :
                                    steps.findIndex(st => st.id === step) > steps.findIndex(st => st.id === s.id) ? "text-emerald-500" : "text-zinc-600 cursor-not-allowed"
                            )}
                        >
                            {s.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {step === 'dates' && (
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold text-white">Rental Period</h1>
                                    <p className="text-zinc-400">Select your pickup and return dates.</p>
                                </div>
                                <div className="p-1">
                                    <DateRangePicker
                                        value={rentalDates || null}
                                        onChange={(range) => onDateSelect(range || undefined)}
                                        className="w-full"
                                        variant="minimal"
                                    />
                                </div>
                                {!rentalDates?.start && (
                                    <p className="text-amber-500 text-sm">Please select a date range to continue.</p>
                                )}
                            </div>
                        )}

                        {step === 'contact' && (
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold text-white">Contact Info</h1>
                                    <p className="text-zinc-400">Where should we send the quote?</p>
                                </div>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                                    <div className="space-y-1">
                                        <label className="text-xs font-mono text-zinc-500 uppercase">First Name</label>
                                        <input
                                            {...register('firstName')}
                                            className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg text-white focus:border-white outline-none transition-colors placeholder:text-zinc-800"
                                            placeholder="Jane"
                                        />
                                        {errors.firstName && <span className="text-red-500 text-xs">{errors.firstName.message}</span>}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-mono text-zinc-500 uppercase">Last Name</label>
                                        <input
                                            {...register('lastName')}
                                            className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg text-white focus:border-white outline-none transition-colors placeholder:text-zinc-800"
                                            placeholder="Doe"
                                        />
                                        {errors.lastName && <span className="text-red-500 text-xs">{errors.lastName.message}</span>}
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                        <label className="text-xs font-mono text-zinc-500 uppercase">Email Address</label>
                                        <input
                                            {...register('email')}
                                            className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg text-white focus:border-white outline-none transition-colors placeholder:text-zinc-800"
                                            placeholder="jane@example.com"
                                        />
                                        {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}

                                        {existingAccountEmail && (
                                            <div className="mt-2 p-3 bg-amber-900/20 border border-amber-900/50 rounded-lg flex items-start gap-3">
                                                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-amber-200 text-sm font-medium">Account Found</p>
                                                    <p className="text-amber-400/80 text-xs mt-1">
                                                        It looks like you have an account. Please{' '}
                                                        <Link href={`/${lng}/login?redirect=/quote`} className="underline hover:text-amber-200">
                                                            log in
                                                        </Link>
                                                        {' '}to save this quote to your history.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                        <label className="text-xs font-mono text-zinc-500 uppercase">Phone Number</label>
                                        <input
                                            {...register('phone')}
                                            className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg text-white focus:border-white outline-none transition-colors placeholder:text-zinc-800"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                        {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message}</span>}
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                        <label className="text-xs font-mono text-zinc-500 uppercase">Company <span className="text-zinc-600 normal-case">(Optional)</span></label>
                                        <div className="relative">
                                            <input
                                                {...register('company')}
                                                className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg text-white focus:border-white outline-none transition-colors placeholder:text-zinc-800 pl-8"
                                                placeholder="Production Co."
                                            />
                                            <Building className="absolute left-0 top-3.5 w-5 h-5 text-zinc-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 'project' && (
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold text-white">Project Details</h1>
                                    <p className="text-zinc-400">Tell us a bit about the production.</p>
                                </div>
                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <label className="text-xs font-mono text-zinc-500 uppercase">Project Type</label>
                                        <div className="flex gap-3 flex-wrap">
                                            {(Object.keys(projectTypeLabels) as Array<keyof typeof projectTypeLabels>).map((type) => (
                                                <label key={type} className={cn(
                                                    "px-4 py-2 border rounded-full text-sm transition-all cursor-pointer select-none",
                                                    watch('projectType') === type
                                                        ? "bg-white text-black border-white font-bold"
                                                        : "border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600"
                                                )}>
                                                    <input
                                                        type="radio"
                                                        value={type}
                                                        {...register('projectType')}
                                                        className="hidden"
                                                    />
                                                    {projectTypeLabels[type]}
                                                </label>
                                            ))}
                                        </div>
                                        {errors.projectType && <span className="text-red-500 text-xs">{errors.projectType.message}</span>}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-mono text-zinc-500 uppercase">Project Name / Description</label>
                                        <textarea
                                            {...register('projectDescription')}
                                            className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg text-white focus:border-white outline-none transition-colors h-24 resize-none placeholder:text-zinc-800"
                                            placeholder="e.g. Summer Campaign Commercial"
                                        />
                                        {errors.projectDescription && <span className="text-red-500 text-xs">{errors.projectDescription.message}</span>}
                                    </div>

                                    {/* Delivery & Location Group */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                        <div className="space-y-4">
                                            <label className="text-xs font-mono text-zinc-500 uppercase">Delivery Preference</label>
                                            <div className="flex gap-4">
                                                {(Object.keys(deliveryPreferenceLabels) as Array<keyof typeof deliveryPreferenceLabels>).map((pref) => (
                                                    <label key={pref} className={cn(
                                                        "flex-1 px-4 py-3 border-b-2 transition-all cursor-pointer select-none flex items-center justify-center gap-2",
                                                        watch('deliveryPreference') === pref
                                                            ? "border-white text-white"
                                                            : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
                                                    )}>
                                                        <input
                                                            type="radio"
                                                            value={pref}
                                                            {...register('deliveryPreference')}
                                                            className="hidden"
                                                        />
                                                        {pref === 'pickup' ? <Box className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                                                        <span className="text-sm">{deliveryPreferenceLabels[pref]}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            {errors.deliveryPreference && <span className="text-red-500 text-xs">{errors.deliveryPreference.message}</span>}
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-mono text-zinc-500 uppercase">Location <span className="text-zinc-600 normal-case">(Optional)</span></label>
                                            <div className="relative">
                                                <input
                                                    {...register('location')}
                                                    className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg text-white focus:border-white outline-none transition-colors placeholder:text-zinc-800"
                                                    placeholder="City or Studio"
                                                />
                                            </div>
                                            {errors.location && <span className="text-red-500 text-xs">{errors.location.message}</span>}
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-mono text-zinc-500 uppercase">Additional Notes <span className="text-zinc-600 normal-case">(Optional)</span></label>
                                        <textarea
                                            {...register('notes')}
                                            className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg text-white focus:border-white outline-none transition-colors h-24 resize-none placeholder:text-zinc-800"
                                            placeholder="Any special requirements..."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 'review' && (
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold text-white">Review Request</h1>
                                    <p className="text-zinc-400">Confirm details before submitting.</p>
                                </div>

                                <div className="border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800">
                                    {/* Dates Summary */}
                                    <div className="p-4 bg-zinc-900/30 flex justify-between items-center group cursor-pointer hover:bg-zinc-900/50" onClick={() => setStep('dates')}>
                                        <div>
                                            <p className="text-xs font-mono text-zinc-500 uppercase mb-1">Dates</p>
                                            <p className="text-white">
                                                {rentalDates?.start ? new Date(rentalDates.start).toLocaleDateString() : 'N/A'}
                                                {' - '}
                                                {rentalDates?.end ? new Date(rentalDates.end).toLocaleDateString() : 'N/A'}
                                            </p>
                                            <p className="text-emerald-500 text-xs mt-1">
                                                {rentalDates ? `${calculateRentalDays(rentalDates)} day${calculateRentalDays(rentalDates) !== 1 ? 's' : ''} rental` : ''}
                                            </p>
                                        </div>
                                        <div className="text-xs text-zinc-600 group-hover:text-white transition-colors">Edit</div>
                                    </div>

                                    {/* Contact Summary */}
                                    <div className="p-4 bg-zinc-900/30 flex justify-between items-center group cursor-pointer hover:bg-zinc-900/50" onClick={() => setStep('contact')}>
                                        <div>
                                            <p className="text-xs font-mono text-zinc-500 uppercase mb-1">Contact</p>
                                            <p className="text-white font-medium">{values.firstName} {values.lastName}</p>
                                            <p className="text-zinc-400 text-sm">{values.email} • {values.phone}</p>
                                            {values.company && <p className="text-zinc-500 text-sm mt-1 flex items-center gap-1"><Building className="w-3 h-3" /> {values.company}</p>}
                                        </div>
                                        <div className="text-xs text-zinc-600 group-hover:text-white transition-colors">Edit</div>
                                    </div>

                                    {/* Project Summary */}
                                    <div className="p-4 bg-zinc-900/30 flex justify-between items-center group cursor-pointer hover:bg-zinc-900/50" onClick={() => setStep('project')}>
                                        <div className="space-y-2">
                                            <p className="text-xs font-mono text-zinc-500 uppercase mb-1">Project Details</p>
                                            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                                                <div>
                                                    <span className="text-zinc-500 text-xs block">Type</span>
                                                    <span className="text-zinc-300 text-sm">{projectTypeLabels[projectType] || projectType}</span>
                                                </div>
                                                <div>
                                                    <span className="text-zinc-500 text-xs block">Delivery</span>
                                                    <span className="text-zinc-300 text-sm">{deliveryPreferenceLabels[deliveryPref] || deliveryPref}</span>
                                                </div>
                                                {values.location && (
                                                    <div className="col-span-2">
                                                        <span className="text-zinc-500 text-xs block">Location</span>
                                                        <span className="text-zinc-300 text-sm">{values.location}</span>
                                                    </div>
                                                )}
                                            </div>
                                            {values.projectDescription && (
                                                <div className="mt-2 pt-2 border-t border-zinc-800/50">
                                                    <p className="text-zinc-400 text-sm italic">"{values.projectDescription}"</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-xs text-zinc-600 group-hover:text-white transition-colors">Edit</div>
                                    </div>

                                    {/* Equipment Summary */}
                                    <div className="p-4 bg-zinc-900/30">
                                        <p className="text-xs font-mono text-zinc-500 uppercase mb-3">Equipment ({items.length})</p>
                                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                            {items.map((item, i) => (
                                                <div key={i} className="flex justify-between text-sm">
                                                    <span className="text-zinc-300 w-2/3 truncate">
                                                        {item.product.name || item.product.nameEn || item.product.slug}
                                                    </span>
                                                    <span className="text-zinc-500 font-mono">x{item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-[10px] text-zinc-600 mt-2 text-center uppercase tracking-widest">
                                            Pricing calculated in final quote
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-2">
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                {...register('acceptTerms')}
                                                className="peer w-5 h-5 appearance-none rounded border border-zinc-700 bg-zinc-900 checked:bg-emerald-500 checked:border-emerald-500 transition-colors"
                                            />
                                            <Check className="w-3.5 h-3.5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">
                                                I understand this is a request for a quote, not a confirmed reservation.
                                            </span>
                                            <p className="text-xs text-zinc-500">
                                                Final pricing, availability, and insurance requirements will be confirmed by the TFS team.
                                            </p>
                                        </div>
                                    </label>
                                    {errors.acceptTerms && <p className="text-xs text-red-500 ml-8">{errors.acceptTerms.message}</p>}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer Actions */}
            <div className="mt-12 pt-8 border-t border-zinc-800 flex justify-between items-center">
                <button
                    onClick={prevStep}
                    className={cn(
                        "text-zinc-500 hover:text-white transition-colors flex items-center gap-2 text-sm",
                        step === 'dates' && "invisible"
                    )}
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <button
                    onClick={step === 'review' ? onSubmit : nextStep}
                    disabled={isSubmitting || (step === 'review' && !values.acceptTerms)}
                    className={cn(
                        "bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-zinc-200 transition-all flex items-center gap-2",
                        step === 'review' && "bg-emerald-500 hover:bg-emerald-400 text-white",
                        (isSubmitting || (step === 'review' && !values.acceptTerms)) && "opacity-50 cursor-not-allowed"
                    )}
                >
                    {isSubmitting ? (
                        <>Submitting <Loader2 className="w-4 h-4 animate-spin" /></>
                    ) : step === 'review' ? (
                        <>Submit Request <Check className="w-4 h-4" /></>
                    ) : (
                        <>Continue <ArrowRight className="w-4 h-4" /></>
                    )}
                </button>
            </div>
        </div>
    )
}
