/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Seed Broadcast Equipment Downloads
 * 
 * Updates the Broadcast service's sections JSON with complete equipment
 * downloads list for PDF specification sheets.
 */

migrate((app) => {
    const collection = app.findCollectionByNameOrId("services")

    if (!collection) {
        console.log('[Migration] Services collection not found, skipping...')
        return
    }

    // Equipment data organized by category
    const downloadsCategories = [
        {
            category: "OBVAN & Mobile Regie",
            items: [
                { title: "OBVAN 20 cameras Full HD", file: "" },
                { title: "OBVAN 16 cameras Full HD", file: "" },
                { title: "Mobil regie 8 cameras 4/HDR UHD", file: "" },
                { title: "Mobil regie 30 cameras Full HD", file: "" },
                { title: "Mobil regie 20 cameras Full HD", file: "" },
                { title: "Mobil regie 15 cameras Full HD", file: "" },
                { title: "Mobil regie 10 cameras Full HD", file: "" },
                { title: "Mobil regie 5 cameras Full HD", file: "" }
            ]
        },
        {
            category: "Special cameras",
            items: [
                { title: "PTZ", file: "" },
                { title: "Compact cameras", file: "" }
            ]
        },
        {
            category: "Cranes",
            items: [
                { title: "Crane Telescop Moviebird 45", file: "" },
                { title: "Crane Panther Pegasus 14m", file: "" },
                { title: "Crane Egripment Javelin 12,2m", file: "" },
                { title: "Crane Movietech Felix", file: "" },
                { title: "Crane ABC 120 12m", file: "" },
                { title: "Crane Jimmy Jib 12m", file: "" }
            ]
        },
        {
            category: "Steadicam's",
            items: [
                { title: "MK-V", file: "" },
                { title: "Arri Artemis 2", file: "" },
                { title: "Arri Trinity", file: "" }
            ]
        },
        {
            category: "Interphonie",
            items: [
                { title: "Intercom Riedel Bolero", file: "" },
                { title: "Intercom Clear-Com", file: "" },
                { title: "Matrix Riedel 64x64", file: "" },
                { title: "Talkies Walkies", file: "" },
                { title: "In-Ear", file: "" }
            ]
        },
        {
            category: "Others",
            items: [
                { title: "Spidercam", file: "" },
                { title: "Cablecam", file: "" },
                { title: "Speedcam", file: "" },
                { title: "Electro Moto", file: "" },
                { title: "Agito", file: "" }
            ]
        }
    ]

    // Find broadcast service
    let broadcast = null
    try {
        const records = app.findRecordsByFilter("services", 'slug ~ "broadcast"', "", 1)
        if (records && records.length > 0) {
            broadcast = records[0]
        }
    } catch (e) {
        console.log('[Migration] Error finding broadcast service:', e.message)
    }

    if (!broadcast) {
        console.log('[Migration] Broadcast service not found, skipping...')
        return
    }

    console.log(`[Migration] Found broadcast service: ${broadcast.get("title")}`)

    // Get existing sections
    let sections = []
    try {
        const sectionsRaw = broadcast.get("sections")
        if (typeof sectionsRaw === 'string') {
            sections = JSON.parse(sectionsRaw)
        } else if (Array.isArray(sectionsRaw)) {
            sections = sectionsRaw
        }
    } catch (e) {
        console.log('[Migration] Could not parse sections, starting fresh')
        sections = []
    }

    // Create new downloads section
    const downloadsSection = {
        type: 'downloads_categorized',
        title: 'Equipment & Specifications',
        categories: downloadsCategories
    }

    // Find existing downloads section or add new one
    const downloadsIndex = sections.findIndex(s => s.type === 'downloads_categorized')

    if (downloadsIndex >= 0) {
        console.log('[Migration] Updating existing downloads section...')
        sections[downloadsIndex] = downloadsSection
    } else {
        console.log('[Migration] Adding new downloads section...')
        sections.push(downloadsSection)
    }

    // Update the record
    // We sanitize the object to ensure it's pure JS data without any Go wrappers or specific prototypes
    // This prevents "Must be a valid json value" errors and byte-array encoding issues
    const cleanSections = JSON.parse(JSON.stringify(sections))
    broadcast.set("sections", cleanSections)
    app.save(broadcast)

    const totalItems = downloadsCategories.reduce((acc, cat) => acc + cat.items.length, 0)
    console.log(`[Migration] Broadcast downloads seeded! Categories: ${downloadsCategories.length}, Items: ${totalItems}`)

}, (app) => {
    // Rollback - remove downloads section
    try {
        const records = app.findRecordsByFilter("services", 'slug ~ "broadcast"', "", 1)
        if (records && records.length > 0) {
            const broadcast = records[0]
            let sections = broadcast.get("sections") || []
            if (typeof sections === 'string') sections = JSON.parse(sections)

            const filtered = sections.filter(s => s.type !== 'downloads_categorized')
            broadcast.set("sections", filtered)
            app.save(broadcast)
            console.log('[Migration] Removed downloads section from broadcast')
        }
    } catch (e) {
        console.log('[Migration] Rollback failed:', e.message)
    }
})
