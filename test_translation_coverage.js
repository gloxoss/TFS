
async function checkCoverage() {
    const { default: PocketBase } = await import('pocketbase');
    const pb = new PocketBase('http://127.0.0.1:8090');

    try {
        const services = await pb.collection('services').getFullList();
        let missing = 0;
        let total = services.length;

        console.log(`Total Services: ${total}`);

        services.forEach(s => {
            const hasBrief = !!s.brief_description_fr;
            const hasFull = !!s.full_description_fr;
            if (!hasBrief) {
                missing++;
                console.log(`- Missing FR Brief: ${s.title} (${s.slug})`);
            }
        });

        console.log(`\nMissing FR Translations: ${missing}/${total}`);

    } catch (e) {
        console.error("Error:", e.message);
    }
}

checkCoverage();
