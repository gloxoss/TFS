/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    // NOTE: In this environment, 'app' (App instance) is passed, not 'db'.
    // We use app methods directly (findRecordsByFilter, save, etc.)

    // 1. Find the target category (Power or Power & Cables)
    let category;
    try {
        // Try to find 'power' or 'power-cables'
        // app.findRecordsByFilter returns an array of records
        const result = app.findRecordsByFilter("categories", "slug ~ 'power'", "-created", 1);
        if (result && result.length > 0) {
            category = result[0];
        }
    } catch (e) {
        console.log("Could not find Power category via filter, trying exact slugs...");
    }

    if (!category) {
        try { category = app.findFirstRecordByData("categories", "slug", "power-cables"); } catch (e) { }
    }
    if (!category) {
        try { category = app.findFirstRecordByData("categories", "slug", "power"); } catch (e) { }
    }

    if (!category) {
        console.log("CRITICAL: No 'Power' related category found. Skipping seed.");
        return;
    }

    console.log(`Using Category: ${category.getString("name")} (${category.id})`);

    // 2. Define Items
    const items = [
        {
            "name": "Bebob V200 Micro 196Wh",
            "slug": "bebob-v200-micro",
            "rate": 55,
            "specs": { "capacity": "196Wh", "mount": "V-Mount", "output": "14.4V / 16A" },
            "description": "Compact 14.4V Li-Ion Battery. 196Wh capacity, 16A max draw."
        },
        {
            "name": "Bebob V290RM-CINE 293Wh",
            "slug": "bebob-v290rm-cine",
            "rate": 60,
            "specs": { "capacity": "293Wh", "mount": "V-Mount", "output": "14.8V / 20A" },
            "description": "High Load V-Mount Battery. Supports 20A continuous draw. 293Wh."
        },
        {
            "name": "Bebob B290CINE 4-Battery Kit (B-Mount)",
            "slug": "bebob-b290cine-kit",
            "rate": 250,
            "specs": { "capacity": "4x 294Wh", "kit": "4 Batts + Charger", "mount": "B-Mount" },
            "description": "Kit of 4x B290CINE 294Wh batteries with Quad Charger. B-Mount interface."
        },
        {
            "name": "SWIT PB-R290S+ 290Wh Heavy-Duty",
            "slug": "swit-pb-r290s",
            "rate": 55,
            "specs": { "capacity": "290Wh", "mount": "V-Mount", "protection": "IP54" },
            "description": "IP54 Weatherproof V-Mount Battery. 290Wh, 250W/20A high load."
        },
        {
            "name": "SWIT 140Wh Pocket V-Mount",
            "slug": "swit-pocket-140wh",
            "rate": 35,
            "specs": { "capacity": "140Wh", "mount": "V-Mount", "size": "Pocket/Compact" },
            "description": "Ultracompact professional battery. 140Wh capacity, 12A max load."
        },
        {
            "name": "IDX DUO-C198P 193Wh",
            "slug": "idx-duo-c198p",
            "rate": 40,
            "specs": { "capacity": "193Wh", "features": "D-Tap / USB", "mount": "V-Mount" },
            "description": "Compact High-Load Li-Ion V-Mount. 193Wh, 14A draw. Data display."
        }
    ];

    const collection = app.findCollectionByNameOrId("equipment");

    // 3. Insert Items
    items.forEach(item => {
        try {
            // Check duplication
            let existing;
            try { existing = app.findFirstRecordByData("equipment", "slug", item.slug); } catch (e) { }

            if (existing) {
                console.log(`Skipping ${item.slug} (exists)`);
                return;
            }

            const record = new Record(collection);
            record.set("name", item.name);
            record.set("slug", item.slug);
            record.set("description", item.description);
            record.set("daily_rate", item.rate);
            record.set("specs", item.specs);
            record.set("category", category.id);
            record.set("stock_quantity", 4);
            record.set("active", true);
            record.set("item_sort_order", 500); // Middle order

            // Using app.save() based on previous migration style
            app.save(record);
            console.log(`Seeded: ${item.name}`);
        } catch (err) {
            console.log(`Error seeding ${item.name}: ${err}`);
        }
    });

}, (app) => {
    // down
})
