
async function verify() {
    const { default: PocketBase } = await import('pocketbase');
    const pb = new PocketBase('http://127.0.0.1:8090');

    try {
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

        const slugs = ['film-shipping', 'equipment-hire', 'broadcasting-live', 'film-permits', 'crewing'];

        for (const slug of slugs) {
            console.log(`\n--- Verifying: ${slug} ---`);
            try {
                const service = await pb.collection('services').getFirstListItem(`slug="${slug}"`);
                console.log(`Hero Image: ${service.hero_image}`);
                console.log(`Gallery Images: ${service.images ? service.images.length : 0}`);
                if (service.images) console.log(`   - ${service.images.join(', ')}`);

                if (service.sections) {
                    console.log("Sections used images:");
                    service.sections.forEach((s, idx) => {
                        if (s.image) console.log(`   [Section ${idx}] ${s.type}: ${s.image}`);
                    });
                }
            } catch (e) {
                console.log(`Could not fetch ${slug}: ${e.message}`);
            }
        }

    } catch (e) {
        console.error("Error:", e.message);
    }
}

verify();
