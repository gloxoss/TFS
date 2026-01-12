/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {

    const equipmentData = [
        // --- STABILIZING SUPPORT (Easyrigs / Armor Man) ---
        {
            name: "Easyrig 2.5 600N",
            slug: "easyrig-2-5-600n",
            brand: "Easyrig",
            category_slug: "stabilizers",
            description_en: "Cost effective stabilizing support. Reduces static load on neck and shoulder muscles.",
            description_fr: "Support stabilisateur économique. Réduit la charge statique sur les muscles du cou et des épaules.",
            specs: { "load_capacity": "600N (approx 12-15kg)", "type": "Body Support" },
            daily_rate: 100,
            image_urls: ["https://www.adorama.com/images/XLarge/easyrig-2-400n-stabilizing-camera-support_erig400_1.webp"]
        },
        {
            name: "Easyrig Vario 5 Gimbal Rig",
            slug: "easyrig-vario-5-gimbal",
            brand: "Easyrig",
            category_slug: "stabilizers",
            description_en: "Adjustable support for rigs 11-38 lb. Includes Gimbal Rig Vest and 5\" Extended Arm.",
            description_fr: "Support réglable pour configurations de 5 à 17 kg. Inclut gilet Gimbal et bras étendu.",
            specs: { "load_range": "11-38 lb", "arm": "5-inch Extended", "vest": "Gimbal Rig" },
            daily_rate: 180,
            image_urls: ["https://static.bhphoto.com/images/multiple_images/images500x500/1434390382_IMG_505123.jpg"]
        },
        {
            name: "Tilta Armor Man 3.0",
            slug: "tilta-armor-man-3",
            brand: "Tilta",
            category_slug: "stabilizers",
            description_en: "Exoskeleton support for gimbals. Supports Tilta Gravity, MōVI, Ronin. Spring-loaded arms.",
            description_fr: "Support exosquelette pour gimbals. Bras à ressort.",
            specs: { "type": "Exoskeleton", "compatibility": "Universal Gimbal" },
            daily_rate: 200,
            // Re-using generic image if specific not provided or broken, using placeholders based on input
            image_urls: ["https://static.bhphoto.com/images/multiple_images/images500x500/1434390382_IMG_505123.jpg"]
        },
        {
            name: "Tilta Armor Man 2",
            slug: "tilta-armor-man-2",
            brand: "Tilta",
            category_slug: "stabilizers",
            description_en: "Designed to take weight off arms. Version with V-mount plate attached to vest.",
            description_fr: "Conçu pour soulager le poids des bras. Version avec plaque V-mount.",
            specs: { "type": "Exoskeleton", "feature": "V-Mount Plate" },
            daily_rate: 150,
            image_urls: ["https://static.bhphoto.com/images/multiple_images/images500x500/1434390382_IMG_505123.jpg"]
        },

        // --- BATTERIES ---
        {
            name: "Bebob V200 Micro 196Wh",
            slug: "bebob-v200-micro",
            brand: "Bebob",
            category_slug: "power",
            description_en: "Compact 14.4V Li-Ion Battery. 196Wh capacity, 16A max draw.",
            description_fr: "Batterie Li-Ion compacte 14.4V. Capacité 196Wh, tirage max 16A.",
            specs: { "mount": "V-Mount", "capacity": "196Wh", "output": "14.4V / 16A" },
            daily_rate: 45,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1600338928_1594107.jpg"]
        },
        {
            name: "Bebob V290RM-CINE 293Wh",
            slug: "bebob-v290rm-cine",
            brand: "Bebob",
            category_slug: "power",
            description_en: "High Load V-Mount Battery. Supports 20A continuous draw. 293Wh.",
            description_fr: "Batterie V-Mount haute charge. Supporte 20A en continu. 293Wh.",
            specs: { "mount": "V-Mount", "capacity": "293Wh", "output": "14.8V / 20A" },
            daily_rate: 60,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1527091561_1409408.jpg"]
        },
        {
            name: "Bebob B290CINE 4-Battery Kit (B-Mount)",
            slug: "bebob-b290cine-kit",
            brand: "Bebob",
            category_slug: "power",
            description_en: "Kit of 4x B290CINE 294Wh batteries with Quad Charger. B-Mount interface.",
            description_fr: "Kit de 4 batteries B290CINE 294Wh avec chargeur quadruple. Interface B-Mount.",
            specs: { "mount": "B-Mount", "capacity": "4x 294Wh", "kit": "4 Batts + Charger" },
            daily_rate: 250,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1720197931_1698235.jpg"]
        },
        {
            name: "SWIT PB-R290S+ 290Wh Heavy-Duty",
            slug: "swit-pb-r290s",
            brand: "SWIT",
            category_slug: "power",
            description_en: "IP54 Weatherproof V-Mount Battery. 290Wh, 250W/20A high load.",
            description_fr: "Batterie V-Mount étanche IP54. 290Wh, haute charge 250W/20A.",
            specs: { "mount": "V-Mount", "capacity": "290Wh", "protection": "IP54" },
            daily_rate: 55,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1668522319_1734750.jpg"]
        },
        {
            name: "SWIT 140Wh Pocket V-Mount",
            slug: "swit-pocket-140wh",
            brand: "SWIT",
            category_slug: "power",
            description_en: "Ultracompact professional battery. 140Wh capacity, 12A max load.",
            description_fr: "Batterie professionnelle ultra-compacte. Capacité 140Wh.",
            specs: { "mount": "V-Mount", "capacity": "140Wh", "size": "Pocket/Compact" },
            daily_rate: 35,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1655218230_1710560.jpg"]
        },
        {
            name: "IDX DUO-C198P 193Wh",
            slug: "idx-duo-c198p",
            brand: "IDX",
            category_slug: "power",
            description_en: "Compact High-Load Li-Ion V-Mount. 193Wh, 14A draw. Data display.",
            description_fr: "V-Mount Li-Ion compact haute charge. 193Wh, tirage 14A.",
            specs: { "mount": "V-Mount", "capacity": "193Wh", "features": "D-Tap / USB" },
            daily_rate: 40,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1649070368_1699540.jpg"]
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
    const ensureCategory = (slug, name, nameFr) => {
        try {
            return app.findFirstRecordByFilter("categories", `slug="${slug}"`);
        } catch (e) {
            const cat = new Record(app.findCollectionByNameOrId("categories"));
            cat.set("slug", slug);
            cat.set("name", name);
            cat.set("name_en", name);
            cat.set("name_fr", nameFr);
            app.save(cat);
            return cat;
        }
    };

    const categories = {
        "stabilizers": ensureCategory("stabilizers", "Stabilizers", "Stabilisateurs"),
        "power": ensureCategory("power", "Power & Batteries", "Énergie & Batteries")
    };

    const equipmentCollection = app.findCollectionByNameOrId("equipment");

    equipmentData.forEach(item => {
        try {
            const existing = app.findFirstRecordByFilter("equipment", `slug="${item.slug}"`);
            if (existing) app.delete(existing);
        } catch (e) { }

        console.log(`Seeding: ${item.name}`);
        const record = new Record(equipmentCollection);

        record.set("name", item.name);
        record.set("name_en", item.name);
        record.set("name_fr", item.description_fr ? item.name : item.name);
        record.set("slug", item.slug);
        record.set("brand", item.brand);
        record.set("category", categories[item.category_slug].id);

        record.set("description_en", item.description_en);
        record.set("description_fr", item.description_fr);
        record.set("specs", item.specs);
        record.set("specs_en", item.specs);
        record.set("specs_fr", item.specs);

        record.set("daily_rate", item.daily_rate);
        record.set("stock", 4);
        record.set("stock_available", 4);
        record.set("visibility", true);

        if (item.category_slug === 'power') {
            record.set("type", "Battery");
        }

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