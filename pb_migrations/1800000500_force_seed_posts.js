/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    console.log("!!! RUNNING SEED MIGRATION !!!");
    const collection = app.findCollectionByNameOrId("posts");

    const posts = [
        {
            title_en: "Cinematography Masterclass: The Art of Lighting",
            title_fr: "Masterclass Cinématographie: L'Art de l'Éclairage",
            slug: "cinematography-masterclass-lighting",
            excerpt_en: "Learn the secrets of cinematic lighting from industry professionals. We dive deep into 3-point lighting, practicals, and mood setting.",
            excerpt_fr: "Apprenez les secrets de l'éclairage cinématographique avec des professionnels de l'industrie.",
            content_en: "<p>In this comprehensive guide, we explore the fundamental principles of lighting for cinema...</p>",
            content_fr: "<p>Dans ce guide complet, nous explorons les principes fondamentaux de l'éclairage...</p>",
            category: "tips",
            video_url: "https://www.youtube.com/watch?v=IP0w9XfOggA",
            published: true,
            published_at: "2024-01-15 10:00:00.000Z"
        },
        {
            title_en: "Behind the Scenes: Atlas Mountains Documentary",
            title_fr: "Coulisses: Documentaire Atlas Mountains",
            slug: "bts-atlas-mountains",
            excerpt_en: "Join us on a journey through the rugged terrain of the High Atlas as we film our latest documentary feature.",
            excerpt_fr: "Rejoignez-nous pour un voyage à travers le terrain accidenté du Haut Atlas...",
            content_en: "<p>Filming in extreme conditions requires special preparation...</p>",
            content_fr: "<p>Filmer dans des conditions extrêmes nécessite une préparation spéciale...</p>",
            category: "behind-the-scenes",
            video_url: "https://vimeo.com/839075306",
            published: true,
            published_at: "2024-02-01 14:00:00.000Z"
        },
        {
            title_en: "New Equipment Arrival: ARRI Alexa 35",
            title_fr: "Nouvel Équipement: ARRI Alexa 35",
            slug: "new-equipment-arri-alexa-35",
            excerpt_en: "We are proud to announce the addition of the ARRI Alexa 35 to our rental inventory. Experience 17 stops of dynamic range.",
            excerpt_fr: "Nous sommes fiers d'annoncer l'ajout de l'ARRI Alexa 35 à notre inventaire...",
            content_en: "<p>The ARRI Alexa 35 raises the bar for digital cinematography...</p>",
            content_fr: "<p>L'ARRI Alexa 35 élève la barre de la cinématographie numérique...</p>",
            category: "news",
            video_url: "https://www.youtube.com/watch?v=L9sH5rL2k4E",
            published: true,
            published_at: "2024-02-10 09:00:00.000Z"
        },
        {
            title_en: "Film Industry Trends 2025",
            title_fr: "Tendances de l'Industrie Cinématographique 2025",
            slug: "film-industry-trends-2025",
            excerpt_en: "What to expect in the coming year? Virtual production, AI integration, and sustainable filmmaking practices.",
            excerpt_fr: "À quoi s'attendre pour l'année à venir ? Production virtuelle, intégration de l'IA...",
            content_en: "<p>The landscape of film production is evolving rapidly...</p>",
            content_fr: "<p>Le paysage de la production cinématographique évolue rapidement...</p>",
            category: "industry",
            video_url: "", // No video
            published: true,
            published_at: "2024-03-01 11:00:00.000Z"
        }
    ];

    posts.forEach(data => {
        // Check if exists by slug
        try {
            const existing = app.findRecordsByFilter("posts", `slug = "${data.slug}"`, "", 1);
            if (existing && existing.length > 0) {
                return; // Skip if exists
            }
        } catch (e) { }

        const record = new Record(collection);
        Object.keys(data).forEach(key => {
            record.set(key, data[key]);
        });

        // Ensure required fields like 'title' if your schema requires it separate from title_en
        // Assuming your schema uses title_en/fr mainly, but if 'title' is required:
        // record.set("title", data.title_en); 

        app.save(record);
    });

}, (app) => {
    // Optional: Delete seeded posts (by slug)
    const slugs = [
        "cinematography-masterclass-lighting",
        "bts-atlas-mountains",
        "new-equipment-arri-alexa-35",
        "film-industry-trends-2025"
    ];

    slugs.forEach(slug => {
        try {
            const records = app.findRecordsByFilter("posts", `slug = "${slug}"`, "", 1);
            if (records && records.length > 0) {
                app.delete(records[0]);
            }
        } catch (e) { }
    });
})
