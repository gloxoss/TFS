/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {

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
    const getCategoryIdSafe = (slugs) => {
        for (const slug of slugs) {
            try {
                return app.findFirstRecordByFilter("categories", `slug="${slug}"`).id;
            } catch (e) { }
        }
        try {
            return app.findFirstRecordByFilter("categories", 'slug="cameras"').id;
        } catch (e) { return null; }
    };

    const catFilters = getCategoryIdSafe(["filters"]);
    const catGrip = getCategoryIdSafe(["grip-dollies", "grip"]);

    const newItems = [
        // --- FILTERS ---
        {
            name: "Schneider ND 0.3 (1-Stop)",
            slug: "schneider-nd-03",
            brand: "Schneider",
            category: catFilters,
            description_en: "Solid neutral density filter providing a 1-stop exposure reduction.",
            description_fr: "Filtre à densité neutre solide offrant une réduction d'exposition d'un diaphragme.",
            specs: { "size": "4x5.65", "type": "ND", "density": "0.3" },
            daily_rate: 15,
            image_urls: ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/Tiffen_45650ND3_4_x_5_65_Neutral_1636720564_86014.jpg"]
        },
        {
            name: "Schneider IRND 0.3 (1-Stop)",
            slug: "schneider-irnd-03",
            brand: "Schneider",
            category: catFilters,
            description_en: "Full Spectrum IRND Filter. Combines infrared control with 1-stop ND.",
            description_fr: "Filtre IRND à spectre complet. Combine le contrôle infrarouge avec un ND d'un diaphragme.",
            specs: { "size": "4x5.65", "type": "IRND", "density": "0.3" },
            daily_rate: 20,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1502792755_572940.jpg"]
        },
        {
            name: "Schneider Soft-Edge Grad ND 0.9 (3-Stop)",
            slug: "schneider-grad-nd-09",
            brand: "Schneider",
            category: catFilters,
            description_en: "Graduated ND filter to specifically darken skies. Soft-edged transition.",
            description_fr: "Filtre ND dégradé pour assombrir spécifiquement le ciel. Transition douce.",
            specs: { "size": "4x5.65", "type": "Grad ND", "density": "0.9" },
            daily_rate: 20,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1629724915_373624.jpg"]
        },
        {
            name: "Tiffen Black Pro-Mist 1/4",
            slug: "tiffen-bpm-1-4",
            brand: "Tiffen",
            category: catFilters,
            description_en: "Reduces highlight value while softening contrast. Smooths facial wrinkles.",
            description_fr: "Réduit la valeur des hautes lumières tout en adoucissant le contraste. Lisse les rides du visage.",
            specs: { "size": "4x5.65", "type": "Diffusion", "strength": "1/4" },
            daily_rate: 20,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1727344805_85878.jpg"]
        },
        {
            name: "Schneider Glimmerglass 1",
            slug: "schneider-glimmerglass-1",
            brand: "Schneider",
            category: catFilters,
            description_en: "Beauty filter that softens skin details and produces glowing highlights.",
            description_fr: "Filtre de beauté qui adoucit les détails de la peau et produit des reflets brillants.",
            specs: { "size": "4x5.65", "type": "Diffusion", "strength": "1" },
            daily_rate: 20,
            image_urls: ["https://cdn.cvp.com/images/products/altimage/25-03-20201585145210tiffen-glimmerglass-filter-1.jpg"]
        },
        {
            name: "Tiffen Soft FX Filter",
            slug: "tiffen-soft-fx",
            brand: "Tiffen",
            category: catFilters,
            description_en: "Enhance images with a soft, dreamy effect. Adds a touch of magic.",
            description_fr: "Améliorez les images avec un effet doux et rêveur. Ajoute une touche de magie.",
            specs: { "size": "4x5.65", "type": "Diffusion" },
            daily_rate: 20,
            image_urls: ["https://videoking.eu/wp-content/uploads/2020/01/W4565BKPEARL.jpg"]
        },
        {
            name: "Tiffen/Schneider Diopter Tray",
            slug: "diopter-tray",
            brand: "Revar Cine",
            category: catFilters,
            description_en: "Double Tray for 138mm Close-Up Diopter. Fits most 4x5.65 matte boxes.",
            description_fr: "Double plateau pour dioptrie gros plan de 138 mm. Convient à la plupart des matte boxes 4x5.65.",
            specs: { "size": "4x5.65", "accepts": "138mm Diopter" },
            daily_rate: 25,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1683899428_1763255.jpg"]
        },
        {
            name: "Schneider Hollywood Black Magic",
            slug: "schneider-hbm",
            brand: "Schneider",
            category: catFilters,
            description_en: "Reduces blemishes and wrinkles. Softens highlights and mid-tone contrast.",
            description_fr: "Réduit les imperfections et les rides. Adoucit les hautes lumières et le contraste des tons moyens.",
            specs: { "size": "4x5.65", "type": "Diffusion" },
            daily_rate: 20,
            image_urls: ["https://www.camerahire.com.au/images/hire/Schneider_ND_Filters_480x3502.png"]
        },
        {
            name: "ARRI Rota Pola Frame",
            slug: "arri-rota-pola",
            brand: "ARRI",
            category: catFilters,
            description_en: "Rotating polarizer tray. Reduces reflections and glare from non-metallic surfaces.",
            description_fr: "Plateau polarisant rotatif. Réduit les reflets et l'éblouissement.",
            specs: { "size": "4x5.65", "type": "Polarizer" },
            daily_rate: 40,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1641919557_1367822.jpg"]
        },
        {
            name: "Schneider Linear True-Pol Polarizer",
            slug: "schneider-true-pol",
            brand: "Schneider",
            category: catFilters,
            description_en: "Effective linear polarizer for motion picture cameras. High extinction ratio.",
            description_fr: "Polarisant linéaire efficace pour les caméras de cinéma. Rapport d'extinction élevé.",
            specs: { "size": "4x5.65", "type": "Polarizer" },
            daily_rate: 25,
            image_urls: ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/Schneider_68013056_True_Polarizing_Filter_4_x_1565868205_398939.jpg"]
        },
        {
            name: "Tiffen 138mm Full Field Diopter Set",
            slug: "tiffen-diopter-set",
            brand: "Tiffen",
            category: catFilters,
            description_en: "Set of diopters (+1/2, +1, +2, +3). Achieve precise close-up shots.",
            description_fr: "Jeu de dioptries (+1/2, +1, +2, +3). Obtenez des gros plans précis.",
            specs: { "size": "138mm", "type": "Diopter Set" },
            daily_rate: 60,
            image_urls: ["https://images.squarespace-cdn.com/content/v1/61a7f2611cbe417ce838e1b3/09e74e3c-45b5-48cf-9681-5cf3b2cb3187/Tiffen-138mm-Diopter-Set-Wide.png?format=2500w"]
        },
        {
            name: "Tiffen Enhancing Glass Filter",
            slug: "tiffen-enhancing",
            brand: "Tiffen",
            category: catFilters,
            description_en: "Increases color saturation of reddish objects. Maximizes red hues.",
            description_fr: "Augmente la saturation des couleurs des objets rougeâtres. Maximise les teintes rouges.",
            specs: { "size": "4x5.65", "type": "Color Enhancer" },
            daily_rate: 20,
            image_urls: ["https://tiffen.com/cdn/shop/products/W4565DDFX1.jpg?crop=center&v=1739222576&width=1100"]
        },
        {
            name: "Schneider True-Streak Blue 2mm",
            slug: "schneider-true-streak-blue",
            brand: "Schneider",
            category: catFilters,
            description_en: "Creates prominent, elongated blue streaks from point light sources.",
            description_fr: "Crée des stries bleues allongées et proéminentes à partir de sources lumineuses ponctuelles.",
            specs: { "size": "4x5.65", "type": "Effect", "effect": "Blue Streak" },
            daily_rate: 25,
            image_urls: ["https://static.bhphoto.com/images/images500x500/1568816621_944109.jpg"]
        },
        {
            name: "Tiffen Sky 1A Filter",
            slug: "tiffen-sky-1a",
            brand: "Tiffen",
            category: catFilters,
            description_en: "Reduces atmospheric haze. Compensates for cool, bluish cast outdoors.",
            description_fr: "Réduit la brume atmosphérique. Compense la dominante bleuâtre froide à l'extérieur.",
            specs: { "size": "4x5.65", "type": "UV / Haze" },
            daily_rate: 15,
            image_urls: ["https://cdn.cvp.com/images/products/altimage/24-03-20201585060928tiffen-4x5.65-clear-coated-filter-1.jpg"]
        },

        // --- GRIP ---
        {
            name: "Movietech Magnum Dolly",
            slug: "movietech-magnum",
            brand: "MovieTech",
            category: catGrip,
            description_en: "Electromechanical column dolly. Programmable column. Adjustable counterweight.",
            description_fr: "Dolly à colonne électromécanique. Colonne programmable. Contrepoids réglable.",
            specs: { "type": "Dolly", "column": "Electromechanical" },
            daily_rate: 450,
            image_urls: ["https://fookuspookus.ee/wp-content/uploads/2024/03/magnum-dolly.png"]
        },
        {
            name: "MovieTech Scooter Dolly",
            slug: "movietech-scooter",
            brand: "MovieTech",
            category: catGrip,
            description_en: "Compact camera slider dolly. Extendable track length.",
            description_fr: "Dolly slider compacte. Longueur de rail extensible.",
            specs: { "type": "Slider Dolly", "mobility": "Track" },
            daily_rate: 150,
            image_urls: ["https://www.movietech.de/wp-content/uploads/2024/02/MovieTech-Scooter-Dolly-650x650-1.jpg"]
        },
        {
            name: "Panther Super Panther Dolly",
            slug: "panther-super-panther",
            brand: "Panther",
            category: catGrip,
            description_en: "Hydraulic column dolly. Lifts operator and camera simultaneously.",
            description_fr: "Dolly à colonne hydraulique. Soulève l'opérateur et la caméra simultanément.",
            specs: { "type": "Dolly", "column": "Hydraulic" },
            daily_rate: 400,
            image_urls: ["https://finalcutequipped.com/wp-content/uploads/2023/02/5cad1611d10c09ca67455c2c_classicplusdolly-943x1024.jpg"]
        },
        {
            name: "Mount Slider Kit for Dolly",
            slug: "slider-mount-kit",
            brand: "Generic",
            category: catGrip,
            description_en: "Securely attach a fluid head to a camera slider. Provides stable support.",
            description_fr: "Fixez solidement une tête fluide à un slider de caméra. Fournit un support stable.",
            specs: { "type": "Accessory", "compatibility": "Sliders" },
            daily_rate: 50,
            image_urls: ["https://d1rzxhvrtciqq1.cloudfront.net/images/listing_images/images/50529/big/3d5f5c-157d9a-nr2415521403.jpg"]
        },
        {
            name: "Panther Husky Dolly",
            slug: "panther-husky",
            brand: "Panther",
            category: catGrip,
            description_en: "Foldable and lightweight dolly. Supports loads up to 250 kg.",
            description_fr: "Dolly pliable et légère. Supporte des charges jusqu'à 250 kg.",
            specs: { "type": "Dolly", "payload": "250kg" },
            daily_rate: 200,
            image_urls: ["https://patriot.ua/wp-content/uploads/2019/06/A62A0080-kopyya.jpg"]
        },
        {
            name: "Chapman PeeWee Dolly (Espace)",
            slug: "chapman-peewee",
            brand: "Chapman",
            category: catGrip,
            description_en: "Industry standard hydraulic dolly. Crab, Convex, and Round steering modes.",
            description_fr: "Dolly hydraulique standard de l'industrie. Modes de direction Crabe, Convexe et Rond.",
            specs: { "type": "Dolly", "steering": "3-Mode" },
            daily_rate: 350,
            image_urls: ["https://www.tsf.fr/wp-content/uploads/2023/10/PEEWEE-V-1024x718.jpg"]
        },
        {
            name: "GFM Lite Dolly",
            slug: "gfm-lite",
            brand: "GFM",
            category: catGrip,
            description_en: "Pull-type trolley dolly. Usable on wheels or track.",
            description_fr: "Dolly chariot à tirer. Utilisable sur roues ou sur rail.",
            specs: { "type": "Dolly", "track_width": "62cm" },
            daily_rate: 150,
            image_urls: ["https://www.tsf.fr/wp-content/uploads/2017/12/G-LITE-1-0.png"]
        },
        {
            name: "MovieBird 45 Crane",
            slug: "moviebird-45",
            brand: "MovieBird",
            category: catGrip,
            description_en: "Versatile telescopic crane. 35ft to 45ft reach in seconds.",
            description_fr: "Grue télescopique polyvalente. Portée de 35 à 45 pieds en quelques secondes.",
            specs: { "type": "Telescopic Crane", "reach": "45 ft" },
            daily_rate: 1500,
            image_urls: ["https://eurogrip.com/media/com_jmsproduct/tmpl/83/MB45-2-tlo-6-znak-wodny800px.png"]
        },
        {
            name: "Phoenix Crane",
            slug: "phoenix-crane",
            brand: "Generic",
            category: catGrip,
            description_en: "Large hybrid platform/remote crane. Very stable.",
            description_fr: "Grande grue hybride plateforme/télécommande. Très stable.",
            specs: { "type": "Crane", "style": "Hybrid" },
            daily_rate: 1000,
            image_urls: ["https://www.tsf.fr/wp-content/uploads/2017/12/G-PH-1-0.png"]
        },
        {
            name: "MultiTower Scaffolding",
            slug: "multitower",
            brand: "Generic",
            category: catGrip,
            description_en: "Mobile scaffolding solution for safe assembly. Extendable up to 13.20m.",
            description_fr: "Solution d'échafaudage mobile pour un montage sûr. Extensible jusqu'à 13,20 m.",
            specs: { "type": "Rigging", "height": "Max 13.2m" },
            daily_rate: 100,
            image_urls: ["https://cdn.djust-app.com/img/0000000034_ve/product/1493423/98195275_1d803712e87d414b81a5a34653667cd5?width=329&height=329&format=webp&fit=contain"]
        },
        {
            name: "Panther Pegasus Crane",
            slug: "panther-pegasus",
            brand: "Panther",
            category: catGrip,
            description_en: "Modular crane. Steel and aluminum construction. Weather resistant.",
            description_fr: "Grue modulaire. Construction en acier et aluminium. Résistant aux intempéries.",
            specs: { "type": "Crane", "build": "Modular" },
            daily_rate: 800,
            image_urls: ["https://mundocrane.com/wp-content/uploads/2020/03/pegasus-2-mundo-crane.jpg"]
        },
        {
            name: "ABC 120 Lightweight Crane",
            slug: "abc-120",
            brand: "MovieTech",
            category: catGrip,
            description_en: "Versatile lightweight crane. Setup versions: 9m, 10.5m, 12m.",
            description_fr: "Grue légère polyvalente. Versions d'installation : 9m, 10,5m, 12m.",
            specs: { "type": "Crane", "length": "12m Max" },
            daily_rate: 600,
            image_urls: ["https://www.movietech.de/wp-content/uploads/2024/04/MovieTech-ABC-Crane-120-9m-Lightweight-Broadcast-Crane-650x650-1.jpg"]
        },
        {
            name: "Stanton Jimmy Jib",
            slug: "jimmy-jib",
            brand: "Stanton",
            category: catGrip,
            description_en: "Remote-controlled jib. Flexible and lightweight.",
            description_fr: "Jib télécommandé. Flexible et léger.",
            specs: { "type": "Jib", "control": "Remote" },
            daily_rate: 400,
            image_urls: ["https://www.jimmyjib.com/uimages/home/featured/home-triangle-pro-series.jpg"]
        },
        {
            name: "Egripment Javelin Crane",
            slug: "egripment-javelin",
            brand: "Egripment",
            category: catGrip,
            description_en: "Modular crane. High structural rigidity. Streamlined arm design.",
            description_fr: "Grue modulaire. Haute rigidité structurelle. Conception de bras simplifiée.",
            specs: { "type": "Crane", "style": "Modular" },
            daily_rate: 600,
            image_urls: ["https://egripment.com/assets/components/phpthumbof/cache/Naamloos.b8d4572a526726ec7e9752fd1c024425.jpg"]
        },
        {
            name: "Gizmo Jib",
            slug: "gizmo-jib",
            brand: "MovieTech",
            category: catGrip,
            description_en: "Modular jib system. Extendable front segment. S to XXL versions.",
            description_fr: "Système de jib modulaire. Segment avant extensible. Versions S à XXL.",
            specs: { "type": "Jib", "range": "Adjustable" },
            daily_rate: 300,
            image_urls: ["https://www.movietech.de/wp-content/uploads/2023/11/1301-03_Gizmo-Jib-Version-L-Ohne-Hintergrund_650x650px.jpg"]
        },
        {
            name: "Panther U-Bangi II",
            slug: "panther-u-bangi",
            brand: "Panther",
            category: catGrip,
            description_en: "Camera tracking slider. Enables shots in a spherical space.",
            description_fr: "Slider de tracking caméra. Permet des prises de vue dans un espace sphérique.",
            specs: { "type": "Slider", "payload": "80kg" },
            daily_rate: 150,
            image_urls: ["https://utopiacam.com/wp-content/uploads/2016/10/panther-u-bangi.jpg"]
        },
        {
            name: "GFM Mini Jib",
            slug: "gfm-mini-jib",
            brand: "GFM",
            category: catGrip,
            description_en: "Stable and strong mini jib. Extendable front section.",
            description_fr: "Mini jib stable et solide. Section avant extensible.",
            specs: { "type": "Jib", "size": "Mini" },
            daily_rate: 150,
            image_urls: ["https://photocinerent.com/storage/1382/conversions/GFM-Mini-JIB-6QVH-slide.jpg"]
        },
        {
            name: "Panther Lightweight Jib",
            slug: "panther-lightweight-jib",
            brand: "Panther",
            category: catGrip,
            description_en: "Universal jib arm mountable on all Panther Dollies.",
            description_fr: "Bras de jib universel montable sur toutes les dollies Panther.",
            specs: { "type": "Jib", "mount": "Dolly" },
            daily_rate: 250,
            image_urls: ["https://utopiacam.com/wp-content/uploads/2016/10/lighweightjib_title.jpg"]
        },
        {
            name: "Panther Boogie Wheels",
            slug: "panther-boogie-wheels",
            brand: "Panther",
            category: catGrip,
            description_en: "Keeps dolly steady on straight or curved tracks.",
            description_fr: "Maintient la dolly stable sur des rails droits ou courbes.",
            specs: { "type": "Accessory", "compatibility": "Panther Dolly" },
            daily_rate: 80,
            image_urls: ["https://fookuspookus.ee/wp-content/uploads/2023/08/boogie-wheels-1.jpg"]
        },
        {
            name: "System Low Rig Set",
            slug: "system-low-rig",
            brand: "MovieTech",
            category: catGrip,
            description_en: "Snake Bracket for ultra-low angle shots.",
            description_fr: "Support Snake pour prises de vue en contre-plongée extrême.",
            specs: { "type": "Rigging", "application": "Low Angle" },
            daily_rate: 100,
            image_urls: ["https://www.movietech.de/wp-content/uploads/2023/12/2005-3500Set-Syszem-Low-rig-new-turntsile-650x650-1.jpg"]
        },
        {
            name: "Low Rig Set Panther",
            slug: "panther-low-rig",
            brand: "Panther",
            category: catGrip,
            description_en: "Compact camera mounting system for low angle shots.",
            description_fr: "Système de montage de caméra compact pour prises de vue en contre-plongée.",
            specs: { "type": "Rigging", "application": "Low Angle" },
            daily_rate: 100,
            image_urls: ["https://www.movietech.de/wp-content/uploads/2023/12/2005-3500Set-Syszem-Low-rig-new-turntsile-650x650-1.jpg"]
        },
        {
            name: "Panther Straight Track",
            slug: "panther-straight-track",
            brand: "Panther",
            category: catGrip,
            description_en: "Precision aluminum straight dolly track.",
            description_fr: "Rail de dolly droit en aluminium de précision.",
            specs: { "type": "Track", "shape": "Straight" },
            daily_rate: 50,
            image_urls: ["https://cdn.prod.website-files.com/66ba0723facf47228bf58e73/684a7a35344929502a0ec11f_curved%20tracks%20cover.png"]
        },
        {
            name: "Panther Curved Track",
            slug: "panther-curved-track",
            brand: "Panther",
            category: catGrip,
            description_en: "Precision aluminum curved dolly track.",
            description_fr: "Rail de dolly courbe en aluminium de précision.",
            specs: { "type": "Track", "shape": "Curved" },
            daily_rate: 50,
            image_urls: ["https://cdn.prod.website-files.com/66ba0723facf47228bf58e73/684a7a35344929502a0ec11f_curved%20tracks%20cover.png"]
        },
        {
            name: "GFM Curved Track",
            slug: "gfm-curved-track",
            brand: "GFM",
            category: catGrip,
            description_en: "Stainless steel/Aluminum track system.",
            description_fr: "Système de rail en acier inoxydable/aluminium.",
            specs: { "type": "Track", "shape": "Curved" },
            daily_rate: 50,
            image_urls: ["https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s2dff3baea53019e6/image/id3bec16208d025fb/version/1505572535/image.jpg"]
        },
        {
            name: "GFM Straight Track",
            slug: "gfm-straight-track",
            brand: "GFM",
            category: catGrip,
            description_en: "Stainless steel/Aluminum track system.",
            description_fr: "Système de rail en acier inoxydable/aluminium.",
            specs: { "type": "Track", "shape": "Straight" },
            daily_rate: 50,
            image_urls: ["https://cinegear.biz/uploads/60a8a2122fff1_GFM%208ft%20Dolly%20Track.png"]
        },
        {
            name: "Manfrotto Autopoles",
            slug: "manfrotto-autopoles",
            brand: "Manfrotto",
            category: catGrip,
            description_en: "Short/Long Autopoles. Floor-to-ceiling mounting.",
            description_fr: "Autopoles courts/longs. Montage sol-plafond.",
            specs: { "type": "Rigging", "mechanism": "Cantilever" },
            daily_rate: 30,
            image_urls: ["https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/Manfrotto_076SET_076SET_Short_Autopoles_1233192889_560187.jpg"]
        },
        {
            name: "Barracuda Bar",
            slug: "barracuda-bar",
            brand: "Generic",
            category: catGrip,
            description_en: "Aluminum crossbars to hold spotlights.",
            description_fr: "Traverses en aluminium pour maintenir les projecteurs.",
            specs: { "type": "Rigging" },
            daily_rate: 40,
            image_urls: ["https://turtlemaxlocation.com/wp-content/uploads/2019/02/jeu-de-barres-scaled.jpg"]
        },
        {
            name: "Euro Riser Set",
            slug: "euro-riser-set",
            brand: "MovieTech",
            category: catGrip,
            description_en: "Set of Euro Risers (Bazookas). 10 to 50 cm lengths.",
            description_fr: "Jeu de Euro Risers (Bazookas). Longueurs de 10 à 50 cm.",
            specs: { "type": "Rigging", "mount": "Euro" },
            daily_rate: 60,
            image_urls: ["https://www.movietech.de/wp-content/uploads/2023/12/2134-1000Set-Riser-Bazooka-10-20-30-40-50-cm-incl-case_-650x650-1.jpg"]
        },
        {
            name: "Gas Riser Adjustable",
            slug: "gas-riser",
            brand: "MovieTech",
            category: catGrip,
            description_en: "Adjustable column extension with gas pressure support.",
            description_fr: "Extension de colonne réglable avec support de pression de gaz.",
            specs: { "type": "Rigging", "payload": "40kg" },
            daily_rate: 80,
            image_urls: ["https://www.movietech.de/wp-content/uploads/2024/01/2135-0_MovieTech_Gas_riser_Adjustable_39-73cm_650x650.jpg"]
        },
        {
            name: "Ball Adapter 150mm",
            slug: "ball-adapter-150mm",
            brand: "MovieTech",
            category: catGrip,
            description_en: "Adapter to convert Euro mount to 150mm Bowl.",
            description_fr: "Adaptateur pour convertir la monture Euro en bol de 150 mm.",
            specs: { "type": "Adapter", "mount": "150mm Bowl" },
            daily_rate: 25,
            image_urls: ["https://www.movietech.de/wp-content/uploads/2023/12/2031-0_MovieTech_Bowl_Adapter_150_mm_650x650.jpg"]
        }
    ];

    newItems.forEach(item => {
        let record;
        try {
            record = app.findFirstRecordByFilter("equipment", `slug="${item.slug}"`);
            console.log(`Updating: ${item.name}`);
        } catch (e) {
            console.log(`Creating: ${item.name}`);
            record = new Record(equipmentCollection);
        }

        // Common fields update
        record.set("name", item.name);
        record.set("name_en", item.name);
        record.set("name_fr", item.name);
        record.set("slug", item.slug);
        record.set("brand", item.brand);
        record.set("category", item.category);

        // Explicitly set category_sort_order
        try {
            if (item.category) {
                const catRec = app.findRecordById("categories", item.category);
                record.set("category_sort_order", catRec.getInt("sort_order"));
            }
        } catch (e) { }

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
                record.set("image", mainImg);
            }
        }

        app.save(record);
    });

}, (app) => {
    // Rollback logic
});