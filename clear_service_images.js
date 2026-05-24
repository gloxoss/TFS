
async function clearImages() {
    const { default: PocketBase } = await import('pocketbase');
    const pb = new PocketBase('http://127.0.0.1:8090');

    const mapping = {
        "accommodation": "accommodation",
        "casting": "casting",
        "catering": "catering",
        "crewing": "crewing",
        "equipment": "equipment-hire",
        "full-production": "broadcasting-live",
        "permits": "film-permits",
        "scouting": "scouting",
        "shipping": "film-shipping",
        "transportation": "transportation",
        "sporting-events": "sporting-events",
        "location-scouting": "scouting"
    };

    const slugs = [...new Set(Object.values(mapping))]; // Unique slugs

    try {
        console.log("--- Clearing Images ---");
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

        for (const slug of slugs) {
            try {
                const service = await pb.collection('services').getFirstListItem(`slug="${slug}"`);

                // Clear images
                await pb.collection('services').update(service.id, {
                    hero_image: null,
                    images: null
                });
                console.log(`✅ Cleared images for: ${slug}`);

            } catch (e) {
                console.log(`⚠️ Skipped ${slug}: ${e.message}`);
            }
        }

    } catch (e) {
        console.error("Error:", e.message);
    }
}

clearImages();
