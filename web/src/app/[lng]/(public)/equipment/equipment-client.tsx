/**
 * Equipment Catalog Client Component
 * 
 * Hybrid Filter System:
 * - Desktop: Top sticky bar with category pills + brand dropdown
 * - Mobile: FAB button + bottom sheet modal
 * 
 * No price filters - equipment rental catalog mode
 * 
 * Design Archetype: Dark Cinema / Luxury Editorial
 */
'use client'

import { Download } from 'lucide-react'
import { useState, useCallback, useTransition, useMemo, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Product, Category, Attribute } from '@/services'
import { ProductGrid, HybridFilterBar } from '@/components/catalog'
import { Pagination } from '@/components/ui/pagination'
import { useTranslation } from '@/app/i18n/client'

interface EquipmentCatalogClientProps {
  lng: string
  initialProducts: Product[]
  initialPagination: {
    page: number
    totalPages: number
    totalItems: number
  }
  categories: Category[]
  attributes: Attribute[]
  initialCategory: string | null
  initialSearch: string
}

export function EquipmentCatalogClient({
  lng,
  initialProducts,
  initialPagination,
  categories,
  attributes,
  initialCategory,
  initialSearch,
}: EquipmentCatalogClientProps) {
  const { t } = useTranslation(lng, 'catalog')
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Initialize attribute filters from URL
  const [selectedAttributeFilters, setSelectedAttributeFilters] = useState<Record<string, string[]>>(() => {
    const filters: Record<string, string[]> = {}
    searchParams.forEach((value, key) => {
      if (key.startsWith('spec_')) {
        const slug = key.replace('spec_', '')
        const values = searchParams.getAll(key)
        if (values.length > 0) {
          filters[slug] = values
        }
      }
    })
    return filters
  })

  // Update URL with filters
  const updateFilters = useCallback(
    (updates: { category?: string | null; search?: string; page?: number; specs?: Record<string, string[]> }) => {
      const params = new URLSearchParams(searchParams.toString())

      if (updates.category !== undefined) {
        if (updates.category) {
          params.set('category', updates.category)
        } else {
          params.delete('category')
        }
      }

      if (updates.search !== undefined) {
        if (updates.search) {
          params.set('search', updates.search)
        } else {
          params.delete('search')
        }
      }

      if (updates.page !== undefined) {
        if (updates.page > 1) {
          params.set('page', updates.page.toString())
        } else {
          params.delete('page')
        }
      }

      // Handle specs updates
      if (updates.specs) {
        Object.entries(updates.specs).forEach(([slug, values]) => {
          const paramKey = `spec_${slug}`
          params.delete(paramKey)
          values.forEach(v => params.append(paramKey, v))
        })
      }

      // If we are changing filters (not just page), reset to page 1
      if (updates.category !== undefined || updates.search !== undefined || updates.specs !== undefined) {
        params.set('page', '1')
        params.delete('page')
      }

      startTransition(() => {
        router.push(`/${lng}/equipment?${params.toString()}`, { scroll: false })
      })
    },
    [router, searchParams, lng]
  )

  // Handlers
  const handleCategoryChange = useCallback(
    (categorySlug: string | null) => {
      setSelectedCategory(categorySlug)
      updateFilters({ category: categorySlug, page: 1 })
    },
    [updateFilters]
  )

  // Debounced search - update local state immediately, debounce URL update
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleSearchChange = useCallback(
    (query: string) => {
      // Update local state immediately for responsive UI
      setSearchQuery(query)

      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }

      // Debounce URL update (300ms delay)
      searchTimeoutRef.current = setTimeout(() => {
        updateFilters({ search: query, page: 1 })
      }, 300)
    },
    [updateFilters]
  )

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  // Dynamic Attribute Handler (Updates URL now)
  const handleAttributeFilterChange = useCallback((slug: string, values: string[]) => {
    // Update local state for immediate feedback
    setSelectedAttributeFilters(prev => ({
      ...prev,
      [slug]: values
    }))

    // Update URL
    updateFilters({ specs: { [slug]: values } })
  }, [updateFilters])

  const handlePageChange = useCallback(
    (page: number) => {
      updateFilters({ page })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [updateFilters]
  )

  // Client-side filtering removed - Server is Source of Truth
  const filteredProducts = initialProducts

  const totalFilteredCount = filteredProducts.length

  // Filter attributes based on selected category
  const filteredAttributes = useMemo(() => {
    if (!attributes) return []

    // Find current category object to get its ID
    const currentCategoryObj = selectedCategory
      ? categories.find(c => c.slug === selectedCategory)
      : null

    return attributes.filter(attr => {
      // If NO category is selected (All Equipment), hide all attribute filters.
      // Filters only appear when a specific category is chosen.
      if (!currentCategoryObj) return false;

      // Strict Mode for specific category:
      // Only show attributes EXPLICITLY linked to the current category.
      if (!attr.categories || attr.categories.length === 0) return false

      // If a category is selected, show attributes linked to it
      if (attr.categories.includes(currentCategoryObj.id)) return true

      return false
    })
  }, [attributes, selectedCategory, categories])

  // No client-side option limiting for server-side filtering
  const availableOptions = undefined

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 to-zinc-950" />

        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <span className="inline-block px-4 py-1.5 bg-red-700/15 text-red-400 rounded-full text-sm font-medium mb-6">
              {t('professionalEquipment')}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {t('title')}
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
              {t('description')}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center"
            >
              <a
                href="/catalog.pdf"
                download
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full font-medium transition-all group border border-zinc-700 hover:border-zinc-500"
              >
                <Download className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                <span>{t('downloadCatalog')}</span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Hybrid Filter Bar */}
      <HybridFilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        totalCount={totalFilteredCount}
        onCategoryChange={handleCategoryChange}
        onSearchChange={handleSearchChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        t={t}
        // NEW: Dynamic Attributes
        attributes={filteredAttributes}
        selectedAttributeFilters={selectedAttributeFilters}
        onAttributeFilterChange={handleAttributeFilterChange}
        availableOptions={availableOptions}
      />

      {/* Results Section */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header - Desktop Only (mobile shows in HybridFilterBar) */}
          <div className="hidden md:flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <p className="text-sm text-zinc-500">
                <span className="text-white font-medium">{totalFilteredCount}</span> {t('pagination.results')}
                {selectedCategory && (
                  <span className="ml-1">
                    in <span className="text-red-400">{categories.find(c => c.slug === selectedCategory)?.name}</span>
                  </span>
                )}

              </p>

              {isPending && (
                <span className="text-sm text-zinc-500 flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-zinc-600 border-t-red-500 rounded-full animate-spin" />
                  Loading...
                </span>
              )}
            </div>

            {/* Sort Dropdown Removed */}
          </div>

          {/* Product Grid */}
          <ProductGrid
            products={filteredProducts}
            lng={lng}
            isLoading={isPending}
          />

          {/* Pagination */}
          {initialPagination.totalPages > 1 && (
            <div className="mt-12">
              <Pagination
                currentPage={initialPagination.page}
                totalPages={initialPagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
