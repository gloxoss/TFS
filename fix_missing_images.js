/**
 * FIX MISSING IMAGES SCRIPT
 * 
 * This script:
 * 1. Uploads missing scouting image (3rd image)
 * 2. Links sections to images for sports services
 * 
 * Usage: node fix_missing_images.js
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
};

async function compressImage(inputPath) {
    const outputPath = inputPath.replace(/\.[^.]+$/, '_compressed.jpg');
    await sharp(inputPath)
        .resize(CONFIG.MAX_WIDTH, CONFIG.MAX_HEIGHT, {
            fit: 'inside',
            withoutEnlargement: true
        })
        .jpeg({ quality: CONFIG.QUALITY, mozjpeg: true })
        .toFile(outputPath);
    return outputPath;
}

async function main() {
    const { default: PocketBase } = await import('pocketbase');
    const pb = new PocketBase(CONFIG.POCKETBASE_URL);
    
    console.log('🔐 Authenticating...');
    await pb.admins.authWithPassword(CONFIG.ADMIN_EMAIL, CONFIG.ADMIN_PASSWORD);
    console.log('✅ Authenticated\n');
    
    // 1. Fix scouting - add missing 3rd image
    console.log('=== FIXING SCOUTING ===');
    try {
        const scouting = await pb.collection('services').getFirstListItem('slug="scouting"');
        const scoutingDir = path.join(__dirname, 'web', 'public', 'all', 'scouting');
        const missingFile = 'A detailed map displaying a specific location marked with two vibrant pins, symbolizing the starting and destination points in a GPS navigation system_ Stock Illustration _ Adobe Stock.jpeg';
        const filePath = path.join(scoutingDir, missingFile);
        
        if (fs.existsSync(filePath)) {
            console.log('📤 Compressing and uploading missing scouting image...');
            const compressed = await compressImage(filePath);
            const buffer = fs.readFileSync(compressed);
            const formData = new FormData();
            formData.append('images', new Blob([buffer]), 'scouting_map_detailed.jpg');
            await pb.collection('services').update(scouting.id, formData);
            fs.unlinkSync(compressed);
            console.log('✅ Scouting 3rd image uploaded\n');
        } else {
            console.log('❌ File not found:', filePath);
        }
    } catch (e) {
        console.error('❌ Scouting fix failed:', e.message);
    }
    
    // 2. Fix sports - link sections to images
    console.log('=== FIXING SPORTS SECTIONS ===');
    const sports = ['athletics', 'baseball', 'basketball', 'football', 'cycling', 'rugby', 'tennis', 'motorsports', 'combat-sports', 'extreme-sports'];
    
    for (const slug of sports) {
        try {
            const service = await pb.collection('services').getFirstListItem(`slug="${slug}"`);
            
            if (!service.sections || service.sections.length === 0) {
                console.log(`⚠️ ${slug}: No sections to fix`);
                continue;
            }
            
            if (!service.images || service.images.length === 0) {
                console.log(`⚠️ ${slug}: No images available`);
                continue;
            }
            
            // Check if sections already have images
            const sectionsNeedImages = service.sections.filter(s => 
                ['text_image', 'image_text', 'full_width_media'].includes(s.type) && !s.image
            );
            
            if (sectionsNeedImages.length === 0) {
                console.log(`✅ ${slug}: Sections already have images`);
                continue;
            }
            
            // Link images to sections
            let imageIdx = 0;
            const updatedSections = service.sections.map(sec => {
                if (['text_image', 'image_text', 'full_width_media'].includes(sec.type) && !sec.image) {
                    if (imageIdx < service.images.length) {
                        sec.image = service.images[imageIdx++];
                    }
                }
                return sec;
            });
            
            await pb.collection('services').update(service.id, { sections: updatedSections });
            console.log(`✅ ${slug}: Linked ${imageIdx} images to sections`);
            
        } catch (e) {
            console.error(`❌ ${slug}: ${e.message}`);
        }
    }
    
    console.log('\n✅ All fixes complete!');
}

main().catch(console.error);
