/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {

    const newItems = [
        {
            name: "Tilta Mirage Matte Box",
            slug: "tilta-mirage-matte-box",
            brand: "Tilta",
            category_slug: "matte-boxes",
            description_en: "Modular component system that clips onto 95mm OD lenses. Weighs about the same as a standard 4x5.65 glass filter. Accepts 95mm round filters.",
            description_fr: "Système modulaire qui se clipse sur des objectifs de 95mm de diamètre extérieur. Accepte les filtres ronds de 95mm.",
            specs: {
                "mount": "Clamp-on 95mm",
                "filter_type": "95mm Circular / 4x5.65 Tray",
                "weight": "Lightweight"
            },
            daily_rate: 50,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1696934438_1661353.jpg"]
        },
        {
            name: "Teradek Bolt Pro 300 Wireless",
            slug: "teradek-bolt-pro-300",
            brand: "Teradek",
            category_slug: "wireless-video",
            description_en: "Dual Format (HDMI/SDI) transmitter. Fan-less receiver with USB 3.0 output. 300ft range, zero delay (<1ms).",
            description_fr: "Émetteur double format (HDMI/SDI). Récepteur sans ventilateur avec sortie USB 3.0. Portée de 300 pieds, zéro délai.",
            specs: {
                "range": "300 ft",
                "inputs": "HD-SDI / HDMI",
                "outputs": "HD-SDI / HDMI / USB 3.0"
            },
            daily_rate: 120,
            image_urls: ["https://photocinerent.com/storage/1482/conversions/Teradek-300-TX-ESF8-slide.jpg"]
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
            // Fallback
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
        record.set("name_fr", item.name);
        record.set("slug", item.slug);
        record.set("brand", item.brand);
        record.set("category", getCategoryId(item.category_slug));

        record.set("description_en", item.description_en);
        record.set("description_fr", item.description_fr);

        record.set("specs", item.specs);
        record.set("specs_en", item.specs);
        record.set("specs_fr", item.specs);

        record.set("daily_rate", item.daily_rate);
        record.set("stock", 2);
        record.set("stock_available", 2);
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