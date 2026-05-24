/**
 * Fix any remaining old path references in sections
 */
async function fixOldPaths() {
    const { default: PocketBase } = await import('pocketbase');
    const pb = new PocketBase('http://127.0.0.1:8090');
    await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');
    
    const services = await pb.collection('services').getFullList();
    
    for (const service of services) {
        if (!service.sections) continue;
        
        let needsUpdate = false;
        let imageIndex = 0;
        
        const newSections = service.sections.map((sec, i) => {
            // If section has old path reference
            if (sec.image && sec.image.startsWith('/')) {
                needsUpdate = true;
                // Try to assign from uploaded images
                if (service.images && service.images[imageIndex]) {
                    sec.image = service.images[imageIndex];
                    imageIndex++;
                } else {
                    // No more images, use first one or null
                    sec.image = service.images?.[0] || null;
                }
                console.log(`  Fixed ${service.slug} section[${i}]: ${sec.image}`);
            }
            return sec;
        });
        
        if (needsUpdate) {
            await pb.collection('services').update(service.id, { sections: newSections });
            console.log(`✅ Updated ${service.slug}`);
        }
    }
    
    console.log('\nDone!');
}

fixOldPaths();
