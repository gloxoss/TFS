/**
 * Compress images from /all folder and upload to PocketBase
 * Uses Sharp to resize and compress images
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const BASE_DIR = path.join(__dirname, 'web', 'public', 'all');
const OUTPUT_DIR = path.join(__dirname, 'web', 'public', 'all_compressed');
const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|webp|avif|jfif|gif)$/i;

// Max dimensions and quality
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;
const QUALITY = 80;

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

async function compressImage(inputPath, outputPath) {
    const ext = path.extname(inputPath).toLowerCase();
    
    try {
        let pipeline = sharp(inputPath)
            .resize(MAX_WIDTH, MAX_HEIGHT, {
                fit: 'inside',
                withoutEnlargement: true
            });

        // Output as JPEG for best compression
        await pipeline
            .jpeg({ quality: QUALITY, mozjpeg: true })
            .toFile(outputPath.replace(/\.[^.]+$/, '.jpg'));

        return outputPath.replace(/\.[^.]+$/, '.jpg');
    } catch (e) {
        console.error(`   ❌ Failed to compress ${path.basename(inputPath)}: ${e.message}`);
        return null;
    }
}

async function main() {
    const { default: PocketBase } = await import('pocketbase');
    const pb = new PocketBase('http://127.0.0.1:8090');

    console.log("=== COMPRESS & UPLOAD IMAGES ===\n");

    // 1. Authenticate
    await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');
    console.log("✅ Authenticated.\n");

    // 2. Clear ALL services first
    console.log("🗑️ Clearing all existing images...");
    const allServices = await pb.collection('services').getFullList();
    for (const s of allServices) {
        await pb.collection('services').update(s.id, {
            hero_image: null,
            images: []
        });
    }
    console.log(`✅ Cleared ${allServices.length} services.\n`);

    // 3. Create output directory
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // 4. Get all folders
    const foldersToProcess = [];
    const mainFolders = fs.readdirSync(BASE_DIR).filter(f => 
        fs.statSync(path.join(BASE_DIR, f)).isDirectory()
    );

    for (const folder of mainFolders) {
        const folderPath = path.join(BASE_DIR, folder);
        
        if (folder.toLowerCase() === 'sports') {
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

    // 5. Process each folder
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

        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`📂 ${folder.name} → ${slug}`);
        console.log(`   Original files: ${files.length}`);

        // Create output subfolder
        const outFolder = path.join(OUTPUT_DIR, slug);
        if (!fs.existsSync(outFolder)) {
            fs.mkdirSync(outFolder, { recursive: true });
        }

        // Compress all images
        const compressedFiles = [];
        for (const file of files) {
            const inputPath = path.join(folder.path, file);
            const outputPath = path.join(outFolder, file);
            
            const originalSize = fs.statSync(inputPath).size;
            console.log(`   🔄 Compressing: ${file} (${Math.round(originalSize/1024)}KB)`);
            
            const compressed = await compressImage(inputPath, outputPath);
            if (compressed) {
                const newSize = fs.statSync(compressed).size;
                console.log(`      ✅ → ${path.basename(compressed)} (${Math.round(newSize/1024)}KB)`);
                compressedFiles.push({
                    original: file,
                    compressed: compressed,
                    name: path.basename(compressed)
                });
            }
        }

        if (compressedFiles.length === 0) {
            console.log(`   ❌ No files compressed successfully`);
            continue;
        }

        // Find poster
        let posterIdx = compressedFiles.findIndex(f => 
            f.original.toLowerCase().startsWith('poster')
        );
        if (posterIdx === -1) posterIdx = 0;
        
        const posterFile = compressedFiles[posterIdx];
        const otherFiles = compressedFiles.filter((_, i) => i !== posterIdx);

        // Upload hero
        console.log(`   📤 Uploading hero: ${posterFile.name}`);
        try {
            const buffer = fs.readFileSync(posterFile.compressed);
            const formData = new FormData();
            formData.append('hero_image', new Blob([buffer]), posterFile.name);
            await pb.collection('services').update(service.id, formData);
            console.log(`   ✅ Hero uploaded`);
        } catch (e) {
            console.log(`   ❌ Hero failed: ${e.message}`);
        }

        // Upload gallery
        if (otherFiles.length > 0) {
            console.log(`   📤 Uploading ${otherFiles.length} gallery images...`);
            const formData = new FormData();
            for (const f of otherFiles) {
                const buffer = fs.readFileSync(f.compressed);
                formData.append('images', new Blob([buffer]), f.name);
            }
            try {
                await pb.collection('services').update(service.id, formData);
                console.log(`   ✅ Gallery uploaded`);
            } catch (e) {
                console.log(`   ❌ Gallery failed: ${e.message}`);
                // Try one by one
                for (const f of otherFiles) {
                    try {
                        const buffer = fs.readFileSync(f.compressed);
                        const singleForm = new FormData();
                        singleForm.append('images', new Blob([buffer]), f.name);
                        await pb.collection('services').update(service.id, singleForm);
                        console.log(`      ✅ ${f.name}`);
                    } catch (e2) {
                        console.log(`      ❌ ${f.name}: ${e2.message}`);
                    }
                }
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
    console.log("\n\n═══════════════════════════════════════════");
    console.log("📊 FINAL REPORT:");
    console.log("═══════════════════════════════════════════\n");
    
    const finalServices = await pb.collection('services').getFullList({ sort: 'slug' });
    let withImages = 0;
    for (const s of finalServices) {
        const hasHero = !!s.hero_image;
        const imgCount = s.images?.length || 0;
        if (hasHero || imgCount > 0) {
            withImages++;
            console.log(`  ✅ ${s.slug.padEnd(25)} Hero: ${hasHero ? 'YES' : 'NO '}  Gallery: ${imgCount}`);
        } else {
            console.log(`  ❌ ${s.slug.padEnd(25)} No images`);
        }
    }
    console.log(`\n✅ Total with images: ${withImages}/${finalServices.length}`);
}

main().catch(console.error);
