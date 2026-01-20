/**
 * Admin Edit Equipment Page
 * 
 * Form for editing existing equipment listings.
 */

'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Package, Image as ImageIcon, X, Trash2, Plus } from 'lucide-react'
import { getEquipmentById, updateEquipment, deleteEquipment, getEquipmentCategories } from '@/lib/actions/admin-inventory'
import { slugify } from '@/lib/utils/slugify'

export default function EditEquipmentPage({
    params
}: {
    params: Promise<{ lng: string; id: string }>
}) {
    const { lng, id } = use(params)
    const router = useRouter()

    // Form state
    const [nameEn, setNameEn] = useState('')
    const [nameFr, setNameFr] = useState('')
    const [slug, setSlug] = useState('')
    const [category, setCategory] = useState('')
    const [brand, setBrand] = useState('')
    const [descriptionEn, setDescriptionEn] = useState('')
    const [descriptionFr, setDescriptionFr] = useState('')
    const [dailyRate, setDailyRate] = useState('')
    const [stock, setStock] = useState('1')
    const [visibility, setVisibility] = useState(true)
    const [featured, setFeatured] = useState(false)
    const [availabilityStatus, setAvailabilityStatus] = useState('available')

    // Specifications State
    const [specs, setSpecs] = useState<Array<{ key: string; value: string }>>([])

    // Image State
    const [mainImage, setMainImage] = useState<{ url: string; filename: string } | null>(null)
    const [newMainImage, setNewMainImage] = useState<File | null>(null)
    const [newMainImagePreview, setNewMainImagePreview] = useState<string | null>(null)
    const [deleteMainImage, setDeleteMainImage] = useState(false)

    const [galleryImages, setGalleryImages] = useState<{ url: string; filename: string }[]>([])
    const [newGalleryImages, setNewGalleryImages] = useState<File[]>([])
    const [newGalleryImagePreviews, setNewGalleryImagePreviews] = useState<string[]>([])

    // Categories
    const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>([])

    // UI state
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [error, setError] = useState('')

    // Load equipment and categories
    useEffect(() => {
        async function load() {
            const [equipmentResult, categoriesResult] = await Promise.all([
                getEquipmentById(id),
                getEquipmentCategories()
            ])

            if (equipmentResult.success && equipmentResult.item) {
                const item = equipmentResult.item
                setNameEn(item.nameEn)
                setNameFr(item.nameFr)
                setSlug(item.slug)
                // Category will be set after categories load
                setBrand(item.brand)
                setDescriptionEn(item.descriptionEn)
                setDescriptionFr(item.descriptionFr)
                setDailyRate(String(item.dailyRate || ''))
                setStock(String(item.stock))
                setVisibility(item.visibility)
                setFeatured(item.featured)
                setAvailabilityStatus(item.availabilityStatus)

                // Specifications
                if (item.specs && typeof item.specs === 'object') {
                    const specsArray = Object.entries(item.specs).map(([key, value]) => ({
                        key,
                        value: String(value)
                    }))
                    setSpecs(specsArray)
                }

                // Main Image
                if (item.mainImage) {
                    setMainImage({ url: item.mainImage, filename: 'main-image' })
                }

                // Gallery Images
                // item.images contains filenames, item.galleryImages contains full URLs
                const mappedGallery = item.galleryImages.map((url, index) => ({
                    url,
                    filename: item.images[index] || ''
                })).filter(img => img.filename)

                setGalleryImages(mappedGallery)

                // Set category after we have the categories list
                if (categoriesResult.success && categoriesResult.categories.length > 0) {
                    // Find matching category by name (case-insensitive)
                    const matchedCat = categoriesResult.categories.find(
                        cat => cat.name.toLowerCase() === item.category?.toLowerCase() ||
                            cat.slug === item.category ||
                            cat.id === item.category
                    )
                    if (matchedCat) {
                        setCategory(matchedCat.name)
                    } else {
                        setCategory(item.category)
                    }
                } else {
                    setCategory(item.category)
                }
            } else {
                setError('Equipment not found')
            }

            if (categoriesResult.success) {
                setCategories(categoriesResult.categories)
            }

            setLoading(false)
        }
        load()
    }, [id])

    // Handle Main Image Upload
    const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setNewMainImage(file)
            setDeleteMainImage(false) // Reset delete flag if new image uploaded
            const reader = new FileReader()
            reader.onload = (e) => {
                setNewMainImagePreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    // Remove Main Image (Mark for deletion or clear new upload)
    const removeMainImage = () => {
        if (newMainImage) {
            setNewMainImage(null)
            setNewMainImagePreview(null)
        } else {
            setDeleteMainImage(true)
        }
    }

    // Handle Gallery Image Upload
    const handleGalleryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        setNewGalleryImages(prev => [...prev, ...files])

        files.forEach(file => {
            const reader = new FileReader()
            reader.onload = (e) => {
                setNewGalleryImagePreviews(prev => [...prev, e.target?.result as string])
            }
            reader.readAsDataURL(file)
        })
    }

    // Remove new gallery image
    const removeNewGalleryImage = (index: number) => {
        setNewGalleryImages(prev => prev.filter((_, i) => i !== index))
        setNewGalleryImagePreviews(prev => prev.filter((_, i) => i !== index))
    }

    // Remove existing gallery image
    const removeExistingGalleryImage = (index: number) => {
        setGalleryImages(prev => prev.filter((_, i) => i !== index))
    }

    // Submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSaving(true)

        try {
            const formData = new FormData()
            formData.append('name_en', nameEn)
            formData.append('name_fr', nameFr)
            formData.append('slug', slug)
            formData.append('category', category)
            formData.append('brand', brand)
            formData.append('description_en', descriptionEn)
            formData.append('description_fr', descriptionFr)
            formData.append('daily_rate', dailyRate)
            formData.append('stock', stock)
            formData.append('visibility', String(visibility))
            formData.append('featured', String(featured))
            formData.append('availability_status', availabilityStatus)

            // Specs Logic - convert array to object
            const specsObject: Record<string, string> = {}
            specs.forEach(spec => {
                if (spec.key.trim()) {
                    specsObject[spec.key.trim()] = spec.value
                }
            })
            formData.append('specs', JSON.stringify(specsObject))

            // Main Image Logic
            if (newMainImage) {
                formData.append('main_image', newMainImage)
            } else if (deleteMainImage) {
                formData.append('main_image', 'DELETE')
            }

            // Gallery Images Logic
            // 1. Existing images to keep
            galleryImages.forEach(img => {
                formData.append('gallery_images', img.filename)
            })

            // 2. New images to add
            newGalleryImages.forEach(img => {
                formData.append('gallery_images', img)
            })

            // 3. Flag if cleared (to ensure backend knows if list is empty)
            if (galleryImages.length === 0 && newGalleryImages.length === 0) {
                formData.append('gallery_images_cleared', 'true')
            }

            const result = await updateEquipment(id, formData)

            if (result.success) {
                router.push(`/${lng}/admin/inventory`)
            } else {
                setError(result.error || 'Failed to update equipment')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setSaving(false)
        }
    }

    // Delete equipment
    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this equipment? This action cannot be undone.')) {
            return
        }

        setDeleting(true)
        try {
            const result = await deleteEquipment(id)
            if (result.success) {
                router.push(`/${lng}/admin/inventory`)
            } else {
                setError(result.error || 'Failed to delete')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setDeleting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-zinc-500">Loading...</div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href={`/${lng}/admin/inventory`}
                        className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Package className="w-6 h-6 text-red-500" />
                            Edit Equipment
                        </h1>
                        <p className="text-zinc-500 text-sm">{nameEn}</p>
                    </div>
                </div>
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                    {deleting ? 'Deleting...' : 'Delete'}
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-900/20 border border-red-900/50 text-red-400 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-zinc-900/30 rounded-xl border border-zinc-800 p-6 space-y-4">
                    <h2 className="font-semibold text-white">Basic Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-zinc-400 mb-2">Name (English) *</label>
                            <input
                                type="text"
                                value={nameEn}
                                onChange={(e) => setNameEn(e.target.value)}
                                required
                                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-900/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-zinc-400 mb-2">Name (French)</label>
                            <input
                                type="text"
                                value={nameFr}
                                onChange={(e) => setNameFr(e.target.value)}
                                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-900/50"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-zinc-400 mb-2">URL Slug *</label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(slugify(e.target.value))}
                                required
                                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-900/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-zinc-400 mb-2">Brand</label>
                            <input
                                type="text"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-900/50"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-zinc-400 mb-2">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-900/50"
                            >
                                <option value="">Select a category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-zinc-400 mb-2">Availability Status</label>
                            <select
                                value={availabilityStatus}
                                onChange={(e) => setAvailabilityStatus(e.target.value)}
                                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-900/50"
                            >
                                <option value="available">Available</option>
                                <option value="rented">Rented</option>
                                <option value="maintenance">Maintenance</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-zinc-900/30 rounded-xl border border-zinc-800 p-6 space-y-4">
                    <h2 className="font-semibold text-white">Description</h2>

                    <div>
                        <label className="block text-sm text-zinc-400 mb-2">Description (English)</label>
                        <textarea
                            value={descriptionEn}
                            onChange={(e) => setDescriptionEn(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-900/50 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-zinc-400 mb-2">Description (French)</label>
                        <textarea
                            value={descriptionFr}
                            onChange={(e) => setDescriptionFr(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-900/50 resize-none"
                        />
                    </div>
                </div>

                {/* Specifications */}
                <div className="bg-zinc-900/30 rounded-xl border border-zinc-800 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-white">Specifications</h2>
                        <button
                            type="button"
                            onClick={() => setSpecs([...specs, { key: '', value: '' }])}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Spec
                        </button>
                    </div>
                    <p className="text-xs text-zinc-500">Add technical specifications like sensor_size, codec, max_fps, mount, etc.</p>

                    {specs.length === 0 ? (
                        <div className="text-center py-8 text-zinc-500 border border-dashed border-zinc-700 rounded-lg">
                            No specifications yet. Click "Add Spec" to add one.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {specs.map((spec, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={spec.key}
                                        onChange={(e) => {
                                            const newSpecs = [...specs]
                                            newSpecs[index].key = e.target.value.toLowerCase().replace(/\s+/g, '_')
                                            setSpecs(newSpecs)
                                        }}
                                        placeholder="Key (e.g. sensor_size)"
                                        className="w-1/3 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-red-900/50"
                                    />
                                    <span className="text-zinc-600">→</span>
                                    <input
                                        type="text"
                                        value={spec.value}
                                        onChange={(e) => {
                                            const newSpecs = [...specs]
                                            newSpecs[index].value = e.target.value
                                            setSpecs(newSpecs)
                                        }}
                                        placeholder="Value (e.g. 28.0 x 19.2mm)"
                                        className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-red-900/50"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setSpecs(specs.filter((_, i) => i !== index))}
                                        className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pricing & Stock */}
                <div className="bg-zinc-900/30 rounded-xl border border-zinc-800 p-6 space-y-4">
                    <h2 className="font-semibold text-white">Pricing & Stock</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-zinc-400 mb-2">Daily Rate ($)</label>
                            <input
                                type="number"
                                value={dailyRate}
                                onChange={(e) => setDailyRate(e.target.value)}
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-900/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-zinc-400 mb-2">Stock Quantity</label>
                            <input
                                type="number"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                min="0"
                                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-900/50"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={visibility}
                                onChange={(e) => setVisibility(e.target.checked)}
                                className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-red-500 focus:ring-red-500"
                            />
                            <span className="text-sm text-zinc-300">Visible to public</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={featured}
                                onChange={(e) => setFeatured(e.target.checked)}
                                className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-red-500 focus:ring-red-500"
                            />
                            <span className="text-sm text-zinc-300">Featured item</span>
                        </label>
                    </div>
                </div>

                {/* Main Image */}
                <div className="bg-zinc-900/30 rounded-xl border border-zinc-800 p-6 space-y-4">
                    <h2 className="font-semibold text-white">Main Image (Hero)</h2>
                    <p className="text-sm text-zinc-500">This image will be displayed on the listing card and as the main image on the detail page.</p>

                    <div className="flex items-start gap-6">
                        {/* Current Main Image */}
                        {!deleteMainImage && (newMainImagePreview || mainImage) ? (
                            <div className="relative group w-48 h-48">
                                <img
                                    src={newMainImagePreview || mainImage?.url}
                                    alt="Main"
                                    className="w-full h-full object-cover rounded-lg border border-zinc-700"
                                />
                                <button
                                    type="button"
                                    onClick={removeMainImage}
                                    className="absolute top-2 right-2 p-1 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                {newMainImagePreview && (
                                    <span className="absolute bottom-2 left-2 text-xs bg-green-600 px-2 py-0.5 rounded text-white">New</span>
                                )}
                            </div>
                        ) : (
                            <div className="w-48 h-48 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700 border-dashed">
                                <span className="text-zinc-500 text-sm">No Main Image</span>
                            </div>
                        )}

                        {/* Upload Button */}
                        <div className="flex-1">
                            <label className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg cursor-pointer transition-colors">
                                <ImageIcon className="w-4 h-4" />
                                <span>{mainImage || newMainImage ? 'Change Main Image' : 'Upload Main Image'}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleMainImageUpload}
                                    className="hidden"
                                />
                            </label>
                            {deleteMainImage && (
                                <p className="mt-2 text-sm text-red-400">Main image marked for deletion.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Gallery Images */}
                <div className="bg-zinc-900/30 rounded-xl border border-zinc-800 p-6 space-y-4">
                    <h2 className="font-semibold text-white">Gallery Images</h2>
                    <p className="text-sm text-zinc-500">Additional images for the product gallery.</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Existing images */}
                        {galleryImages.map((img, index) => (
                            <div key={`existing-${index}`} className="relative group">
                                <img
                                    src={img.url}
                                    alt={`Gallery ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeExistingGalleryImage(index)}
                                    className="absolute top-2 right-2 p-1 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}

                        {/* New image previews */}
                        {newGalleryImagePreviews.map((preview, index) => (
                            <div key={`new-${index}`} className="relative group">
                                <img
                                    src={preview}
                                    alt={`New ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg border-2 border-green-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeNewGalleryImage(index)}
                                    className="absolute top-2 right-2 p-1 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <span className="absolute bottom-2 left-2 text-xs bg-green-600 px-2 py-0.5 rounded text-white">New</span>
                            </div>
                        ))}

                        <label className="h-32 border-2 border-dashed border-zinc-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-red-900/50 transition-colors">
                            <ImageIcon className="w-8 h-8 text-zinc-600 mb-2" />
                            <span className="text-xs text-zinc-500">Add Images</span>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleGalleryImageUpload}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex items-center justify-end gap-4">
                    <Link
                        href={`/${lng}/admin/inventory`}
                        className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-900 text-white rounded-lg font-medium transition-colors"
                    >
                        {saving ? (
                            <span>Saving...</span>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
