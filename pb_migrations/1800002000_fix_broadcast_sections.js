/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Fix Broadcast Sections Corruption
 * 
 * Detects if 'sections' field is corrupted (byte array from JSON.stringify)
 * and repairs it by decoding and saving as proper JSON.
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
        console.log('[Migration Fix] Error finding broadcast service:', e.message)
        return
    }

    if (!broadcast) {
        console.log('[Migration Fix] Broadcast service not found, skipping...')
        return
    }

    // Get current sections
    let sections = broadcast.get("sections")

    // Check if it looks like a byte array (array of numbers starting with 91 '[')
    let isCorrupted = false
    if (Array.isArray(sections) && sections.length > 0 && typeof sections[0] === 'number') {
        // Double check first byte is '[' (91)
        if (sections[0] === 91) {
            isCorrupted = true
        }
    } else if (typeof sections === 'string') {
        // It might be a string representation of the byte array?
        // No, verify if it is valid JSON or not
        try {
            const parsed = JSON.parse(sections)
            if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'number' && parsed[0] === 91) {
                sections = parsed
                isCorrupted = true
            }
        } catch (e) { }
    }

    // Repair if needed
    if (isCorrupted) {
        console.log('[Migration Fix] ⚠️ Detected byte array corruption! Repairing...')
        try {
            // Convert bytes to string
            // In Goja (JSVM), String.fromCharCode might have limits, but let's try
            // or use a loop if needed.
            let jsonString = ""
            // Simple robust way for small-ish arrays
            for (let i = 0; i < sections.length; i++) {
                jsonString += String.fromCharCode(sections[i])
            }

            console.log('[Migration Fix] Decoded string (start):', jsonString.substring(0, 50))

            const fixedSections = JSON.parse(jsonString)

            if (Array.isArray(fixedSections)) {
                // Save back the clean object
                // We use JSON.parse(JSON.stringify()) to be super safe against Go wrappers
                const clean = JSON.parse(JSON.stringify(fixedSections))
                broadcast.set("sections", clean)
                app.save(broadcast)
                console.log('[Migration Fix] ✅ Successfully repaired sections!')
            } else {
                console.log('[Migration Fix] ❌ Decoded JSON is not an array, skipping save.')
            }
        } catch (e) {
            console.log('[Migration Fix] ❌ Error repairing:', e.message)
        }
    } else {
        console.log('[Migration Fix] Sections appear valid (or empty), no repair needed.')
    }

}, (app) => {
    // No rollback needed for a fix
})
