'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus,
    Minus,
    Settings2,
    X,
    ChevronRight,
    ChevronDown,
    Monitor,
    Mic,
    Video,
    Aperture,
    Battery,
    Box,
    Layers
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================================
// MOCK DATA
// ============================================================================

const HIDDEN_CATEGORIES = [
    { id: 'mon', name: 'Monitor', icon: Monitor, description: 'On-camera & director monitors' },
    { id: 'vid', name: 'Wireless Video', icon: Video, description: 'Teradek & transmitters' },
    { id: 'aud', name: 'Audio', icon: Mic, description: 'Shotgun mics & recorders' },
    { id: 'mat', name: 'Matte Box', icon: Box, description: 'Light control & filtering' },
    { id: 'fil', name: 'Filters', icon: Aperture, description: 'NDs, diffusion, & polarizer' },
    { id: 'fol', name: 'Follow Focus', icon: Layers, description: 'Wireless & manual focus' },
]

// ============================================================================
// COMPONENTS
// ============================================================================

// 1. CHIPS / TAGS ROW
const DesignChips = () => {
    const [active, setActive] = useState<string[]>([])

    const toggle = (id: string) => {
        setActive(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
    }

    return (
        <div className="w-full">
            <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
                {HIDDEN_CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => toggle(cat.id)}
                        className={cn(
                            "flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all",
                            active.includes(cat.id)
                                ? "bg-amber-500/10 border-amber-500/50 text-amber-500"
                                : "bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                        )}
                    >
                        {active.includes(cat.id) ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        {cat.name}
                    </button>
                ))}
            </div>
            <div className="mt-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl min-h-[100px] flex items-center justify-center text-zinc-500 text-sm">
                {active.length === 0 ? "Select categories above" : `Active Slots: ${active.join(', ')}`}
            </div>
        </div>
    )
}

// 2. COMPACT DROPDOWN
const DesignDropdown = () => {
    const [active, setActive] = useState<string[]>([])
    const available = HIDDEN_CATEGORIES.filter(c => !active.includes(c.id))

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-zinc-400">Add Extra Components</h3>
                <div className="relative group">
                    <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 hover:bg-zinc-700 transition-colors">
                        <Plus className="w-4 h-4" />
                        Add Accessory
                        <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                    </button>

                    <div className="absolute right-0 top-full mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        {available.length === 0 ? (
                            <div className="p-3 text-xs text-zinc-500 text-center">All added</div>
                        ) : available.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActive(prev => [...prev, cat.id])}
                                className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
                            >
                                <cat.icon className="w-4 h-4 text-zinc-500" />
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                {active.map(id => {
                    const cat = HIDDEN_CATEGORIES.find(c => c.id === id)!
                    return (
                        <div key={id} className="flex items-center justify-between p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                            <div className="flex items-center gap-3">
                                <cat.icon className="w-4 h-4 text-amber-500" />
                                <span className="text-sm text-zinc-200">{cat.name}</span>
                            </div>
                            <button onClick={() => setActive(x => x.filter(i => i !== id))} className="text-zinc-500 hover:text-red-400">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )
                })}
                {active.length === 0 && <div className="text-center py-6 text-zinc-600 text-sm border border-dashed border-zinc-800 rounded-xl">No extras added</div>}
            </div>
        </div>
    )
}

// 3. INLINE DASHED PLACEHOLDER
const DesignInline = () => {
    const [active, setActive] = useState<string[]>([])
    const [isAdding, setIsAdding] = useState(false)

    const available = HIDDEN_CATEGORIES.filter(c => !active.includes(c.id))

    return (
        <div className="w-full space-y-4">
            {/* Active Slots */}
            {active.map(id => {
                const cat = HIDDEN_CATEGORIES.find(c => c.id === id)!
                return (
                    <div key={id} className="h-16 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center px-4 justify-between">
                        <span className="text-zinc-200 font-medium">{cat.name} Slot</span>
                        <button onClick={() => setActive(x => x.filter(i => i !== id))}><X className="w-4 h-4 text-zinc-500" /></button>
                    </div>
                )
            })}

            {/* Add Button */}
            {available.length > 0 && (
                <div className="relative">
                    {isAdding ? (
                        <div className="p-4 bg-zinc-900/50 border border-zinc-700 rounded-xl animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium text-white">Choose Category</span>
                                <button onClick={() => setIsAdding(false)}><X className="w-4 h-4 text-zinc-500" /></button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {available.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => { setActive(p => [...p, cat.id]); setIsAdding(false) }}
                                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800 text-left transition-colors"
                                    >
                                        <div className="p-1.5 bg-zinc-800 rounded text-zinc-400">
                                            <cat.icon className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="text-sm text-zinc-300">{cat.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="w-full h-12 border border-dashed border-zinc-700 hover:border-amber-500/50 hover:bg-zinc-900/50 rounded-xl flex items-center justify-center gap-2 text-zinc-500 hover:text-amber-500 transition-all font-medium text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Add Another Section
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

// 4. SIDEBAR / DRAWER TRIGGER
const DesignSidebar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [active, setActive] = useState<string[]>([])

    return (
        <div className="w-full">
            <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-4 rounded-xl mb-4">
                <div>
                    <h3 className="text-white font-medium">Kit Configuration</h3>
                    <p className="text-xs text-zinc-500">{active.length} extra sections visible</p>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-amber-600 hover:text-white rounded-lg text-sm text-zinc-300 transition-colors flex items-center gap-2"
                >
                    <Settings2 className="w-4 h-4" />
                    Customize
                </button>
            </div>

            {/* Mock Content */}
            <div className="border border-zinc-800/50 rounded-xl p-8 text-center text-zinc-600 bg-zinc-950">
                Main Kit Content Here...
                {active.map(id => (
                    <div key={id} className="mt-4 p-4 border border-zinc-800 bg-zinc-900 rounded-lg text-amber-500">
                        {HIDDEN_CATEGORIES.find(c => c.id === id)?.name} Section
                    </div>
                ))}
            </div>

            {/* Sidebar Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            className="relative w-80 h-full bg-zinc-900 border-l border-zinc-800 p-6 shadow-2xl overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold text-white">Customize</h2>
                                <button onClick={() => setIsOpen(false)}><X className="w-5 h-5 text-zinc-400" /></button>
                            </div>

                            <div className="space-y-1">
                                {HIDDEN_CATEGORIES.map(cat => {
                                    const isActive = active.includes(cat.id)
                                    return (
                                        <div key={cat.id} className="flex items-start gap-3 p-3 hover:bg-zinc-800/50 rounded-xl transition-colors cursor-pointer" onClick={() => setActive(p => isActive ? p.filter(x => x !== cat.id) : [...p, cat.id])}>
                                            <div className={cn("w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition-colors", isActive ? "bg-amber-500 border-amber-500" : "border-zinc-600")}>
                                                {isActive && <span className="text-black text-xs">✓</span>}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-zinc-200">{cat.name}</h4>
                                                <p className="text-xs text-zinc-500 mt-0.5">{cat.description}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

// 5. MINIMAL TEXT LINKS
const DesignMinimal = () => {
    const [active, setActive] = useState<string[]>([])
    const available = HIDDEN_CATEGORIES.filter(c => !active.includes(c.id))

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500 mb-6 justify-center bg-zinc-900/30 p-4 rounded-full border border-zinc-800/50">
                <span className="font-medium text-zinc-700 uppercase tracking-widest text-xs self-center mr-2">Quick Add:</span>
                {available.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActive(p => [...p, cat.id])}
                        className="hover:text-amber-500 hover:underline decoration-amber-500/50 underline-offset-4 transition-all"
                    >
                        + {cat.name}
                    </button>
                ))}
                {available.length === 0 && <span className="text-zinc-700 italic">No more options</span>}
            </div>
            <div className="space-y-4">
                {active.map(id => (
                    <div key={id} className="h-20 bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-400">
                        {HIDDEN_CATEGORIES.find(c => c.id === id)?.name} Content Area
                    </div>
                ))}
            </div>
        </div>
    )
}

// ============================================================================
// PAGE
// ============================================================================

export default function AccessoryPlaygroundPage() {
    return (
        <div className="min-h-screen bg-black text-white p-8 md:p-16 font-sans">
            <div className="max-w-3xl mx-auto space-y-16">

                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
                        UI Prototyping
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        Five alternative methods for adding hidden accessory slots.
                    </p>
                </div>

                {/* VARIANT 1 */}
                <section className="space-y-4">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">1</div>
                        <h2 className="text-xl font-semibold">Horizontal Chips</h2>
                    </div>
                    <p className="text-zinc-500 text-sm ml-12 mb-6">Best for quick toggling visibility without adding vertical height. Very common in mobile apps.</p>
                    <div className="ml-12 p-6 rounded-2xl border border-zinc-800 bg-zinc-950">
                        <DesignChips />
                    </div>
                </section>

                {/* VARIANT 2 */}
                <section className="space-y-4">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">2</div>
                        <h2 className="text-xl font-semibold">Compact Dropdown</h2>
                    </div>
                    <p className="text-zinc-500 text-sm ml-12 mb-6">Cleanest option. Keeps the interface very minimal until user specifically asks for more.</p>
                    <div className="ml-12 p-6 rounded-2xl border border-zinc-800 bg-zinc-950 overflow-visible">
                        <DesignDropdown />
                    </div>
                </section>

                {/* VARIANT 3 */}
                <section className="space-y-4">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center font-bold">3</div>
                        <h2 className="text-xl font-semibold">Inline Placeholder</h2>
                    </div>
                    <p className="text-zinc-500 text-sm ml-12 mb-6">Natural flow. The "Add" button sits exactly where the new item will appear.</p>
                    <div className="ml-12 p-6 rounded-2xl border border-zinc-800 bg-zinc-950">
                        <DesignInline />
                    </div>
                </section>

                {/* VARIANT 4 */}
                <section className="space-y-4">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">4</div>
                        <h2 className="text-xl font-semibold">Configuration Sidebar</h2>
                    </div>
                    <p className="text-zinc-500 text-sm ml-12 mb-6">Power user option. Allows managing the entire kit visibility from one focused menu.</p>
                    <div className="ml-12 p-6 rounded-2xl border border-zinc-800 bg-zinc-950 relative min-h-[300px]">
                        <DesignSidebar />
                    </div>
                </section>

                {/* VARIANT 5 */}
                <section className="space-y-4">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center font-bold">5</div>
                        <h2 className="text-xl font-semibold">Minimal Text Links</h2>
                    </div>
                    <p className="text-zinc-500 text-sm ml-12 mb-6">Subtle and text-based. Good if you want the options visible but visually recessive.</p>
                    <div className="ml-12 p-6 rounded-2xl border border-zinc-800 bg-zinc-950">
                        <DesignMinimal />
                    </div>
                </section>

            </div>
        </div>
    )
}
