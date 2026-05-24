const PocketBase = require('pocketbase').default;

async function checkBothServices() {
    const pb = new PocketBase('http://127.0.0.1:8090');
    try {
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

        const slugs = ['digital-production', 'digital-corporate'];
        for (const slug of slugs) {
            console.log(`\n--- Checking ${slug} ---`);
            try {
                const s = await pb.collection('services').getFirstListItem(`slug="${slug}"`);
                console.log(`Title: ${s.title}`);
                if (s.sections) {
                    console.log(`Sections: ${s.sections.length}`);
                    s.sections.forEach((sec, i) => {
                        console.log(`  [${i}] ${sec.type} - ${sec.title || 'No Title'}`);
                    });
                } else {
                    console.log("No sections found.");
                }
            } catch (e) {
                console.log(`Service not found.`);
            }
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

checkBothServices();
