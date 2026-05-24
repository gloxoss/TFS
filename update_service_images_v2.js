
const fs = require('fs');
const path = require('path');

async function updateServiceImages() {
    const { default: PocketBase } = await import('pocketbase');
    const pb = new PocketBase('http://127.0.0.1:8090');

    const BASE_DIR = path.join(__dirname, 'web', 'public', 'images', 'services');

    try {
        console.log("--- Authenticating ---");
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');
        console.log("✅ Authenticated.");

        // Get list of service folders
        if (!fs.existsSync(BASE_DIR)) {
            console.error(`❌ Base directory not found: ${BASE_DIR}`);
            return;
        }

        const folders = fs.readdirSync(BASE_DIR).filter(file => {
            return fs.statSync(path.join(BASE_DIR, file)).isDirectory();
        });

        console.log(`Found ${folders.length} folders to process.`);

        const mapping = {
            "accommodation": "accommodation",
            "audio-equipment": "audio", // Check if 'audio' service exists? No, maybe part of equipment categories? Skipping if no service match.
            "camera-rental": "camera", // Likewise
            "casting": "casting",
            "catering": "catering",
            "crewing": "crewing",
            "equipment": "equipment-hire",
            "full-production": "broadcasting-live", // Assumption based on "Broadcasting & Live"
            "grip-support": "grip",
            "lighting-equipment": "lighting",
            "location-scouting": "scouting",
            "permits": "film-permits",
            "permits-logistics": "film-shipping",
            "scouting": "scouting", // Duplicate?
            "shipping": "film-shipping", // Duplicate? Use one.
            "sporting-events": "sporting-events",
            "sports": "tfs-football", // Example? "sports" folder might contain subfolders?
            "transportation": "transportation",
            "lens-collection": "lenses"
        };

        // Let's refine based on the slug list I just got.
        // Slugs: film-shipping, equipment-hire, broadcasting-live, film-permits, crewing, scouting, catering, accommodation, transportation, casting, makeup-hair, costume-wardrobe, props-set-dressing, security-management

        const refinedMapping = {
            "accommodation": "accommodation",
            "casting": "casting",
            "catering": "catering",
            "crewing": "crewing",
            "equipment": "equipment-hire", // Folder "equipment" -> Slug "equipment-hire"
            "full-production": "broadcasting-live", // Likely match
            "permits": "film-permits",
            "scouting": "scouting",
            "shipping": "film-shipping",
            "transportation": "transportation",
            "sporting-events": "sporting-events",

            // These might be tricky:
            "location-scouting": "scouting", // Alternate folder
            "permits-logistics": "film-shipping", // Alternate folder

            // "crew-talent" -> crewing?
            "crew-talent": "crewing"
        };

        // Filter for debugging
        // const targetFolders = ['shipping', 'equipment', 'full-production', 'permits'];
        // const foldersToProcess = folders.filter(f => targetFolders.includes(f));

        for (const folder of folders) {
            let slug = refinedMapping[folder] || folder; // Fallback to folder name

            console.log(`\nProcessing Folder: ${folder} -> Service Slug: ${slug}`);
            const folderPath = path.join(BASE_DIR, folder);

            // 1. Check if service exists
            let service;
            try {
                service = await pb.collection('services').getFirstListItem(`slug="${slug}"`);
            } catch (e) {
                console.log(`❌ Service not found in DB: ${slug} (Skipping)`);
                continue;
            }

            // 2. Identify Images
            const files = fs.readdirSync(folderPath);
            console.log(`   - Files in folder: ${files.join(', ')}`);

            let heroFile = files.find(f => f.toLowerCase().startsWith('hero.') && /\.(jpg|jpeg|png|webp|avif)$/i.test(f));
            const otherImages = files.filter(f => f !== heroFile && /\.(jpg|jpeg|png|webp|avif)$/i.test(f));

            if (!heroFile && otherImages.length === 0) {
                console.log(`⚠️ No valid images found in folder: ${slug} (Files: ${files.join(', ')})`);
                continue;
            }

            // 3. Prepare Upload
            // Note: PocketBase SDK sends "multipart/form-data" automatically when using FormData
            const formData = new FormData();

            if (heroFile) {
                const blob = new Blob([fs.readFileSync(path.join(folderPath, heroFile))]);
                formData.append('hero_image', blob, heroFile);
                console.log(`   - Found Hero: ${heroFile}`);
            }

            if (otherImages.length > 0) {
                console.log(`   - Found ${otherImages.length} other images for gallery/sections.`);
                // We overwrite the 'images' field. 
                // To append, we would need to fetch existing, download them, and re-upload. 
                // The plan says "overwrite", so we just push new ones.
                for (const img of otherImages) {
                    const blob = new Blob([fs.readFileSync(path.join(folderPath, img))]);
                    formData.append('images', blob, img);
                }
            }

            // 4. Update Service (Upload Images)
            let updatedService;
            try {
                updatedService = await pb.collection('services').update(service.id, formData);
                console.log(`   ✅ Images uploaded.`);
            } catch (e) {
                console.error(`   ❌ Failed to upload images:`, e.message);
                continue;
            }

            // 5. Update Sections
            // We need to map the uploaded 'images' to the sections.
            // The available images in the record are now in updatedService.images
            if (updatedService.sections && updatedService.sections.length > 0 && updatedService.images && updatedService.images.length > 0) {
                let imageIndex = 0;
                let sectionsUpdated = false;

                const newSections = updatedService.sections.map(section => {
                    // Check if section has an 'image' field or we should add one
                    // Assuming sections like "text_image" have an "image" property.
                    // We'll try to assign an image if the section *can* take one.
                    // Or strictly follow existing logic: if it had an image, update it?
                    // The prompt implies: "modify their ... section images to those of in that folder"
                    // We will iterate and assign from the pool of uploaded images.

                    if (imageIndex < updatedService.images.length) {
                        // Crude check: does the section look like it needs an image?
                        // We'll just assign to 'image' property if the section type suggests it or if it exists.
                        // Or we just forcefully set 'image' property for 'text_image' etc.
                        if (['text_image', 'image_text', 'full_width_media'].includes(section.type) || section.image !== undefined) {
                            section.image = updatedService.images[imageIndex];
                            imageIndex++;
                            sectionsUpdated = true;
                        }
                    }
                    return section;
                });

                if (sectionsUpdated) {
                    try {
                        await pb.collection('services').update(service.id, {
                            sections: newSections
                        });
                        console.log(`   ✅ Sections updated with new image references.`);
                    } catch (e) {
                        console.error(`   ❌ Failed to update sections:`, e.message);
                    }
                } else {
                    console.log(`   ℹ️ No suitable sections found to assign images to.`);
                }
            }
        }

        console.log("\n--- Done ---");

    } catch (e) {
        console.error("General Error:", e.message);
    }
}

updateServiceImages();
