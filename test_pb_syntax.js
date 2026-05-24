
async function testSyntax() {
    const { default: PocketBase } = await import('pocketbase');
    const pb = new PocketBase('http://127.0.0.1:8090');

    try {
        // 1. First, list one item to confirm the data structure
        console.log("Fetching one item to check specs structure...");
        const item = await pb.collection('equipment').getFirstListItem('specs != null');
        console.log("Sample Item Specs:", JSON.stringify(item.specs, null, 2));

        // We know 'day-light' exists? Let's assume we want to match whatever key is in there.
        // If the sample doesn't have 'day-light', we might need to find one that does.
        // For the sake of the user's issue, let's try to filter by a key we SEE in the sample if possible, 
        // OR just try the 'day-light' one if we trust the user's DB has it.

        // Let's try to filter by 'day-light' specifically since that's the error.
        const targetValue = "Arri M-Series";

        const variants = [
            `specs.day-light = '${targetValue}'`,
            `specs."day-light" = '${targetValue}'`,
            `specs['day-light'] = '${targetValue}'`, // This is invalid standard PB syntax usually, but maybe?
            `specs:day-light = '${targetValue}'`,
            `specs ~ '\"day-light\": \"${targetValue}\"'` // awful string match fallback
        ];

        console.log("\n--- Testing Variants ---");
        for (const filter of variants) {
            console.log(`\nTesting filter: [ ${filter} ]`);
            try {
                const list = await pb.collection('equipment').getList(1, 1, { filter });
                console.log(`✅ SUCCESS. Found ${list.totalItems} items.`);
            } catch (e) {
                console.log(`❌ FAILED. Error: ${e.message}`);
                if (e.data) console.log("   Details:", JSON.stringify(e.data));
            }
        }

    } catch (e) {
        console.error("Setup Error:", e);
    }
}

testSyntax();
