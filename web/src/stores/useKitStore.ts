/**
 * Kit Store (Zustand)
 *
 * Global state management for kit configurations.
 * Persists user selections across navigation (Master Product -> Accessory -> Master Product).
 *
 * Features:
 * - Session-based persistence (productId is the key)
 * - Persists to localStorage so refresh doesn't wipe progress
 * - Supports partial kit updates
 */
'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// ============================================================================
// Types
// ============================================================================

/**
 * map slot_id -> array of selected product_ids
 */
export type KitSelections = Record<string, string[]>

/**
 * map slot_id -> { item_id -> { variant_key -> variant_value } }
 */
export type KitVariantSelections = Record<string, Record<string, Record<string, string>>>

export interface KitState {
    // Map parent_product_id -> { slot_id -> selected_ids[] }
    selections: Record<string, KitSelections>
    // Map parent_product_id -> { slot_id -> { item_id -> variants } }
    variantSelections: Record<string, KitVariantSelections>

    // Actions
    /**
     * Set entire selection map for a product (e.g., initial load)
     */
    setSelections: (productId: string, selections: KitSelections) => void

    /**
     * Update a single slot's selection for a product
     */
    updateSlotSelection: (productId: string, slotId: string, selectedIds: string[]) => void

    /**
     * Update a single item's variant selection within a slot
     */
    updateSlotVariantSelection: (productId: string, slotId: string, itemId: string, variants: Record<string, string>) => void

    /**
     * Clear selections for a specific product (e.g., after adding to cart)
     */
    clearSelections: (productId: string) => void

    /**
     * Get selections for a specific product
     */
    getSelections: (productId: string) => KitSelections | undefined
    getVariantSelections: (productId: string) => KitVariantSelections | undefined

    // View Preference
    viewPreference: 'grid' | 'list'
    setViewPreference: (mode: 'grid' | 'list') => void

    // Navigation Preference
    skipNavigationConfirm: boolean
    setSkipNavigationConfirm: (skip: boolean) => void
}

// ============================================================================
// Store
// ============================================================================

export const useKitStore = create<KitState>()(
    persist(
        (set, get) => ({
            selections: {},
            variantSelections: {},

            setSelections: (productId, selections) => {
                set((state) => ({
                    selections: {
                        ...state.selections,
                        [productId]: selections,
                    },
                }))
            },

            updateSlotSelection: (productId, slotId, selectedIds) => {
                set((state) => {
                    const currentSelections = state.selections[productId] || {}
                    return {
                        selections: {
                            ...state.selections,
                            [productId]: {
                                ...currentSelections,
                                [slotId]: selectedIds,
                            },
                        },
                    }
                })
            },

            updateSlotVariantSelection: (productId, slotId, itemId, variants) => {
                set((state) => {
                    const currentProduct = state.variantSelections[productId] || {}
                    const currentSlot = currentProduct[slotId] || {}

                    return {
                        variantSelections: {
                            ...state.variantSelections,
                            [productId]: {
                                ...currentProduct,
                                [slotId]: {
                                    ...currentSlot,
                                    [itemId]: variants
                                }
                            }
                        }
                    }
                })
            },

            clearSelections: (productId) => {
                set((state) => {
                    const newSelections = { ...state.selections }
                    delete newSelections[productId]
                    const newVariants = { ...state.variantSelections }
                    delete newVariants[productId]
                    return {
                        selections: newSelections,
                        variantSelections: newVariants
                    }
                })
            },

            // View Preference
            viewPreference: 'grid', // default
            setViewPreference: (mode) => set({ viewPreference: mode }),

            // Navigation Preference
            skipNavigationConfirm: false,
            setSkipNavigationConfirm: (skip) => set({ skipNavigationConfirm: skip }),

            getSelections: (productId) => {
                return get().selections[productId]
            },
            getVariantSelections: (productId) => {
                return get().variantSelections[productId]
            },
        }),
        {
            name: 'tfs-kit-persistence', // unique name for localStorage key
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                selections: state.selections,
                variantSelections: state.variantSelections,
                viewPreference: state.viewPreference,
                skipNavigationConfirm: state.skipNavigationConfirm
            }), // explicit allowlist
        }
    )
)

export default useKitStore
