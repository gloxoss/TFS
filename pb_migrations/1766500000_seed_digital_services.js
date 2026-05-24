/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Seed Digital Services Hub
 * 
 * Creates:
 * 1. Digital Services (hub) - parent with sub_services
 * 2. Digital Production for Producers (showcase) - sub-service
 * 3. Digital Marketing (showcase) - sub-service
 */

migrate((app) => {
    const collection = app.findCollectionByNameOrId("services")

    if (!collection) {
        console.log('[Migration] Services collection not found, skipping...')
        return
    }

    // ============================================
    // 1. Create Digital Production sub-service
    // ============================================
    let digitalProductionExists = false
    try {
        const existing = app.findRecordsByFilter("services", `slug = "digital-production"`, "", 1)
        if (existing && existing.length > 0) digitalProductionExists = true
    } catch (e) { }

    if (!digitalProductionExists) {
        const digitalProduction = new Record(collection)
        digitalProduction.set("title", "Digital Production for Producers")
        digitalProduction.set("title_fr", "Production Digitale pour Producteurs")
        digitalProduction.set("slug", "digital-production")
        digitalProduction.set("brief_description", "Professional digital production services tailored for film and media producers.")
        digitalProduction.set("brief_description_fr", "Services de production digitale professionnels adaptés aux producteurs de films et médias.")
        digitalProduction.set("full_description", "<p>Comprehensive digital production solutions for modern filmmaking, from pre-production planning to final delivery.</p>")
        digitalProduction.set("full_description_fr", "<p>Solutions de production digitale complètes pour la réalisation cinématographique moderne.</p>")
        digitalProduction.set("type", "content_page")
        digitalProduction.set("template", "showcase")
        digitalProduction.set("display_order", 18)
        digitalProduction.set("is_active", true)
        digitalProduction.set("sections", JSON.stringify([
            {
                "type": "text_image",
                "title": "End-to-End Digital Workflow",
                "titleFr": "Flux de Travail Digital de Bout en Bout",
                "content": "From script breakdown to final delivery, our digital production services streamline your entire workflow with industry-leading tools and expertise.",
                "contentFr": "De la décomposition du script à la livraison finale, nos services de production digitale rationalisent l'ensemble de votre flux de travail.",
                "image": "/images/services/digital/workflow.jpg",
                "layout": "right"
            },
            {
                "type": "text_image",
                "title": "Cloud-Based Collaboration",
                "titleFr": "Collaboration Basée sur le Cloud",
                "content": "Work seamlessly with your team across the globe using our secure cloud platforms for review, approval, and asset management.",
                "contentFr": "Travaillez de manière transparente avec votre équipe à travers le monde grâce à nos plateformes cloud sécurisées.",
                "image": "/images/services/digital/collaboration.jpg",
                "layout": "left"
            }
        ]))
        digitalProduction.set("stats", JSON.stringify([
            { "value": "4K+", "label": "Resolution", "labelFr": "Résolution" },
            { "value": "Cloud", "label": "Workflow", "labelFr": "Flux de Travail" },
            { "value": "24/7", "label": "Support", "labelFr": "Support" }
        ]))
        digitalProduction.set("features", JSON.stringify([
            { "title": "DIT Services", "titleFr": "Services DIT", "description": "Digital imaging technician support.", "descriptionFr": "Support de technicien d'imagerie digitale.", "icon": "HardDrive" },
            { "title": "Dailies Processing", "titleFr": "Traitement des Rushes", "description": "Same-day dailies with color.", "descriptionFr": "Rushes le même jour avec étalonnage.", "icon": "Film" },
            { "title": "Asset Management", "titleFr": "Gestion des Assets", "description": "Secure media storage.", "descriptionFr": "Stockage média sécurisé.", "icon": "Database" }
        ]))
        app.save(digitalProduction)
        console.log('[Migration] Created Digital Production sub-service')
    }

    // ============================================
    // 2. Create Digital Marketing sub-service
    // ============================================
    let digitalMarketingExists = false
    try {
        const existing = app.findRecordsByFilter("services", `slug = "digital-marketing"`, "", 1)
        if (existing && existing.length > 0) digitalMarketingExists = true
    } catch (e) { }

    if (!digitalMarketingExists) {
        const digitalMarketing = new Record(collection)
        digitalMarketing.set("title", "Digital Marketing & Distribution")
        digitalMarketing.set("title_fr", "Marketing Digital & Distribution")
        digitalMarketing.set("slug", "digital-marketing")
        digitalMarketing.set("brief_description", "Strategic digital marketing and distribution services for film and media projects.")
        digitalMarketing.set("brief_description_fr", "Services stratégiques de marketing digital et de distribution pour projets cinématographiques.")
        digitalMarketing.set("full_description", "<p>From social media campaigns to VOD distribution, we help your content reach its target audience.</p>")
        digitalMarketing.set("full_description_fr", "<p>Des campagnes sur les réseaux sociaux à la distribution VOD, nous aidons votre contenu à atteindre son public cible.</p>")
        digitalMarketing.set("type", "content_page")
        digitalMarketing.set("template", "showcase")
        digitalMarketing.set("display_order", 19)
        digitalMarketing.set("is_active", true)
        digitalMarketing.set("sections", JSON.stringify([
            {
                "type": "text_image",
                "title": "Social Media Campaigns",
                "titleFr": "Campagnes Réseaux Sociaux",
                "content": "Engage audiences with targeted social media strategies across all major platforms, driving awareness and engagement for your project.",
                "contentFr": "Engagez les audiences avec des stratégies ciblées sur les réseaux sociaux.",
                "image": "/images/services/digital/social-media.jpg",
                "layout": "right"
            },
            {
                "type": "text_image",
                "title": "VOD & Streaming Distribution",
                "titleFr": "Distribution VOD & Streaming",
                "content": "Navigate the complex world of digital distribution with our expertise in VOD platforms, streaming services, and international markets.",
                "contentFr": "Naviguez dans le monde complexe de la distribution digitale avec notre expertise.",
                "image": "/images/services/digital/streaming.jpg",
                "layout": "left"
            }
        ]))
        digitalMarketing.set("stats", JSON.stringify([
            { "value": "Global", "label": "Reach", "labelFr": "Portée" },
            { "value": "Multi", "label": "Platform", "labelFr": "Plateforme" },
            { "value": "ROI", "label": "Focused", "labelFr": "Orienté" }
        ]))
        digitalMarketing.set("features", JSON.stringify([
            { "title": "Social Strategy", "titleFr": "Stratégie Sociale", "description": "Platform-specific campaigns.", "descriptionFr": "Campagnes spécifiques par plateforme.", "icon": "Share2" },
            { "title": "VOD Distribution", "titleFr": "Distribution VOD", "description": "Global platform access.", "descriptionFr": "Accès aux plateformes mondiales.", "icon": "Play" },
            { "title": "Analytics", "titleFr": "Analytiques", "description": "Performance tracking.", "descriptionFr": "Suivi des performances.", "icon": "BarChart2" }
        ]))
        app.save(digitalMarketing)
        console.log('[Migration] Created Digital Marketing sub-service')
    }

    // ============================================
    // 3. Create Digital Services Hub (parent)
    // ============================================
    let digitalHubExists = false
    try {
        const existing = app.findRecordsByFilter("services", `slug = "digital-services"`, "", 1)
        if (existing && existing.length > 0) digitalHubExists = true
    } catch (e) { }

    if (!digitalHubExists) {
        const digitalHub = new Record(collection)
        digitalHub.set("title", "Digital Services")
        digitalHub.set("title_fr", "Services Digitaux")
        digitalHub.set("slug", "digital-services")
        digitalHub.set("brief_description", "Comprehensive digital solutions for modern film and media production.")
        digitalHub.set("brief_description_fr", "Solutions digitales complètes pour la production cinématographique moderne.")
        digitalHub.set("full_description", "<p>TFS offers a complete suite of digital services to support your production from start to finish.</p>")
        digitalHub.set("full_description_fr", "<p>TFS offre une gamme complète de services digitaux pour accompagner votre production du début à la fin.</p>")
        digitalHub.set("type", "content_page")
        digitalHub.set("template", "hub")
        digitalHub.set("display_order", 17)
        digitalHub.set("is_active", true)
        digitalHub.set("sub_services", JSON.stringify(["digital-production", "digital-marketing"]))
        app.save(digitalHub)
        console.log('[Migration] Created Digital Services hub')
    }

}, (app) => {
    // Rollback - delete all digital services
    const slugsToDelete = ["digital-services", "digital-production", "digital-marketing"]

    for (const slug of slugsToDelete) {
        try {
            const records = app.findRecordsByFilter("services", `slug = "${slug}"`, "", 1)
            if (records && records.length > 0) {
                app.delete(records[0])
                console.log(`[Migration] Deleted ${slug}`)
            }
        } catch (e) {
            console.log(`[Migration] Could not find ${slug} to delete`)
        }
    }
})
