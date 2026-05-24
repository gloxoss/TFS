/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Fix Broadcast Sections Corruption V3
 * 
 * Recursively detects and repairs byte array corruption (including double encoding).
 * Handles null bytes and trailing garbage.
 */

migrate((app) => {
    // Find broadcast service
    let broadcast = null
    try {
        const records = app.findRecordsByFilter("services", 'slug ~ "broadcast"', "", 1)
        if (records && records.length > 0) {
            broadcast = records[0]
        }
    } catch (e) {
        console.log('[Fix V3] Error finding broadcast service:', e.message)
        return
    }

    if (!broadcast) {
        console.log('[Fix V3] Broadcast service not found, skipping...')
        return
    }

    // Get current sections
    let sections = broadcast.get("sections")

    // Helper to decode bytes to string, filtering out nulls
    const decodeBytes = (arr) => {
        let str = ""
        // Use loop to avoid stack overflow on large arrays
        for (let i = 0; i < arr.length; i++) {
            // Filter null bytes (0) and other non-printable control chars if needed
            // But usually just 0 is the issue with fixed-size buffers
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
            // If it looks like a JSON array
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
        console.log('[Fix V3] ⚠️ Detected corruption! Attempting robust repair...')

        try {
            // Level 1: Decode bytes to string
            let decoded = decodeBytes(sections)
            console.log('[Fix V3] Level 1 decode start:', decoded.substring(0, 50))

            // Heuristic for double encoding: Result looks like "[91, 13...]"
            const trimmed = decoded.trim()
            if (trimmed.startsWith('[') && !trimmed.startsWith('[{') && !trimmed.startsWith('[\n') && !trimmed.startsWith('[\r')) {

                // Try to parse it as an array to verify
                try {
                    const level2 = JSON.parse(decoded)
                    if (Array.isArray(level2) && level2.length > 0 && typeof level2[0] === 'number') {
                        console.log('[Fix V3] ⚠️ Detected double encoding (Bytes of String of Array)!')
                        // Level 2: Decode bytes to string
                        decoded = decodeBytes(level2)
                        console.log('[Fix V3] Level 2 decode start:', decoded.substring(0, 50))
                    }
                } catch (e) {
                    // Not a JSON array of numbers, keep level 1
                }
            }

            // Clean up the string to ensure valid JSON
            decoded = decoded.trim()
            // Fix common issue: trailing nulls or junk after valid JSON
            // Find last ']'
            const lastBrace = decoded.lastIndexOf(']')
            if (lastBrace !== -1 && lastBrace < decoded.length - 1) {
                console.log('[Fix V3] Trimming trailing garbage after index ' + lastBrace)
                decoded = decoded.substring(0, lastBrace + 1)
            }

            // Now parse the final string to object
            console.log('[Fix V3] Parsing final string (length ' + decoded.length + ')...')
            const fixedSections = JSON.parse(decoded)

            if (Array.isArray(fixedSections)) {
                // Save back the clean object
                const clean = JSON.parse(JSON.stringify(fixedSections))
                broadcast.set("sections", clean)
                app.save(broadcast)
                console.log('[Fix V3] ✅ Successfully repaired sections!')
            } else {
                console.log('[Fix V3] ❌ Decoded result is not an array, skipping save.')
                // console.log('[Fix V3] Value:', JSON.stringify(fixedSections))
            }

        } catch (e) {
            console.log('[Fix V3] ❌ Repair failed:', e.message)
        }
    } else {
        console.log('[Fix V3] Sections appear valid, no repair needed.')
    }

}, (app) => {
    // No rollback
})
