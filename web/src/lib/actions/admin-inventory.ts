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

/**
 * Helper to check if a FormData value is an uploaded file.
 * Works in Node.js (where File may not exist globally) by checking for Blob-like properties.
 */
function isFileUpload(value: unknown): value is Blob {
    return (
        typeof value === 'object' &&
        value !== null &&
        'size' in value &&
        typeof (value as any).size === 'number' &&
        (value as any).size > 0 &&
        'arrayBuffer' in value // Blob/File have arrayBuffer method
    )
}

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
    specs: Record<string, string> | null
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
        category: record.category || '',
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
        specs: parseSpecs(record.specs),
        created: record.created,
        updated: record.updated
    }
}

/**
 * Parse specs from various formats (string JSON, object, null)
 */
function parseSpecs(specsRaw: unknown): Record<string, string> | null {
    if (!specsRaw) return null
    if (typeof specsRaw === 'string') {
        try {
            return JSON.parse(specsRaw)
        } catch {
            return null
        }
    }
    if (typeof specsRaw === 'object') {
        return specsRaw as Record<string, string>
    }
    return null
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
        specs?: Record<string, string>
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
        // Dynamic specs filtering
        if (filters?.specs) {
            for (const [key, value] of Object.entries(filters.specs)) {
                if (value) {
                    // PocketBase JSON field filter syntax
                    filterParts.push(`specs.${key} = "${value}"`)
                }
            }
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
        if (isFileUpload(mainImage)) {
            data.append('image', mainImage)
        }

        // Gallery Images
        const galleryImages = formData.getAll('gallery_images')
        galleryImages.forEach(img => {
            if (isFileUpload(img)) {
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
        } else if (isFileUpload(mainImage)) {
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
            if (isFileUpload(img)) {
                data.append('images', img)
            }
        })

        // Handle Specs (JSON)
        const specsJson = formData.get('specs')
        if (specsJson !== null) {
            try {
                const specsObj = typeof specsJson === 'string' ? JSON.parse(specsJson) : specsJson
                const specsString = JSON.stringify(specsObj)
                data.append('specs', specsString)
                data.append('specs_en', specsString)
                data.append('specs_fr', specsString)
            } catch {
                // Invalid JSON, skip specs update
                console.warn('[AdminInventory] Invalid specs JSON, skipping')
            }
        }

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

/**
 * Create Category
 */
export async function createCategory(formData: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        const hasAccess = await verifyInventoryAccess()
        if (!hasAccess) return { success: false, error: 'Unauthorized' }

        const client = await createAdminClient()
        const name = formData.get('name') as string
        const slug = formData.get('slug') as string

        if (!name) return { success: false, error: 'Name is required' }

        await client.collection('categories').create({
            name,
            slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        })

        revalidatePath('/[lng]/admin/inventory/categories')
        revalidatePath('/[lng]/admin/inventory')
        return { success: true }
    } catch (error) {
        console.error('Error creating category:', error)
        return { success: false, error: 'Failed to create category' }
    }
}

/**
 * Delete Category
 */
export async function deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const canDelete = await canDeleteProducts()
        if (!canDelete) return { success: false, error: 'Unauthorized' }

        const client = await createAdminClient()
        await client.collection('categories').delete(id)

        revalidatePath('/[lng]/admin/inventory/categories')
        revalidatePath('/[lng]/admin/inventory')
        return { success: true }
    } catch (error) {
        console.error('Error deleting category:', error)
        return { success: false, error: 'Failed to delete category' }
    }
}

/**
 * Update Category
 */
export async function updateCategory(id: string, formData: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        const hasAccess = await verifyInventoryAccess()
        if (!hasAccess) return { success: false, error: 'Unauthorized' }

        const client = await createAdminClient()
        const name = formData.get('name') as string
        const slug = formData.get('slug') as string

        await client.collection('categories').update(id, {
            name,
            slug: slug || undefined
        })

        revalidatePath('/[lng]/admin/inventory/categories')
        revalidatePath('/[lng]/admin/inventory')
        return { success: true }
    } catch (error) {
        console.error('Error updating category:', error)
        return { success: false, error: 'Failed to update category' }
    }
}


/**
 * Get Attributes (optionally filtered by category)
 */
export async function getAttributes(categoryId?: string): Promise<{ success: boolean; attributes: any[]; error?: string }> {
    try {
        const hasAccess = await verifyInventoryAccess()
        if (!hasAccess) return { success: false, attributes: [], error: 'Unauthorized' }

        const client = await createAdminClient()

        // Build query options - filter by category if provided
        const options: { filter?: string; sort?: string } = { sort: 'name' }
        if (categoryId) {
            options.filter = `categories ~ "${categoryId}"`
        }

        const result = await client.collection('attributes').getFullList(options)

        const attributes = result.map(record => ({
            id: record.id,
            name: record.name || '',
            slug: record.slug || '',
            type: record.type || 'text',
            options: Array.isArray(record.options) ? record.options : [],
            categories: Array.isArray(record.categories) ? record.categories : [],
        }))

        return { success: true, attributes }
    } catch (error: any) {
        // Log detailed error info
        console.error('Error fetching attributes:', {
            message: error?.message,
            status: error?.status,
            response: error?.response,
            data: error?.data
        })
        return { success: false, attributes: [], error: error?.message || 'Failed to fetch attributes' }
    }
}

/**
 * Create Attribute
 */
export async function createAttribute(formData: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        const hasAccess = await verifyInventoryAccess()
        if (!hasAccess) return { success: false, error: 'Unauthorized' }

        const client = await createAdminClient()

        const name = formData.get('name') as string
        const slug = formData.get('slug') as string
        const type = formData.get('type') as string

        // Options (split by newline or comma)
        const optionsRaw = formData.get('options') as string
        let options: string[] = []
        if (optionsRaw) {
            options = optionsRaw.split('\n').map(s => s.trim()).filter(Boolean)
        }

        // Categories (multiple Select)
        const categories = formData.getAll('categories') as string[]

        await client.collection('attributes').create({
            name,
            slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            type,
            options,
            categories
        })

        revalidatePath('/[lng]/admin/inventory/attributes')
        return { success: true }
    } catch (error: any) {
        console.error('Error creating attribute:', {
            message: error?.message,
            status: error?.status,
            response: error?.response,
            data: error?.data
        })
        return { success: false, error: error?.response?.message || error?.message || 'Failed to create attribute' }
    }
}

/**
 * Update Attribute
 */
export async function updateAttribute(id: string, formData: FormData): Promise<{ success: boolean; error?: string }> {
    try {
        const hasAccess = await verifyInventoryAccess()
        if (!hasAccess) return { success: false, error: 'Unauthorized' }

        const client = await createAdminClient()

        const name = formData.get('name') as string
        const slug = formData.get('slug') as string
        const type = formData.get('type') as string

        const optionsRaw = formData.get('options') as string
        let options: string[] = []
        if (optionsRaw) {
            options = optionsRaw.split('\n').map(s => s.trim()).filter(Boolean)
        }

        const categories = formData.getAll('categories') as string[]

        // Build data object, only include fields that have values
        const data: Record<string, any> = { name, type }
        if (slug) data.slug = slug
        if (options.length > 0) data.options = options
        data.categories = categories // Can be empty array

        await client.collection('attributes').update(id, data)

        revalidatePath('/[lng]/admin/inventory/attributes')
        return { success: true }
    } catch (error: any) {
        console.error('Error updating attribute:', {
            message: error?.message,
            status: error?.status,
            response: error?.response,
            data: error?.data
        })
        return { success: false, error: error?.response?.message || error?.message || 'Failed to update attribute' }
    }
}

/**
 * Delete Attribute
 */
export async function deleteAttribute(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const hasAccess = await verifyInventoryAccess()
        if (!hasAccess) return { success: false, error: 'Unauthorized' }

        const client = await createAdminClient()
        await client.collection('attributes').delete(id)

        revalidatePath('/[lng]/admin/inventory/attributes')
        return { success: true }
    } catch (error) {
        console.error('Error deleting attribute:', error)
        return { success: false, error: 'Failed to delete attribute' }
    }
}

