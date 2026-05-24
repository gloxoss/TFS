/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Seed Sporting Events Service
 * 
 * Creates a new "Sporting Events" service with:
 * - template: showcase
 * - slider_images pointing to local images
 * - Structured sections, stats, and features
 */

migrate((app) => {
    const collection = app.findCollectionByNameOrId("services")

    if (!collection) {
        console.log('[Migration] Services collection not found, skipping...')
        return
    }

    // Check if sporting-events already exists
    try {
        const existing = app.findRecordsByFilter(
            "services",
            `slug = "sporting-events"`,
            "",
            1
        )
        if (existing && existing.length > 0) {
            console.log('[Migration] Sporting Events service already exists, skipping...')
            return
        }
    } catch (e) {
        // Continue if not found
    }

    // Create the sporting events service
    const record = new Record(collection)

    record.set("title", "Sporting Events")
    record.set("title_fr", "Événements Sportifs")
    record.set("slug", "sporting-events")
    record.set("brief_description", "Professional equipment and crew services for live sports broadcasting and event coverage across Morocco.")
    record.set("brief_description_fr", "Équipement professionnel et services d'équipe pour la diffusion sportive en direct et la couverture d'événements au Maroc.")
    record.set("full_description", "<p>TFS Cinema Solutions provides comprehensive support for sporting events, from local tournaments to international broadcasts. Our experienced crews and state-of-the-art equipment ensure professional coverage for any scale of production.</p>")
    record.set("full_description_fr", "<p>TFS Cinema Solutions fournit un support complet pour les événements sportifs, des tournois locaux aux diffusions internationales. Nos équipes expérimentées et notre équipement de pointe garantissent une couverture professionnelle pour toute échelle de production.</p>")
    record.set("type", "content_page")
    record.set("template", "showcase")
    record.set("display_order", 16)
    record.set("is_active", true)

    // Sections
    record.set("sections", JSON.stringify([
        {
            "type": "text_image",
            "title": "Live Sports Broadcasting",
            "titleFr": "Diffusion Sportive en Direct",
            "content": "From football matches to international tournaments, TFS provides complete broadcasting solutions. Our multi-camera setups, skilled operators, and broadcast-grade equipment deliver world-class coverage for any sporting event.",
            "contentFr": "Des matchs de football aux tournois internationaux, TFS fournit des solutions de diffusion complètes. Nos configurations multi-caméras, opérateurs qualifiés et équipement de qualité broadcast offrent une couverture de classe mondiale.",
            "image": "/images/services/sporting-events/dfl-de_camera-bundesliga_international-scaled.jpg",
            "layout": "right"
        },
        {
            "type": "text_image",
            "title": "Event Coverage & Production",
            "titleFr": "Couverture & Production d'Événements",
            "content": "Whether it's a local championship or a major league event, our team delivers comprehensive coverage. We handle everything from camera placement to live switching, ensuring every crucial moment is captured.",
            "contentFr": "Qu'il s'agisse d'un championnat local ou d'un événement de ligue majeure, notre équipe assure une couverture complète. Nous gérons tout, du placement des caméras au switching en direct.",
            "image": "/images/services/sporting-events/fussball-im-tv-heute-live.jpg",
            "layout": "left"
        },
        {
            "type": "text_image",
            "title": "Professional Crews & Equipment",
            "titleFr": "Équipes & Équipement Professionnels",
            "content": "Access our pool of experienced sports cameramen, technicians, and production staff. Combined with our extensive equipment inventory, we deliver broadcast-ready solutions for any sporting event.",
            "contentFr": "Accédez à notre vivier de cameramen sportifs expérimentés, techniciens et personnel de production. Combiné à notre vaste inventaire d'équipement, nous livrons des solutions prêtes pour la diffusion.",
            "image": "/images/services/sporting-events/Sportcast2.jpg",
            "layout": "right"
        }
    ]))

    // Stats
    record.set("stats", JSON.stringify([
        { "value": "50+", "label": "Sports Events", "labelFr": "Événements Sportifs" },
        { "value": "4K/HD", "label": "Broadcast Quality", "labelFr": "Qualité Broadcast" },
        { "value": "24/7", "label": "Support Available", "labelFr": "Support Disponible" },
        { "value": "Multi-Cam", "label": "Setups", "labelFr": "Configurations" }
    ]))

    // Features
    record.set("features", JSON.stringify([
        {
            "title": "Multi-Camera Coverage",
            "titleFr": "Couverture Multi-Caméras",
            "description": "Up to 12+ camera positions for complete event coverage.",
            "descriptionFr": "Jusqu'à 12+ positions de caméra pour une couverture complète.",
            "icon": "Camera"
        },
        {
            "title": "Live Broadcast Ready",
            "titleFr": "Prêt pour Diffusion en Direct",
            "description": "Full OB van and transmission capabilities.",
            "descriptionFr": "Capacités complètes de car régie et transmission.",
            "icon": "Radio"
        },
        {
            "title": "Instant Replay",
            "titleFr": "Replay Instantané",
            "description": "Super slow-motion and replay systems.",
            "descriptionFr": "Systèmes de super ralenti et replay.",
            "icon": "Rewind"
        },
        {
            "title": "Graphics Integration",
            "titleFr": "Intégration Graphique",
            "description": "Score overlays, stats, and branded graphics.",
            "descriptionFr": "Incrustations score, statistiques et graphiques de marque.",
            "icon": "BarChart"
        }
    ]))

    // Tags
    record.set("tags", JSON.stringify([
        "Sports", "Broadcasting", "Live Events", "Football", "Multi-Camera", "OB Van"
    ]))

    // Video URL (example - can be updated later)
    record.set("video_url", "")

    // Downloads (example - can be updated later)
    record.set("downloads", JSON.stringify([]))

    app.save(record)
    console.log('[Migration] Created Sporting Events service with showcase template')

}, (app) => {
    // Rollback - delete the service
    try {
        const records = app.findRecordsByFilter(
            "services",
            `slug = "sporting-events"`,
            "",
            1
        )
        if (records && records.length > 0) {
            app.delete(records[0])
            console.log('[Migration] Deleted Sporting Events service')
        }
    } catch (e) {
        console.log('[Migration] Could not find Sporting Events service to delete')
    }
})
