/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    const servicesCollection = app.findCollectionByNameOrId("services");

    // 1. Remove "Production Design"
    // (And optionally Props/Costumes if you want to clean up the whole category, 
    // but your prompt specifically said "remove the production design")
    try {
        const prodDesign = app.findFirstRecordByFilter("services", 'slug="production-design"');
        if (prodDesign) {
            console.log("Removing Service: Production Design");
            app.delete(prodDesign);
        }
    } catch (e) {
        // Ignore if not found
    }

    // 2. Add New Services
    const newServices = [
        {
            slug: "broadcasting-live",
            title: "Broadcasting & Live Transmission",
            title_fr: "Diffusion & Transmission en Direct",
            brief_description: "Professional broadcasting services for national and international productions.",
            hero_image: "hero_broadcasting.jpg", // Placeholder, you'll need to upload a real one
            type: "content_page",
            sections: [
                {
                    type: "hero",
                    title: "Live Transmission Solutions",
                    title_fr: "Solutions de Transmission en Direct",
                    description: "Reliable, high-quality audiovisual coverage tailored to broadcasters and event organizers.",
                    description_fr: "Couverture audiovisuelle fiable et de haute qualité adaptée aux diffuseurs et organisateurs d'événements.",
                    background: "/images/services/broadcasting/hero.jpg"
                },
                {
                    type: "text_image",
                    title: "Live Capture & Multi-Camera Production",
                    titleFr: "Captation Live & Production Multi-Caméra",
                    content: "TFS deploys professional broadcast camera systems suitable for studio and on-location environments. Our setups support multi-camera configurations, enabling dynamic coverage and real-time storytelling.",
                    contentFr: "TFS déploie des systèmes de caméras broadcast professionnels adaptés aux studios et aux tournages en extérieur. Nos configurations supportent le multi-caméras pour une couverture dynamique.",
                    image: "/images/services/broadcasting/multicam.jpg",
                    layout: "right"
                },
                {
                    type: "text_image",
                    title: "Live Streaming & Transmission",
                    titleFr: "Streaming en Direct & Transmission",
                    content: "We specialize in live streaming and broadcast transmission workflows adapted to both local and international distribution, ensuring continuity, low latency, and uninterrupted transmission.",
                    contentFr: "Nous sommes spécialisés dans les flux de streaming en direct et de transmission broadcast adaptés à la distribution locale et internationale, assurant continuité et faible latence.",
                    image: "/images/services/broadcasting/streaming.jpg",
                    layout: "left"
                }
            ],
            features: [
                { icon: "Radio", text: "Multi-Camera Production", text_fr: "Production Multi-Caméra" },
                { icon: "Wifi", text: "Low Latency Streaming", text_fr: "Streaming Faible Latence" },
                { icon: "Mic", text: "Broadcast Audio", text_fr: "Audio Broadcast" }
            ],
            display_order: 10,
            is_active: true
        },
        {
            slug: "digital-production-marketing",
            title: "Digital Production & Marketing",
            title_fr: "Production Numérique & Marketing",
            brief_description: "Integrated digital solutions combining filming, content production, and marketing.",
            hero_image: "hero_digital.jpg", // Placeholder
            type: "content_page",
            sections: [
                {
                    type: "hero",
                    title: "Digital Content Solutions",
                    title_fr: "Solutions de Contenu Numérique",
                    description: "From concept to final delivery, we ensure your production achieves maximum impact across all platforms.",
                    description_fr: "Du concept à la livraison finale, nous assurons un impact maximal de votre production sur toutes les plateformes.",
                    background: "/images/services/digital/hero.jpg"
                },
                {
                    type: "text_image",
                    title: "Digital Filming & Content Production",
                    titleFr: "Tournage Numérique & Production de Contenu",
                    content: "High-end filming solutions for digital platforms, branded content, and corporate communication. We ensure visual consistency and broadcast-ready quality output.",
                    contentFr: "Solutions de tournage haut de gamme pour plateformes numériques et contenu de marque. Nous assurons une cohérence visuelle et une qualité prête à la diffusion.",
                    image: "/images/services/digital/content-creation.jpg",
                    layout: "right"
                },
                {
                    type: "text_image",
                    title: "Digital Marketing & Online Visibility",
                    titleFr: "Marketing Numérique & Visibilité en Ligne",
                    content: "We integrate digital marketing solutions to amplify content impact. This includes campaign-oriented delivery and strategic distribution aligned with client objectives.",
                    contentFr: "Nous intégrons des solutions de marketing numérique pour amplifier l'impact du contenu, incluant la livraison orientée campagne et la distribution stratégique.",
                    image: "/images/services/digital/marketing.jpg",
                    layout: "left"
                }
            ],
            features: [
                { icon: "Video", text: "Branded Content", text_fr: "Contenu de Marque" },
                { icon: "TrendingUp", text: "Strategy Optimization", text_fr: "Optimisation Stratégique" },
                { icon: "Share2", text: "Social Distribution", text_fr: "Distribution Sociale" }
            ],
            display_order: 11,
            is_active: true
        }
    ];

    newServices.forEach(service => {
        // Remove if exists to ensure clean update
        try {
            const existing = app.findFirstRecordByFilter("services", `slug="${service.slug}"`);
            app.delete(existing);
        } catch (e) { }

        console.log(`Creating Service: ${service.title}`);
        const record = new Record(servicesCollection);

        record.set("title", service.title);
        record.set("title_fr", service.title_fr);
        record.set("slug", service.slug);
        record.set("brief_description", service.brief_description);
        record.set("type", service.type);
        record.set("sections", service.sections);
        record.set("features", service.features);
        record.set("display_order", service.display_order);
        record.set("is_active", service.is_active);

        // Note: You will need to manually upload the hero images later 
        // or place them in pb_public/images/services/...

        app.save(record);
    });

}, (app) => {
    // Rollback logic
});