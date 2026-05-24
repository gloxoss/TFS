import { getEquipmentCategories } from '@/lib/actions/admin-inventory'
import { CategoriesManager } from './categories-manager'
import { ChevronLeft, Layers } from 'lucide-react'
import Link from 'next/link'

export default async function CategoriesPage({ params }: { params: Promise<{ lng: string }> }) {
    const { lng } = await params
    const { categories } = await getEquipmentCategories()

    return (
        <div className="space-y-6 max-w-4xl mx-auto py-8 px-4">
            {/* Back Link */}
            <Link
                href={`/${lng}/admin/inventory`}
                className="inline-flex items-center text-sm text-zinc-500 hover:text-white transition-colors gap-1 mb-2"
            >
                <ChevronLeft className="w-4 h-4" />
                Back to Inventory
            </Link>

            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                    <Layers className="w-6 h-6 text-red-500" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Category Management</h1>
                    <p className="text-zinc-500">Define equipment categories and filters.</p>
                </div>
            </div>

            <CategoriesManager initialCategories={categories || []} />
        </div>
    )
}
