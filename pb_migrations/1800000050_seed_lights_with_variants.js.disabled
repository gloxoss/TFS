/// <reference path="../pb_data/types.d.ts" />
/**
 * Lighting Equipment Seed with Variant Options
 * 
 * Truncates existing lighting equipment and re-seeds with proper variant options
 * for wattage/model selections (e.g., Nanlite Forza 60B/300/500).
 */
migrate((app) => {
    const ID_CATEGORIES = "pbc_categories0001";
    const ID_EQUIPMENT = "pbc_equipment00001";

    // ==========================================================================
    // HELPER: Generate slug from name
    // ==========================================================================
    function slugify(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    // ==========================================================================
    // 1. GET LIGHTING CATEGORY ID FIRST
    // ==========================================================================
    let lightingCategoryId = null;
    try {
        const lightingCategory = app.findFirstRecordByFilter(ID_CATEGORIES, "name = 'Lighting'");
        if (lightingCategory) {
            lightingCategoryId = lightingCategory.id;
            console.log(`[Category] Found Lighting category: ${lightingCategoryId}`);
        } else {
            console.log("[Category] Lighting category not found, aborting!");
            return;
        }
    } catch (e) {
        console.log("[Category] Error finding Lighting category:", e);
        return;
    }

    // ==========================================================================
    // 2. CLEANUP: Delete existing lighting equipment using category ID
    // ==========================================================================
    console.log("[Cleanup] Removing existing lighting equipment...");
    try {
        const existingLights = app.findRecordsByFilter(
            ID_EQUIPMENT,
            `category = '${lightingCategoryId}'`,
            "",
            500,
            0
        );
        existingLights.forEach(light => {
            app.delete(light);
        });
        console.log(`[Cleanup] Deleted ${existingLights.length} lighting items`);
    } catch (e) {
        console.log("[Cleanup] No existing lights to delete or error:", e);
    }

    // ==========================================================================
    // 3. LIGHTING EQUIPMENT DATA WITH VARIANT OPTIONS
    // ==========================================================================
    const lightingData = [
        // =====================================================================
        // DAYLIGHT HMI
        // =====================================================================
        {
            name_en: "ARRI M-Series",
            name_fr: "Série ARRI M",
            slug: "arri-m-series",
            brand: "ARRI",
            category: "Lighting",
            type: "Daylight HMI",
            description_en: "The M-Series encompasses ARRI's most innovative, Academy Award-winning daylight products featuring the unique, patented MAX Technology reflector. The MAX Technology enables lens-less, focusable lampheads that unify the advantages of a PAR and a Fresnel providing maximum light output.",
            description_fr: "La série M comprend les produits de lumière du jour les plus innovants d'ARRI, primés aux Oscars, dotés du réflecteur breveté MAX Technology.",
            specs: {
                type: "Daylight HMI",
                technology: "MAX Technology",
                focusable: true
            },
            variant_options: {
                "WATTAGE": ["M18 (1.8KW)", "M40 (4KW)", "M90 (9KW)"]
            },
            stock_available: 4,
            is_featured: true,
            images: ["arri-m-series.jpg"]
        },
        {
            name_en: "ARRISUN Series",
            name_fr: "Série ARRISUN",
            slug: "arrisun-series",
            brand: "ARRI",
            category: "Lighting",
            type: "Daylight HMI",
            description_en: "The ARRISUN product range includes compact and powerful daylight fixtures. Even though discontinued in 2017, these lampheads remain popular for punch and bounce lighting alongside the M-Series.",
            description_fr: "La gamme ARRISUN comprend des projecteurs compacts et puissants pour la lumière du jour.",
            specs: {
                type: "Daylight HMI",
                discontinued: 2017
            },
            variant_options: {
                "WATTAGE": ["575W", "1.2KW", "2.5/4KW", "6KW", "12KW"]
            },
            stock_available: 6,
            is_featured: false,
            images: ["arrisun.jpg"]
        },

        // =====================================================================
        // TUNGSTEN
        // =====================================================================
        {
            name_en: "ARRI Fresnel Series",
            name_fr: "Série Fresnel ARRI",
            slug: "arri-fresnel-series",
            brand: "ARRI",
            category: "Lighting",
            type: "Tungsten Fresnel",
            description_en: "The ARRI Junior series is ideal for portable applications where compact but robust, lightweight tungsten Fresnel spotlights are required. Pole-operated versions available for 650W.",
            description_fr: "La série ARRI Junior est idéale pour les applications portables nécessitant des projecteurs Fresnel tungstène compacts mais robustes.",
            specs: {
                type: "Tungsten Fresnel",
                pole_operated: "650W"
            },
            variant_options: {
                "WATTAGE": ["150W", "300W", "650W", "1KW", "2KW", "5KW", "10KW"]
            },
            stock_available: 12,
            is_featured: false,
            images: ["arri-fresnel.jpg"]
        },
        {
            name_en: "ARRI True Blue T1",
            name_fr: "ARRI True Blue T1",
            slug: "arri-true-blue-t1",
            brand: "ARRI",
            category: "Lighting",
            type: "Tungsten Fresnel",
            description_en: "ARRI True Blue represent an unprecedented evolution of the location fixtures with over 30 new improvements for studio and location lighting. Available in both manual and pole-operated versions.",
            description_fr: "ARRI True Blue représente une évolution sans précédent des projecteurs avec plus de 30 nouvelles améliorations.",
            specs: {
                type: "Tungsten Fresnel",
                improvements: "30+"
            },
            variant_options: {
                "TYPE": ["Manual", "Pole-Operated"]
            },
            stock_available: 4,
            is_featured: false,
            images: ["true-blue-t1.png"]
        },
        {
            name_en: "ARRI Blonde (Redhead)",
            name_fr: "ARRI Blonde (Redhead)",
            slug: "arri-blonde-redhead",
            brand: "ARRI",
            category: "Lighting",
            type: "Tungsten Open Face",
            description_en: "A lightweight revolution in quartz lighting, constructed from a polyester/fibre glass material providing light weight and heat insulation. Beam angle varies from 42 to 86 degrees.",
            description_fr: "Une révolution légère dans l'éclairage au quartz, construite en matériau polyester/fibre de verre.",
            specs: {
                type: "Tungsten Open Face",
                beam_angle: "42° - 86°"
            },
            variant_options: {
                "WATTAGE": ["800W", "2000W"]
            },
            stock_available: 6,
            is_featured: false,
            images: ["arri-blonde.jpg"]
        },
        {
            name_en: "Dino Light PAR 64",
            name_fr: "Dino Light PAR 64",
            slug: "dino-light-par64",
            brand: "Dino",
            category: "Lighting",
            type: "PAR Arrays",
            description_en: "High-output tungsten lighting fixture with multiple PAR 64 lamps on a single frame. Delivers powerful, broad light output ideal for daylight simulation and large-area washes.",
            description_fr: "Projecteur tungstène haute puissance avec plusieurs lampes PAR 64 sur un seul châssis.",
            specs: {
                type: "PAR 64 Array",
                lamp_type: "PAR 64"
            },
            variant_options: {
                "CONFIG": ["8×650W", "9×1000W", "12×1000W", "24×1000W"]
            },
            stock_available: 4,
            is_featured: false,
            images: ["dino-light.png"]
        },
        {
            name_en: "Kupo PAR 64",
            name_fr: "Kupo PAR 64",
            slug: "kupo-par-64",
            brand: "Kupo",
            category: "Lighting",
            type: "PAR",
            description_en: "Low-cost, highly flexible luminaires designed for diverse applications. Intensities and beam spread are a function of the installed lamp, so any one unit can serve multiple purposes.",
            description_fr: "Luminaires flexibles et économiques conçus pour diverses applications.",
            specs: {
                type: "PAR 64"
            },
            variant_options: {
                "WATTAGE": ["500W", "1000W"]
            },
            stock_available: 8,
            is_featured: false,
            images: ["kupo-par-64.png"]
        },
        {
            name_en: "ETC Source 4 Profile",
            name_fr: "ETC Source 4 Profile",
            slug: "etc-source-4-profile",
            brand: "ETC",
            category: "Lighting",
            type: "Profile Spotlight",
            description_en: "Source Four combines energy-saving HPL lamp technology with a dichroic reflector and optical-quality lenses for the coolest beam on the market. Perfect for punching through saturated colors.",
            description_fr: "Source Four combine la technologie de lampe HPL économe en énergie avec un réflecteur dichroïque.",
            specs: {
                type: "Profile Spotlight",
                wattage: "750W"
            },
            variant_options: {
                "BEAM": ["19°", "26°", "36°", "50°"]
            },
            stock_available: 6,
            is_featured: false,
            images: ["etc-source-4.jpg"]
        },
        {
            name_en: "Dedolight Kit",
            name_fr: "Kit Dedolight",
            slug: "dedolight-kit",
            brand: "Dedolight",
            category: "Lighting",
            type: "Precision Spotlight",
            description_en: "Compact, high-precision lighting solution known for exceptional beam control and optical efficiency. Delivers clean, punchy output with minimal spill.",
            description_fr: "Solution d'éclairage compacte et de haute précision reconnue pour son contrôle exceptionnel du faisceau.",
            specs: {
                type: "Precision Spotlight",
                wattage: "150W"
            },
            variant_options: {
                "KIT": ["2-Light Kit", "4-Light Kit"]
            },
            stock_available: 2,
            is_featured: false,
            images: ["dedolight.jpg"]
        },

        // =====================================================================
        // LED
        // =====================================================================
        {
            name_en: "Creamsource Vortex8",
            name_fr: "Creamsource Vortex8",
            slug: "creamsource-vortex8",
            brand: "Creamsource",
            category: "Lighting",
            type: "LED RGB Panel",
            description_en: "650W RGB LED Light Panel providing powerful illumination that rivals a 1200W HMI. Features 14,000 lux at 9.8', 2200-15,000K CCT range, full RGBW spectrum, and CRI/TLCI of 95.",
            description_fr: "Panneau LED RGB de 650W offrant une puissance rivalisant avec un HMI de 1200W.",
            specs: {
                type: "LED RGB Panel",
                wattage: "650W",
                cct_range: "2200K - 15,000K",
                cri: "95"
            },
            variant_options: {
                "ACCESSORY": ["Standard", "With Softbox", "With Barndoors"]
            },
            stock_available: 2,
            is_featured: true,
            images: ["creamsource-vortex8.jpg"]
        },
        {
            name_en: "ARRI SkyPanel",
            name_fr: "ARRI SkyPanel",
            slug: "arri-skypanel",
            brand: "ARRI",
            category: "Lighting",
            type: "LED Softlight",
            description_en: "High-output, full-color LED softlight designed for professional film and television productions. Exceptional color accuracy and wide CCT range for key, fill, and ambient lighting.",
            description_fr: "Softlight LED haute puissance et couleur complète conçu pour les productions professionnelles de cinéma et télévision.",
            specs: {
                type: "LED Softlight",
                color: "Full RGBWW"
            },
            variant_options: {
                "MODEL": ["S30-C", "S60-C"]
            },
            stock_available: 4,
            is_featured: true,
            images: ["arri-skypanel.jpg"]
        },
        {
            name_en: "DMG Lumière MIX",
            name_fr: "DMG Lumière MIX",
            slug: "dmg-lumiere-mix",
            brand: "DMG Lumière",
            category: "Lighting",
            type: "LED Panel",
            description_en: "High-performance, full-color lighting solutions featuring advanced RGBWW color mixing and excellent color accuracy. Soft, controllable illumination across a wide CCT range.",
            description_fr: "Solutions d'éclairage haute performance avec mélange de couleurs RGBWW avancé.",
            specs: {
                type: "LED Panel",
                color: "RGBWW"
            },
            variant_options: {
                "SIZE": ["MINI MIX", "SL1 MIX", "MAXI MIX"]
            },
            stock_available: 3,
            is_featured: true,
            images: ["dmg-lumiere-mix.jpg"]
        },
        {
            name_en: "Astera LED Tubes",
            name_fr: "Tubes LED Astera",
            slug: "astera-led-tubes",
            brand: "Astera",
            category: "Lighting",
            type: "LED Tube",
            description_en: "Flexible, wireless, and full-color LED lighting with advanced RGB technology. Battery-powered operation for both studio and location use.",
            description_fr: "Éclairage LED flexible, sans fil et couleur complète avec technologie RGB avancée.",
            specs: {
                type: "LED Tube",
                wireless: true,
                battery: true
            },
            variant_options: {
                "MODEL": ["Titan Tube FP-1", "Pixel Tube AX-1", "AX-3", "AX-5", "AX10", "Bulb"]
            },
            stock_available: 16,
            is_featured: true,
            images: []
        },
        {
            name_en: "Nanlite Forza Series",
            name_fr: "Série Nanlite Forza",
            slug: "nanlite-forza-series",
            brand: "Nanlite",
            category: "Lighting",
            type: "LED COB Point Source",
            description_en: "High-output, compact point-source fixtures using advanced COB technology. Exceptional color accuracy (high CRI/TLCI) and consistent beam. Daylight and Bi-color options available.",
            description_fr: "Projecteurs compacts à source ponctuelle haute puissance utilisant la technologie COB avancée.",
            specs: {
                type: "LED COB Point Source",
                mount: "Bowens",
                cri: "96+",
                tlci: "97+"
            },
            variant_options: {
                "WATTAGE": ["60B", "300", "300B", "500", "500B"]
            },
            stock_available: 10,
            is_featured: true,
            images: ["nanlite-forza.png"]
        },
        {
            name_en: "Aputure Light Storm LS",
            name_fr: "Aputure Light Storm LS",
            slug: "aputure-ls-series",
            brand: "Aputure",
            category: "Lighting",
            type: "LED COB Point Source",
            description_en: "Industry standard for high-output, point-source LED fixtures. Universal Bowens Mount, advanced color science, weather-resistant Pro builds, and Sidus Link app integration.",
            description_fr: "Standard de l'industrie pour les projecteurs LED à source ponctuelle haute puissance.",
            specs: {
                type: "LED COB Point Source",
                mount: "Bowens",
                app: "Sidus Link"
            },
            variant_options: {
                "MODEL": ["1200d Pro", "600c Pro II", "600c Pro", "600x Pro", "600d Pro", "300c", "300d II", "60x"]
            },
            stock_available: 12,
            is_featured: true,
            images: ["aputure-ls-series.png"]
        },
        {
            name_en: "Aputure STORM XT52",
            name_fr: "Aputure STORM XT52",
            slug: "aputure-storm-xt52",
            brand: "Aputure",
            category: "Lighting",
            type: "LED High Power",
            description_en: "5200W point-source tunable-white LED monolight for large-scale film/television productions. CCT range 2500-10,000K with exceptional accuracy and IP65 construction.",
            description_fr: "Monolight LED blanc ajustable de 5200W pour les grandes productions cinématographiques.",
            specs: {
                type: "LED High Power",
                wattage: "5200W",
                cct_range: "2500K - 10,000K",
                ip_rating: "IP65"
            },
            variant_options: {
                "ACCESSORY": ["Standard", "With Fresnel", "With Softbox"]
            },
            stock_available: 1,
            is_featured: true,
            images: ["aputure-storm-xt52.jpg"]
        },
        {
            name_en: "Aputure Electro Storm CS15",
            name_fr: "Aputure Electro Storm CS15",
            slug: "aputure-electro-storm-cs15",
            brand: "Aputure",
            category: "Lighting",
            type: "LED Full Color",
            description_en: "One of the most powerful full color point source LEDs on the market. SSI (Tungsten) 89+ and SSI (D56) 86+. HyperSync for flicker-free high-speed photography.",
            description_fr: "L'un des LED à source ponctuelle couleur complète les plus puissants du marché.",
            specs: {
                type: "LED Full Color",
                ssi_tungsten: "89+",
                ssi_d56: "86+"
            },
            variant_options: {
                "ACCESSORY": ["Standard", "With Fresnel", "With Softbox"]
            },
            stock_available: 2,
            is_featured: false,
            images: ["aputure-electro-storm-cs15.png"]
        },
        {
            name_en: "Aputure Electro Storm XT26",
            name_fr: "Aputure Electro Storm XT26",
            slug: "aputure-electro-storm-xt26",
            brand: "Aputure",
            category: "Lighting",
            type: "LED Tunable White",
            description_en: "Powerful point source LED with tunable white chipset, CCT range 2,700K-6,500K including +/- green adjustment. HyperSync for flicker-free high-speed work.",
            description_fr: "LED puissant à source ponctuelle avec blanc ajustable, plage CCT 2700K-6500K.",
            specs: {
                type: "LED Tunable White",
                cct_range: "2,700K - 6,500K"
            },
            variant_options: {
                "ACCESSORY": ["Standard", "With Fresnel", "With Softbox"]
            },
            stock_available: 2,
            is_featured: false,
            images: ["aputure-electro-storm-xt26.png"]
        },
        {
            name_en: "Aputure MC Pro",
            name_fr: "Aputure MC Pro",
            slug: "aputure-mc-pro",
            brand: "Aputure",
            category: "Lighting",
            type: "LED Pocket Light",
            description_en: "Compact full-color pocket light that lives in your bag, hides in a set, or mounts on a camera. Perfect for a pop of color when you need it.",
            description_fr: "Lumière de poche compacte couleur complète qui se range dans votre sac ou se monte sur une caméra.",
            specs: {
                type: "LED Pocket Light",
                color: "RGBWW"
            },
            variant_options: {
                "KIT": ["Single", "4-Light Kit", "8-Light Kit"]
            },
            stock_available: 6,
            is_featured: false,
            images: ["aputure-mc-pro.png"]
        },
        {
            name_en: "amaran F-Series LED Mat",
            name_fr: "amaran F-Series LED Mat",
            slug: "amaran-f-series-led-mat",
            brand: "amaran",
            category: "Lighting",
            type: "LED Flexible Mat",
            description_en: "Powerful, versatile, and flexible RGBWW LED mats with 95+ CRI/TLCI. Adjustable CCT from 2500-7500K, 360° HSI control, 46 gel presets, and 15 lighting effects.",
            description_fr: "Tapis LED RGBWW puissants, polyvalents et flexibles avec CRI/TLCI de 95+.",
            specs: {
                type: "LED Flexible Mat",
                color: "RGBWW",
                cri: "95+",
                tlci: "97+"
            },
            variant_options: {
                "SIZE": ["F21c (2×1')", "F22c (2×2')"]
            },
            stock_available: 4,
            is_featured: false,
            images: ["amaran-f21c.jpg"]
        },
        {
            name_en: "LiteGear LiteMat",
            name_fr: "LiteGear LiteMat",
            slug: "litegear-litemat",
            brand: "LiteGear",
            category: "Lighting",
            type: "LED Ultra-Thin Panel",
            description_en: "Industry standard for ultra-thin, lightweight, and versatile soft lighting. Less than 1 inch thick with Velcro-backed housing for rigging in tight spaces.",
            description_fr: "Standard de l'industrie pour l'éclairage doux ultra-fin, léger et polyvalent.",
            specs: {
                type: "LED Ultra-Thin Panel",
                thickness: "<1 inch"
            },
            variant_options: {
                "SIZE": ["LiteMat 2 (21×21\")", "LiteMat 2L (11.5×40\")", "LiteMat 4 (21×40\")"]
            },
            stock_available: 4,
            is_featured: false,
            images: ["litegear-litemat.jpg"]
        },

        // =====================================================================
        // LIGHTING ACCESSORIES
        // =====================================================================
        {
            name_en: "Professional Light Modifiers",
            name_fr: "Modificateurs de Lumière Professionnels",
            slug: "professional-light-modifiers",
            brand: "Various",
            category: "Lighting",
            type: "Light Modifier",
            description_en: "High-quality light modifiers for total control over shape, direction, and quality of light. Compatible with Aputure and Nanlite Bowens-mount fixtures.",
            description_fr: "Modificateurs de lumière de haute qualité pour un contrôle total sur la forme, la direction et la qualité de la lumière.",
            specs: {
                type: "Light Modifier",
                mount: "Bowens"
            },
            variant_options: {
                "TYPE": ["Parabolic Softbox", "Lantern Softbox", "Umbrella Softbox", "Octagon Softbox", "Rectangle Softbox"]
            },
            stock_available: 20,
            is_featured: false,
            images: ["light-modifiers.webp"]
        },
        {
            name_en: "Butterfly & Overhead Frames",
            name_fr: "Cadres Butterfly & Overhead",
            slug: "butterfly-overhead-frames",
            brand: "Various",
            category: "Lighting",
            type: "Diffusion/Bounce Frame",
            description_en: "Butterflies and Overheads manufactured to fit standard frames used in motion picture and television production – from 4'x4' to 20'x20'.",
            description_fr: "Cadres Butterfly et Overhead fabriqués aux dimensions standard de l'industrie cinématographique.",
            specs: {
                type: "Diffusion/Bounce Frame"
            },
            variant_options: {
                "SIZE": ["4×4'", "6×6'", "8×8'", "12×12'", "20×20'"]
            },
            stock_available: 10,
            is_featured: false,
            images: ["butterfly-overhead.jpg"]
        },
        {
            name_en: "Reflector Flag Panel Kit",
            name_fr: "Kit Panneau Réflecteur Flag",
            slug: "reflector-flag-panel-kit",
            brand: "Various",
            category: "Lighting",
            type: "Scrim/Reflector",
            description_en: "5-in-1 Light Reflector Flag Panel Kit with Translucent/Gold/Silver/Black/White surfaces. Stainless steel foldable frame for studio portrait photography.",
            description_fr: "Kit panneau réflecteur 5-en-1 avec surfaces translucide/or/argent/noir/blanc.",
            specs: {
                type: "5-in-1 Reflector",
                size: "30×36\" / 75×90cm"
            },
            variant_options: {
                "SIZE": ["24×36\"", "30×36\"", "40×60\""]
            },
            stock_available: 6,
            is_featured: false,
            images: ["reflector-flag-panel.jpg"]
        },
        {
            name_en: "Professional Dimmer Systems",
            name_fr: "Variateurs Professionnels",
            slug: "professional-dimmer-systems",
            brand: "Various",
            category: "Lighting",
            type: "Dimmer/Power Control",
            description_en: "Professional dimming solutions for Tungsten, Halogen, and compatible LED fixtures. High-resolution micro-controllers for smooth, linear dimming curve.",
            description_fr: "Solutions de variation professionnelles pour projecteurs Tungstène, Halogène et LED compatibles.",
            specs: {
                type: "In-line Dimmer"
            },
            variant_options: {
                "CAPACITY": ["1KW", "2KW", "3KW", "5KW"]
            },
            stock_available: 8,
            is_featured: false,
            images: ["dimmer-systems.jpg"]
        }
    ];

    // ==========================================================================
    // 4. CREATE LIGHTING EQUIPMENT RECORDS
    // ==========================================================================
    console.log(`[Seeding] Creating ${lightingData.length} lighting items...`);

    lightingData.forEach(item => {
        try {
            const record = new Record(app.findCollectionByNameOrId(ID_EQUIPMENT));

            record.set("name_en", item.name_en);
            record.set("name_fr", item.name_fr);
            record.set("slug", item.slug);
            record.set("brand", item.brand);
            record.set("category", lightingCategoryId);
            record.set("type", item.type);
            record.set("description_en", item.description_en);
            record.set("description_fr", item.description_fr || item.description_en);
            record.set("specs", item.specs);
            record.set("stock_available", item.stock_available);
            record.set("is_featured", item.is_featured);
            record.set("is_visible", true);

            // Set variant_options if present
            if (item.variant_options) {
                record.set("variant_options", item.variant_options);
            }

            // Note: Images will need to be uploaded separately via PocketBase admin
            // or via a file upload script. For now we just reference the filenames.

            app.save(record);
            console.log(`[Created] ${item.name_en} (${item.variant_options ? Object.keys(item.variant_options).length + ' variant types' : 'no variants'})`);
        } catch (e) {
            console.error(`[Error] Failed to create ${item.name_en}:`, e);
        }
    });

    console.log(`[Complete] Seeded ${lightingData.length} lighting items with variant options`);

}, (app) => {
    // Rollback: This would need to delete the seeded records
    console.log("[Rollback] Lighting seed rollback - manual cleanup required");
});
