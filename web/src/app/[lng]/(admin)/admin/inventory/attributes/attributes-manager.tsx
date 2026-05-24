'use client'

import { useState } from 'react'
import { createAttribute, updateAttribute, deleteAttribute } from '@/lib/actions/admin-inventory'
import { Plus, Edit, Trash2, X, Check, Save, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Attribute {
    id: string
    name: string
    slug: string
    type: string
    options: string[]
    categories: string[] // IDs
    expand?: { categories?: { id: string, name: string }[] }
}

interface Category {
    id: string
    name: string
}

export function AttributesManager({ initialAttributes, categories }: { initialAttributes: Attribute[], categories: Category[] }) {
    const router = useRouter()
    const [editingId, setEditingId] = useState<string | null>(null)
    const [isAdding, setIsAdding] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleAdd(formData: FormData) {
        setLoading(true)
        await createAttribute(formData)
        setLoading(false)
        setIsAdding(false)
        router.refresh()
    }

    async function handleUpdate(id: string, formData: FormData) {
        setLoading(true)
        await updateAttribute(id, formData)
        setLoading(false)
        setEditingId(null)
        router.refresh()
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure?')) return
        setLoading(true)
        await deleteAttribute(id)
        setLoading(false)
        router.refresh()
    }

    return (
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                <h2 className="font-semibold text-zinc-300">Attribute Definitions</h2>
                <button
                    onClick={() => setIsAdding(true)}
                    disabled={isAdding}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors disabled:opacity-50"
                >
                    <Plus className="w-4 h-4" />
                    New Attribute
                </button>
            </div>

            <div className="divide-y divide-zinc-800">
                {/* Add Form */}
                {isAdding && (
                    <form action={handleAdd} className="p-4 bg-zinc-900/50 flex flex-col gap-4 animate-in slide-in-from-top-2 border-b border-zinc-800">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input name="name" placeholder="Name (e.g. Mount)" className="bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm text-white" required />
                            <input name="slug" placeholder="Slug (optional)" className="bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm text-white" />
                            <select name="type" className="bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm text-white">
                                <option value="text">Text</option>
                                <option value="select">Select Dropdown</option>
                                <option value="number">Number</option>
                                <option value="boolean">Boolean (Yes/No)</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <textarea name="options" placeholder="Options (one per line) - for Select type only" rows={3} className="bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm text-white resize-none" />
                            <div>
                                <label className="block text-xs text-zinc-500 mb-1">Applies to Categories (Hold Ctrl to select multiple)</label>
                                <select name="categories" multiple className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm text-white h-24">
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setIsAdding(false)} className="px-3 py-1.5 text-zinc-400 hover:text-white">Cancel</button>
                            <button type="submit" disabled={loading} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm">Save</button>
                        </div>
                    </form>
                )}

                {/* List */}
                {initialAttributes.map((attr) => (
                    <div key={attr.id} className="p-4 hover:bg-zinc-900/10 transition-colors">
                        {editingId === attr.id ? (
                            <form action={(fd) => handleUpdate(attr.id, fd)} className="flex flex-col gap-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input name="name" defaultValue={attr.name} className="bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm text-white" required />
                                    <input name="slug" defaultValue={attr.slug} className="bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm text-white" />
                                    <select name="type" defaultValue={attr.type} className="bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm text-white">
                                        <option value="text">Text</option>
                                        <option value="select">Select Dropdown</option>
                                        <option value="number">Number</option>
                                        <option value="boolean">Boolean</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <textarea name="options" defaultValue={attr.options?.join('\n')} rows={3} className="bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm text-white resize-none" />
                                    <select name="categories" multiple defaultValue={attr.categories} className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm text-white h-24">
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button type="button" onClick={() => setEditingId(null)} className="px-3 py-1.5 text-zinc-400">Cancel</button>
                                    <button type="submit" disabled={loading} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm">Update</button>
                                </div>
                            </form>
                        ) : (
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-white">{attr.name}</span>
                                        <span className="text-xs px-2 py-0.5 bg-zinc-800 rounded-full text-zinc-400 border border-zinc-700">{attr.type}</span>
                                        <span className="text-xs text-zinc-600 font-mono">{attr.slug}</span>
                                    </div>
                                    <div className="mt-1 text-xs text-zinc-500 flex gap-2 flex-wrap">
                                        {attr.categories?.length > 0 ?
                                            attr.categories.map(catId => {
                                                const cat = categories.find(c => c.id === catId)
                                                return cat ? (
                                                    <span key={catId} className="text-blue-400 bg-blue-900/20 px-1.5 py-0.5 rounded border border-blue-900/30">{cat.name}</span>
                                                ) : null
                                            })
                                            : <span className="text-zinc-600">All Categories</span>
                                        }
                                    </div>
                                    {attr.options && attr.options.length > 0 && (
                                        <p className="mt-1 text-xs text-zinc-500 truncate max-w-md">Options: {attr.options.join(', ')}</p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditingId(attr.id)} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded"><Edit className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(attr.id)} className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-900/20 rounded"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
