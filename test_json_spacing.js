
async function testSpacing() {
    const { default: PocketBase } = await import('pocketbase');
    const pb = new PocketBase('http://127.0.0.1:8090');

    try {
        console.log("--- Checking Filters ---");

        // 1. Test Standard Key (led) with Dot Notation (Should WORK for standard JSON)
        console.log("\n1. Testing specs.led = 'Astera' (Dot Notation)...");
        try {
            const list = await pb.collection('equipment').getList(1, 1, {
                filter: `specs.led = "Astera"`
            });
            console.log(`   [DOT] Result: ${list.totalItems} items`);
        } catch (e) { console.log("   [DOT] Error:", e.message); }

        // 2. Test Standard Key (led) with String Match No Space (Current Filter)
        console.log("\n2. Testing specs ~ '\"led\":\"Astera\"' (Strict String)...");
        try {
            const list = await pb.collection('equipment').getList(1, 1, {
                filter: `specs ~ '"led":"Astera"'`
            });
            console.log(`   [STR NO-SPACE] Result: ${list.totalItems} items`);
        } catch (e) { console.log("   [STR NO-SPACE] Error:", e.message); }

        // 3. Test Standard Key (led) with String Match WITH Space
        console.log("\n3. Testing specs ~ '\"led\": \"Astera\"' (String + Space)...");
        try {
            const list = await pb.collection('equipment').getList(1, 1, {
                filter: `specs ~ '"led": "Astera"'`
            });
            console.log(`   [STR SPACE] Result: ${list.totalItems} items`);
        } catch (e) { console.log("   [STR SPACE] Error:", e.message); }

    } catch (e) {
        console.error(e);
    }
}

testSpacing();
