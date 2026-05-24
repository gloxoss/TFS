/**
 * COMPLETE SERVICE IMAGES UPDATE SCRIPT
 * 
 * This script:
 * 1. Compresses all images from web/public/all folder
 * 2. Uploads to ALL services with proper mapping
 * 3. Handles shared images (costume->makeup, digital->digital-corporate/services)
 * 
 * Usage: node complete_service_images_update.js
 * 
 * Requirements: npm install sharp pocketbase
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// ============================================
// CONFIGURATION - Edit these as needed
// ============================================

const CONFIG = {
    POCKETBASE_URL: 'http://127.0.0.1:8090',
    ADMIN_EMAIL: 'zakiossama28@gmail.com',
    ADMIN_PASSWORD: 'GloXoss123.',

    // Paths
    BASE_DIR: path.join(__dirname, 'web', 'public', 'all'),
    OUTPUT_DIR: path.join(__dirname, 'web', 'public', 'all_compressed'),
    SPORT_EVENTS_DIR: path.join(__dirname, 'sport services images'),  // For sporting-events

    // Image compression settings
    MAX_WIDTH: 1920,
    MAX_HEIGHT: 1080,
    QUALITY: 80,

    IMAGE_EXTENSIONS: /\.(jpg|jpeg|png|webp|avif|jfif|gif)$/i
};

// ============================================
// FOLDER TO SERVICE SLUG MAPPING
// ============================================

const FOLDER_TO_SLUG = {
    // Main folders
    "accommodation": "accommodation",
    "broadcast": "broadcasting-live",
    "casting": "casting",
    "catrering": "catering",  // typo in folder
    "costume & make up": "costume-makeup",  // costume + makeup fused into one service
    // "digital" is handled specially - 3 services with different images
    "equipent hire": "equipment-hire",  // typo in folder
    "film crewing": "crewing",
    "film shiping": "film-shipping",  // typo in folder
    "permits": "film-permits",
    "props & setdressing": "props-set-dressing",
    "scouting": "scouting",  // location scouting
    "security et set management": "security-management",
    "transportation": "transportation",

    // Sports subfolders (no more tfs- prefix)
    "athletics sport": "athletics",
    "baseball": "baseball",
    "basketball": "basketball",
    "cycling": "cycling",
    "extreme and actionsports": "extreme-sports",
    "football": "football",
    "motosports": "motorsports",
    "rugby": "rugby",
    "sport combqcts": "combat-sports",  // typo in folder
    "tenis": "tennis",  // typo in folder
};

// Services that share images with another service (processed after main upload)
const SHARED_IMAGES = {
    // Currently none - digital services each have their own images
};

// Digital folder has separate images for 3 services
// Maps: file pattern -> service slug
const DIGITAL_SERVICES_MAP = {
    "digital-production": {
        poster: "POSTER - Digital Production for Producers.jpg",
        inside: ["inside for producers.jfif", "inside for producers.jpg"]
    },
    "digital-corporate": {
        poster: "POSTER -Digital Production for Companies.jpg",
        inside: ["inside for companies.jpg", "inside for conpanies.jpg"]
    },
    "digital-services": {
        poster: "poster.jpg",
        inside: []  // No specific inside images, will use remaining
    }
};

// Special case: sport (formerly sporting-events) uses images from separate folder
const SPECIAL_FOLDERS = {
    "sport": "SPORT_EVENTS_DIR",  // Uses sport services images folder
};

// Services to rename (slug changes and title updates)
const SERVICE_RENAMES = [
    // Remove 'tfs-' prefix from sports
    { oldSlug: 'tfs-football', newSlug: 'football', title: 'Football', title_fr: 'Football' },
    { oldSlug: 'tfs-baseball', newSlug: 'baseball', title: 'Baseball', title_fr: 'Baseball' },
    { oldSlug: 'tfs-basketball', newSlug: 'basketball', title: 'Basketball', title_fr: 'Basketball' },
    { oldSlug: 'tfs-motorsports', newSlug: 'motorsports', title: 'Motorsports', title_fr: 'Sports Mécaniques' },
    { oldSlug: 'tfs-athletics', newSlug: 'athletics', title: 'Athletics', title_fr: 'Athlétisme' },
    { oldSlug: 'tfs-combat-sports', newSlug: 'combat-sports', title: 'Combat Sports', title_fr: 'Sports de Combat' },
    { oldSlug: 'tfs-tennis', newSlug: 'tennis', title: 'Tennis', title_fr: 'Tennis' },
    { oldSlug: 'tfs-rugby', newSlug: 'rugby', title: 'Rugby', title_fr: 'Rugby' },
    { oldSlug: 'tfs-cycling', newSlug: 'cycling', title: 'Cycling', title_fr: 'Cyclisme' },
    { oldSlug: 'tfs-extreme-sports', newSlug: 'extreme-sports', title: 'Extreme & Action Sports', title_fr: 'Sports Extrêmes' },
    // Rename sporting-events to sport
    { oldSlug: 'sporting-events', newSlug: 'sport', title: 'Sport', title_fr: 'Sport' },
    // Rename costume-wardrobe to costume-makeup (fused service)
    { oldSlug: 'costume-wardrobe', newSlug: 'costume-makeup', title: 'Costume & Makeup', title_fr: 'Costume & Maquillage' },
];

// Services to DELETE (fused into another service)
const SERVICES_TO_DELETE = [
    'makeup-hair',  // Fused into costume-makeup
];

// Sub-services mappings - update parent services to reference correct child slugs
const SUB_SERVICES_FIX = {
    'sport': [
        'football', 'baseball', 'basketball', 'motorsports', 'athletics',
        'combat-sports', 'tennis', 'rugby', 'cycling', 'extreme-sports'
    ]
};

// ============================================
// HELPER FUNCTIONS
// ============================================

async function compressImage(inputPath, outputPath) {
    try {
        await sharp(inputPath)
            .resize(CONFIG.MAX_WIDTH, CONFIG.MAX_HEIGHT, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .jpeg({ quality: CONFIG.QUALITY, mozjpeg: true })
            .toFile(outputPath.replace(/\.[^.]+$/, '.jpg'));

        return outputPath.replace(/\.[^.]+$/, '.jpg');
    } catch (e) {
        console.error(`   ❌ Failed to compress ${path.basename(inputPath)}: ${e.message}`);
        return null;
    }
}

async function uploadImagesToService(pb, serviceSlug, compressedDir) {
    // Find service
    let service;
    try {
        service = await pb.collection('services').getFirstListItem(`slug="${serviceSlug}"`);
    } catch (e) {
        console.log(`   ❌ Service not found: ${serviceSlug}`);
        return false;
    }

    // Get files
    let files;
    try {
        files = fs.readdirSync(compressedDir).filter(f => CONFIG.IMAGE_EXTENSIONS.test(f));
    } catch (e) {
        console.log(`   ❌ Cannot read directory: ${compressedDir}`);
        return false;
    }

    if (files.length === 0) {
        console.log(`   ⚠️ No images found`);
        return false;
    }

    // Find poster/hero
    let posterIdx = files.findIndex(f => f.toLowerCase().startsWith('poster'));
    if (posterIdx === -1) posterIdx = 0;

    const posterFile = files[posterIdx];
    const otherFiles = files.filter((_, i) => i !== posterIdx);

    // Upload hero
    console.log(`   📤 Uploading hero: ${posterFile}`);
    try {
        const buffer = fs.readFileSync(path.join(compressedDir, posterFile));
        const formData = new FormData();
        formData.append('hero_image', new Blob([buffer]), posterFile);
        await pb.collection('services').update(service.id, formData);
    } catch (e) {
        console.log(`   ❌ Hero upload failed: ${e.message}`);
        return false;
    }

    // Upload gallery
    if (otherFiles.length > 0) {
        console.log(`   📤 Uploading ${otherFiles.length} gallery images...`);
        const formData = new FormData();
        for (const f of otherFiles) {
            const buffer = fs.readFileSync(path.join(compressedDir, f));
            formData.append('images', new Blob([buffer]), f);
        }
        try {
            await pb.collection('services').update(service.id, formData);
        } catch (e) {
            // Try one by one
            console.log(`   ⚠️ Batch failed, trying one by one...`);
            for (const f of otherFiles) {
                try {
                    const buffer = fs.readFileSync(path.join(compressedDir, f));
                    const singleForm = new FormData();
                    singleForm.append('images', new Blob([buffer]), f);
                    await pb.collection('services').update(service.id, singleForm);
                } catch (e2) {
                    console.log(`      ❌ ${f}: ${e2.message}`);
                }
            }
        }
    }

    // Update sections - link gallery images to sections
    const updated = await pb.collection('services').getOne(service.id);
    if (updated.sections && updated.sections.length > 0 && updated.images && updated.images.length > 0) {
        let idx = 0;
        const newSections = updated.sections.map((sec, secIdx) => {
            // Link image if section has a type that uses images, OR if it has no type (simple title/content section)
            const usesImage = ['text_image', 'image_text', 'full_width_media'].includes(sec.type) 
                || sec.image !== undefined 
                || (!sec.type && sec.title);  // Simple sections without type
            
            if (usesImage && idx < updated.images.length) {
                sec.image = updated.images[idx++];
                // Add alternating layout if not set
                if (!sec.layout) {
                    sec.layout = secIdx % 2 === 0 ? 'right' : 'left';
                }
            }
            return sec;
        });
        await pb.collection('services').update(service.id, { sections: newSections });
        console.log(`   📎 Linked ${idx} images to sections`);
    }

    console.log(`   ✅ Done`);
    return true;
}

// ============================================
// MAIN FUNCTION
// ============================================

async function main() {
    const { default: PocketBase } = await import('pocketbase');
    const pb = new PocketBase(CONFIG.POCKETBASE_URL);

    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║     COMPLETE SERVICE IMAGES UPDATE SCRIPT                     ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    // 1. Authenticate
    console.log('🔐 Authenticating...');
    try {
        await pb.admins.authWithPassword(CONFIG.ADMIN_EMAIL, CONFIG.ADMIN_PASSWORD);
        console.log('✅ Authenticated.\n');
    } catch (e) {
        console.error('❌ Authentication failed:', e.message);
        return;
    }

    // 2. Rename services (remove TFS prefix, rename sporting-events to sport)
    console.log('📝 Renaming services...');
    for (const r of SERVICE_RENAMES) {
        try {
            const service = await pb.collection('services').getFirstListItem(`slug="${r.oldSlug}"`);
            await pb.collection('services').update(service.id, {
                slug: r.newSlug,
                title: r.title,
                title_fr: r.title_fr
            });
            console.log(`   ✅ ${r.oldSlug} → ${r.newSlug}`);
        } catch (e) {
            // Service might already be renamed or doesn't exist
            console.log(`   ⏭️ ${r.oldSlug} - skipped (already renamed or not found)`);
        }
    }
    console.log('');

    // 3. Delete fused services
    console.log('🗑️ Deleting fused services...');
    for (const slug of SERVICES_TO_DELETE) {
        try {
            const service = await pb.collection('services').getFirstListItem(`slug="${slug}"`);
            await pb.collection('services').delete(service.id);
            console.log(`   ✅ Deleted: ${slug}`);
        } catch (e) {
            console.log(`   ⏭️ ${slug} - skipped (already deleted or not found)`);
        }
    }
    console.log('');

    // 4. Fix sub_services references (update parent services with correct child slugs)
    console.log('🔗 Fixing sub_services references...');
    for (const [parentSlug, childSlugs] of Object.entries(SUB_SERVICES_FIX)) {
        try {
            const service = await pb.collection('services').getFirstListItem(`slug="${parentSlug}"`);
            await pb.collection('services').update(service.id, {
                sub_services: childSlugs
            });
            console.log(`   ✅ ${parentSlug} → ${childSlugs.length} sub-services`);
        } catch (e) {
            console.log(`   ⏭️ ${parentSlug} - skipped (not found)`);
        }
    }
    console.log('');

    // 5. Clear ALL services images
    console.log('🗑️ Clearing all existing images from all services...');
    const allServices = await pb.collection('services').getFullList();
    for (const s of allServices) {
        await pb.collection('services').update(s.id, {
            hero_image: null,
            images: []
        });
    }
    console.log(`✅ Cleared ${allServices.length} services.\n`);

    // 6. Create output directory
    if (!fs.existsSync(CONFIG.OUTPUT_DIR)) {
        fs.mkdirSync(CONFIG.OUTPUT_DIR, { recursive: true });
    }

    // 7. Get all folders to process
    const foldersToProcess = [];
    const mainFolders = fs.readdirSync(CONFIG.BASE_DIR).filter(f =>
        fs.statSync(path.join(CONFIG.BASE_DIR, f)).isDirectory()
    );

    for (const folder of mainFolders) {
        const folderPath = path.join(CONFIG.BASE_DIR, folder);

        if (folder.toLowerCase() === 'sports') {
            // Add sport subfolders
            const sportFolders = fs.readdirSync(folderPath).filter(f =>
                fs.statSync(path.join(folderPath, f)).isDirectory()
            );
            for (const sf of sportFolders) {
                foldersToProcess.push({
                    name: sf,
                    path: path.join(folderPath, sf)
                });
            }
        } else {
            foldersToProcess.push({
                name: folder,
                path: folderPath
            });
        }
    }

    console.log(`📁 Found ${foldersToProcess.length} folders to process.\n`);

    // 8. Process each folder - Compress and Upload
    const processedSlugs = new Map(); // slug -> compressed folder path

    for (const folder of foldersToProcess) {
        const slug = FOLDER_TO_SLUG[folder.name.toLowerCase()];
        if (!slug) {
            console.log(`⚠️ [${folder.name}] No mapping defined, skipping.`);
            continue;
        }

        // Get images
        let files;
        try {
            files = fs.readdirSync(folder.path).filter(f => CONFIG.IMAGE_EXTENSIONS.test(f));
        } catch (e) {
            continue;
        }

        if (files.length === 0) {
            console.log(`⚠️ [${folder.name}] No images found, skipping.`);
            continue;
        }

        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

        // Handle array of slugs (e.g., costume & make up -> both costume-wardrobe AND makeup-hair)
        const slugs = Array.isArray(slug) ? slug : [slug];
        const primarySlug = slugs[0];

        console.log(`📂 ${folder.name} → ${slugs.join(', ')}`);
        console.log(`   Original files: ${files.length}`);

        // Create output subfolder (use primary slug)
        const outFolder = path.join(CONFIG.OUTPUT_DIR, primarySlug);
        if (!fs.existsSync(outFolder)) {
            fs.mkdirSync(outFolder, { recursive: true });
        }

        // Compress all images
        for (const file of files) {
            const inputPath = path.join(folder.path, file);
            const outputPath = path.join(outFolder, file);

            const originalSize = fs.statSync(inputPath).size;
            console.log(`   🔄 Compressing: ${file} (${Math.round(originalSize / 1024)}KB)`);

            const compressed = await compressImage(inputPath, outputPath);
            if (compressed) {
                const newSize = fs.statSync(compressed).size;
                console.log(`      ✅ → ${path.basename(compressed)} (${Math.round(newSize / 1024)}KB)`);
            }
        }

        // Upload to service(s) - handle multiple slugs
        for (const s of slugs) {
            if (slugs.length > 1 && s !== primarySlug) {
                console.log(`   📂 Also uploading to: ${s}`);
            }
            const success = await uploadImagesToService(pb, s, outFolder);
            if (success) {
                processedSlugs.set(s, outFolder);
            }
        }
    }

    // 9. Handle digital folder specially (3 services with different images)
    console.log(`\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📋 Processing digital folder (3 separate services)...`);

    const digitalDir = path.join(CONFIG.BASE_DIR, 'digital');
    if (fs.existsSync(digitalDir)) {
        const allDigitalFiles = fs.readdirSync(digitalDir).filter(f => CONFIG.IMAGE_EXTENSIONS.test(f));

        for (const [serviceSlug, mapping] of Object.entries(DIGITAL_SERVICES_MAP)) {
            console.log(`\n   📂 ${serviceSlug}`);

            const outFolder = path.join(CONFIG.OUTPUT_DIR, serviceSlug);
            if (!fs.existsSync(outFolder)) {
                fs.mkdirSync(outFolder, { recursive: true });
            }

            // Get files for this service
            const serviceFiles = [];

            // Add poster
            if (mapping.poster && allDigitalFiles.includes(mapping.poster)) {
                serviceFiles.push(mapping.poster);
            }

            // Add inside images
            for (const inside of mapping.inside) {
                if (allDigitalFiles.includes(inside)) {
                    serviceFiles.push(inside);
                }
            }

            if (serviceFiles.length === 0) {
                console.log(`   ⚠️ No images found for ${serviceSlug}`);
                continue;
            }

            console.log(`   Files: ${serviceFiles.length}`);

            // Compress
            for (const file of serviceFiles) {
                const inputPath = path.join(digitalDir, file);
                const outputPath = path.join(outFolder, file);

                const originalSize = fs.statSync(inputPath).size;
                console.log(`   🔄 Compressing: ${file} (${Math.round(originalSize / 1024)}KB)`);

                const compressed = await compressImage(inputPath, outputPath);
                if (compressed) {
                    const newSize = fs.statSync(compressed).size;
                    console.log(`      ✅ → ${path.basename(compressed)} (${Math.round(newSize / 1024)}KB)`);
                }
            }

            // Upload
            await uploadImagesToService(pb, serviceSlug, outFolder);
            processedSlugs.set(serviceSlug, outFolder);
        }
    }

    // 10. Handle special folders (like sport with separate source)
    console.log(`\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📋 Processing special folders...`);

    for (const [targetSlug, configKey] of Object.entries(SPECIAL_FOLDERS)) {
        const sourceDir = CONFIG[configKey];
        if (!sourceDir || !fs.existsSync(sourceDir)) {
            console.log(`   ⚠️ ${targetSlug}: Source folder not found, skipping.`);
            continue;
        }

        console.log(`\n   📂 ${targetSlug} (from special folder)`);

        // Get and compress images
        const files = fs.readdirSync(sourceDir).filter(f => CONFIG.IMAGE_EXTENSIONS.test(f));
        if (files.length === 0) {
            console.log(`   ⚠️ No images found in ${sourceDir}`);
            continue;
        }

        console.log(`   Original files: ${files.length}`);

        const outFolder = path.join(CONFIG.OUTPUT_DIR, targetSlug);
        if (!fs.existsSync(outFolder)) {
            fs.mkdirSync(outFolder, { recursive: true });
        }

        // Compress
        for (const file of files) {
            const inputPath = path.join(sourceDir, file);
            const outputPath = path.join(outFolder, file);

            const originalSize = fs.statSync(inputPath).size;
            console.log(`   🔄 Compressing: ${file} (${Math.round(originalSize / 1024)}KB)`);

            const compressed = await compressImage(inputPath, outputPath);
            if (compressed) {
                const newSize = fs.statSync(compressed).size;
                console.log(`      ✅ → ${path.basename(compressed)} (${Math.round(newSize / 1024)}KB)`);
            }
        }

        // Upload
        await uploadImagesToService(pb, targetSlug, outFolder);
    }

    // 11. Handle shared images
    console.log(`\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📋 Processing shared images...`);

    for (const [targetSlug, sourceSlug] of Object.entries(SHARED_IMAGES)) {
        const sourceFolder = processedSlugs.get(sourceSlug);
        if (!sourceFolder) {
            console.log(`   ⚠️ ${targetSlug}: Source ${sourceSlug} not processed, skipping.`);
            continue;
        }

        console.log(`\n   📂 ${targetSlug} (copying from ${sourceSlug})`);
        await uploadImagesToService(pb, targetSlug, sourceFolder);
    }

    // 12. Final Report
    console.log(`\n\n╔══════════════════════════════════════════════════════════════╗`);
    console.log(`║                    FINAL REPORT                                ║`);
    console.log(`╚══════════════════════════════════════════════════════════════╝\n`);

    const finalServices = await pb.collection('services').getFullList({ sort: 'slug' });
    let withImages = 0;
    let withoutImages = [];

    for (const s of finalServices) {
        const hasHero = !!s.hero_image;
        const imgCount = s.images?.length || 0;

        if (hasHero || imgCount > 0) {
            withImages++;
            console.log(`  ✅ ${s.slug.padEnd(25)} Hero: ${hasHero ? 'YES' : 'NO '}  Gallery: ${imgCount}`);
        } else {
            withoutImages.push(s.slug);
            console.log(`  ❌ ${s.slug.padEnd(25)} No images`);
        }
    }

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`✅ Total with images: ${withImages}/${finalServices.length}`);

    if (withoutImages.length > 0) {
        console.log(`❌ Missing images (${withoutImages.length}): ${withoutImages.join(', ')}`);
    }

    console.log(`\n🎉 COMPLETE!`);
}

// Run
main().catch(console.error);
