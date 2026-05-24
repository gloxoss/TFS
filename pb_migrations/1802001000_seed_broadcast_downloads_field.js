/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Seed Broadcast Downloads Field
 * 
 * Migrates equipment data to the downloads field on the broadcast service.
 * This uses the simpler ServiceDownload[] structure instead of nested sections.
 */

migrate((app) => {
    const collection = app.findCollectionByNameOrId("services")

    if (!collection) {
        console.log('[Migration] Services collection not found, skipping...')
        return
    }

    // Equipment data organized by category
    const equipmentData = [
        // OBVAN & Mobile Regie
        { title: "OBVAN 20 cameras Full HD", url: "", category: "OBVAN & Mobile Regie" },
        { title: "OBVAN 16 cameras Full HD", url: "", category: "OBVAN & Mobile Regie" },
        { title: "Mobil regie 8 cameras 4/HDR UHD", url: "", category: "OBVAN & Mobile Regie" },
        { title: "Mobil regie 30 cameras Full HD", url: "", category: "OBVAN & Mobile Regie" },
        { title: "Mobil regie 20 cameras Full HD", url: "", category: "OBVAN & Mobile Regie" },
        { title: "Mobil regie 15 cameras Full HD", url: "", category: "OBVAN & Mobile Regie" },
        { title: "Mobil regie 10 cameras Full HD", url: "", category: "OBVAN & Mobile Regie" },
        { title: "Mobil regie 5 cameras Full HD", url: "", category: "OBVAN & Mobile Regie" },
        
        // Special Cameras
        { title: "PTZ", url: "", category: "Special Cameras" },
        { title: "Compact cameras", url: "", category: "Special Cameras" },
        
        // Cranes
        { title: "Crane Telescop Moviebird 45", url: "", category: "Cranes" },
        { title: "Crane Panther Pegasus 14m", url: "", category: "Cranes" },
        { title: "Crane Egripment Javelin 12,2m", url: "", category: "Cranes" },
        { title: "Crane Movietech Felix", url: "", category: "Cranes" },
        { title: "Crane ABC 120 12m", url: "", category: "Cranes" },
        { title: "Crane Jimmy Jib 12m", url: "", category: "Cranes" },
        
        // Steadicam's
        { title: "MK-V", url: "", category: "Steadicam's" },
        { title: "Arri Artemis 2", url: "", category: "Steadicam's" },
        { title: "Arri Trinity", url: "", category: "Steadicam's" },
        
        // Interphonie
        { title: "Intercom Riedel Bolero", url: "", category: "Interphonie" },
        { title: "Intercom Clear-Com", url: "", category: "Interphonie" },
        { title: "Matrix Riedel 64x64", url: "", category: "Interphonie" },
        { title: "Talkies Walkies", url: "", category: "Interphonie" },
        { title: "In-Ear", url: "", category: "Interphonie" },
        
        // Others
        { title: "Spidercam", url: "", category: "Others" },
        { title: "Cablecam", url: "", category: "Others" },
        { title: "Speedcam", url: "", category: "Others" },
        { title: "Electro Moto", url: "", category: "Others" },
        { title: "Agito", url: "", category: "Others" }
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

    // Set the downloads field
    const cleanData = JSON.parse(JSON.stringify(equipmentData))
    broadcast.set("downloads", cleanData)
    app.save(broadcast)

    console.log(`[Migration] Seeded ${equipmentData.length} equipment items to downloads field`)

}, (app) => {
    // Rollback - clear downloads field
    try {
        const records = app.findRecordsByFilter("services", 'slug ~ "broadcast"', "", 1)
        if (records && records.length > 0) {
            const broadcast = records[0]
            broadcast.set("downloads", [])
            app.save(broadcast)
            console.log('[Migration] Cleared downloads field from broadcast')
        }
    } catch (e) {
        console.log('[Migration] Rollback failed:', e.message)
    }
})
