/**
 * FIX SPORTS SECTIONS - Link uploaded images to sections
 * 
 * This script adds the 'image' property to sports service sections
 * to connect them with their uploaded gallery images.
 * 
 * Usage: node fix_sports_sections.js
 */

const PocketBase = require('pocketbase').default;
const pb = new PocketBase('http://127.0.0.1:8090');

async function main() {
    console.log('🔐 Authenticating...');
    await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');
    console.log('✅ Authenticated\n');
    
    const sports = [
        'athletics', 'baseball', 'basketball', 'football', 'cycling', 
        'rugby', 'tennis', 'motorsports', 'combat-sports', 'extreme-sports'
    ];
    
    for (const slug of sports) {
        try {
            const service = await pb.collection('services').getFirstListItem(`slug="${slug}"`);
            
            console.log(`\n=== ${slug.toUpperCase()} ===`);
            console.log(`Sections: ${service.sections?.length || 0}`);
            console.log(`Images: ${service.images?.length || 0}`);
            
            if (!service.sections || service.sections.length === 0) {
                console.log('⚠️ No sections');
                continue;
            }
            
            if (!service.images || service.images.length === 0) {
                console.log('⚠️ No images');
                continue;
            }
            
            // Check if sections already have images
            const hasImages = service.sections.some(s => s.image);
            if (hasImages) {
                console.log('✅ Sections already have images');
                continue;
            }
            
            // Link images to sections (first 2 sections get images)
            const updatedSections = service.sections.map((sec, idx) => {
                if (idx < service.images.length) {
                    return {
                        ...sec,
                        image: service.images[idx],
                        layout: idx % 2 === 0 ? 'right' : 'left'  // Alternate left/right
                    };
                }
                return sec;
            });
            
            await pb.collection('services').update(service.id, { sections: updatedSections });
            
            const linkedCount = Math.min(service.sections.length, service.images.length);
            console.log(`✅ Linked ${linkedCount} images to sections`);
            
        } catch (e) {
            console.error(`❌ ${slug}: ${e.message}`);
        }
    }
    
    console.log('\n✅ All sports sections fixed!');
}

main().catch(console.error);
