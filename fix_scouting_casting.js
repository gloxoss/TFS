/**
 * FIX SCOUTING & CASTING IMAGES
 * 
 * Uploads:
 * 1. Scouting - New Morocco location images (5 images + poster)
 * 2. Casting - Missing section images
 * 
 * Usage: node fix_scouting_casting.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const CONFIG = {
    POCKETBASE_URL: 'http://127.0.0.1:8090',
    ADMIN_EMAIL: 'zakiossama28@gmail.com',
    ADMIN_PASSWORD: 'GloXoss123.',
    MAX_WIDTH: 1920,
    MAX_HEIGHT: 1080,
    QUALITY: 80,
    IMAGE_EXTENSIONS: /\.(jpg|jpeg|png|webp|avif|jfif|gif)$/i
};

async function compressImage(inputPath, outputDir) {
    const baseName = path.basename(inputPath).replace(/\s+/g, '_').toLowerCase();
    const outputPath = path.join(outputDir, baseName.replace(/\.[^.]+$/, '.jpg'));
    
    await sharp(inputPath)
        .resize(CONFIG.MAX_WIDTH, CONFIG.MAX_HEIGHT, {
            fit: 'inside',
            withoutEnlargement: true
        })
        .jpeg({ quality: CONFIG.QUALITY, mozjpeg: true })
        .toFile(outputPath);
    
    return outputPath;
}

async function uploadServiceImages(pb, slug, folderPath, tempDir) {
    console.log(`\n=== Processing ${slug.toUpperCase()} ===`);
    
    // Get service
    let service;
    try {
        service = await pb.collection('services').getFirstListItem(`slug="${slug}"`);
    } catch (e) {
        console.log(`❌ Service not found: ${slug}`);
        return;
    }
    
    // Get all image files
    const files = fs.readdirSync(folderPath).filter(f => CONFIG.IMAGE_EXTENSIONS.test(f));
    console.log(`Found ${files.length} images in folder`);
    
    if (files.length === 0) return;
    
    // Identify poster (hero) and inside images
    const posterFile = files.find(f => f.toLowerCase().startsWith('poster')) || files[0];
    const insideFiles = files.filter(f => f !== posterFile);
    
    console.log(`Poster: ${posterFile}`);
    console.log(`Inside images: ${insideFiles.length}`);
    
    // Compress all images
    const compressedPoster = await compressImage(path.join(folderPath, posterFile), tempDir);
    const compressedInside = [];
    for (const f of insideFiles) {
        const compressed = await compressImage(path.join(folderPath, f), tempDir);
        compressedInside.push(compressed);
    }
    
    // Clear existing images first
    console.log('Clearing existing images...');
    await pb.collection('services').update(service.id, {
        hero_image: null,
        images: []
    });
    
    // Upload hero
    console.log('Uploading hero image...');
    const heroBuffer = fs.readFileSync(compressedPoster);
    const heroForm = new FormData();
    heroForm.append('hero_image', new Blob([heroBuffer]), path.basename(compressedPoster));
    await pb.collection('services').update(service.id, heroForm);
    
    // Upload gallery images
    if (compressedInside.length > 0) {
        console.log(`Uploading ${compressedInside.length} gallery images...`);
        const galleryForm = new FormData();
        for (const imgPath of compressedInside) {
            const buffer = fs.readFileSync(imgPath);
            galleryForm.append('images', new Blob([buffer]), path.basename(imgPath));
        }
        await pb.collection('services').update(service.id, galleryForm);
    }
    
    // Update sections to use gallery images
    const updated = await pb.collection('services').getOne(service.id);
    if (updated.sections && updated.images && updated.images.length > 0) {
        let idx = 0;
        const newSections = updated.sections.map(sec => {
            if (['text_image', 'image_text', 'full_width_media'].includes(sec.type)) {
                if (idx < updated.images.length) {
                    sec.image = updated.images[idx++];
                }
            }
            return sec;
        });
        await pb.collection('services').update(service.id, { sections: newSections });
        console.log(`Linked ${idx} images to sections`);
    }
    
    console.log(`✅ ${slug} complete!`);
}

async function main() {
    const { default: PocketBase } = await import('pocketbase');
    const pb = new PocketBase(CONFIG.POCKETBASE_URL);
    
    console.log('🔐 Authenticating...');
    await pb.admins.authWithPassword(CONFIG.ADMIN_EMAIL, CONFIG.ADMIN_PASSWORD);
    console.log('✅ Authenticated');
    
    // Create temp directory
    const tempDir = path.join(__dirname, 'temp_compressed');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }
    
    // Fix Scouting
    const scoutingDir = path.join(__dirname, 'web', 'public', 'all', 'scouting');
    await uploadServiceImages(pb, 'scouting', scoutingDir, tempDir);
    
    // Fix Casting
    const castingDir = path.join(__dirname, 'web', 'public', 'all', 'casting');
    await uploadServiceImages(pb, 'casting', castingDir, tempDir);
    
    // Cleanup temp dir
    console.log('\n🧹 Cleaning up...');
    const tempFiles = fs.readdirSync(tempDir);
    for (const f of tempFiles) {
        fs.unlinkSync(path.join(tempDir, f));
    }
    fs.rmdirSync(tempDir);
    
    console.log('\n✅ All fixes complete!');
}

main().catch(console.error);
