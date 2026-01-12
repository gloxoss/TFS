/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    const NEW_ITEMS = [
        {
            "id": "cam_amira",
            "name": "ARRI Amira",
            "brand": "ARRI",
            "category": "Cameras",
            "description": "Arri’s Amira offers an ergonomic design that’s well-suited to handheld, shoulder-mount operation. Features the same sensor as the Alexa Mini.",
            "specifications": {
                "sensor_size": "28.3mm x 18.2mm",
                "max_resolution": "3200 x 1800",
                "dynamic_range": "14+ Stops",
                "media_type": "CFast 2.0",
                "weight_lbs": "9.2",
                "codec": "ProRes, ARRIRAW",
                "max_fps": "200fps max"
            },
            "stock_available": 1
        },
        {
            "id": "cam_varicam_lt",
            "name": "Panasonic VariCam LT",
            "brand": "Panasonic",
            "category": "Cameras",
            "description": "The VariCam LT packages the VariCam 35’s 4K Super 35mm sensor in a lightweight, single-body design. Features dual native ISO.",
            "specifications": {
                "sensor_size": "24.6mm x 12.9mm",
                "max_resolution": "4096 x 2160",
                "dynamic_range": "14+ Stops",
                "media_type": "P2 Express, Micro P2",
                "weight_lbs": "6",
                "codec": "AVC-Intra, ProRes",
                "max_fps": "60fps full sensor"
            },
            "stock_available": 1
        },
        {
            "id": "cam_sony_f55",
            "name": "Sony PMW-F55",
            "brand": "Sony",
            "category": "Cameras",
            "description": "The Super 35-format Sony F55 captures 16-bit image files at up to 4K raw. Features a global shutter.",
            "specifications": {
                "sensor_size": "24mm x 12.7mm",
                "max_resolution": "4096 x 2160",
                "dynamic_range": "14 Stops",
                "media_type": "SxS, AXSM",
                "weight_lbs": "4.85",
                "codec": "XAVC, X-OCN",
                "max_fps": "180fps max"
            },
            "stock_available": 1
        },
        {
            "id": "lens_zeiss_master_prime",
            "name": "ARRI / Zeiss Master Prime Set",
            "brand": "Zeiss",
            "category": "Lenses",
            "tags": ["Spherical"],
            "description": "Arri/Zeiss Master Primes offer high contrast and resolution with virtually no breathing. T1.3 aperture across the set.",
            "specifications": {
                "mount": "PL",
                "aperture": "T1.3",
                "coverage": "Super 35"
            },
            "stock_available": 1
        },
        {
            "id": "lens_zeiss_super_speed",
            "name": "ARRI / Zeiss Super Speed MK III Set",
            "brand": "Zeiss",
            "category": "Lenses",
            "tags": ["Spherical"],
            "description": "Renowned for their classic cinematic look, Super Speed MK III primes offer high light-gathering capability (T1.3) with a warm, organic image character.",
            "specifications": {
                "mount": "PL",
                "aperture": "T1.3",
                "coverage": "Super 35"
            },
            "stock_available": 1
        },
        {
            "id": "lens_zeiss_cp2",
            "name": "Zeiss Compact Prime CP.2 Set",
            "brand": "Zeiss",
            "category": "Lenses",
            "tags": ["Spherical"],
            "description": "Designed for versatility, CP.2 lenses deliver sharp, high-contrast images. Interchangeable mounts and full-frame coverage.",
            "specifications": {
                "mount": "PL / EF",
                "aperture": "T2.1",
                "coverage": "Full Frame"
            },
            "stock_available": 1
        },
        {
            "id": "lens_zeiss_cp3",
            "name": "Zeiss Compact Prime CP.3 Set",
            "brand": "Zeiss",
            "category": "Lenses",
            "tags": ["Spherical"],
            "description": "Building on the CP.2, the CP.3 offers improved mechanics, refined optical performance, and a smaller form factor.",
            "specifications": {
                "mount": "PL / EF",
                "aperture": "T2.1",
                "coverage": "Full Frame"
            },
            "stock_available": 1
        },
        {
            "id": "lens_zeiss_ultra_prime",
            "name": "ARRI / Zeiss Ultra Prime Set",
            "brand": "Zeiss",
            "category": "Lenses",
            "tags": ["Spherical"],
            "description": "High-contrast, high-resolution lenses offering even field illumination. Widely considered a workhorse lens for cinema.",
            "specifications": {
                "mount": "PL",
                "aperture": "T1.9",
                "coverage": "Super 35"
            },
            "stock_available": 1
        },
        {
            "id": "lens_zeiss_standard",
            "name": "Zeiss Standard Prime Set",
            "brand": "Zeiss",
            "category": "Lenses",
            "tags": ["Spherical"],
            "description": "Known for their classic ZEISS look, Standard Primes deliver sharp, high-contrast images with natural color reproduction in a tiny form factor.",
            "specifications": {
                "mount": "PL",
                "aperture": "T2.1",
                "coverage": "Super 35"
            },
            "stock_available": 1
        },
        {
            "id": "lens_arri_macro",
            "name": "ARRI Macro Prime Set",
            "brand": "ARRI",
            "category": "Lenses",
            "tags": ["Macro"],
            "description": "Designed for close-focus cinematography, ARRI Macro Primes deliver exceptional sharpness and flat field performance.",
            "specifications": {
                "mount": "PL",
                "aperture": "T2.0",
                "coverage": "Super 35"
            },
            "stock_available": 1
        },
        {
            "id": "lens_zeiss_master_macro",
            "name": "Zeiss Master Macro 100mm",
            "brand": "Zeiss",
            "category": "Lenses",
            "tags": ["Macro"],
            "description": "Designed for high-end macro cinematography, Master Macro Primes deliver exceptional sharpness and contrast from close focus to infinity.",
            "specifications": {
                "focal_length": "100mm",
                "mount": "PL",
                "aperture": "T2.0",
                "coverage": "Super 35"
            },
            "stock_available": 1
        },
        {
            "id": "lens_servicevision_scorpio",
            "name": "Servicevision Scorpion Anamorphic Set",
            "brand": "Servicevision",
            "category": "Lenses",
            "tags": ["Anamorphic"],
            "description": "Designed for lightweight anamorphic cinematography, Scorpion lenses deliver a classic character with pleasing oval bokeh.",
            "specifications": {
                "mount": "PL",
                "aperture": "T2.2",
                "coverage": "Full Frame / Super 35"
            },
            "stock_available": 1
        },
        {
            "id": "lens_arri_uwz",
            "name": "ARRI 9.5-18mm T2.9 Ultra Wide Zoom",
            "brand": "ARRI",
            "category": "Lenses",
            "tags": ["Zoom"],
            "description": "This super-wide angle, near-telecentric zoom delivers optimal image quality with virtually no distortion.",
            "specifications": {
                "focal_length": "9.5-18mm",
                "aperture": "T2.9",
                "mount": "PL",
                "coverage": "Large Format (Open Gate)"
            },
            "stock_available": 1
        },
        {
            "id": "lens_arri_alura_18_80",
            "name": "ARRI Alura 18-80mm T2.6 Studio Zoom",
            "brand": "ARRI",
            "category": "Lenses",
            "tags": ["Zoom"],
            "description": "Designed to match ARRI prime lenses in color and contrast, it delivers exceptional optical consistency. Optimized for ALEXA 2K.",
            "specifications": {
                "focal_length": "18-80mm",
                "aperture": "T2.6",
                "mount": "PL",
                "coverage": "Super 35"
            },
            "stock_available": 1
        },
        {
            "id": "lens_fuji_14_35",
            "name": "Fujinon Cabrio 14-35mm T2.9",
            "brand": "Fujinon",
            "category": "Lenses",
            "tags": ["Zoom"],
            "description": "Wide to telephoto zoom for Super 35mm cameras. Features a detachable ENG-style digital drive unit.",
            "specifications": {
                "focal_length": "14-35mm",
                "aperture": "T2.9",
                "mount": "PL",
                "coverage": "Super 35"
            },
            "stock_available": 1
        },
        {
            "id": "lens_fuji_19_90",
            "name": "Fujinon Cabrio 19-90mm T2.9",
            "brand": "Fujinon",
            "category": "Lenses",
            "tags": ["Zoom"],
            "description": "Versatile standard zoom with detachable servo drive. A workhorse for documentary and commercial production.",
            "specifications": {
                "focal_length": "19-90mm",
                "aperture": "T2.9",
                "mount": "PL",
                "coverage": "Super 35"
            },
            "stock_available": 1
        },
        {
            "id": "lens_fuji_20_120",
            "name": "Fujinon Cabrio 20-120mm T3.5",
            "brand": "Fujinon",
            "category": "Lenses",
            "tags": ["Zoom"],
            "description": "Lightweight zoom with standard 0.8 pitch gears. Servo unit optional (sold separately/check kit).",
            "specifications": {
                "focal_length": "20-120mm",
                "aperture": "T3.5",
                "mount": "PL",
                "coverage": "Super 35"
            },
            "stock_available": 1
        },
        {
            "id": "lens_fuji_85_300",
            "name": "Fujinon Cabrio 85-300mm T2.9-4.0",
            "brand": "Fujinon",
            "category": "Lenses",
            "tags": ["Zoom"],
            "description": "Lightweight telephoto zoom with detachable servo. T2.9 until 200mm, ramping to T4.0 at 300mm.",
            "specifications": {
                "focal_length": "85-300mm",
                "aperture": "T2.9-4.0",
                "mount": "PL",
                "coverage": "Super 35"
            },
            "stock_available": 1
        },
        {
            "id": "lens_canon_15_47",
            "name": "Canon CN-E 15.5-47mm T2.8 Wide Zoom",
            "brand": "Canon",
            "category": "Lenses",
            "tags": ["Zoom"],
            "description": "Wide-angle cinema zoom engineered for 4K resolution. Compact and lightweight.",
            "specifications": {
                "focal_length": "15.5-47mm",
                "aperture": "T2.8",
                "mount": "PL",
                "coverage": "Super 35"
            },
            "stock_available": 1
        },
        {
            "id": "lens_canon_15_120",
            "name": "Canon Cine-Servo 15-120mm T2.95-3.9",
            "brand": "Canon",
            "category": "Lenses",
            "tags": ["Zoom"],
            "description": "Broadcast studio, sports, or live event lens. Pairs cine-style zoom with servo control.",
            "specifications": {
                "focal_length": "15-120mm",
                "aperture": "T2.95-3.9",
                "mount": "PL / EF",
                "coverage": "Full Frame / Super 35"
            },
            "stock_available": 1
        },
        {
            "id": "lens_canon_25_250",
            "name": "Canon Cine-Servo 25-250mm T2.95",
            "brand": "Canon",
            "category": "Lenses",
            "tags": ["Zoom"],
            "description": "High magnification zoom with servo control. Includes built-in 1.5x extender.",
            "specifications": {
                "focal_length": "25-250mm",
                "aperture": "T2.95",
                "mount": "PL / EF",
                "coverage": "Super 35"
            },
            "stock_available": 1
        },
        {
            "id": "lens_angenieux_16_40",
            "name": "Angenieux Optimo Style 16-40mm T2.8",
            "brand": "Angenieux",
            "category": "Lenses",
            "tags": ["Zoom"],
            "description": "Compact wide zoom supporting 4K resolution. Internal focus design with no breathing.",
            "specifications": {
                "focal_length": "16-40mm",
                "aperture": "T2.8",
                "mount": "PL",
                "coverage": "Super 35"
            },
            "stock_available": 1
        },
        {
            "id": "lens_angenieux_28_76",
            "name": "Angenieux Optimo 28-76mm T2.6",
            "brand": "Angenieux",
            "category": "Lenses",
            "tags": ["Zoom"],
            "description": "Lightweight wide-angle to portrait zoom. Extremely high optical quality.",
            "specifications": {
                "focal_length": "28-76mm",
                "aperture": "T2.6",
                "mount": "PL",
                "coverage": "Super 35"
            },
            "stock_available": 1
        },
        {
            "id": "lens_angenieux_48_130",
            "name": "Angenieux Optimo Style 48-130mm T3",
            "brand": "Angenieux",
            "category": "Lenses",
            "tags": ["Zoom"],
            "description": "Mid-telephoto zoom. Can be used with the Angenieux Servo Unit (ASU).",
            "specifications": {
                "focal_length": "48-130mm",
                "aperture": "T3",
                "mount": "PL",
                "coverage": "Super 35"
            },
            "stock_available": 1
        },
        {
            "id": "lens_angenieux_19_94",
            "name": "Angenieux Optimo Style 19.5-94mm T2.6",
            "brand": "Angenieux",
            "category": "Lenses",
            "tags": ["Zoom"],
            "description": "Replaces the classic 17-80mm. Superb homogeneity of colorimetry, contrast and resolution.",
            "specifications": {
                "focal_length": "19.5-94mm",
                "aperture": "T2.6",
                "mount": "PL",
                "coverage": "Super 35"
            },
            "stock_available": 1
        },
        {
            "id": "lens_angenieux_30_76",
            "name": "Angenieux Optimo Style 30-76mm T2.8",
            "brand": "Angenieux",
            "category": "Lenses",
            "tags": ["Zoom"],
            "description": "Lightweight, compact, mid-range lens. Matches the Optimo line look.",
            "specifications": {
                "focal_length": "30-76mm",
                "aperture": "T2.8",
                "mount": "PL",
                "coverage": "Super 35"
            },
            "stock_available": 1
        },
        {
            "id": "lens_zeiss_cz2_15_30",
            "name": "Zeiss CZ.2 15-30mm Compact Zoom",
            "brand": "Zeiss",
            "category": "Lenses",
            "tags": ["Zoom"],
            "description": "Short wide-angle zoom lens for full-frame sensors. Color matched to Zeiss primes.",
            "specifications": {
                "focal_length": "15-30mm",
                "aperture": "T2.9",
                "mount": "PL / EF / E",
                "coverage": "Full Frame"
            },
            "stock_available": 1
        },
        {
            "id": "lens_tokina_11_16",
            "name": "Tokina 11-16mm T3.0",
            "brand": "Tokina",
            "category": "Lenses",
            "tags": ["Zoom"],
            "description": "Professional cine wide-angle zoom. Re-housed with PL mount and 0.8 gears.",
            "specifications": {
                "focal_length": "11-16mm",
                "aperture": "T3.0",
                "mount": "PL",
                "coverage": "Super 35"
            },
            "stock_available": 1
        },
        {
            "id": "lens_sigma_50_100",
            "name": "Sigma 50-100mm T2 High-Speed Zoom",
            "brand": "Sigma",
            "category": "Lenses",
            "tags": ["Zoom"],
            "description": "Fast T2 aperture zoom. Delivers 6K-8K resolution performance.",
            "specifications": {
                "focal_length": "50-100mm",
                "aperture": "T2",
                "mount": "PL",
                "coverage": "Super 35"
            },
            "stock_available": 1
        },
        {
            "id": "ctrl_sxu1",
            "name": "ARRI SXU-1 Single Axis Unit",
            "brand": "ARRI",
            "category": "Lens Control",
            "description": "Wireless hand unit offering single-axis focus, iris, or zoom control.",
            "specifications": {
                "channels": "1 Axis",
                "compatibility": "ARRI / cforce"
            },
            "stock_available": 1
        },
        {
            "id": "ctrl_teradek_fiz",
            "name": "Teradek RT FIZ Wireless Lens Control",
            "brand": "Teradek",
            "category": "Lens Control",
            "description": "Features the CTRL.5 wireless lens controller, MDR.X receiver, and MOTR.S Max lens motor.",
            "specifications": {
                "channels": "3 Axis",
                "components": "CTRL.5, MDR.X, MOTR.S"
            },
            "stock_available": 1
        },
        {
            "id": "ctrl_teradek_ctrl3",
            "name": "Teradek CTRL.3 Three-Axis Controller",
            "brand": "Teradek",
            "category": "Lens Control",
            "description": "Control focus, iris, or zoom with ease. 5000' outdoor wireless range.",
            "specifications": {
                "channels": "3 Axis",
                "range": "5000 ft",
                "display": "OLED"
            },
            "stock_available": 1
        },
        {
            "id": "ctrl_cmotion_one",
            "name": "cmotion compact ONE Set",
            "brand": "cmotion",
            "category": "Lens Control",
            "description": "Ready-to-shoot one motor system. Lightweight and compact.",
            "specifications": {
                "channels": "1 Axis",
                "motor": "Integrated"
            },
            "stock_available": 1
        },
        {
            "id": "ctrl_arri_ff5",
            "name": "ARRI FF-5 Cine Follow Focus",
            "brand": "ARRI",
            "category": "Lens Control",
            "description": "Gear ratio of 2:1, designed for cine-style lenses. Snaps onto 15mm or 19mm rods.",
            "specifications": {
                "type": "Mechanical",
                "ratio": "2:1",
                "rod_support": "15mm/19mm"
            },
            "stock_available": 1
        },
        {
            "id": "ctrl_arri_ff4",
            "name": "ARRI FF-4 Follow Focus",
            "brand": "ARRI",
            "category": "Lens Control",
            "description": "1:2 knob-to-gear ratio for smooth, accurate focus pulls. Robust economical unit.",
            "specifications": {
                "type": "Mechanical",
                "ratio": "1:2",
                "rod_support": "15mm LWS"
            },
            "stock_available": 1
        },
        {
            "id": "ctrl_arri_ff3",
            "name": "ARRI FF-3 Follow Focus",
            "brand": "ARRI",
            "category": "Lens Control",
            "description": "Lightweight single-sided follow focus. Ideal for handheld and studio setups.",
            "specifications": {
                "type": "Mechanical",
                "rod_support": "15mm LWS"
            },
            "stock_available": 1
        },
        {
            "id": "ctrl_chrosziel_dv",
            "name": "Chrosziel DV Studio Rig Follow Focus",
            "brand": "Chrosziel",
            "category": "Lens Control",
            "description": "15mm lightweight standard follow focus. Includes VariLock dual hard stops.",
            "specifications": {
                "type": "Mechanical",
                "rod_support": "15mm LWS",
                "gears": "6 included"
            },
            "stock_available": 1
        }
    ];

    const eqCollection = app.findCollectionByNameOrId("equipment");
    const catCollection = app.findCollectionByNameOrId("categories");

    NEW_ITEMS.forEach(item => {
        let record;
        const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        try {
            record = app.findFirstRecordByData("equipment", "slug", slug);
        } catch (e) {
            record = new Record(eqCollection);
        }

        // Find or create category
        let catId = "";
        const catSlug = item.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        try {
            const cat = app.findFirstRecordByData("categories", "slug", catSlug);
            catId = cat.id;
        } catch (e) {
            // Try strict name match if slug fails (or create if needed, but existing should be there)
            try {
                const cat = app.findFirstRecordByData("categories", "name", item.category);
                catId = cat.id;
            } catch (e2) {
                // If really missing, create it
                const newCat = new Record(catCollection);
                newCat.set("name", item.category);
                newCat.set("name_en", item.category);
                newCat.set("name_fr", item.category);
                newCat.set("slug", catSlug);
                newCat.set("icon", "box");
                app.save(newCat);
                catId = newCat.id;
            }
        }

        record.set("slug", slug);
        record.set("name_en", item.name);
        record.set("name_fr", item.name);
        record.set("description_en", item.description);
        record.set("description_fr", item.description);

        record.set("brand", item.brand);
        record.set("category", catId);

        record.set("stock", 100);
        record.set("stock_available", 100);
        record.set("daily_rate", 100);
        record.set("visibility", true);

        record.set("specs_en", JSON.stringify(item.specifications));
        record.set("specs_fr", JSON.stringify(item.specifications));

        if (item.tags && item.tags.length > 0) {
            record.set("type", item.tags[0]);
        }

        if (item.specifications.mount) record.set("mount", item.specifications.mount);
        if (item.specifications.sensor_size) record.set("sensor_size", item.specifications.sensor_size);
        if (item.specifications.max_resolution) record.set("resolution", item.specifications.max_resolution);
        else if (item.specifications.resolution) record.set("resolution", item.specifications.resolution);

        app.save(record);
        console.log(`Supplemental Upsert: ${item.name}`);
    });
});
