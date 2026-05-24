/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Fix Broadcast Sections Corruption FINAL
 * 
 * Recursively detects and repairs byte array corruption.
 * Specifically handles "Unexpected token" errors caused by null bytes.
 */

migrate((app) => {
    console.log('[Fix Final] Starting repair check...')

    // Find broadcast service
    let broadcast = null
    try {
        const records = app.findRecordsByFilter("services", 'slug ~ "broadcast"', "", 1)
        if (records && records.length > 0) {
            broadcast = records[0]
        }
    } catch (e) {
        console.log('[Fix Final] Error finding broadcast service:', e.message)
        return
    }

    if (!broadcast) {
        console.log('[Fix Final] Broadcast service not found, skipping...')
        return
    }

    // Get current sections
    let sections = broadcast.get("sections")

    // Helper to decode bytes to string, filtering out nulls
    const decodeBytes = (arr) => {
        let str = ""
        // Use loop to avoid stack overflow on large arrays
        for (let i = 0; i < arr.length; i++) {
            // Filter null bytes (0)
            if (arr[i] !== 0) {
                str += String.fromCharCode(arr[i])
            }
        }
        return str
    }

    let isCorrupted = false

    // 1. Check if it's a byte array directly
    if (Array.isArray(sections) && sections.length > 0 && typeof sections[0] === 'number') {
        isCorrupted = true
    }
    // 2. Check if it's a string that MIGHT require parsing to see if it's an array
    else if (typeof sections === 'string') {
        try {
            const trimmed = sections.trim()
            if (trimmed.startsWith('[') && !trimmed.startsWith('[{')) {
                const parsed = JSON.parse(sections)
                if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'number') {
                    sections = parsed
                    isCorrupted = true
                }
            }
        } catch (e) { }
    }

    if (isCorrupted) {
        console.log('[Fix Final] ⚠️ Detected corruption! Attempting robust repair...')

        try {
            // Level 1: Decode bytes to string
            let decoded = decodeBytes(sections)
            // console.log('[Fix Final] Level 1 decode start:', decoded.substring(0, 50))

            // Heuristic for double encoding
            const trimmed = decoded.trim()
            if (trimmed.startsWith('[') && !trimmed.startsWith('[{') && !trimmed.startsWith('[\n') && !trimmed.startsWith('[\r')) {

                // Try to parse it as an array to verify
                try {
                    const level2 = JSON.parse(decoded)
                    if (Array.isArray(level2) && level2.length > 0 && typeof level2[0] === 'number') {
                        console.log('[Fix Final] ⚠️ Detected double encoding (Bytes of String of Array)!')
                        // Level 2: Decode bytes to string
                        decoded = decodeBytes(level2)
                        // console.log('[Fix Final] Level 2 decode start:', decoded.substring(0, 50))
                    }
                } catch (e) {
                    // Not a JSON array of numbers, keep level 1
                }
            }

            // Clean up the string to ensure valid JSON
            decoded = decoded.trim()
            // Fix trailing garbage
            const lastBrace = decoded.lastIndexOf(']')
            if (lastBrace !== -1 && lastBrace < decoded.length - 1) {
                console.log('[Fix Final] Trimming garbage after index ' + lastBrace)
                decoded = decoded.substring(0, lastBrace + 1)
            }

            // Parse final string
            console.log('[Fix Final] Parsing final string (length ' + decoded.length + ')...')
            const fixedSections = JSON.parse(decoded)

            if (Array.isArray(fixedSections)) {
                // Save back the clean object
                const clean = JSON.parse(JSON.stringify(fixedSections))
                broadcast.set("sections", clean)
                app.save(broadcast)
                console.log('[Fix Final] ✅ Successfully repaired sections! (Check DB to confirm)')
            } else {
                console.log('[Fix Final] ❌ Decoded result is not an array, skipping save.')
            }

        } catch (e) {
            console.log('[Fix Final] ❌ Repair failed:', e.message)
        }
    } else {
        console.log('[Fix Final] Sections appear valid, no repair needed.')
    }

}, (app) => {
    // No rollback
})
