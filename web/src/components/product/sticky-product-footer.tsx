'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/app/i18n/client'

interface StickyProductFooterProps {
    isVisible: boolean
    productName: string
    selectedCount: number
    isAvailable: boolean
    isAdding: boolean
    onAdd: () => void
    lng: string
}

export function StickyProductFooter({
    isVisible,
    productName,
    selectedCount,
    isAvailable,
    isAdding,
    onAdd,
    lng
}: StickyProductFooterProps) {
    const { t } = useTranslation(lng, 'catalog')

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className="fixed bottom-28 left-4 right-4 z-40 mx-auto max-w-4xl"
                >
                    <div className="bg-zinc-900/90 backdrop-blur-lg border border-zinc-800 rounded-2xl shadow-2xl p-4 flex items-center justify-between gap-4">
                        {/* Info */}
                        <div className="hidden sm:block">
                            <h3 className="text-sm font-semibold text-white truncate max-w-[200px]">
                                {productName}
                            </h3>
                            <p className="text-xs text-zinc-400">
                                {selectedCount === 0
                                    ? t('detail.basePackage')
                                    : `${selectedCount} ${t('detail.selected')}`}
                            </p>
                        </div>

                        {/* Price/Context (Optional placeholder) */}
                        <div className="flex-1 sm:hidden">
                            <span className="text-xs text-zinc-400">{selectedCount} {t('detail.selected')}</span>
                        </div>

                        {/* Action */}
                        <button
                            onClick={onAdd}
                            disabled={!isAvailable || isAdding}
                            className={cn(
                                'px-6 py-2.5 flex items-center gap-2 rounded-xl font-semibold text-sm transition-all shadow-lg',
                                isAvailable
                                    ? 'bg-red-700 text-white hover:bg-red-600 hover:shadow-red-900/20'
                                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                            )}
                        >
                            {isAdding ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <ShoppingCart className="w-4 h-4" />
                                    {t('detail.addToQuote')}
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
