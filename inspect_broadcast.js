/**
 * Inspect Broadcast Service Sections
 * 
 * Verifies the content of the 'sections' field for the Broadcast service.
 */

const PocketBase = require('pocketbase/cjs');

const pb = new PocketBase('http://127.0.0.1:8090');

async function inspectBroadcast() {
    try {
        // Find the broadcast service
        const services = await pb.collection('services').getList(1, 1, {
            filter: 'slug ~ "broadcast"'
        });

        if (services.items.length === 0) {
            console.error('❌ Broadcast service not found!');
            return;
        }

        const broadcast = services.items[0];
        console.log(`✅ Found: ${broadcast.title} (ID: ${broadcast.id})`);

        const sections = broadcast.sections;
        console.log('📦 Sections type:', typeof sections);
        console.log('📦 Sections isArray:', Array.isArray(sections));

        const downloadsSection = sections.find(s => s.type === 'downloads_categorized');

        if (downloadsSection) {
            console.log('✅ Downloads section found!');
            console.log('Title:', downloadsSection.title);
            console.log('Categories count:', downloadsSection.categories?.length);
            // Log first category to verify structure
            if (downloadsSection.categories?.length > 0) {
                console.log('First category:', JSON.stringify(downloadsSection.categories[0], null, 2));
            }
        } else {
            console.error('❌ Downloads section NOT found in sections array');
            console.log('Available section types:', sections.map(s => s.type));
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

inspectBroadcast();
