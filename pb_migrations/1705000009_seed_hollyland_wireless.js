/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {

    const newItems = [
        {
            name: "Hollyland Cosmo C1 SDI/HDMI",
            slug: "hollyland-cosmo-c1",
            brand: "Hollyland",
            category_slug: "wireless-video",
            description_en: "Wirelessly transmit high-resolution video up to 1080p60 over long distances up to 1000' to a single receiver. Operates on 5.1-5.9 GHz frequency.",
            description_fr: "Transmettez sans fil de la vidéo haute résolution jusqu'à 1080p60 sur des distances allant jusqu'à 300m. Fonctionne sur la fréquence 5.1-5.9 GHz.",
            specs: {
                "range": "1000 ft (300m)",
                "latency": "0.04s",
                "inputs": "SDI / HDMI",
                "resolution": "1080p60",
                "technology": "HEVO"
            },
            daily_rate: 150,
            image_urls: ["https://www.bhphotovideo.com/images/fb/hollyland_hl_cosmo_c1_cosmo_c1_sdi_hdmi_wireless_1671905.jpg"]
        },
        {
            name: "Hollyland MARS 400S SDI/HDMI",
            slug: "hollyland-mars-400s",
            brand: "Hollyland",
            category_slug: "wireless-video",
            description_en: "Entry-level 1080p60 transmitter/receiver system featuring a 400' line-of-sight range. SDI and HDMI connections. Supports app monitoring on up to 4 devices.",
            description_fr: "Système émetteur/récepteur 1080p60 d'entrée de gamme avec une portée de 120m. Connexions SDI et HDMI. Supporte le monitoring via application jusqu'à 4 appareils.",
            specs: {
                "range": "400 ft (120m)",
                "inputs": "SDI / HDMI",
                "resolution": "1080p60",
                "features": "App Monitoring (iOS/Android)"
            },
            daily_rate: 80,
            image_urls: ["https://www.filmtools.com/media/catalog/product/m/a/mars_400s-4.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=521&width=521&canvas=521:521"]
        }
    ];

    // Helper to download images
    const fetchImage = (url) => {
        try {
            const res = $http.send({ url: url, method: "GET", timeout: 30 });
            if (res.statusCode === 200) {
                const filename = url.split('/').pop().split('?')[0] || `image_${Date.now()}.jpg`;
                return { name: filename, type: res.headers['Content-Type'] || "image/jpeg", content: res.raw };
            }
        } catch (e) {
            console.log(`Failed to fetch image: ${url}`);
        }
        return null;
    };

    const equipmentCollection = app.findCollectionByNameOrId("equipment");

    // Helper to find category ID
    const getCategoryId = (slug) => {
        try {
            return app.findFirstRecordByFilter("categories", `slug="${slug}"`).id;
        } catch (e) {
            // Fallback to a default if specific category missing
            return app.findFirstRecordByFilter("categories", 'slug="cameras"').id;
        }
    };

    newItems.forEach(item => {
        // Remove existing if re-running
        try {
            const existing = app.findFirstRecordByFilter("equipment", `slug="${item.slug}"`);
            app.delete(existing);
        } catch (e) { }

        console.log(`Creating: ${item.name}`);
        const record = new Record(equipmentCollection);

        record.set("name", item.name);
        record.set("name_en", item.name);
        record.set("name_fr", item.name); // Using Name as title
        record.set("slug", item.slug);
        record.set("brand", item.brand);
        record.set("category", getCategoryId(item.category_slug));

        record.set("description_en", item.description_en);
        record.set("description_fr", item.description_fr);

        record.set("specs", item.specs);
        record.set("specs_en", item.specs);
        record.set("specs_fr", item.specs); // Manual translation needed for keys

        record.set("daily_rate", item.daily_rate);
        record.set("stock", 3);
        record.set("stock_available", 3);
        record.set("visibility", true);

        if (item.image_urls && item.image_urls.length > 0) {
            const mainImg = fetchImage(item.image_urls[0]);
            if (mainImg) {
                // record.set("image", mainImg); 
            }
        }

        app.save(record);
    });

}, (app) => {
    // Rollback logic
});