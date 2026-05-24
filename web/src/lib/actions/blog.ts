'use server'

import { createServerClient, createAdminClient } from "@/lib/pocketbase/server"
import { revalidatePath } from "next/cache"
import { slugify } from "@/lib/utils/slugify"
import { PB_URL } from "@/lib/pocketbase/config"
import { createActionLogger } from "@/lib/logger"
import { verifyAdminAccess } from '@/services/auth/access-control'

const log = createActionLogger('Blog');

export type BlogActionResult = {
    success: boolean
    error?: string
    data?: any
}

/**
 * Create a new blog post (Admin only)
 * Supports bilingual content
 */
export async function createPost(formData: FormData): Promise<BlogActionResult> {
    try {
        // Verify admin access first
        const isAdmin = await verifyAdminAccess()
        if (!isAdmin) {
            return { success: false, error: "Unauthorized: Admin access required" }
        }

        const pb = await createAdminClient()

        // Basic validation
        const titleEn = formData.get('title_en') || formData.get('title')
        const titleFr = formData.get('title_fr') || titleEn

        if (!titleEn) {
            return { success: false, error: "English title is required" }
        }

        // Ensure slug exists
        let slug = formData.get('slug')?.toString()
        if (!slug) {
            slug = slugify(titleEn.toString())
        }

        // Construct clean data object with bilingual fields
        const data: Record<string, any> = {
            title_en: titleEn,
            title_fr: titleFr,
            slug,
            excerpt_en: formData.get('excerpt_en') || formData.get('excerpt') || '',
            excerpt_fr: formData.get('excerpt_fr') || formData.get('excerpt_en') || '',
            content_en: formData.get('content_en') || formData.get('content') || '',
            content_fr: formData.get('content_fr') || formData.get('content_en') || '',
            category: formData.get('category') || 'news',
            video_url: formData.get('video_url') || '',
            published: formData.get('published') === 'true',
            published_at: formData.get('published') === 'true' ? new Date().toISOString() : null,
        }

        // Handle cover image separately
        const coverImage = formData.get('cover_image')
        if (coverImage && coverImage instanceof File && coverImage.size > 0) {
            data.cover_image = coverImage
        }

        log.debug('Creating post', { hasImage: !!data.cover_image })

        // Create record
        const record = await pb.collection('posts').create(data)

        // Revalidate admin dashboard and blog pages
        revalidatePath('/', 'layout')

        return { success: true, data: record }

    } catch (error: any) {
        log.error('Error creating post', error)

        let errorMessage = "Failed to create post"
        if (error?.response?.data) {
            // Format detailed validation errors
            const details = Object.entries(error.response.data)
                .map(([key, val]: [string, any]) => `${key}: ${val.message}`)
                .join(', ')
            if (details) errorMessage += `: ${details}`
        } else if (error?.message) {
            errorMessage += `: ${error.message}`
        }

        return { success: false, error: errorMessage }
    }
}

/**
 * Update an existing blog post (Admin only)
 */
export async function updatePost(formData: FormData): Promise<BlogActionResult> {
    try {
        // Verify admin access first
        const isAdmin = await verifyAdminAccess()
        if (!isAdmin) {
            return { success: false, error: "Unauthorized: Admin access required" }
        }

        const pb = await createAdminClient()
        const id = formData.get('id')?.toString()

        if (!id) {
            return { success: false, error: 'Post ID is required' }
        }

        const data: Record<string, any> = {}

        // Only include fields that are present
        const title = formData.get('title')
        if (title) data.title_en = title
        if (formData.has('title_en')) data.title_en = formData.get('title_en')
        if (formData.has('title_fr')) data.title_fr = formData.get('title_fr')
        if (formData.has('slug')) data.slug = formData.get('slug')

        const excerpt = formData.get('excerpt')
        if (excerpt) data.excerpt_en = excerpt
        if (formData.has('excerpt_en')) data.excerpt_en = formData.get('excerpt_en')
        if (formData.has('excerpt_fr')) data.excerpt_fr = formData.get('excerpt_fr')

        const content = formData.get('content')
        if (content) data.content_en = content
        if (formData.has('content_en')) data.content_en = formData.get('content_en')
        if (formData.has('content_fr')) data.content_fr = formData.get('content_fr')

        if (formData.has('category')) data.category = formData.get('category')
        const videoUrl = formData.get('video_url')
        if (videoUrl !== null) data.video_url = videoUrl

        if (formData.has('published')) {
            data.published = formData.get('published') === 'true'
            if (data.published) data.published_at = new Date().toISOString()
        }

        // Handle cover image
        const coverImage = formData.get('cover_image')
        if (coverImage && coverImage instanceof File && coverImage.size > 0) {
            data.cover_image = coverImage
        }

        const record = await pb.collection('posts').update(id, data)

        revalidatePath('/', 'layout')

        return { success: true, data: record }

    } catch (error: any) {
        log.error('Error updating post', error)
        return { success: false, error: error?.message || "Failed to update post" }
    }
}

/**
 * Get a single blog post by ID
 */
export async function getPost(id: string): Promise<{
    success: boolean
    post?: {
        id: string
        title: string
        slug: string
        content: string
        excerpt: string
        published: boolean
        coverImageUrl: string | null
        videoUrl: string
        created: string
    }
    error?: string
}> {
    try {
        const pb = await createServerClient()

        const record = await pb.collection('posts').getOne(id)

        return {
            success: true,
            post: {
                id: record.id,
                title: record.title || record.title_en || '',
                slug: record.slug || '',
                content: record.content || record.content_en || '',
                excerpt: record.excerpt || record.excerpt_en || '',
                published: record.published || false,
                coverImageUrl: record.cover_image
                    ? `${PB_URL}/api/files/${record.collectionId}/${record.id}/${record.cover_image}`
                    : null,
                videoUrl: record.video_url || '',
                created: record.created
            }
        }
    } catch (error: any) {
        log.error('Error fetching post', error)
        return { success: false, error: error?.message || 'Post not found' }
    }
}



/**
 * Delete a blog post (Admin only)
 */
export async function deletePost(id: string): Promise<BlogActionResult> {
    try {
        // Verify admin access first
        const isAdmin = await verifyAdminAccess()
        if (!isAdmin) {
            return { success: false, error: "Unauthorized: Admin access required" }
        }

        const pb = await createAdminClient()
        await pb.collection('posts').delete(id)

        revalidatePath('/', 'layout')

        return { success: true }

    } catch (error: any) {
        log.error('Error deleting post', error)
        return { success: false, error: error?.message || "Failed to delete post" }
    }
}
