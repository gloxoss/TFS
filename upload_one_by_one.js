/**
 * Upload images one by one to handle large files
 * From web/public/all folder
 */
const fs = require('fs');
const path = require('path');

async function uploadOneByOne() {
    const { default: PocketBase } = await import('pocketbase');
    const pb = new PocketBase('http://127.0.0.1:8090');

    const BASE_DIR = path.join(__dirname, 'web', 'public', 'all');
    const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|webp|avif|jfif|gif)$/i;

    // Mapping: folder name (lowercase) -> service slug
    const FOLDER_TO_SLUG = {
        "accommodation": "accommodation",
        "broadcast": "broadcasting-live",
        "casting": "casting",
        "catrering": "catering",
        "costume & make up": "costume-wardrobe",
        "digital": "digital-production",
        "equipent hire": "equipment-hire",
        "film crewing": "crewing",
        "film shiping": "film-shipping",
        "permits": "film-permits",
        "props & setdressing": "props-set-dressing",
        "security et set management": "security-management",
        "transportation": "transportation",
        "scouting": "scouting",
        // Sports subfolders
        "athletics sport": "tfs-athletics",
        "baseball": "tfs-baseball",
        "basketball": "tfs-basketball",
        "cycling": "tfs-cycling",
        "extreme and actionsports": "tfs-extreme-sports",
        "football": "tfs-football",
        "motosports": "tfs-motorsports",
        "rugby": "tfs-rugby",
        "sport combqcts": "tfs-combat-sports",
        "tenis": "tfs-tennis",
    };

    try {
        console.log("=== UPLOAD ONE BY ONE ===\n");
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');
        console.log("✅ Authenticated.\n");

        // Get all folders to process
        const foldersToProcess = [];
        
        const mainFolders = fs.readdirSync(BASE_DIR).filter(f => 
            fs.statSync(path.join(BASE_DIR, f)).isDirectory()
        );

        for (const folder of mainFolders) {
            const folderPath = path.join(BASE_DIR, folder);
            
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

        console.log(`📁 Processing ${foldersToProcess.length} folders...\n`);

        for (const folder of foldersToProcess) {
            const slug = FOLDER_TO_SLUG[folder.name.toLowerCase()];
            if (!slug) {
                console.log(`⚠️ [${folder.name}] No mapping, skipping.`);
                continue;
            }

            // Get images
            let files;
            try {
                files = fs.readdirSync(folder.path).filter(f => IMAGE_EXTENSIONS.test(f));
            } catch (e) {
                continue;
            }

            if (files.length === 0) {
                console.log(`⚠️ [${folder.name}] No images, skipping.`);
                continue;
            }

            // Find service
            let service;
            try {
                service = await pb.collection('services').getFirstListItem(`slug="${slug}"`);
            } catch (e) {
                console.log(`❌ [${folder.name}] Service not found: ${slug}`);
                continue;
            }

            // Skip if already has images
            if (service.hero_image) {
                console.log(`✓ [${slug}] Already has images, skipping.`);
                continue;
            }

            console.log(`\n📂 ${folder.name} → ${slug}`);
            console.log(`   Files: ${files.join(', ')}`);

            // Find poster
            let posterFile = files.find(f => f.toLowerCase().startsWith('poster'));
            const otherImages = files.filter(f => f !== posterFile);

            if (!posterFile && files.length > 0) {
                posterFile = files[0];
                const idx = otherImages.indexOf(posterFile);
                if (idx > -1) otherImages.splice(idx, 1);
            }

            // Upload hero first
            if (posterFile) {
                console.log(`   📤 Uploading hero: ${posterFile}`);
                try {
                    const filePath = path.join(folder.path, posterFile);
                    const buffer = fs.readFileSync(filePath);
                    const formData = new FormData();
                    formData.append('hero_image', new Blob([buffer]), posterFile);
                    
                    await pb.collection('services').update(service.id, formData);
                    console.log(`   ✅ Hero uploaded`);
                } catch (e) {
                    console.log(`   ❌ Hero failed: ${e.message}`);
                }
            }

            // Upload gallery images one by one
            for (const img of otherImages) {
                console.log(`   📤 Uploading: ${img}`);
                try {
                    const filePath = path.join(folder.path, img);
                    const buffer = fs.readFileSync(filePath);
                    const formData = new FormData();
                    formData.append('images', new Blob([buffer]), img);
                    
                    await pb.collection('services').update(service.id, formData);
                    console.log(`   ✅ Uploaded`);
                } catch (e) {
                    console.log(`   ❌ Failed: ${e.message}`);
                }
            }

            // Update sections
            const updatedService = await pb.collection('services').getOne(service.id);
            if (updatedService.sections && updatedService.images && updatedService.images.length > 0) {
                let imageIndex = 0;
                const newSections = updatedService.sections.map((section) => {
                    if (['text_image', 'image_text', 'full_width_media'].includes(section.type) || section.image !== undefined) {
                        if (imageIndex < updatedService.images.length) {
                            section.image = updatedService.images[imageIndex];
                            imageIndex++;
                        }
                    }
                    return section;
                });
                await pb.collection('services').update(service.id, { sections: newSections });
                console.log(`   ✅ Sections updated`);
            }
        }

        // Final report
        console.log("\n\n📊 FINAL REPORT:");
        const allServices = await pb.collection('services').getFullList({ sort: 'slug' });
        let withImages = 0;
        for (const s of allServices) {
            const hasHero = !!s.hero_image;
            const imgCount = s.images?.length || 0;
            if (hasHero || imgCount > 0) {
                withImages++;
                console.log(`  ✅ ${s.slug}: Hero=${hasHero}, Gallery=${imgCount}`);
            } else {
                console.log(`  ❌ ${s.slug}: No images`);
            }
        }
        console.log(`\nTotal: ${withImages}/${allServices.length}`);

    } catch (e) {
        console.error("Error:", e.message);
    }
}

uploadOneByOne();
