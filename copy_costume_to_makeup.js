/**
 * Copy costume images to makeup-hair service
 */
const fs = require('fs');
const path = require('path');

async function copyToMakeupHair() {
    const { default: PocketBase } = await import('pocketbase');
    const pb = new PocketBase('http://127.0.0.1:8090');
    await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');
    console.log('✅ Authenticated');

    // Get makeup-hair service
    const makeupService = await pb.collection('services').getFirstListItem('slug="makeup-hair"');
    console.log('Makeup-hair ID:', makeupService.id);

    // Read compressed files from costume-wardrobe folder
    const compressedDir = path.join(__dirname, 'web', 'public', 'all_compressed', 'costume-wardrobe');
    const files = fs.readdirSync(compressedDir);
    console.log('Compressed files:', files);

    // Find poster
    let posterFile = files.find(f => f.toLowerCase().includes('costume'));
    const otherFiles = files.filter(f => f !== posterFile);

    if (!posterFile) {
        posterFile = files[0];
    }

    console.log('Using as hero:', posterFile);
    console.log('Gallery:', otherFiles);

    // Upload hero
    const heroBuffer = fs.readFileSync(path.join(compressedDir, posterFile));
    const heroForm = new FormData();
    heroForm.append('hero_image', new Blob([heroBuffer]), posterFile);
    await pb.collection('services').update(makeupService.id, heroForm);
    console.log('✅ Hero uploaded');

    // Upload gallery
    if (otherFiles.length > 0) {
        const galleryForm = new FormData();
        for (const f of otherFiles) {
            const buffer = fs.readFileSync(path.join(compressedDir, f));
            galleryForm.append('images', new Blob([buffer]), f);
        }
        await pb.collection('services').update(makeupService.id, galleryForm);
        console.log('✅ Gallery uploaded');
    }

    // Update sections
    const updated = await pb.collection('services').getOne(makeupService.id);
    if (updated.sections && updated.images && updated.images.length > 0) {
        let idx = 0;
        const newSections = updated.sections.map(sec => {
            if (sec.image !== undefined && idx < updated.images.length) {
                sec.image = updated.images[idx++];
            }
            return sec;
        });
        await pb.collection('services').update(makeupService.id, { sections: newSections });
        console.log('✅ Sections updated');
    }

    console.log('\n✅ Done! Makeup-hair now has same images as costume-wardrobe');
}

copyToMakeupHair();
