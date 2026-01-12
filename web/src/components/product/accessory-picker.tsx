'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus,
    Minus,
    Settings2,
    X,
    ChevronDown,
    Monitor,
    Mic,
    Video,
    Aperture,
    Battery,
    Box,
    Layers,
    Component,
    Zap,
    Disc
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================================
// TYPES & HELPER - Map Slot Names to Icons
// ============================================================================

export interface SlotSimple {
    slotName: string
    // Add other props if needed for display (like existing selections etc, but primarily name)
}

interface PickerProps {
    hiddenSlots: SlotSimple[]
    onAdd: (slotName: string) => void
}

const getIconForSlot = (name: string) => {
    const n = name.toLowerCase()
    if (n.includes('monitor')) return Monitor
    if (n.includes('audio') || n.includes('mic')) return Mic
    if (n.includes('video') || n.includes('transmitt')) return Video
    if (n.includes('matte')) return Box
    if (n.includes('filter')) return Aperture
    if (n.includes('focus')) return Layers
    if (n.includes('power') || n.includes('battery')) return Battery
    if (n.includes('media')) return Disc
    if (n.includes('cable')) return Zap
    return Component // Fallback
}

// ============================================================================
// VARIANT 1: CHIPS (Horizontal Scroll)
// ============================================================================
export function PickerChips({ hiddenSlots, onAdd }: PickerProps) {
    if (hiddenSlots.length === 0) return null

    return (
        <div className="w-full py-4">
            <p className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wider pl-1">Add Accessories:</p>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {hiddenSlots.map(slot => (
                    <button
                        key={slot.slotName}
                        onClick={() => onAdd(slot.slotName)}
                        className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full border border-dashed border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:text-white hover:border-zinc-500 hover:bg-zinc-800 transition-all text-sm"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        {slot.slotName}
                    </button>
                ))}
            </div>
        </div>
    )
}

// ============================================================================
// VARIANT 2: DROPDOWN (Compact)
// ============================================================================
export function PickerDropdown({ hiddenSlots, onAdd }: PickerProps) {
    if (hiddenSlots.length === 0) return null

    return (
        <div className="flex items-center justify-between py-4 border-t border-zinc-800/50 mt-4">
            <span className="text-sm text-zinc-500">Missing an option?</span>
            <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Accessory
                    <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                </button>

                <div className="absolute right-0 bottom-full mb-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    {hiddenSlots.map(slot => {
                        const Icon = getIconForSlot(slot.slotName)
                        return (
                            <button
                                key={slot.slotName}
                                onClick={() => onAdd(slot.slotName)}
                                className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
                            >
                                <Icon className="w-4 h-4 text-zinc-500" />
                                {slot.slotName}
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

// ============================================================================
// VARIANT 3: INLINE DASHED (Preferred)
// ============================================================================
export function PickerInline({ hiddenSlots, onAdd }: PickerProps) {
    const [isAdding, setIsAdding] = useState(false)
    if (hiddenSlots.length === 0) return null

    return (
        <div className="mt-6 mb-12">
            <div className="relative">
                {isAdding ? (
                    <div className="p-4 bg-zinc-900/50 border border-zinc-700 rounded-xl animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-white">Choose Category to Add</span>
                            <button onClick={() => setIsAdding(false)} className="hover:bg-zinc-800 p-1 rounded-full text-zinc-500"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {hiddenSlots.map(slot => {
                                const Icon = getIconForSlot(slot.slotName)
                                return (
                                    <button
                                        key={slot.slotName}
                                        onClick={() => { onAdd(slot.slotName); setIsAdding(false) }}
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800 text-left transition-colors border border-transparent hover:border-zinc-700"
                                    >
                                        <div className="p-2 bg-zinc-800 rounded text-zinc-400">
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm text-zinc-300 font-medium">{slot.slotName}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full h-16 border border-dashed border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900/60 hover:border-zinc-600 rounded-2xl flex items-center justify-center gap-3 text-zinc-500 hover:text-white transition-all font-medium text-sm group"
                    >
                        <div className="w-8 h-8 rounded-full border border-zinc-700 group-hover:border-zinc-500 flex items-center justify-center bg-zinc-800 group-hover:bg-zinc-700 transition-colors">
                            <Plus className="w-4 h-4" />
                        </div>
                        Add Another Accessory Section
                    </button>
                )}
            </div>
        </div>
    )
}

// ============================================================================
// VARIANT 4: SIDEBAR
// ============================================================================
export function PickerSidebar({ hiddenSlots, onAdd }: PickerProps) {
    const [isOpen, setIsOpen] = useState(false)
    if (hiddenSlots.length === 0) return null

    return (
        <>
            <div className="fixed bottom-24 right-6 z-30 md:static md:w-full md:mt-8 md:flex md:justify-center">
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full shadow-xl border border-zinc-700 transition-transform hover:scale-105 active:scale-95"
                >
                    <Settings2 className="w-4 h-4" />
                    Customize Kit ({hiddenSlots.length})
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[60] flex justify-end isolate">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            className="relative w-80 h-full bg-zinc-900 border-l border-zinc-800 p-6 shadow-2xl overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold text-white">Add Sections</h2>
                                <button onClick={() => setIsOpen(false)}><X className="w-5 h-5 text-zinc-400" /></button>
                            </div>

                            <div className="space-y-1">
                                {hiddenSlots.map(slot => {
                                    const Icon = getIconForSlot(slot.slotName)
                                    return (
                                        <button
                                            key={slot.slotName}
                                            onClick={() => { onAdd(slot.slotName) }}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-zinc-800 rounded-xl transition-colors text-left group"
                                        >
                                            <div className="w-8 h-8 rounded bg-zinc-800 group-hover:bg-zinc-700 text-zinc-400 group-hover:text-white flex items-center justify-center transition-colors">
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-medium text-zinc-200">{slot.slotName}</span>
                                            <Plus className="w-4 h-4 ml-auto text-zinc-600 group-hover:text-white" />
                                        </button>
                                    )
                                })}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}

// ============================================================================
// VARIANT 5: MINIMAL
// ============================================================================
export function PickerMinimal({ hiddenSlots, onAdd }: PickerProps) {
    if (hiddenSlots.length === 0) return null

    return (
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500 my-8 justify-center bg-zinc-900/30 p-4 rounded-full border border-zinc-800/50">
            <span className="font-medium text-zinc-700 uppercase tracking-widest text-xs self-center mr-2">Quick Add:</span>
            {hiddenSlots.map(slot => (
                <button
                    key={slot.slotName}
                    onClick={() => onAdd(slot.slotName)}
                    className="hover:text-white hover:underline decoration-zinc-500 underline-offset-4 transition-all"
                >
                    + {slot.slotName}
                </button>
            ))}
        </div>
    )
}
