import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SOURCE_DIR = 'c:/Users/zakio/Documents/Project/PB-Next/web/public/all/INTRO';
const DEST_DIR = 'c:/Users/zakio/Documents/Project/PB-Next/web/public/images/hero';

async function processImages() {
    console.log('📂 Reading INTRO folder...');
    const files = fs.readdirSync(SOURCE_DIR).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
    
    console.log(`   Found ${files.length} images\n`);
    
    const processedFiles = [];
    
    for (const file of files) {
        const srcPath = path.join(SOURCE_DIR, file);
        // Create a clean filename for the hero folder
        const baseName = path.parse(file).name
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, '-')
            .replace(/-+/g, '-')
            .substring(0, 40); // Limit length
        const destFile = `${baseName}.webp`;
        const destPath = path.join(DEST_DIR, destFile);
        
        const srcStats = fs.statSync(srcPath);
        console.log(`🔄 Processing: ${file} (${Math.round(srcStats.size / 1024)}KB)`);
        
        // Compress to WebP with high quality for hero images
        await sharp(srcPath)
            .resize(1920, 1080, { fit: 'cover', withoutEnlargement: true })
            .webp({ quality: 85 })
            .toFile(destPath);
        
        const destStats = fs.statSync(destPath);
        console.log(`   ✅ → ${destFile} (${Math.round(destStats.size / 1024)}KB)`);
        
        processedFiles.push(`/images/hero/${destFile}`);
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Processed files for HERO_IMAGES array:\n');
    console.log('const HERO_IMAGES = [');
    processedFiles.forEach((f, i) => {
        console.log(`    "${f}",${i === 0 ? ' // Priority LCP image' : ''}`);
    });
    console.log('];');
    console.log('\n🎉 Done! Copy the array above to hero-impact.tsx');
}

processImages().catch(console.error);
