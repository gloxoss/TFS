/**
 * Hybrid Filter Bar Component
 * 
 * Desktop: Top sticky bar with pill filters (category + brand)
 * Mobile: FAB button + bottom sheet modal
 * 
 * No price filters - equipment rental catalog mode
 */
'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
    Filter,
    X,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Check,
    SlidersHorizontal,
    Search,
    LayoutGrid,
    List
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Category } from '@/services/products/types'
import type { Attribute } from '@/services'
import { DynamicAttributeFilters, ActiveFilterTags } from './DynamicAttributeFilters'

// Uniform category icon
function getCategoryIcon(_slug: string): React.ElementType {
    return LayoutGrid
}

interface HybridFilterBarProps {
    categories: Category[]
    selectedCategory: string | null
    searchQuery: string
    totalCount: number
    onCategoryChange: (category: string | null) => void
    onSearchChange: (query: string) => void
    viewMode?: 'grid' | 'list'
    onViewModeChange?: (mode: 'grid' | 'list') => void
    t: (key: string) => string
    // Dynamic attributes from collection
    attributes?: Attribute[]
    selectedAttributeFilters?: Record<string, string[]>
    attributes?: Attribute[]
    selectedAttributeFilters?: Record<string, string[]>
    onAttributeFilterChange?: (slug: string, values: string[]) => void
    /** Available options map from current products */
    availableOptions?: Record<string, string[]>
}

export function HybridFilterBar({
    categories,
    selectedCategory,
    searchQuery,
    totalCount,
    onCategoryChange,
    onSearchChange,
    viewMode = 'grid',
    onViewModeChange,
    t,
    attributes,
    selectedAttributeFilters,
    onAttributeFilterChange,
    availableOptions
}: HybridFilterBarProps) {
    const [mobileSheetOpen, setMobileSheetOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)

    // Close logic 
    useEffect(() => {
        if (!mobileSheetOpen) {
            setMobileSheetOpen(false)
        }
    }, [mobileSheetOpen])
    const scrollRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return
        setIsDragging(true)
        setStartX(e.pageX - scrollRef.current.offsetLeft)
        setScrollLeft(scrollRef.current.scrollLeft)
    }

    const handleMouseLeave = () => {
        setIsDragging(false)
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return
        e.preventDefault()
        const x = e.pageX - scrollRef.current.offsetLeft
        const walk = (x - startX) * 2 // Scroll speed multiplier
        scrollRef.current.scrollLeft = scrollLeft - walk
    }

    const activeFilterCount = (selectedCategory ? 1 : 0) +
        (selectedAttributeFilters ? Object.values(selectedAttributeFilters).reduce((acc, curr) => acc + curr.length, 0) : 0)

    const clearAllFilters = useCallback(() => {
        onCategoryChange(null)
        onSearchChange('')
        if (selectedAttributeFilters && onAttributeFilterChange) {
            Object.keys(selectedAttributeFilters).forEach(slug => {
                onAttributeFilterChange(slug, [])
            })
        }
    }, [onCategoryChange, onSearchChange, selectedAttributeFilters, onAttributeFilterChange])

    // Detect if top filter bar is in view
    const filterBarRef = useRef(null)
    const isInView = useInView(filterBarRef, { amount: 0.1 }) // 10% visible
    const showMobileFab = !isInView;

    return (
        <>
            {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            {/* DESKTOP: Top Sticky Filter Bar */}
            {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            <div ref={filterBarRef} className="md:block relative z-40 px-4 sm:px-6 lg:px-8 mb-8">
                <div className="max-w-7xl mx-auto bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">

                    {/* Primary Row: Category Pills - Drag to Scroll */}
                    <div className="relative border-b border-white/5 group/categories">
                        {/* Left Arrow */}
                        <button
                            onClick={() => scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' })}
                            className="absolute left-0 top-0 bottom-0 z-20 px-2 bg-gradient-to-r from-zinc-900 to-transparent flex items-center justify-center opacity-100 md:opacity-0 md:group-hover/categories:opacity-100 transition-opacity"
                        >
                            <ChevronLeft className="w-5 h-5 text-white drop-shadow-lg" />
                        </button>

                        {/* Right Arrow */}
                        <button
                            onClick={() => scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' })}
                            className="absolute right-0 top-0 bottom-0 z-20 px-2 bg-gradient-to-l from-zinc-900 to-transparent flex items-center justify-center opacity-100 md:opacity-0 md:group-hover/categories:opacity-100 transition-opacity"
                        >
                            <ChevronRight className="w-5 h-5 text-white drop-shadow-lg" />
                        </button>

                        {/* Fade gradients */}
                        <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-zinc-900 to-transparent z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-zinc-900 to-transparent z-10 pointer-events-none" />

                        <div
                            ref={scrollRef}
                            className={cn(
                                "flex overflow-x-auto px-6 py-2 scrollbar-hide select-none",
                                isDragging ? "cursor-grabbing" : "cursor-grab"
                            )}
                            style={{ scrollbarWidth: 'none' }}
                            onMouseDown={handleMouseDown}
                            onMouseLeave={handleMouseLeave}
                            onMouseUp={handleMouseUp}
                            onMouseMove={handleMouseMove}
                        >
                            {/* All Equipment */}
                            <CategoryPill
                                label={t('categories.all')}
                                icon={LayoutGrid}
                                active={selectedCategory === null}
                                onClick={() => !isDragging && onCategoryChange(null)}
                            />

                            {/* Category Pills */}
                            {categories.map((cat) => (
                                <CategoryPill
                                    key={cat.id}
                                    label={cat.name}
                                    icon={getCategoryIcon(cat.slug)}
                                    count={cat.productCount}
                                    active={selectedCategory === cat.slug}
                                    onClick={() => !isDragging && onCategoryChange(cat.slug)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Secondary Row: Filters + Search */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 md:px-6 py-3 gap-3 md:gap-4">
                        {/* Left: Item count + Filters */}
                        <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0 flex-wrap">
                            <span className="text-xs text-zinc-500 shrink-0 font-medium">
                                {totalCount} <span className="hidden sm:inline">items</span>
                            </span>

                            {/* Dynamic Attribute Attributes */}
                            {attributes && selectedAttributeFilters && onAttributeFilterChange && (
                                <DynamicAttributeFilters
                                    attributes={attributes}
                                    selectedFilters={selectedAttributeFilters}
                                    onFilterChange={onAttributeFilterChange}
                                    onClearAll={activeFilterCount > 0 ? clearAllFilters : undefined}
                                    availableOptions={availableOptions}
                                />
                            )}



                            {/* Active filter tags */}
                            <div className="flex gap-2 overflow-hidden">
                                {/* Dynamic attribute tags */}
                                {attributes && selectedAttributeFilters && onAttributeFilterChange && (
                                    <ActiveFilterTags
                                        attributes={attributes}
                                        selectedFilters={selectedAttributeFilters}
                                        onFilterChange={onAttributeFilterChange}
                                        maxVisible={2}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Right: Search - Full width on mobile */}
                        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                            {/* Mobile: Static Search Bar */}
                            <div className="relative flex-1 md:hidden">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    placeholder={t('search.placeholder')}
                                    className="w-full pl-9 pr-8 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm focus:outline-none focus:border-red-500/50 text-white placeholder-zinc-500 transition-colors"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => onSearchChange('')}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-zinc-500 hover:text-white transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>

                            {/* Desktop: Animated Search Toggle */}
                            <div className="relative hidden md:flex items-center">
                                <AnimatePresence mode="wait">
                                    {searchOpen ? (
                                        <motion.div
                                            key="search-input"
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{ width: 220, opacity: 1 }}
                                            exit={{ width: 0, opacity: 0 }}
                                            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                                            className="flex items-center gap-2 overflow-hidden"
                                        >
                                            <motion.div
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                exit={{ x: -20, opacity: 0 }}
                                                transition={{ delay: 0.1, duration: 0.2 }}
                                                className="flex items-center gap-2"
                                            >
                                                <div className="relative flex-1">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                                    <input
                                                        type="text"
                                                        value={searchQuery}
                                                        onChange={(e) => onSearchChange(e.target.value)}
                                                        placeholder="Search..."
                                                        className="w-44 pl-9 pr-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm focus:outline-none focus:border-red-500 text-white placeholder-zinc-500"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setSearchOpen(false)
                                                        onSearchChange('')
                                                    }}
                                                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </motion.div>
                                        </motion.div>
                                    ) : (
                                        <motion.button
                                            key="search-button"
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.9, opacity: 0 }}
                                            transition={{ duration: 0.15 }}
                                            onClick={() => setSearchOpen(true)}
                                            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm text-zinc-300 transition-colors"
                                        >
                                            <Search className="w-4 h-4" />
                                            <span>Search</span>
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Clear All */}
                            {activeFilterCount > 0 && (
                                <button
                                    onClick={clearAllFilters}
                                    className="flex items-center gap-1 px-3 py-2 text-zinc-400 hover:text-white text-sm"
                                >
                                    <X className="w-4 h-4" />
                                    Clear all
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            {/* MOBILE: Compact Header + FAB */}
            {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            {/* MOBILE: Compact Header (Using Desktop Bar instead now, but keeping spacer if needed) */}
            {/* ═══════════════════════════════════════════════════════════════════════ */}
            {/* FAB Button - Only show when top bar is scrolled out of view */}
            <AnimatePresence>
                {showMobileFab && (
                    <motion.button
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={() => setMobileSheetOpen(true)}
                        className={cn(
                            "fixed bottom-12 left-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all",
                            activeFilterCount > 0
                                ? "bg-red-700 shadow-red-700/30"
                                : "bg-white shadow-white/20"
                        )}
                    >
                        <Filter className={cn(
                            "w-6 h-6",
                            activeFilterCount > 0 ? "text-zinc-900" : "text-zinc-900"
                        )} />
                        {activeFilterCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-zinc-900 rounded-full text-xs font-bold flex items-center justify-center">
                                {activeFilterCount}
                            </span>
                        )}
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Mobile Bottom Sheet */}
            <AnimatePresence>
                {mobileSheetOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                            onClick={() => setMobileSheetOpen(false)}
                        />

                        {/* Sheet */}
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-700 rounded-t-3xl z-50 max-h-[85vh] overflow-hidden flex flex-col"
                        >
                            {/* Handle */}
                            <div className="flex justify-center py-3">
                                <div className="w-12 h-1.5 bg-zinc-700 rounded-full" />
                            </div>

                            {/* Header */}
                            <div className="flex items-center justify-between px-6 pb-4 border-b border-zinc-800">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Filters</h3>
                                    <p className="text-sm text-zinc-500">{totalCount} items available</p>
                                </div>
                                <button
                                    onClick={() => setMobileSheetOpen(false)}
                                    className="p-2 rounded-full bg-zinc-800 text-zinc-400"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                                {/* Search */}
                                <div>
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 block">
                                        Search
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => onSearchChange(e.target.value)}
                                            placeholder="Search equipment..."
                                            className="w-full pl-12 pr-4 py-3.5 bg-zinc-800 border border-zinc-700 rounded-2xl text-base focus:outline-none focus:border-red-500 text-white placeholder-zinc-500"
                                        />
                                    </div>
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 block">
                                        Category
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <MobileCategoryButton
                                            label="All"
                                            icon={LayoutGrid}
                                            active={selectedCategory === null}
                                            onClick={() => onCategoryChange(null)}
                                        />
                                        {categories.map(cat => (
                                            <MobileCategoryButton
                                                key={cat.id}
                                                label={cat.name}
                                                icon={getCategoryIcon(cat.slug)}
                                                count={cat.productCount}
                                                active={selectedCategory === cat.slug}
                                                onClick={() => onCategoryChange(cat.slug)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Brands */}
                                {/* Dynamic Filters (Mobile) */}
                                {attributes && selectedAttributeFilters && onAttributeFilterChange && (
                                    <DynamicAttributeFilters
                                        attributes={attributes}
                                        selectedFilters={selectedAttributeFilters}
                                        onFilterChange={onAttributeFilterChange}
                                        onClearAll={activeFilterCount > 0 ? clearAllFilters : undefined}
                                        compact={true}
                                        availableOptions={availableOptions}
                                    />
                                )}
                            </div>

                            {/* Footer Actions */}
                            <div className="p-6 border-t border-zinc-800 bg-zinc-900 space-y-3">
                                <button
                                    onClick={() => setMobileSheetOpen(false)}
                                    className="w-full py-4 bg-red-700 text-white font-bold rounded-2xl text-lg"
                                >
                                    Show {totalCount} Results
                                </button>
                                {activeFilterCount > 0 && (
                                    <button
                                        onClick={clearAllFilters}
                                        className="w-full py-3 bg-zinc-800 text-zinc-300 font-medium rounded-2xl"
                                    >
                                        Clear All Filters
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </>
    )
}

// Desktop Category Pill
function CategoryPill({
    label,
    icon: Icon,
    count,
    active,
    onClick
}: {
    label: string
    icon: React.ElementType
    count?: number
    active: boolean
    onClick: () => void
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0 mx-1",
                active
                    ? "bg-red-700 text-white shadow-lg shadow-red-700/20"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            )}
        >
            <Icon className="w-4 h-4" />
            {label}
            {count !== undefined && (
                <span className={cn(
                    "px-1.5 py-0.5 rounded-full text-xs",
                    active ? "bg-zinc-900/30 text-zinc-900" : "bg-zinc-800 text-zinc-500"
                )}>
                    {count}
                </span>
            )}
        </button>
    )
}

// Mobile Category Button
function MobileCategoryButton({
    label,
    icon: Icon,
    count,
    active,
    onClick
}: {
    label: string
    icon: React.ElementType
    count?: number
    active: boolean
    onClick: () => void
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-2xl transition-all",
                active
                    ? "bg-red-700 text-white"
                    : "bg-zinc-800 text-zinc-300 border border-zinc-700"
            )}
        >
            <Icon className="w-6 h-6" />
            <span className="text-xs font-medium text-center leading-tight">{label}</span>
            {count !== undefined && (
                <span className={cn(
                    "text-[10px]",
                    active ? "text-zinc-900/70" : "text-zinc-500"
                )}>
                    {count}
                </span>
            )}
        </button>
    )
}
