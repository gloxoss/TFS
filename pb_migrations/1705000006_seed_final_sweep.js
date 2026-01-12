/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    // This script seeds the remaining 8% of items found in the PDF
    // that were not covered in previous batches.

    const finalItems = [
        // --- MISSING WIRELESS (Legacy Teradeks from Page 9/10) ---
        {
            name: "Teradek Bolt Pro 2000",
            slug: "teradek-bolt-pro-2000",
            brand: "Teradek",
            category_slug: "wireless-video",
            description_en: "Latency free wireless transmission sending 4:2:2 1080p60 video up to 2000 ft over 5GHz band.",
            description_fr: "Transmission sans fil sans latence envoyant de la vidéo 1080p60 jusqu'à 2000 pieds.",
            specs: { "range": "2000 ft", "inputs": "3G-SDI / HDMI" },
            daily_rate: 300,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1425923204_1076568.jpg"]
        },
        {
            name: "Teradek Bolt Pro 1000",
            slug: "teradek-bolt-pro-1000",
            brand: "Teradek",
            category_slug: "wireless-video",
            description_en: "Transmit uncompressed 1080p video wirelessly over 1000 feet line-of-sight. Multicast capable.",
            description_fr: "Transmettez la vidéo 1080p non compressée sans fil sur 1000 pieds.",
            specs: { "range": "1000 ft", "inputs": "3G-SDI" },
            daily_rate: 250,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1471867680_1273184.jpg"]
        },
        {
            name: "Teradek Bolt LT 500",
            slug: "teradek-bolt-lt-500",
            brand: "Teradek",
            category_slug: "wireless-video",
            description_en: "Lightweight, smaller high-performance wireless video system. Zero delay.",
            description_fr: "Système vidéo sans fil léger et performant. Zéro délai.",
            specs: { "range": "500 ft", "inputs": "3G-SDI / HDMI" },
            daily_rate: 150,
            image_urls: ["https://tdmstore.tdm.ma/wp-content/uploads/2020/05/TERADEK-HF-BOLT-LT-500.jpg"]
        },
        {
            name: "Teradek Bolt Pro 300",
            slug: "teradek-bolt-pro-300",
            brand: "Teradek",
            category_slug: "wireless-video",
            description_en: "Dual format (HDMI/SDI) transmitter. Fan-less receiver. 300ft range.",
            description_fr: "Émetteur double format (HDMI/SDI). Récepteur sans ventilateur. Portée de 300 pieds.",
            specs: { "range": "300 ft", "inputs": "HD-SDI / HDMI" },
            daily_rate: 120,
            // Using placeholder or previously defined image if specific link missing in current context
            image_urls: ["https://static.bhphoto.com/images/images500x500/1425923204_1076568.jpg"]
        },

        // --- MISSING MONITORS (Legacy Models from Page 8/9) ---
        {
            name: "Video Devices PIX-E7",
            slug: "video-devices-pix-e7",
            brand: "Video Devices",
            category_slug: "monitors",
            description_en: "7-inch 4K Recording Monitor. Records to SpeedDrive SSDs. 1920x1200 Touchscreen.",
            description_fr: "Moniteur enregistreur 4K de 7 pouces. Enregistre sur SSD SpeedDrive.",
            specs: { "size": "7 inch", "recording": "ProRes 4K" },
            daily_rate: 150,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1428938280_1137280.jpg"]
        },
        {
            name: "TVLogic LVM-091W-M",
            slug: "tvlogic-lvm-091w",
            brand: "TVLogic",
            category_slug: "monitors",
            description_en: "9-inch broadcast production monitor. High contrast anti-glare screen.",
            description_fr: "Moniteur de production broadcast de 9 pouces.",
            specs: { "size": "9 inch", "resolution": "960x540" },
            daily_rate: 100,
            image_urls: ["https://www.tvlogic.tv/Monitors/UpImg/1042_782_LVM-091W(1).png"]
        },

        // --- MISSING LIGHTING (Tungsten Classics from Page 11) ---
        {
            name: "ARRI Blonde 2000W",
            slug: "arri-blonde-2000",
            brand: "ARRI",
            category_slug: "lighting",
            description_en: "Lightweight quartz lighting. Open face 2000W fixture. Adjustable beam angle.",
            description_fr: "Éclairage quartz léger. Projecteur open face 2000W.",
            specs: { "type": "Tungsten", "power": "2000W", "style": "Open Face" },
            daily_rate: 50,
            image_urls: ["https://www.goldcoastcamerahire.com.au/wp-content/uploads/2019/01/Arrilite-800-2.jpg"]
        },
        {
            name: "PAR 64 Can (1000W)",
            slug: "par-64-can",
            brand: "Generic",
            category_slug: "lighting",
            description_en: "Low-cost, highly flexible luminaire. Intensity depends on installed lamp (CP60/61/62).",
            description_fr: "Luminaire économique et très flexible. L'intensité dépend de la lampe installée.",
            specs: { "type": "Tungsten", "power": "1000W", "mount": "Yoke" },
            daily_rate: 20,
            image_urls: ["https://www.lightinglab.com.au/wp-content/uploads/2020/04/3-10-Par-64-Black.png"]
        },

        // --- MISSING GRIP (Specific Items from Page 15/16/17) ---
        {
            name: "GFM Lite Dolly",
            slug: "gfm-lite-dolly",
            brand: "GFM",
            category_slug: "grip",
            description_en: "Pull-type trolley dolly. Usable on two directional wheels or track.",
            description_fr: "Dolly de type chariot. Utilisable sur deux roues directionnelles ou sur rail.",
            specs: { "type": "Dolly", "track_width": "62cm" },
            daily_rate: 150,
            image_urls: ["https://www.tsf.fr/wp-content/uploads/2017/12/G-LITE-1-0.png"]
        },
        {
            name: "Egripment Javelin Crane",
            slug: "egripment-javelin",
            brand: "Egripment",
            category_slug: "grip",
            description_en: "Modern modular crane system. Streamlined arm design minimizes visual obstruction.",
            description_fr: "Système de grue modulaire moderne. La conception simplifiée du bras minimise l'obstruction visuelle.",
            specs: { "type": "Crane", "style": "Modular" },
            daily_rate: 600,
            image_urls: ["https://egripment.com/assets/components/phpthumbof/cache/Naamloos.b8d4572a526726ec7e9752fd1c024425.jpg"]
        },
        {
            name: "Ball Adapter 150mm",
            slug: "ball-adapter-150mm",
            brand: "MovieTech",
            category_slug: "grip",
            description_en: "Machined aluminum adapter. Converts Euro mount to 150mm Bowl.",
            description_fr: "Adaptateur en aluminium usiné. Convertit la monture Euro en bol de 150 mm.",
            specs: { "type": "Adapter", "mount": "Euro to 150mm" },
            daily_rate: 25,
            image_urls: ["https://www.movietech.de/wp-content/uploads/2023/12/2031-0_MovieTech_Bowl_Adapter_150_mm_650x650.jpg"]
        }
    ];

    const fetchImage = (url) => {
        try {
            const res = $http.send({ url: url, method: "GET", timeout: 30 });
            if (res.statusCode === 200) {
                const filename = url.split('/').pop().split('?')[0] || `image_${Date.now()}.jpg`;
                return { name: filename, type: res.headers['Content-Type'] || "image/jpeg", content: res.raw };
            }
        } catch (e) { }
        return null;
    };

    // Helper to find categories safely
    const getCategory = (slug) => {
        try {
            return app.findFirstRecordByFilter("categories", `slug="${slug}"`);
        } catch (e) {
            // Fallback if specific cat missing, though previous scripts should have made them
            return app.findFirstRecordByFilter("categories", 'slug="cameras"');
        }
    }

    const equipmentCollection = app.findCollectionByNameOrId("equipment");

    finalItems.forEach(item => {
        // Clean up previous runs if this script is re-run
        try {
            const existing = app.findFirstRecordByFilter("equipment", `slug="${item.slug}"`);
            if (existing) app.delete(existing);
        } catch (e) { }

        console.log(`Seeding final item: ${item.name}`);
        const record = new Record(equipmentCollection);

        record.set("name", item.name);
        record.set("name_en", item.name);
        record.set("name_fr", item.description_fr ? item.name : item.name);
        record.set("slug", item.slug);
        record.set("brand", item.brand);

        const catRecord = getCategory(item.category_slug);
        if (catRecord) record.set("category", catRecord.id);

        record.set("description_en", item.description_en);
        record.set("description_fr", item.description_fr);
        record.set("specs", item.specs);
        record.set("specs_en", item.specs);
        record.set("specs_fr", item.specs); // Manual translation needed for keys

        record.set("daily_rate", item.daily_rate);
        record.set("stock", 2);
        record.set("stock_available", 2);
        record.set("visibility", true);

        // Type setting for filters/lighting
        if (item.category_slug === 'lighting') record.set("type", item.specs.type);

        // Image Handling
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