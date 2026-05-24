'use server'

import { createAdminClient } from "@/lib/pocketbase/server"
import { verifyAdminAccess } from '@/services/auth/access-control'


export interface UploadServiceFileResult {
    success: boolean
    url?: string
    filename?: string
    error?: string
}

/**
 * Upload a download file (PDF, doc, etc.) directly to a service record's
 * `download_files` field. Returns the constructed PocketBase file URL.
 *
 * Files are appended (not replaced) because PocketBase's file+ pattern
 * keeps existing files when you send a new FormData with the same field name.
 */
export async function uploadServiceFile(
    serviceId: string,
    formData: FormData
): Promise<UploadServiceFileResult> {
    try {
        // Verify admin access
        const isAdmin = await verifyAdminAccess()
        if (!isAdmin) {
            return { success: false, error: "Unauthorized: Admin access required" }
        }

        const file = formData.get('file') as File | null
        if (!file || !(file instanceof File)) {
            return { success: false, error: 'No file provided' }
        }

        const pb = await createAdminClient()

        // Fetch the current record to get existing files
        const currentRecord = await pb.collection('services').getOne(serviceId)
        const existingFiles: string[] = currentRecord.download_files || []

        // Build upload FormData with existing files preserved via "+" append syntax
        // PocketBase multi-file fields: sending `field_name` replaces all files,
        // sending `field_name+` appends to existing files (undocumented but stable)
        const uploadData = new FormData()
        uploadData.append('download_files+', file)

        const record = await pb.collection('services').update(serviceId, uploadData)

        // The new file should be the last one in the updated array
        const updatedFiles: string[] = record.download_files || []
        const newFilename = updatedFiles.find((f: string) => !existingFiles.includes(f))
            || updatedFiles[updatedFiles.length - 1]

        if (!newFilename) {
            return {
                success: false,
                error: 'File uploaded but filename not found in response'
            }
        }

        return {
            success: true,
            url: newFilename,
            filename: newFilename
        }
    } catch (error: unknown) {
        console.error('[uploadServiceFile] Error:', error)

        let errorMsg = 'Failed to upload file'
        if (error && typeof error === 'object' && 'response' in error) {
            const resp = (error as { response?: { data?: Record<string, { message?: string }> } }).response
            if (resp?.data) {
                const details = Object.entries(resp.data)
                    .map(([key, val]) => `${key}: ${typeof val === 'object' ? val?.message || JSON.stringify(val) : val}`)
                    .join(', ')
                errorMsg += `: ${details}`
            }
        } else if (error instanceof Error) {
            errorMsg += `: ${error.message}`
        }

        return { success: false, error: errorMsg }
    }
}

/**
 * Delete a specific file from a service record's `download_files` field.
 */
export async function deleteServiceFile(
    serviceId: string,
    filename: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const isAdmin = await verifyAdminAccess()
        if (!isAdmin) {
            return { success: false, error: "Unauthorized: Admin access required" }
        }

        const pb = await createAdminClient()

        // Use PocketBase's file removal: send `download_files-` with the filename
        const removeData = new FormData()
        removeData.append('download_files-', filename)

        await pb.collection('services').update(serviceId, removeData)

        return { success: true }
    } catch (error: unknown) {
        console.error('[deleteServiceFile] Error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete file'
        }
    }
}
