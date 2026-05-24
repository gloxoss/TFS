/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Seed Equestrian Sports service
 * - Creates the equestrian sub-service under the Sport hub
 * - Adds "equestrian" to the Sport hub's sub_services array
 * - Updates content with SOREC partnership details (FR/EN)
 */
migrate((app) => {
    const collection = app.findCollectionByNameOrId("services")

    // 1. Check if equestrian already exists (idempotent)
    try {
        const existing = app.findRecordsByFilter("services", 'slug = "equestrian"', "", 1)
        if (existing && existing.length > 0) {
            console.log("[Migration] Equestrian service already exists, updating content...")
            const record = existing[0]

            record.set("brief_description", "Equestrian sports coverage plays a vital role in promoting the discipline and engaging a broad audience.")
            record.set("brief_description_fr", "La Couverture des sports \u00e9questres permet de promouvoir cette discipline et d\u2019attirer un large public.")
            record.set("full_description", '<h2>Development and Promotion of Equestrian Sports</h2><p>TFS Equestrian Sports delivers high-level audiovisual coverage of horse racing and equestrian events, in strategic partnership with SOREC (Soci\u00e9t\u00e9 Royale d\u2019Encouragement du Cheval), Morocco\u2019s leading authority for the development and promotion of the equine sector.</p><h2>High-Speed Tracking Systems</h2><p>TFS operates according to the highest professional standards, capturing the power, speed, and elegance of horse racing. Our production approach combines high-speed tracking systems, stabilized ground movements, aerial cinematography, and precision long-range optics to follow every stride, every acceleration, and every dramatic finish with breathtaking clarity.</p>')
            record.set("full_description_fr", '<h2>D\u00e9veloppement et promotion des sports \u00e9questres</h2><p>TFS Sports \u00c9questres propose une couverture audiovisuelle de haut niveau des courses hippiques et des \u00e9v\u00e9nements \u00e9questres, en partenariat strat\u00e9gique avec la SOREC (Soci\u00e9t\u00e9 Royale d\u2019Encouragement du Cheval), autorit\u00e9 marocaine de r\u00e9f\u00e9rence pour le d\u00e9veloppement et la promotion de la fili\u00e8re \u00e9quine.</p><h2>Des syst\u00e8mes de suivi de haute vitesse</h2><p>TFS op\u00e8re selon les plus hauts standards professionnels et permet de capturer la puissance, la vitesse et l\u2019\u00e9l\u00e9gance des courses hippiques. Notre approche de production combine des syst\u00e8mes de suivi haute vitesse, des mouvements au sol stabilis\u00e9s, de la cin\u00e9matographie a\u00e9rienne et des optiques longue port\u00e9e de pr\u00e9cision pour suivre chaque foul\u00e9e, chaque acc\u00e9l\u00e9ration et chaque arriv\u00e9e dramatique avec une clart\u00e9 saisissante.</p>')
            record.set("features", JSON.stringify([
                { title: "Multi-Camera Coverage", description: "Complete racecourse coverage from every angle with gate-to-finish tracking.", icon: "Camera" },
                { title: "High-Speed Tracking", description: "Advanced tracking systems capturing every stride and acceleration.", icon: "Zap" },
                { title: "SOREC Partnership", description: "Strategic partnership with Morocco\u2019s leading equine authority.", icon: "Award" }
            ]))
            record.set("sections", JSON.stringify([
                { title: "Development and Promotion of Equestrian Sports", content: "TFS Equestrian Sports delivers high-level audiovisual coverage of horse racing and equestrian events, in strategic partnership with SOREC (Soci\u00e9t\u00e9 Royale d\u2019Encouragement du Cheval), Morocco\u2019s leading authority for the development and promotion of the equine sector.", layout: "right" },
                { title: "High-Speed Tracking Systems", content: "TFS operates according to the highest professional standards, capturing the power, speed, and elegance of horse racing. Our production approach combines high-speed tracking systems, stabilized ground movements, aerial cinematography, and precision long-range optics to follow every stride, every acceleration, and every dramatic finish with breathtaking clarity.", layout: "left" },
                { title: "SOREC Strategic Partnership", content: "As the trusted audiovisual production partner of SOREC, TFS brings years of proven expertise in Moroccan horse racing coverage. From day-to-day race broadcasts to prestigious events like the Morocco International Meeting, we deliver world-class production quality that elevates equestrian sports across every platform.", layout: "right" }
            ]))

            app.save(record)
            console.log("[Migration] Equestrian service updated successfully.")
            return
        }
    } catch (e) {
        // No existing record, proceed with creation
    }

    // 2. Create equestrian service
    console.log("[Migration] Creating Equestrian Sports service...")
    const record = new Record(collection)

    record.set("title", "Equestrian Sports")
    record.set("title_fr", "Sports \u00c9questres")
    record.set("slug", "equestrian")
    record.set("type", "content_page")
    record.set("is_active", true)
    record.set("template", "default")
    record.set("display_order", 110)
    record.set("icon", "Horse")
    record.set("brief_description", "Equestrian sports coverage plays a vital role in promoting the discipline and engaging a broad audience.")
    record.set("brief_description_fr", "La Couverture des sports \u00e9questres permet de promouvoir cette discipline et d\u2019attirer un large public.")
    record.set("full_description", '<h2>Development and Promotion of Equestrian Sports</h2><p>TFS Equestrian Sports delivers high-level audiovisual coverage of horse racing and equestrian events, in strategic partnership with SOREC (Soci\u00e9t\u00e9 Royale d\u2019Encouragement du Cheval), Morocco\u2019s leading authority for the development and promotion of the equine sector.</p><h2>High-Speed Tracking Systems</h2><p>TFS operates according to the highest professional standards, capturing the power, speed, and elegance of horse racing. Our production approach combines high-speed tracking systems, stabilized ground movements, aerial cinematography, and precision long-range optics to follow every stride, every acceleration, and every dramatic finish with breathtaking clarity.</p>')
    record.set("full_description_fr", '<h2>D\u00e9veloppement et promotion des sports \u00e9questres</h2><p>TFS Sports \u00c9questres propose une couverture audiovisuelle de haut niveau des courses hippiques et des \u00e9v\u00e9nements \u00e9questres, en partenariat strat\u00e9gique avec la SOREC (Soci\u00e9t\u00e9 Royale d\u2019Encouragement du Cheval), autorit\u00e9 marocaine de r\u00e9f\u00e9rence pour le d\u00e9veloppement et la promotion de la fili\u00e8re \u00e9quine.</p><h2>Des syst\u00e8mes de suivi de haute vitesse</h2><p>TFS op\u00e8re selon les plus hauts standards professionnels et permet de capturer la puissance, la vitesse et l\u2019\u00e9l\u00e9gance des courses hippiques. Notre approche de production combine des syst\u00e8mes de suivi haute vitesse, des mouvements au sol stabilis\u00e9s, de la cin\u00e9matographie a\u00e9rienne et des optiques longue port\u00e9e de pr\u00e9cision pour suivre chaque foul\u00e9e, chaque acc\u00e9l\u00e9ration et chaque arriv\u00e9e dramatique avec une clart\u00e9 saisissante.</p>')
    record.set("features", JSON.stringify([
        { title: "Multi-Camera Coverage", description: "Complete racecourse coverage from every angle with gate-to-finish tracking.", icon: "Camera" },
        { title: "High-Speed Tracking", description: "Advanced tracking systems capturing every stride and acceleration.", icon: "Zap" },
        { title: "SOREC Partnership", description: "Strategic partnership with Morocco\u2019s leading equine authority.", icon: "Award" }
    ]))
    record.set("sections", JSON.stringify([
        { title: "Development and Promotion of Equestrian Sports", content: "TFS Equestrian Sports delivers high-level audiovisual coverage of horse racing and equestrian events, in strategic partnership with SOREC (Soci\u00e9t\u00e9 Royale d\u2019Encouragement du Cheval), Morocco\u2019s leading authority for the development and promotion of the equine sector.", layout: "right" },
        { title: "High-Speed Tracking Systems", content: "TFS operates according to the highest professional standards, capturing the power, speed, and elegance of horse racing. Our production approach combines high-speed tracking systems, stabilized ground movements, aerial cinematography, and precision long-range optics to follow every stride, every acceleration, and every dramatic finish with breathtaking clarity.", layout: "left" },
        { title: "SOREC Strategic Partnership", content: "As the trusted audiovisual production partner of SOREC, TFS brings years of proven expertise in Moroccan horse racing coverage. From day-to-day race broadcasts to prestigious events like the Morocco International Meeting, we deliver world-class production quality that elevates equestrian sports across every platform.", layout: "right" }
    ]))

    app.save(record)
    console.log("[Migration] Created Equestrian Sports service with slug: equestrian")

    // 3. Add equestrian to Sport hub's sub_services
    try {
        const hubRecords = app.findRecordsByFilter("services", 'slug = "sport"', "", 1)
        if (hubRecords && hubRecords.length > 0) {
            const hub = hubRecords[0]
            let subs = []
            try {
                const raw = hub.get("sub_services")
                subs = typeof raw === "string" ? JSON.parse(raw) : (Array.isArray(raw) ? raw : [])
            } catch (e) { subs = [] }

            if (!subs.includes("equestrian")) {
                subs.push("equestrian")
                hub.set("sub_services", JSON.stringify(subs))
                app.save(hub)
                console.log("[Migration] Added equestrian to Sport hub sub_services:", JSON.stringify(subs))
            } else {
                console.log("[Migration] equestrian already in Sport hub sub_services")
            }
        }
    } catch (e) {
        console.log("[Migration] Warning: Could not update Sport hub sub_services:", e.message)
    }

    console.log("[Migration] Equestrian Sports seed complete.")

}, (app) => {
    // Rollback: remove equestrian service and from hub
    try {
        const records = app.findRecordsByFilter("services", 'slug = "equestrian"', "", 1)
        if (records && records.length > 0) {
            app.delete(records[0])
            console.log("[Migration Rollback] Deleted equestrian service")
        }
    } catch (e) { }

    // Remove from hub sub_services
    try {
        const hubRecords = app.findRecordsByFilter("services", 'slug = "sport"', "", 1)
        if (hubRecords && hubRecords.length > 0) {
            const hub = hubRecords[0]
            let subs = []
            try {
                const raw = hub.get("sub_services")
                subs = typeof raw === "string" ? JSON.parse(raw) : (Array.isArray(raw) ? raw : [])
            } catch (e) { subs = [] }
            subs = subs.filter(s => s !== "equestrian")
            hub.set("sub_services", JSON.stringify(subs))
            app.save(hub)
            console.log("[Migration Rollback] Removed equestrian from Sport hub sub_services")
        }
    } catch (e) { }
})
