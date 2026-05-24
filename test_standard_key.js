
async function testStandard() {
    const { default: PocketBase } = await import('pocketbase');
    const pb = new PocketBase('http://127.0.0.1:8090');

    try {
        console.log("--- Checking Standard Key 'led' ---");

        // 1. Quoted Key Dot Notation
        console.log("\n1. Testing specs.\"led\" = 'Astera' ...");
        try {
            const list = await pb.collection('equipment').getList(1, 1, {
                filter: `specs."led" = "Astera"`
            });
            console.log(`   [QUOTED DOT] Success. Count: ${list.totalItems}`);
        } catch (e) { console.log(`   [QUOTED DOT] Failed: ${e.message}`); }

        // 2. Unquoted Key Dot Notation
        console.log("\n2. Testing specs.led = 'Astera' ...");
        try {
            const list = await pb.collection('equipment').getList(1, 1, {
                filter: `specs.led = "Astera"`
            });
            console.log(`   [DOT] Success. Count: ${list.totalItems}`);
        } catch (e) { console.log(`   [DOT] Failed: ${e.message}`); }

        // 3. String Match NO SPACE
        console.log("\n3. Testing specs ~ '\"led\":\"Astera\"' ...");
        try {
            const list = await pb.collection('equipment').getList(1, 1, {
                filter: `specs ~ '"led":"Astera"'`
            });
            console.log(`   [STR NO-SPACE] Success. Count: ${list.totalItems}`);
        } catch (e) { console.log(`   [STR NO-SPACE] Failed: ${e.message}`); }

    } catch (e) { console.error(e); }
}

testStandard();
