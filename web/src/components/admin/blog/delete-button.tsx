'use client'

import { Trash2 } from 'lucide-react'

export function DeleteButton({ action }: { action: () => void }) {
    return (
        <form action={() => {
            if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
                action()
            }
        }}>
            <button
                type="submit"
                className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-900/20 transition-colors"
                title="Delete"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </form>
    )
}
