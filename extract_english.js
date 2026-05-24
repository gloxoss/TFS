
const fs = require('fs');

async function extract() {
    const { default: PocketBase } = await import('pocketbase');
    const pb = new PocketBase('http://127.0.0.1:8090');

    try {
        const services = await pb.collection('services').getFullList();
        const extracted = services.map(s => ({
            id: s.id,
            slug: s.slug,
            title: s.title,
            brief: s.brief_description,
            full: s.full_description,
            missingFr: !s.brief_description_fr
        })).filter(s => s.missingFr);

        fs.writeFileSync('english_descriptions.json', JSON.stringify(extracted, null, 2));
        console.log(`Extracted ${extracted.length} services.`);

    } catch (e) {
        console.error("Error:", e.message);
    }
}

extract();
