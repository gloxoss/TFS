/**
 * Upload sports images to TFS Football
 */
const fs = require('fs');
const path = require('path');

async function uploadSportsImages() {
    const { default: PocketBase } = await import('pocketbase');
    const pb = new PocketBase('http://127.0.0.1:8090');
    
    await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');
    console.log('✅ Authenticated');
    
    const service = await pb.collection('services').getFirstListItem('slug="tfs-football"');
    console.log('Found service:', service.title);
    
    const sportsDir = path.join(__dirname, 'web', 'public', 'images', 'services', 'sports');
    const files = fs.readdirSync(sportsDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
    
    // Sort by file size and take smallest 4
    const fileStats = files.map(f => ({
        name: f,
        size: fs.statSync(path.join(sportsDir, f)).size
    })).sort((a, b) => a.size - b.size);
    
    console.log('Files sorted by size:');
    fileStats.forEach(f => console.log('  ', f.name, '-', Math.round(f.size/1024) + 'KB'));
    
    // Take smallest 4 files (keep total under 10MB)
    const smallestFiles = fileStats.slice(0, 4).map(f => f.name);
    console.log('\nUsing smallest 4:', smallestFiles);
    
    const formData = new FormData();
    
    // First one as hero
    const heroFile = smallestFiles[0];
    const heroBuffer = fs.readFileSync(path.join(sportsDir, heroFile));
    formData.append('hero_image', new Blob([heroBuffer]), heroFile);
    console.log('Hero:', heroFile);
    
    // Rest as gallery
    for (let i = 1; i < smallestFiles.length; i++) {
        const imgBuffer = fs.readFileSync(path.join(sportsDir, smallestFiles[i]));
        formData.append('images', new Blob([imgBuffer]), smallestFiles[i]);
        console.log('Gallery:', smallestFiles[i]);
    }
    
    try {
        const updated = await pb.collection('services').update(service.id, formData);
        console.log('\n✅ Success!');
        console.log('Hero:', updated.hero_image);
        console.log('Images:', updated.images);
        
        // Update sections
        if (updated.sections && updated.sections.length > 0 && updated.images && updated.images.length > 0) {
            let imageIndex = 0;
            const newSections = updated.sections.map((section, idx) => {
                if (['text_image', 'image_text', 'full_width_media'].includes(section.type) || section.image !== undefined) {
                    if (imageIndex < updated.images.length) {
                        section.image = updated.images[imageIndex];
                        imageIndex++;
                    }
                }
                return section;
            });
            
            await pb.collection('services').update(service.id, { sections: newSections });
            console.log('✅ Sections updated');
        }
    } catch (e) {
        console.error('❌ Failed:', e.message);
        if (e.response) console.error('Response:', JSON.stringify(e.response, null, 2));
    }
}

uploadSportsImages();
