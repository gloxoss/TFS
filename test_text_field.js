
async function testText() {
    const { default: PocketBase } = await import('pocketbase');
    const pb = new PocketBase('http://127.0.0.1:8090');

    try {
        console.log("--- Testing 'specs' as TEXT field ---");

        // 1. Simple 'contains' check (Very loose) - Should definitely work if field is queryable
        console.log("\n1. Testing specs ~ 'led' ...");
        try {
            const list = await pb.collection('equipment').getList(1, 1, {
                filter: `specs ~ 'led'`
            });
            console.log(`   [SIMPLE] Success. Count: ${list.totalItems}`);
        } catch (e) { console.log(`   [SIMPLE] Failed: ${e.message}`); }

        // 2. String Match WITH Space (Standard JSON pretty/normal)
        console.log("\n2. Testing specs ~ '\"led\": \"Astera\"' ...");
        try {
            const list = await pb.collection('equipment').getList(1, 1, {
                filter: `specs ~ '"led": "Astera"'`
            });
            console.log(`   [SPACE] Success. Count: ${list.totalItems}`);
        } catch (e) { console.log(`   [SPACE] Failed: ${e.message}`); }

        // 3. String Match NO Space (Compact)
        console.log("\n3. Testing specs ~ '\"led\":\"Astera\"' ...");
        try {
            const list = await pb.collection('equipment').getList(1, 1, {
                filter: `specs ~ '"led":"Astera"'`
            });
            console.log(`   [NO SPACE] Success. Count: ${list.totalItems}`);
        } catch (e) { console.log(`   [NO SPACE] Failed: ${e.message}`); }

        // 4. Test day-light again with space, just to be sure
        console.log("\n4. Testing specs ~ '\"day-light\": \"Arri\"' (Partial) ...");
        try {
            // Partial match on value to avoid "M-Series" quoting issues
            const list = await pb.collection('equipment').getList(1, 1, {
                filter: `specs ~ '"day-light": "Arri'`
            });
            console.log(`   [DAY-LIGHT SPACE] Success. Count: ${list.totalItems}`);
        } catch (e) { console.log(`   [DAY-LIGHT SPACE] Failed: ${e.message}`); }


    } catch (e) { console.error(e); }
}

testText();
