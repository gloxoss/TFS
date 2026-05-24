/**
 * Dynamic Attribute Filters Component
 * 
 * Renders filter dropdowns based on attributes from the attributes collection.
 * Replaces hardcoded Brand/Mount/Sensor/Resolution filters.
 * 
 * Used by: HybridFilterBar, equipment-client
 */
'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check, X, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Attribute } from '@/services'

interface DynamicAttributeFiltersProps {
    attributes: Attribute[]
    selectedFilters: Record<string, string[]>
    onFilterChange: (slug: string, values: string[]) => void
    onClearAll?: () => void
    /** Color theme for active state - defaults to emerald */
    colorScheme?: 'emerald' | 'blue' | 'amber' | 'red' | 'purple'
    /** Compact mode for mobile */
    compact?: boolean
    /** Available options map from current products */
    availableOptions?: Record<string, string[]>
}

// Color scheme mapping
const colorSchemes = {
    emerald: {
        active: 'bg-emerald-700/20 text-emerald-400 border-emerald-700/30',
        badge: 'bg-emerald-700',
        checkbox: 'bg-emerald-700 border-emerald-700',
        item: 'bg-emerald-700/20 text-emerald-400'
    },
    blue: {
        active: 'bg-blue-700/20 text-blue-400 border-blue-700/30',
        badge: 'bg-blue-700',
        checkbox: 'bg-blue-700 border-blue-700',
        item: 'bg-blue-700/20 text-blue-400'
    },
    amber: {
        active: 'bg-amber-700/20 text-amber-400 border-amber-700/30',
        badge: 'bg-amber-700',
        checkbox: 'bg-amber-700 border-amber-700',
        item: 'bg-amber-700/20 text-amber-400'
    },
    red: {
        active: 'bg-red-700/20 text-red-400 border-red-700/30',
        badge: 'bg-red-700',
        checkbox: 'bg-red-700 border-red-700',
        item: 'bg-red-700/20 text-red-400'
    },
    purple: {
        active: 'bg-purple-700/20 text-purple-400 border-purple-700/30',
        badge: 'bg-purple-700',
        checkbox: 'bg-purple-700 border-purple-700',
        item: 'bg-purple-700/20 text-purple-400'
    }
}

// Assign colors to attributes in sequence
const colorSequence: Array<keyof typeof colorSchemes> = ['emerald', 'blue', 'amber', 'red', 'purple']

export function DynamicAttributeFilters({
    attributes,
    selectedFilters,
    onFilterChange,
    onClearAll,
    compact = false,
    availableOptions,
}: DynamicAttributeFiltersProps) {
    // Track which dropdown is open
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)

    // Filter to only show attributes with options (allow select OR text if options exist)
    const filterableAttrs = attributes.filter(
        attr => attr.options && attr.options.length > 0
    )

    const handleToggle = useCallback((slug: string, value: string) => {
        const current = selectedFilters[slug] || []
        const isIncluded = current.some(v => v.toLowerCase() === value.toLowerCase())

        if (isIncluded) {
            onFilterChange(slug, current.filter(v => v.toLowerCase() !== value.toLowerCase()))
        } else {
            onFilterChange(slug, [...current, value])
        }
    }, [selectedFilters, onFilterChange])

    const handleClear = useCallback((slug: string) => {
        onFilterChange(slug, [])
    }, [onFilterChange])

    if (filterableAttrs.length === 0) return null

    // Count total active filters
    const totalActive = Object.values(selectedFilters).reduce((sum, arr) => sum + arr.length, 0)

    return (
        <div className="flex items-center gap-2 flex-wrap">
            {filterableAttrs.map((attr, index) => {
                const selected = selectedFilters[attr.slug] || []
                const isOpen = openDropdown === attr.slug
                const colorKey = colorSequence[index % colorSequence.length]
                const colors = colorSchemes[colorKey]

                return (
                    <div key={attr.id} className="relative">
                        {/* Dropdown Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                setOpenDropdown(isOpen ? null : attr.slug)
                            }}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                                selected.length > 0
                                    ? `${colors.active} border`
                                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-transparent"
                            )}
                        >
                            <Filter className="w-4 h-4" />
                            {!compact && <span>{attr.name}</span>}
                            {selected.length > 0 && (
                                <span className={cn(
                                    "w-5 h-5 text-white rounded-full text-xs flex items-center justify-center font-bold",
                                    colors.badge
                                )}>
                                    {selected.length}
                                </span>
                            )}
                            <ChevronDown className={cn(
                                "w-4 h-4 transition-transform",
                                isOpen && "rotate-180"
                            )} />
                        </button>

                        {/* Dropdown Panel */}
                        <AnimatePresence>
                            {isOpen && (
                                <>
                                    {/* Backdrop */}
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setOpenDropdown(null)}
                                    />

                                    {/* Panel */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute top-full left-0 mt-2 w-64 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden"
                                    >
                                        {/* Header */}
                                        <div className="p-2 border-b border-zinc-800 flex items-center justify-between">
                                            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-2">
                                                Filter by {attr.name}
                                            </span>
                                            {selected.length > 0 && (
                                                <button
                                                    onClick={() => handleClear(attr.slug)}
                                                    className="text-xs text-zinc-500 hover:text-white px-2"
                                                >
                                                    Clear
                                                </button>
                                            )}
                                        </div>

                                        {/* Options List */}
                                        <div className="max-h-64 overflow-y-auto p-2">
                                            {attr.options.filter(option => {
                                                if (!availableOptions) return true
                                                const available = availableOptions[attr.slug]
                                                // If available list exists, check if option is in it (case-insensitive)
                                                if (!available || available.length === 0) return false
                                                return available.some(av => av.toLowerCase() === option.toLowerCase())
                                            }).map(option => {
                                                const isSelected = selected.some(
                                                    s => s.toLowerCase() === option.toLowerCase()
                                                )

                                                return (
                                                    <button
                                                        key={option}
                                                        onClick={() => handleToggle(attr.slug, option)}
                                                        className={cn(
                                                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                                                            isSelected ? colors.item : "hover:bg-zinc-800 text-zinc-300"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0",
                                                            isSelected ? colors.checkbox : "border-zinc-600"
                                                        )}>
                                                            {isSelected && <Check className="w-3 h-3 text-zinc-900" />}
                                                        </div>
                                                        <span className="text-sm font-medium">{option}</span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                )
            })}

            {/* Clear All Button */}
            {totalActive > 0 && onClearAll && (
                <button
                    onClick={onClearAll}
                    className="flex items-center gap-1 px-3 py-2 text-zinc-400 hover:text-white text-sm"
                >
                    <X className="w-4 h-4" />
                    Clear all
                </button>
            )}
        </div>
    )
}

/**
 * Active Filter Tags - shows selected values as removable pills
 */
export function ActiveFilterTags({
    attributes,
    selectedFilters,
    onFilterChange,
    maxVisible = 4
}: {
    attributes: Attribute[]
    selectedFilters: Record<string, string[]>
    onFilterChange: (slug: string, values: string[]) => void
    maxVisible?: number
}) {
    const allTags: { slug: string; value: string; attrName: string }[] = []

    for (const attr of attributes) {
        const selected = selectedFilters[attr.slug] || []
        for (const value of selected) {
            allTags.push({ slug: attr.slug, value, attrName: attr.name })
        }
    }

    if (allTags.length === 0) return null

    const visibleTags = allTags.slice(0, maxVisible)
    const hiddenCount = allTags.length - maxVisible

    const handleRemove = (slug: string, value: string) => {
        const current = selectedFilters[slug] || []
        onFilterChange(slug, current.filter(v => v !== value))
    }

    return (
        <div className="flex gap-2 overflow-hidden">
            {visibleTags.map(({ slug, value }) => (
                <span
                    key={`${slug}-${value}`}
                    className="px-3 py-1 bg-zinc-800 rounded-full text-xs flex items-center gap-1.5 text-zinc-300"
                >
                    {value}
                    <X
                        className="w-3 h-3 cursor-pointer hover:text-red-400"
                        onClick={() => handleRemove(slug, value)}
                    />
                </span>
            ))}
            {hiddenCount > 0 && (
                <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-500">
                    +{hiddenCount} more
                </span>
            )}
        </div>
    )
}
