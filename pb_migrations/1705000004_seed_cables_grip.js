/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {

    // 1. Data Definitions
    const equipmentData = [
        // ... Previous items filtered out as they were already seeded ...
        {
            name: "Panther Husky Dolly",
            slug: "panther-husky-dolly",
            brand: "Panther",
            category_slug: "grip",
            description_en: "Foldable and lightweight dolly. Supports loads up to 250kg. Includes Vario Bazooka.",
            description_fr: "Dolly pliable et légère. Supporte jusqu'à 250 kg. Inclut Vario Bazooka.",
            specs: { "type": "Dolly", "payload": "250kg", "feature": "Foldable" },
            daily_rate: 200,
            image_urls: ["https://patriot.ua/wp-content/uploads/2019/06/A62A0080-kopyya.jpg"]
        },
        {
            name: "Chapman PeeWee Dolly",
            slug: "chapman-peewee",
            brand: "Chapman",
            category_slug: "grip",
            description_en: "Industry standard hydraulic lift dolly. 3 steering modes: Crab, Round, Conventional.",
            description_fr: "Dolly hydraulique standard de l'industrie. 3 modes de direction.",
            specs: { "type": "Dolly", "steering": "Crab / Round / Conventional" },
            daily_rate: 350,
            image_urls: ["https://www.tsf.fr/wp-content/uploads/2023/10/PEEWEE-V-1024x718.jpg"]
        },
        {
            name: "MovieBird 45 Telescopic Crane",
            slug: "moviebird-45",
            brand: "MovieBird",
            category_slug: "grip",
            description_en: "Telescopic crane with 35ft to 45ft reach. Fast extension speed.",
            description_fr: "Grue télescopique avec une portée de 35 à 45 pieds.",
            specs: { "type": "Telescopic Crane", "reach": "45 ft (13.7m)" },
            daily_rate: 1500,
            image_urls: ["https://eurogrip.com/media/com_jmsproduct/tmpl/83/MB45-2-tlo-6-znak-wodny800px.png"]
        },
        {
            name: "Stanton Jimmy Jib Triangle",
            slug: "stanton-jimmy-jib",
            brand: "Stanton",
            category_slug: "grip",
            description_en: "Modular remote controlled jib. Variable lengths. Standard industry workhorse.",
            description_fr: "Jib modulaire télécommandé. Longueurs variables.",
            specs: { "type": "Jib", "control": "Remote Head" },
            daily_rate: 400,
            image_urls: ["https://www.jimmyjib.com/uimages/home/featured/home-triangle-pro-series.jpg"]
        },
        {
            name: "Egripment Javelin Crane",
            slug: "egripment-javelin",
            brand: "Egripment",
            category_slug: "grip",
            description_en: "Modular crane system. High structural rigidity with lightweight construction.",
            description_fr: "Système de grue modulaire. Haute rigidité structurelle.",
            specs: { "type": "Modular Crane" },
            daily_rate: 600,
            image_urls: ["https://egripment.com/assets/components/phpthumbof/cache/Naamloos.b8d4572a526726ec7e9752fd1c024425.jpg"]
        },
        {
            name: "Panther U-Bangi II",
            slug: "panther-u-bangi",
            brand: "Panther",
            category_slug: "grip",
            description_en: "Camera slider/offset system. Allows camera tracking with little effort.",
            description_fr: "Système de slider/déport caméra.",
            specs: { "type": "Slider / Offset", "payload": "80kg" },
            daily_rate: 150,
            image_urls: ["https://utopiacam.com/wp-content/uploads/2016/10/panther-u-bangi.jpg"]
        },
        {
            name: "GFM Mini Jib",
            slug: "gfm-mini-jib",
            brand: "GFM",
            category_slug: "grip",
            description_en: "Stable and strong mini jib. Adjustable length front section.",
            description_fr: "Mini jib stable et solide. Section avant réglable.",
            specs: { "type": "Jib", "size": "Mini" },
            daily_rate: 150,
            image_urls: ["https://photocinerent.com/storage/1382/conversions/GFM-Mini-JIB-6QVH-slide.jpg"]
        },
        {
            name: "Panther Straight Track (Set)",
            slug: "panther-straight-track",
            brand: "Panther",
            category_slug: "grip",
            description_en: "Precision aluminum dolly track. Standard width (62cm).",
            description_fr: "Rail de dolly en aluminium de précision. Largeur standard.",
            specs: { "type": "Track", "shape": "Straight", "width": "62cm" },
            daily_rate: 50,
            image_urls: ["https://cdn.prod.website-files.com/66ba0723facf47228bf58e73/684a7a35344929502a0ec11f_curved%20tracks%20cover.png"]
        },
        {
            name: "Panther Curved Track (Set)",
            slug: "panther-curved-track",
            brand: "Panther",
            category_slug: "grip",
            description_en: "Precision aluminum curved dolly track. Allows for fluid arc shots.",
            description_fr: "Rail de dolly courbe en aluminium de précision.",
            specs: { "type": "Track", "shape": "Curved", "width": "62cm" },
            daily_rate: 50,
            image_urls: ["https://cdn.prod.website-files.com/66ba0723facf47228bf58e73/684a7a35344929502a0ec11f_curved%20tracks%20cover.png"]
        },
        {
            name: "Manfrotto Autopoles (Pair)",
            slug: "manfrotto-autopoles",
            brand: "Manfrotto",
            category_slug: "grip",
            description_en: "Floor-to-ceiling mounting poles. Quick single-action locking.",
            description_fr: "Pôles de montage sol-plafond. Verrouillage rapide.",
            specs: { "type": "Rigging", "mount": "Floor-to-Ceiling" },
            daily_rate: 30,
            image_urls: ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/Manfrotto_076SET_076SET_Short_Autopoles_1233192889_560187.jpg"]
        }
    ];

    // Helper to download images from URL (Keep for reference but unused in loop)
    const fetchImage = (url) => {
        try {
            const res = $http.send({
                url: url,
                method: "GET",
                timeout: 30
            });
            if (res.statusCode === 200) {
                const filename = url.split('/').pop().split('?')[0] || `image_${Date.now()}.jpg`;
                return {
                    name: filename,
                    type: res.headers['Content-Type'] || "image/jpeg",
                    content: res.raw
                };
            }
        } catch (e) {
            console.log(`Failed to fetch image ${url}: ${e}`);
        }
        return null;
    };

    // 2. Ensure Categories Exist
    const ensureCategory = (slug, name, nameFr) => {
        try {
            return app.findFirstRecordByFilter("categories", `slug="${slug}"`);
        } catch (e) {
            console.log(`Creating Category: ${name}`);
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
        "power-distribution": ensureCategory("power-distribution", "Power & Cables", "Énergie & Câbles"),
        "filters": ensureCategory("filters", "Filters", "Filtres"),
        "grip": ensureCategory("grip", "Grip & Dollies", "Machinerie & Dollies")
    };

    const equipmentCollection = app.findCollectionByNameOrId("equipment");

    // 3. Process Items
    equipmentData.forEach(item => {
        try {
            const existing = app.findFirstRecordByFilter("equipment", `slug="${item.slug}"`);
            if (existing) app.delete(existing);
        } catch (e) { }

        console.log(`Creating equipment: ${item.name}`);
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
        record.set("stock", 5);
        record.set("stock_available", 5);
        record.set("visibility", true);

        if (item.category_slug === 'filters') {
            record.set("type", item.specs.type);
        }

        // Disabled internal fetch to avoid timeouts. Use python script instead.
        // if (item.image_urls && item.image_urls.length > 0) {
        //     const mainImg = fetchImage(item.image_urls[0]);
        //     if (mainImg) {
        //          record.set("image", mainImg); 
        //     }
        // }

        app.save(record);
    });

}, (app) => {
    // Rollback logic
});