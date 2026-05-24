/**
 * Upload images from web/public/all folder to services
 * POSTER.* -> hero_image
 * Other images -> images (gallery) + sections
 */
const fs = require('fs');
const path = require('path');

async function uploadAllImages() {
    const { default: PocketBase } = await import('pocketbase');
    const pb = new PocketBase('http://127.0.0.1:8090');

    const BASE_DIR = path.join(__dirname, 'web', 'public', 'all');
    const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|webp|avif|jfif|gif)$/i;

    // Mapping: folder name (lowercase) -> service slug
    const FOLDER_TO_SLUG = {
        "accommodation": "accommodation",
        "broadcast": "broadcasting-live",
        "casting": "casting",
        "catrering": "catering",  // typo in folder name
        "costume & make up": "costume-wardrobe",  // or makeup-hair? Let's do both
        "digital": "digital-production",
        "equipent hire": "equipment-hire",  // typo in folder name
        "film crewing": "crewing",
        "film shiping": "film-shipping",  // typo in folder name
        "permits": "film-permits",
        "props & setdressing": "props-set-dressing",
        "security et set management": "security-management",
        "transportation": "transportation",
        // Sports subfolders
        "athletics sport": "tfs-athletics",
        "baseball": "tfs-baseball",
        "basketball": "tfs-basketball",
        "cycling": "tfs-cycling",
        "extreme and actionsports": "tfs-extreme-sports",
        "football": "tfs-football",
        "motosports": "tfs-motorsports",
        "rugby": "tfs-rugby",
        "sport combqcts": "tfs-combat-sports",  // typo in folder name
        "tenis": "tfs-tennis",  // typo in folder name
    };

    try {
        console.log("=== UPLOAD FROM /all FOLDER ===\n");

        // 1. Authenticate
        console.log("🔐 Authenticating...");
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');
        console.log("✅ Authenticated.\n");

        // 2. First, clear ALL images from ALL services
        console.log("🗑️ Clearing ALL existing images from ALL services...");
        const allServices = await pb.collection('services').getFullList();
        for (const s of allServices) {
            await pb.collection('services').update(s.id, {
                hero_image: null,
                images: []
            });
        }
        console.log(`✅ Cleared ${allServices.length} services.\n`);

        // 3. Process main folders
        const mainFolders = fs.readdirSync(BASE_DIR).filter(f => {
            return fs.statSync(path.join(BASE_DIR, f)).isDirectory();
        });

        console.log(`📁 Found ${mainFolders.length} main folders.\n`);

        for (const folder of mainFolders) {
            const folderPath = path.join(BASE_DIR, folder);
            
            // Special handling for sports folder - process subfolders
            if (folder.toLowerCase() === 'sports') {
                console.log("\n🏆 Processing SPORTS subfolders...");
                const sportFolders = fs.readdirSync(folderPath).filter(f => {
                    return fs.statSync(path.join(folderPath, f)).isDirectory();
                });
                
                for (const sportFolder of sportFolders) {
                    await processFolder(pb, path.join(folderPath, sportFolder), sportFolder, FOLDER_TO_SLUG, IMAGE_EXTENSIONS);
                }
                continue;
            }
            
            // Process regular folder
            await processFolder(pb, folderPath, folder, FOLDER_TO_SLUG, IMAGE_EXTENSIONS);
        }

        console.log(`\n\n✅ ═══════════════════════════════════════`);
        console.log(`   COMPLETE!`);
        console.log(`═══════════════════════════════════════════\n`);

        // Final report
        console.log("\n📊 FINAL REPORT:");
        const updatedServices = await pb.collection('services').getFullList({ sort: 'slug' });
        let withImages = 0;
        for (const s of updatedServices) {
            const hasHero = !!s.hero_image;
            const imgCount = s.images?.length || 0;
            if (hasHero || imgCount > 0) {
                withImages++;
                console.log(`  ✅ ${s.slug}: Hero=${hasHero ? 'YES' : 'NO'}, Gallery=${imgCount}`);
            } else {
                console.log(`  ❌ ${s.slug}: No images`);
            }
        }
        console.log(`\nTotal with images: ${withImages}/${updatedServices.length}`);

    } catch (e) {
        console.error("❌ Error:", e.message);
        console.error(e.stack);
    }
}

async function processFolder(pb, folderPath, folderName, FOLDER_TO_SLUG, IMAGE_EXTENSIONS) {
    const slug = FOLDER_TO_SLUG[folderName.toLowerCase()];
    
    if (!slug) {
        console.log(`⚠️ [${folderName}] No mapping defined, skipping.`);
        return;
    }

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📂 Processing: "${folderName}" → ${slug}`);

    // Get all images in folder
    let files;
    try {
        files = fs.readdirSync(folderPath).filter(f => IMAGE_EXTENSIONS.test(f));
    } catch (e) {
        console.log(`   ⚠️ Cannot read folder: ${e.message}`);
        return;
    }

    if (files.length === 0) {
        console.log(`   ⚠️ No images found, skipping.`);
        return;
    }

    console.log(`   📷 Found ${files.length} images: ${files.join(', ')}`);

    // Find POSTER image (hero)
    let posterFile = files.find(f => f.toLowerCase().startsWith('poster'));
    const otherImages = files.filter(f => f !== posterFile);

    console.log(`   🎬 Poster/Hero: ${posterFile || '(none - will use first image)'}`);
    console.log(`   🖼️ Other images: ${otherImages.length > 0 ? otherImages.join(', ') : '(none)'}`);

    // If no poster, use first image as hero
    if (!posterFile && files.length > 0) {
        posterFile = files[0];
        const idx = otherImages.indexOf(posterFile);
        if (idx > -1) otherImages.splice(idx, 1);
        console.log(`   ℹ️ Using first image as hero: ${posterFile}`);
    }

    // Find service in DB
    let service;
    try {
        service = await pb.collection('services').getFirstListItem(`slug="${slug}"`);
        console.log(`   ✅ Found service: ${service.title} (ID: ${service.id})`);
    } catch (e) {
        console.log(`   ❌ Service not found: ${slug}`);
        return;
    }

    // Upload images
    console.log(`   📤 Uploading...`);
    const formData = new FormData();

    if (posterFile) {
        const filePath = path.join(folderPath, posterFile);
        const buffer = fs.readFileSync(filePath);
        const blob = new Blob([buffer]);
        formData.append('hero_image', blob, posterFile);
    }

    for (const img of otherImages) {
        const filePath = path.join(folderPath, img);
        const buffer = fs.readFileSync(filePath);
        const blob = new Blob([buffer]);
        formData.append('images', blob, img);
    }

    let updatedService;
    try {
        updatedService = await pb.collection('services').update(service.id, formData);
        console.log(`   ✅ Uploaded! Hero: ${updatedService.hero_image}, Gallery: ${updatedService.images?.length || 0}`);
    } catch (e) {
        console.error(`   ❌ Failed to upload:`, e.message);
        return;
    }

    // Update sections with new image references
    if (updatedService.sections && updatedService.sections.length > 0 && 
        updatedService.images && updatedService.images.length > 0) {
        
        let imageIndex = 0;
        const newSections = updatedService.sections.map((section, idx) => {
            if (['text_image', 'image_text', 'full_width_media', 'gallery'].includes(section.type) || 
                section.image !== undefined) {
                if (imageIndex < updatedService.images.length) {
                    section.image = updatedService.images[imageIndex];
                    imageIndex++;
                }
            }
            return section;
        });

        try {
            await pb.collection('services').update(service.id, { sections: newSections });
            console.log(`   ✅ Sections updated.`);
        } catch (e) {
            console.error(`   ❌ Failed to update sections:`, e.message);
        }
    }
}

uploadAllImages();
