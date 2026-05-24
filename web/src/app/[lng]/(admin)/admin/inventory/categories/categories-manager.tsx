'use client'

import { useState } from 'react'
import { createCategory, updateCategory, deleteCategory } from '@/lib/actions/admin-inventory'
import { Plus, Edit, Trash2, X, Check, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Category {
    id: string
    name: string
    slug: string
}

export function CategoriesManager({ initialCategories }: { initialCategories: Category[] }) {
    const router = useRouter()
    const [editingId, setEditingId] = useState<string | null>(null)
    const [isAdding, setIsAdding] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleAdd(formData: FormData) {
        setLoading(true)
        await createCategory(formData)
        setLoading(false)
        setIsAdding(false)
        // Router refresh is handled by server action revalidatePath, but extra refresh ensures client sync
        router.refresh()
    }

    async function handleUpdate(id: string, formData: FormData) {
        setLoading(true)
        await updateCategory(id, formData)
        setLoading(false)
        setEditingId(null)
        router.refresh()
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure? This will remove the category from all associated equipment.')) return
        setLoading(true)
        await deleteCategory(id)
        setLoading(false)
        router.refresh()
    }

    return (
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                <h2 className="font-semibold text-zinc-300">Category List</h2>
                <button
                    onClick={() => setIsAdding(true)}
                    disabled={isAdding}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors disabled:opacity-50"
                >
                    <Plus className="w-4 h-4" />
                    New Category
                </button>
            </div>

            <div className="divide-y divide-zinc-800">
                {/* Add Form */}
                {isAdding && (
                    <form action={handleAdd} className="p-4 bg-zinc-900/50 flex gap-4 items-center animate-in slide-in-from-top-2">
                        <input
                            name="name"
                            placeholder="Category Name"
                            className="flex-1 bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                            required
                        />
                        <input
                            name="slug" // optional
                            placeholder="Slug (optional)"
                            className="hidden md:block w-48 bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                        />
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="p-2 text-green-500 hover:bg-green-900/20 rounded disabled:opacity-50"
                            >
                                <Check className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="p-2 text-zinc-500 hover:bg-zinc-800 rounded"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                )}

                {/* List */}
                {initialCategories.map((cat) => (
                    <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-zinc-900/20 transition-colors">
                        {editingId === cat.id ? (
                            <form
                                action={(formData) => handleUpdate(cat.id, formData)}
                                className="flex-1 flex gap-4 items-center"
                            >
                                <input
                                    name="name"
                                    defaultValue={cat.name}
                                    className="flex-1 bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                                />
                                <input
                                    name="slug"
                                    defaultValue={cat.slug}
                                    className="hidden md:block w-48 bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-400 focus:outline-none focus:border-red-500"
                                />
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="p-2 text-green-500 hover:bg-green-900/20 rounded disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingId(null)}
                                        className="p-2 text-zinc-500 hover:bg-zinc-800 rounded"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div className="flex-1">
                                    <p className="font-medium text-white">{cat.name}</p>
                                    <p className="text-xs text-zinc-500 font-mono">{cat.slug}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditingId(cat.id)}
                                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat.id)}
                                        className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-900/20 rounded transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}

                {initialCategories.length === 0 && !isAdding && (
                    <div className="p-8 text-center text-zinc-500">
                        No categories found. Create one above.
                    </div>
                )}
            </div>
        </div>
    )
}
