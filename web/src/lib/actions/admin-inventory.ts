'use server'

/**
 * Admin Inventory (Equipment) Server Actions
 * 
 * CRUD operations for equipment management.
 * Products managers and admins can access inventory operations.
 */

import { verifyAdminAccess, verifyInventoryAccess, canDeleteProducts } from '@/services/auth/access-control'
import { createServerClient, createAdminClient } from '@/lib/pocketbase/server'
import { revalidatePath } from 'next/cache'
import { PB_URL } from '@/lib/pocketbase/config'

export interface EquipmentItem {
    id: string
    name: string
    nameEn: string
    nameFr: string
    slug: string
    category: string
    brand: string
    descriptionEn: string
    descriptionFr: string
    dailyRate: number
    stock: number
    mainImage: string | null
    galleryImages: string[]
    // Deprecated but kept for compatibility if needed, though we should rely on the above
    images: string[]
    imageUrls: string[]
    visibility: boolean
    featured: boolean
    availabilityStatus: 'available' | 'rented' | 'maintenance'
    created: string
    updated: string
}

export interface EquipmentListResponse {
    success: boolean
    items: EquipmentItem[]
    totalItems: number
    totalPages: number
    page: number
    error?: string
}

/**
 * Transform PocketBase record to EquipmentItem
 */
function transformEquipment(record: Record<string, any>, baseUrl: string): EquipmentItem {
    // 'image' is the single main image
    const mainImage = record.image ? `${baseUrl}/api/files/${record.collectionId}/${record.id}/${record.image}` : null

    // 'images' is the array of gallery images
    const galleryImagesArray = Array.isArray(record.images) ? record.images : []
    const galleryImages = galleryImagesArray.map((img: string) =>
        `${baseUrl}/api/files/${record.collectionId}/${record.id}/${img}`
    )

    // Combined for backward compatibility or list views that just want "an image"
    const allImages = mainImage ? [mainImage, ...galleryImages] : galleryImages

    return {
        id: record.id,
        name: record.name || record.name_en || '',
        nameEn: record.name_en || record.name || '',
        nameFr: record.name_fr || '',
        slug: record.slug || '',
        category: record.expand?.category?.name || record.expand?.category?.name_en || record.category || '',
        brand: record.brand || '',
        descriptionEn: record.description_en || '',
        descriptionFr: record.description_fr || '',
        dailyRate: record.daily_rate || 0,
        stock: record.stock || 0,
        mainImage,
        galleryImages,
        images: galleryImagesArray, // Raw filenames of gallery
        imageUrls: allImages,
        visibility: record.visibility ?? true,
        featured: record.featured || false,
        availabilityStatus: record.availability_status || 'available',
        created: record.created,
        updated: record.updated
    }
}

/**
 * Get paginated equipment list
 */
export async function getEquipmentList(
    page: number = 1,
    limit: number = 20,
    filters?: {
        category?: string
        visibility?: boolean
        search?: string
    }
): Promise<EquipmentListResponse> {
    try {
        const hasAccess = await verifyInventoryAccess()
        if (!hasAccess) {
            return { success: false, items: [], totalItems: 0, totalPages: 0, page, error: 'Unauthorized' }
        }

        const client = await createAdminClient()

        const filterParts: string[] = []
        if (filters?.category) {
            filterParts.push(`category = "${filters.category}"`)
        }
        if (filters?.visibility !== undefined) {
            filterParts.push(`visibility = ${filters.visibility}`)
        }
        if (filters?.search) {
            filterParts.push(`(name_en ~ "${filters.search}" || name_fr ~ "${filters.search}" || brand ~ "${filters.search}")`)
        }

        const filter = filterParts.length > 0 ? filterParts.join(' && ') : undefined

        const result = await client.collection('equipment').getList(page, limit, {
            filter,
            expand: 'category' // Expand category relation to get name
        })

        const items = result.items.map(item => transformEquipment(item, PB_URL))

        return {
            success: true,
            items,
            totalItems: result.totalItems,
            totalPages: result.totalPages,
            page: result.page
        }
    } catch (error) {
        console.error('[AdminInventory] Error fetching equipment:', error)
        return {
            success: false,
            items: [],
            totalItems: 0,
            totalPages: 0,
            page,
            error: error instanceof Error ? error.message : 'Failed to fetch equipment'
        }
    }
}

/**
 * Get single equipment by ID
 */
export async function getEquipmentById(id: string): Promise<{
    success: boolean
    item: EquipmentItem | null
    error?: string
}> {
    try {
        const hasAccess = await verifyInventoryAccess()
        if (!hasAccess) {
            return { success: false, item: null, error: 'Unauthorized' }
        }

        const client = await createAdminClient()
        const record = await client.collection('equipment').getOne(id, {
            expand: 'category'
        })

        return {
            success: true,
            item: transformEquipment(record, PB_URL)
        }
    } catch (error) {
        console.error('[AdminInventory] Error fetching equipment:', error)
        return {
            success: false,
            item: null,
            error: error instanceof Error ? error.message : 'Equipment not found'
        }
    }
}

/**
 * Create new equipment
 */
export async function createEquipment(formData: FormData): Promise<{
    success: boolean
    id?: string
    error?: string
}> {
    try {
        const hasAccess = await verifyInventoryAccess()
        if (!hasAccess) {
            return { success: false, error: 'Unauthorized' }
        }

        const client = await createAdminClient()
        const data = new FormData()

        // Text fields
        const textFields = ['name_en', 'name_fr', 'slug', 'brand', 'description_en', 'description_fr', 'availability_status']
        textFields.forEach(field => {
            const value = formData.get(field)
            if (value) data.append(field, value as string)
        })

        // Category
        let category = formData.get('category') as string
        if (category && category.length !== 15) {
            try {
                const catRecord = await client.collection('categories').getFirstListItem(`slug="${category}" || name="${category}"`)
                category = catRecord.id
            } catch (e) {
                console.error('Failed to resolve category', e)
            }
        }
        if (category) data.append('category', category)

        // Numbers & Booleans
        data.append('daily_rate', (formData.get('daily_rate') || '1').toString())
        data.append('stock', (formData.get('stock') || '1').toString())
        data.append('stock_available', (formData.get('stock') || '1').toString()) // Init available stock
        data.append('visibility', (formData.get('visibility') || 'true').toString())
        data.append('featured', (formData.get('featured') || 'false').toString())

        // Main Image
        const mainImage = formData.get('main_image')
        if (mainImage instanceof File && mainImage.size > 0) {
            data.append('image', mainImage)
        }

        // Gallery Images
        const galleryImages = formData.getAll('gallery_images')
        galleryImages.forEach(img => {
            if (img instanceof File && img.size > 0) {
                data.append('images', img)
            }
        })

        const record = await client.collection('equipment').create(data)

        revalidatePath('/[lng]/admin/inventory')
        revalidatePath('/[lng]/equipment')

        return { success: true, id: record.id }
    } catch (error) {
        console.error('[AdminInventory] Error creating equipment:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create equipment'
        }
    }
}

/**
 * Update equipment
 */
export async function updateEquipment(id: string, formData: FormData): Promise<{
    success: boolean
    error?: string
}> {
    try {
        const hasAccess = await verifyInventoryAccess()
        if (!hasAccess) {
            return { success: false, error: 'Unauthorized' }
        }

        const client = await createAdminClient()
        const data = new FormData()

        // Fields to update
        const fields = ['name_en', 'name_fr', 'slug', 'category', 'brand',
            'description_en', 'description_fr', 'daily_rate',
            'stock', 'visibility', 'featured', 'availability_status']

        fields.forEach(async field => {
            // Skip category here, we handle it separately
            if (field === 'category') return

            const value = formData.get(field)
            if (value !== null) {
                data.append(field, value as string)
            }
        })

        // Handle Category specifically
        let category = formData.get('category') as string
        if (category) {
            try {
                // If it looks like a slug (not length 15 record ID), try to find it
                if (category.length !== 15) {
                    const catRecord = await client.collection('categories').getFirstListItem(`slug="${category}" || name="${category}"`)
                    category = catRecord.id
                }
            } catch (err) {
                console.error('[AdminInventory] Failed to resolve category slug:', err)
                // If we can't resolve it, we probably shouldn't send it, or PB will error.
                // But let's try sending it anyway or maybe just don't append if failed?
                // If we don't append, it won't update, which is better than crashing.
            }
            data.append('category', category)
        }

        // Handle Main Image
        const mainImage = formData.get('main_image')
        if (mainImage === 'DELETE') {
            data.append('image', '') // PocketBase: empty string deletes file
        } else if (mainImage instanceof File && mainImage.size > 0) {
            data.append('image', mainImage)
        }

        // Handle Gallery Images
        // 1. Get current record to compare images
        const currentRecord = await client.collection('equipment').getOne(id)
        const currentImages = Array.isArray(currentRecord.images) ? currentRecord.images : []

        // 2. Identify images to keep (passed as strings from frontend)
        const galleryImages = formData.getAll('gallery_images')
        const keptImages = galleryImages.filter(img => typeof img === 'string') as string[]

        // 3. Identify images to delete
        const imagesToDelete = currentImages.filter((img: string) => !keptImages.includes(img))

        // 4. Perform deletion if needed
        if (imagesToDelete.length > 0) {
            // We use a separate update call with the 'images-' modifier to remove specific files
            await client.collection('equipment').update(id, {
                'images-': imagesToDelete
            })
        }

        // 5. Add NEW images to FormData (to be appended)
        galleryImages.forEach(img => {
            if (img instanceof File && img.size > 0) {
                data.append('images', img)
            }
        })

        await client.collection('equipment').update(id, data)

        revalidatePath('/[lng]/admin/inventory')
        revalidatePath(`/[lng]/admin/inventory/${id}`)
        revalidatePath('/[lng]/equipment')

        return { success: true }
    } catch (error) {
        console.error('[AdminInventory] Error updating equipment:', error)
        // Log detailed error if available (PocketBase ClientResponseError)
        if (typeof error === 'object' && error !== null && 'data' in error) {
            console.error('[AdminInventory] Detailed PB Error:', JSON.stringify((error as any).data, null, 2))
        }
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update equipment'
        }
    }
}

/**
 * Delete equipment
 */
export async function deleteEquipment(id: string): Promise<{
    success: boolean
    error?: string
}> {
    try {
        const canDelete = await canDeleteProducts()
        if (!canDelete) {
            return { success: false, error: 'Delete permission denied. Only admins can delete products.' }
        }

        const client = await createAdminClient()
        await client.collection('equipment').delete(id)

        revalidatePath('/[lng]/admin/inventory')
        revalidatePath('/[lng]/equipment')

        return { success: true }
    } catch (error) {
        console.error('[AdminInventory] Error deleting equipment:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete equipment'
        }
    }
}

/**
 * Toggle equipment visibility
 */
export async function toggleEquipmentVisibility(id: string): Promise<{
    success: boolean
    newVisibility?: boolean
    error?: string
}> {
    try {
        const hasAccess = await verifyInventoryAccess()
        if (!hasAccess) {
            return { success: false, error: 'Unauthorized' }
        }

        const client = await createAdminClient()
        const current = await client.collection('equipment').getOne(id)
        const newVisibility = !current.visibility

        await client.collection('equipment').update(id, { visibility: newVisibility })

        revalidatePath('/[lng]/admin/inventory')
        revalidatePath('/[lng]/equipment')

        return { success: true, newVisibility }
    } catch (error) {
        console.error('[AdminInventory] Error toggling visibility:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to toggle visibility'
        }
    }
}

/**
 * Get equipment categories for dropdown
 */
export async function getEquipmentCategories(): Promise<{
    success: boolean
    categories: Array<{ id: string; name: string; slug: string }>
    error?: string
}> {
    try {
        const hasAccess = await verifyInventoryAccess()
        if (!hasAccess) {
            return { success: false, categories: [], error: 'Unauthorized' }
        }

        const client = await createAdminClient()
        const result = await client.collection('categories').getFullList({
            sort: 'name'
        })

        const categories = result.map(cat => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug
        }))

        return { success: true, categories }
    } catch (error) {
        console.error('[AdminInventory] Error fetching categories:', error)
        return {
            success: false,
            categories: [],
            error: error instanceof Error ? error.message : 'Failed to fetch categories'
        }
    }
}
