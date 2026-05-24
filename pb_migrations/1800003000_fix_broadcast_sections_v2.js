/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Fix Broadcast Sections Corruption V2
 * 
 * recursively detects and repairs byte array corruption (including double encoding).
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
        console.log('[Fix V2] Error finding broadcast service:', e.message)
        return
    }

    if (!broadcast) {
        console.log('[Fix V2] Broadcast service not found, skipping...')
        return
    }

    // Get current sections
    let sections = broadcast.get("sections")

    // Helper to decode bytes to string
    const decodeBytes = (arr) => {
        let str = ""
        // Use loop to avoid stack overflow on large arrays
        for (let i = 0; i < arr.length; i++) {
            str += String.fromCharCode(arr[i])
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
        // It might be valid JSON string, or string representation of numeric array
        try {
            const parsed = JSON.parse(sections)
            if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'number') {
                sections = parsed
                isCorrupted = true
            }
        } catch (e) { }
    }

    if (isCorrupted) {
        console.log('[Fix V2] ⚠️ Detected corruption! Attempting recursive repair...')

        try {
            // Level 1: Decode bytes to string
            let decoded = decodeBytes(sections)
            console.log('[Fix V2] Level 1 decode start:', decoded.substring(0, 50))

            // Check if result is STILL a string representation of an array of numbers "[91, 13...]"
            // Valid JSON for sections should start with "[{" or "[\n" or "[\r"
            // If it starts with "[9" or "[1" etc, it's likely a byte array string representation
            if (decoded.trim().startsWith('[') && !decoded.trim().startsWith('[{') && !decoded.trim().startsWith('[\n') && !decoded.trim().startsWith('[\r')) {

                // Try to parse it as an array to verify
                try {
                    const level2 = JSON.parse(decoded)
                    if (Array.isArray(level2) && level2.length > 0 && typeof level2[0] === 'number') {
                        console.log('[Fix V2] ⚠️ Detected double encoding (Bytes of String of Array)!')
                        // Level 2: Decode bytes to string
                        decoded = decodeBytes(level2)
                        console.log('[Fix V2] Level 2 decode start:', decoded.substring(0, 50))
                    }
                } catch (e) {
                    // Not a JSON array of numbers, keep level 1
                }
            }

            // Now parse the final string to object
            const fixedSections = JSON.parse(decoded)

            if (Array.isArray(fixedSections)) {
                // Save back the clean object
                const clean = JSON.parse(JSON.stringify(fixedSections))
                broadcast.set("sections", clean)
                app.save(broadcast)
                console.log('[Fix V2] ✅ Successfully repaired sections!')
            } else {
                console.log('[Fix V2] ❌ Decoded result is not an array, skipping save.')
                console.log('[Fix V2] Result type:', typeof fixedSections)
            }

        } catch (e) {
            console.log('[Fix V2] ❌ Repair failed:', e.message)
        }
    } else {
        console.log('[Fix V2] Sections appear valid, no repair needed.')
    }

}, (app) => {
    // No rollback
})
