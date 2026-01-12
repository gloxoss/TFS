/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Seed Equipment - Cameras & Lenses
 * 
 * Adds the following products:
 * - ARRI ALEXA 35 Xtreme (camera)
 * - Sony FX6 Full-Frame Cinema Camera (camera)
 * - Cooke S8/i Full-Frame Plus T1.4 8-Lens Set (lens)
 * - Sony FE 50mm f/1.2 GM (lens)
 * - Sony FE 24-70mm f/2.8 GM II (lens)
 * - Sony FE 35mm f/1.4 GM (lens)
 * - Sony FE 16-35mm f/2.8 GM (lens)
 * - Sony FE 85mm f/1.4 GM (lens)
 * - Sony FE 70-200mm f/2.8 GM OSS (lens)
 * - Sony FE PZ 28-135mm f/4 G OSS (lens)
 */

migrate((app) => {
    console.log('[Seed] Starting equipment (cameras & lenses) seed...');

    const productsCollection = app.findCollectionByNameOrId('products');
    if (!productsCollection) {
        console.log('[Seed] Products collection not found, skipping seed.');
        return;
    }

    const categoriesCollection = app.findCollectionByNameOrId('categories');
    if (!categoriesCollection) {
        console.log('[Seed] Categories collection not found, skipping seed.');
        return;
    }

    // Helper: Find or create category
    function getOrCreateCategory(slug, name, description) {
        try {
            const existing = app.findFirstRecordByData('categories', 'slug', slug);
            if (existing) {
                console.log(`[Seed] Category "${slug}" exists, using ID: ${existing.id}`);
                return existing.id;
            }
        } catch (e) {
            // Category doesn't exist, create it
        }

        const record = new Record(categoriesCollection, {
            name: name,
            slug: slug,
            description: description
        });
        app.save(record);
        console.log(`[Seed] Created category: ${name}`);
        return record.id;
    }

    // Helper: Download image from URL with error handling
    function downloadImage(url, productName) {
        try {
            console.log(`[Seed] Downloading image for "${productName}"...`);
            const file = $filesystem.fileFromURL(url, 30);
            console.log(`[Seed] Image downloaded successfully for "${productName}"`);
            return file;
        } catch (e) {
            console.log(`[Seed] Warning: Failed to download image for "${productName}": ${e}`);
            return null;
        }
    }

    // Helper: Generate slug from name
    function slugify(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }

    // Get or create categories
    const camerasCategoryId = getOrCreateCategory('cameras', 'Cameras', 'Professional cinema cameras');
    const lensesCategoryId = getOrCreateCategory('lenses', 'Lenses', 'Cinema lenses and lens sets');

    // Products data
    const products = [
        // CAMERAS
        {
            name: 'ARRI ALEXA 35 Xtreme',
            slug: 'arri-alexa-35-xtreme',
            categoryId: camerasCategoryId,
            description: 'More speed. Less data. The ALEXA 35 Xtreme is a major revision of the industry\'s trusted workhorse—ALEXA 35, known for its superior image quality, ease of use, and reliable operation. Building on its predecessor\'s solid foundation, ALEXA 35 Xtreme introduces powerful new hardware, higher speeds for breathtaking slow-motion images, and the efficient ARRICORE codec.',
            imageUrl: 'https://cdn.theasc.com/20250731-2-arri-alexa-35-xtreme-enso-32-front-right82.jpg',
            specs: {
                brand: 'ARRI',
                type: 'Cinema Camera',
                sensor_size: '28.0 × 19.2 mm (Super 35)',
                max_resolution: '4608 × 3164',
                dynamic_range: '14+ stops',
                max_fps: '75 fps (4:3/Open Gate), 120 fps (2K/HD)',
                codec: 'ProRes 4444/4444 XQ/422 HQ, ARRIRAW',
                media_type: 'CFast 2.0',
                dimensions: '11.6 × 24.1 × 31.9 in',
                weight: '6.4 kg'
            },
            isFeatured: true
        },
        {
            name: 'Sony FX6 Full-Frame Cinema Camera',
            slug: 'sony-fx6-full-frame-cinema-camera',
            categoryId: camerasCategoryId,
            description: 'The FX6 Full-Frame Camera from Sony was developed to offer versatile, cine-style imaging in a truly compact form. With the ability to capture up to 15+ stops of dynamic range, Sony\'s S-Cinetone gamma for filmlike skin tones, and up to 10-bit, 4:2:2 XAVC-I recording, the FX6 is poised to both supplement your FX9 or VENICE capture and to nimbly take on documentary, gimbal, and drone shoots on its own.',
            imageUrl: 'https://static.bhphoto.com/images/multiple_images/images500x500/1671614142_IMG_1901057.jpg',
            specs: {
                brand: 'Sony',
                type: 'Cinema Camera',
                sensor_size: '35.6 × 23.8 mm (Full Frame)',
                max_resolution: '4096 × 2160 (DCI 4K)',
                dynamic_range: '15+ stops',
                max_fps: '120 fps (4K), 240 fps (Full HD)',
                codec: 'XAVC-I, XAVC-Long GOP, XAVC-HS (H.265)',
                media_type: 'CFexpress Type A, SDXC (V90)',
                dimensions: '4.5 × 4.6 × 6.1 in',
                weight: '0.89 kg'
            },
            isFeatured: true
        },
        // LENSES
        {
            name: 'Cooke S8/i Full-Frame Plus T1.4 8-Lens Set',
            slug: 'cooke-s8i-full-frame-plus-t14-8-lens-set',
            categoryId: lensesCategoryId,
            description: 'Bring the renowned "Cooke Look" to your full-frame cine images with the S8/i Full Frame Plus lens series from Cooke. This 8-lens set features a PL mount for rock-solid mounting and consistent focus and iris gear positions across the S8/i lineup for fast lens swaps. It produces a warm, wide-angle lens feel for shots with an organic feel and spherical bokeh that do not sacrifice sharpness. Shooting at T1.4 allows you to get an extra stop of exposure when shooting in dim conditions or chasing that last shot of the day.',
            imageUrl: 'https://twinsproduction.com/wp-content/uploads/2023/11/Cooke-S8i-set.jpg.webp',
            specs: {
                brand: 'Cooke',
                type: 'Spherical',
                mount: 'ARRI PL',
                aperture: 'T1.4',
                coverage: 'Full Frame Plus',
                set_contents: '8-Lens Set'
            },
            isFeatured: true
        },
        {
            name: 'Sony FE 50mm f/1.2 GM',
            slug: 'sony-fe-50mm-f12-gm',
            categoryId: lensesCategoryId,
            description: 'Combining speed, versatility, and quality, the Sony FE 50mm f/1.2 GM is a normal-length prime that flexes a bright f/1.2 design and advanced optics while remaining portable and lightweight for everyday shooting. As a G Master lens, resolution and bokeh are top priorities, and this 50mm f/1.2 goes on to also include a sophisticated focusing system to suit both stills and video needs and a reliable physical design that\'s intuitive to use and durable enough for working in harsh environments.',
            imageUrl: 'https://static.bhphoto.com/images/images500x500/1615895153_1630079.jpg',
            specs: {
                brand: 'Sony',
                type: 'Spherical',
                mount: 'Sony E',
                focal_length: '50mm',
                aperture: 'f/1.2',
                series: 'G Master'
            },
            isFeatured: false
        },
        {
            name: 'Sony FE 24-70mm f/2.8 GM II',
            slug: 'sony-fe-24-70mm-f28-gm-ii',
            categoryId: lensesCategoryId,
            description: 'A refined take on the fast standard zoom, the Sony FE 24-70mm f/2.8 GM II is not only smaller and lighter than the previous generation, it also features a variety of optical, focusing, and handling upgrades, catering to both photo and video applications, that make this the most well-rounded G Master zoom to date.',
            imageUrl: 'https://static.bhphoto.com/images/multiple_images/images500x500/1651055463_IMG_1739517.jpg',
            specs: {
                brand: 'Sony',
                type: 'Spherical',
                mount: 'Sony E',
                focal_length: '24-70mm',
                aperture: 'f/2.8',
                series: 'G Master II'
            },
            isFeatured: false
        },
        {
            name: 'Sony FE 35mm f/1.4 GM',
            slug: 'sony-fe-35mm-f14-gm',
            categoryId: lensesCategoryId,
            description: 'Combining exceptional sharpness, beautiful bokeh, and modern optical refinements, the Sony FE 35mm f/1.4 GM is a versatile wide-normal prime built for both stills and cinematic video. Its bright f/1.4 aperture and advanced XA (extreme aspherical) elements deliver stunning edge-to-edge resolution, controlled aberrations, and smooth background separation.',
            imageUrl: 'https://static.bhphoto.com/images/multiple_images/images500x500/1610533948_IMG_1472020.jpg',
            specs: {
                brand: 'Sony',
                type: 'Spherical',
                mount: 'Sony E',
                focal_length: '35mm',
                aperture: 'f/1.4',
                series: 'G Master'
            },
            isFeatured: false
        },
        {
            name: 'Sony FE 16-35mm f/2.8 GM',
            slug: 'sony-fe-16-35mm-f28-gm',
            categoryId: lensesCategoryId,
            description: 'Offering G Master performance in a compact, fast, and versatile form, the Sony FE 16-35mm f/2.8 GM is a wide-angle zoom covering ultra-wide to standard wide-angle fields of view. Ideal for a range of subjects, from landscape to lifestyle to architecture, the lens\'s advanced optics and bright f/2.8 design pair with a flexible zoom design to suit working in a variety of shooting conditions.',
            imageUrl: 'https://static.bhphoto.com/images/multiple_images/images500x500/1504614646_IMG_863921.jpg',
            specs: {
                brand: 'Sony',
                type: 'Spherical',
                mount: 'Sony E',
                focal_length: '16-35mm',
                aperture: 'f/2.8',
                series: 'G Master'
            },
            isFeatured: false
        },
        {
            name: 'Sony FE 85mm f/1.4 GM',
            slug: 'sony-fe-85mm-f14-gm',
            categoryId: lensesCategoryId,
            description: 'Often referred to as the perfect focal length for portraiture, the Sony FE 85mm f/1.4 GM is a fast short-telephoto prime distinguished by its flattering field of view, advanced optics, and ability to isolate subjects with shallow depth of field. As a G Master lens, this lens offers refined sharpness and bokeh quality, championing a pleasing image quality well-suited for portraits, events, and situations where focus control is paramount.',
            imageUrl: 'https://static.bhphoto.com/images/multiple_images/images500x500/1624972658_IMG_582639.jpg',
            specs: {
                brand: 'Sony',
                type: 'Spherical',
                mount: 'Sony E',
                focal_length: '85mm',
                aperture: 'f/1.4',
                series: 'G Master'
            },
            isFeatured: false
        },
        {
            name: 'Sony FE 70-200mm f/2.8 GM OSS',
            slug: 'sony-fe-70-200mm-f28-gm-oss',
            categoryId: lensesCategoryId,
            description: 'Boasting exceptional optics, intuitive handling, and outstanding speed in all aspects, the Sony FE 70-200mm f/2.8 GM OSS takes its place as a reliable, go-to telephoto zoom for professionals. A member of the G Master series, this 70-200mm delivers high sharpness alongside smooth, clean bokeh, and the bright f/2.8 constant maximum aperture and optical image stabilization also help to ensure sharp handheld shots in available lighting conditions.',
            imageUrl: 'https://static.bhphoto.com/images/images500x500/1454496359_1222776.jpg',
            specs: {
                brand: 'Sony',
                type: 'Spherical',
                mount: 'Sony E',
                focal_length: '70-200mm',
                aperture: 'f/2.8',
                series: 'G Master',
                stabilization: 'OSS'
            },
            isFeatured: false
        },
        {
            name: 'Sony FE PZ 28-135mm f/4 G OSS',
            slug: 'sony-fe-pz-28-135mm-f4-g-oss',
            categoryId: lensesCategoryId,
            description: 'Designed to satisfy professional capture in 4K formats and beyond, the Sony FE PZ 28-135mm f/4 G OSS Lens offers high-quality cine-style imagery when paired with a high-performance 35mm full-frame format camera or Super35 format camcorder. This lens features a powered, variable-speed zoom control with direction reversal and minimal breathing, aberration, and image shift.',
            imageUrl: 'https://static.bhphoto.com/images/images500x500/1410490265_1082051.jpg',
            specs: {
                brand: 'Sony',
                type: 'Spherical',
                mount: 'Sony E',
                focal_length: '28-135mm',
                aperture: 'f/4',
                series: 'G OSS',
                zoom_type: 'Power Zoom',
                stabilization: 'OSS'
            },
            isFeatured: false
        }
    ];

    // Create products
    for (const product of products) {
        try {
            // Check if product already exists
            let existing;
            try {
                existing = app.findFirstRecordByData('products', 'slug', product.slug);
            } catch (e) {
                existing = null;
            }

            if (existing) {
                console.log(`[Seed] Product "${product.name}" already exists, skipping...`);
                continue;
            }

            // Download image
            const imageFile = downloadImage(product.imageUrl, product.name);

            // Create record
            const record = new Record(productsCollection, {
                name: product.name,
                slug: product.slug,
                description: product.description,
                daily_rate: 0,
                stock_total: 1,
                stock_available: 1,
                is_featured: product.isFeatured,
                specs: product.specs
            });

            // Set category relation
            record.set('category', product.categoryId);

            // Attach image if downloaded successfully
            if (imageFile) {
                record.set('images', imageFile);
            }

            app.save(record);
            console.log(`[Seed] Created product: ${product.name}`);
        } catch (e) {
            console.error(`[Seed] Error creating product ${product.name}:`, e);
        }
    }

    console.log('[Seed] Equipment (cameras & lenses) seed complete!');

}, (app) => {
    // Rollback: Do nothing (preserve data)
    console.log('[Seed] Rollback - No action taken');
});
