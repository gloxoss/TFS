'use client'

import { toggleEquipmentVisibility, deleteEquipment } from '@/lib/actions/admin-inventory'
import { Eye, EyeOff, Edit, Trash2, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export function CategoryFilter({ categories }: { categories: { id: string, name: string }[] }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const currentCategory = searchParams.get('category') || ''

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const cat = e.target.value
        const params = new URLSearchParams(searchParams.toString())
        if (cat) {
            params.set('category', cat)
        } else {
            params.delete('category')
        }
        params.set('page', '1')
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="relative">
            <select
                value={currentCategory}
                onChange={handleChange}
                className="w-full md:w-48 appearance-none pl-4 pr-10 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-red-900/50 cursor-pointer"
            >
                <option value="">All Categories</option>
                {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                        {c.name}
                    </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-zinc-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    )
}

export function EquipmentRow({
    item,
    lng
}: {
    item: {
        id: string
        nameEn: string
        category: string
        brand: string
        dailyRate: number
        stock: number
        visibility: boolean
        imageUrls: string[]
        availabilityStatus: string
    }
    lng: string
}) {
    const statusColors: Record<string, string> = {
        available: 'bg-green-900/20 text-green-500',
        rented: 'bg-yellow-900/20 text-yellow-500',
        maintenance: 'bg-red-900/20 text-red-500'
    }

    return (
        <tr className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
            <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                    {item.imageUrls[0] ? (
                        <img
                            src={item.imageUrls[0]}
                            alt={item.nameEn}
                            className="w-12 h-12 rounded-lg object-cover bg-zinc-800"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-zinc-600" />
                        </div>
                    )}
                    <div>
                        <Link
                            href={`/${lng}/admin/inventory/${item.id}`}
                            className="font-medium text-white hover:text-red-400 transition-colors"
                        >
                            {item.nameEn}
                        </Link>
                        <p className="text-xs text-zinc-500">{item.brand}</p>
                    </div>
                </div>
            </td>
            <td className="py-4 px-4">
                <span className="text-sm text-zinc-400 capitalize">{item.category}</span>
            </td>
            <td className="py-4 px-4">
                <span className="text-sm text-zinc-300">${item.dailyRate}/day</span>
            </td>
            <td className="py-4 px-4">
                <span className="text-sm text-zinc-400">{item.stock}</span>
            </td>
            <td className="py-4 px-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[item.availabilityStatus] || 'bg-zinc-800 text-zinc-400'}`}>
                    {item.availabilityStatus}
                </span>
            </td>
            <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                    <form action={async () => {
                        await toggleEquipmentVisibility(item.id)
                    }}>
                        <button
                            type="submit"
                            className={`p-2 rounded-lg transition-colors ${item.visibility
                                ? 'text-green-500 hover:bg-green-900/20'
                                : 'text-zinc-500 hover:bg-zinc-800'
                                }`}
                            title={item.visibility ? 'Visible' : 'Hidden'}
                        >
                            {item.visibility ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                    </form>
                    <Link
                        href={`/${lng}/admin/inventory/${item.id}`}
                        className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        title="Edit"
                    >
                        <Edit className="w-4 h-4" />
                    </Link>
                    <form action={async () => {
                        await deleteEquipment(item.id)
                    }}>
                        <button
                            type="submit"
                            className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-900/20 transition-colors"
                            title="Delete"
                            onClick={(e) => {
                                if (!confirm('Are you sure you want to delete this item?')) {
                                    e.preventDefault()
                                }
                            }}
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </td>
        </tr>
    )
}

interface Attribute {
    id: string
    name: string
    slug: string
    type: string
    options: string[]
}

export function AttributeFilters({ attributes }: { attributes: Attribute[] }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const handleChange = (slug: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set(`spec_${slug}`, value)
        } else {
            params.delete(`spec_${slug}`)
        }
        params.set('page', '1')
        router.push(`${pathname}?${params.toString()}`)
    }

    // Filter to only show attributes that have options (select type)
    const filterableAttrs = attributes.filter(a => a.type === 'select' && a.options && a.options.length > 0)

    if (filterableAttrs.length === 0) return null

    return (
        <>
            {filterableAttrs.map(attr => (
                <div key={attr.id} className="relative">
                    <select
                        value={searchParams.get(`spec_${attr.slug}`) || ''}
                        onChange={(e) => handleChange(attr.slug, e.target.value)}
                        className="w-full md:w-40 appearance-none pl-4 pr-10 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-red-900/50 cursor-pointer"
                    >
                        <option value="">{attr.name}</option>
                        {attr.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-zinc-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            ))}
        </>
    )
}
