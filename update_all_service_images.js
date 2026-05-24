/**
 * Complete Service Images Update Script
 * 
 * This script:
 * 1. Reads all folders from public/images/services
 * 2. Maps folders to service slugs
 * 3. Clears existing images from services
 * 4. Uploads new images (hero.* or poster.* → hero_image, others → images)
 * 5. Updates sections JSON to reference the new uploaded image filenames
 */

const fs = require('fs');
const path = require('path');

async function updateAllServiceImages() {
    const { default: PocketBase } = await import('pocketbase');
    const pb = new PocketBase('http://127.0.0.1:8090');

    const BASE_DIR = path.join(__dirname, 'web', 'public', 'images', 'services');

    // Mapping: folder name → service slug in DB
    const FOLDER_TO_SLUG = {
        "accommodation": "accommodation",
        "casting": "casting",
        "catering": "catering",
        "crewing": "crewing",
        "equipment": "equipment-hire",
        "permits": "film-permits",
        "scouting": "scouting",
        "shipping": "film-shipping",
        "sporting-events": "sporting-events",
        "transportation": "transportation",
        "sports": "tfs-football", // Main sports folder for TFS Football
    };

    const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|webp|avif)$/i;

    try {
        console.log("=== Service Images Update Script ===\n");

        // 1. Authenticate
        console.log("🔐 Authenticating...");
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');
        console.log("✅ Authenticated.\n");

        // 2. Get all folders
        if (!fs.existsSync(BASE_DIR)) {
            console.error(`❌ Base directory not found: ${BASE_DIR}`);
            return;
        }

        const folders = fs.readdirSync(BASE_DIR).filter(file => {
            const folderPath = path.join(BASE_DIR, file);
            return fs.statSync(folderPath).isDirectory();
        });

        console.log(`📁 Found ${folders.length} folders to process.\n`);

        // 3. Process each folder
        for (const folder of folders) {
            const slug = FOLDER_TO_SLUG[folder];
            
            if (!slug) {
                console.log(`⚠️ [${folder}] No mapping defined, skipping.`);
                continue;
            }

            console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            console.log(`📂 Processing: ${folder} → ${slug}`);

            const folderPath = path.join(BASE_DIR, folder);

            // Get all images in folder
            const files = fs.readdirSync(folderPath).filter(f => IMAGE_EXTENSIONS.test(f));

            if (files.length === 0) {
                console.log(`   ⚠️ No images found, skipping.`);
                continue;
            }

            console.log(`   📷 Found ${files.length} images: ${files.join(', ')}`);

            // Find hero/poster image
            let heroFile = files.find(f => 
                f.toLowerCase().startsWith('hero.') || 
                f.toLowerCase().startsWith('poster.')
            );

            // Other images (not hero/poster)
            const otherImages = files.filter(f => f !== heroFile);

            console.log(`   🎬 Hero: ${heroFile || '(none - will use first image)'}`);
            console.log(`   🖼️ Section images: ${otherImages.length > 0 ? otherImages.join(', ') : '(none)'}`);

            // If no hero, use first image as hero
            if (!heroFile && files.length > 0) {
                heroFile = files[0];
                // Remove from otherImages if we're using it as hero
                const idx = otherImages.indexOf(heroFile);
                if (idx > -1) otherImages.splice(idx, 1);
                console.log(`   ℹ️ Using first image as hero: ${heroFile}`);
            }

            // 4. Find service in DB
            let service;
            try {
                service = await pb.collection('services').getFirstListItem(`slug="${slug}"`);
                console.log(`   ✅ Found service: ${service.title} (ID: ${service.id})`);
            } catch (e) {
                console.log(`   ❌ Service not found: ${slug}`);
                continue;
            }

            // 5. Clear existing images first
            console.log(`   🗑️ Clearing existing images...`);
            try {
                await pb.collection('services').update(service.id, {
                    hero_image: null,
                    images: []
                });
                console.log(`   ✅ Existing images cleared.`);
            } catch (e) {
                console.error(`   ❌ Failed to clear images:`, e.message);
                continue;
            }

            // 6. Upload new images
            console.log(`   📤 Uploading new images...`);
            const formData = new FormData();

            if (heroFile) {
                const heroPath = path.join(folderPath, heroFile);
                const heroBuffer = fs.readFileSync(heroPath);
                const heroBlob = new Blob([heroBuffer]);
                formData.append('hero_image', heroBlob, heroFile);
            }

            for (const img of otherImages) {
                const imgPath = path.join(folderPath, img);
                const imgBuffer = fs.readFileSync(imgPath);
                const imgBlob = new Blob([imgBuffer]);
                formData.append('images', imgBlob, img);
            }

            let updatedService;
            try {
                updatedService = await pb.collection('services').update(service.id, formData);
                console.log(`   ✅ Images uploaded successfully.`);
                console.log(`      Hero: ${updatedService.hero_image || '(none)'}`);
                console.log(`      Gallery: ${JSON.stringify(updatedService.images)}`);
            } catch (e) {
                console.error(`   ❌ Failed to upload images:`, e.message);
                continue;
            }

            // 7. Update sections with new image references
            if (updatedService.sections && updatedService.sections.length > 0 && 
                updatedService.images && updatedService.images.length > 0) {
                
                console.log(`   🔧 Updating sections with new image references...`);
                
                let imageIndex = 0;
                const newSections = updatedService.sections.map((section, idx) => {
                    // Only update sections that can have images
                    const imageTypes = ['text_image', 'image_text', 'full_width_media', 'gallery'];
                    
                    if (imageTypes.includes(section.type) || section.image !== undefined) {
                        if (imageIndex < updatedService.images.length) {
                            const newImage = updatedService.images[imageIndex];
                            console.log(`      Section[${idx}] (${section.type}): ${section.image || '(empty)'} → ${newImage}`);
                            section.image = newImage;
                            imageIndex++;
                        }
                    }
                    return section;
                });

                try {
                    await pb.collection('services').update(service.id, {
                        sections: newSections
                    });
                    console.log(`   ✅ Sections updated.`);
                } catch (e) {
                    console.error(`   ❌ Failed to update sections:`, e.message);
                }
            } else {
                console.log(`   ℹ️ No sections to update or no images for sections.`);
            }
        }

        console.log(`\n\n✅ ═══════════════════════════════════════`);
        console.log(`   COMPLETE! All services processed.`);
        console.log(`═══════════════════════════════════════════\n`);

    } catch (e) {
        console.error("❌ General Error:", e.message);
        console.error(e.stack);
    }
}

updateAllServiceImages();
