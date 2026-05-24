
async function inspectSpecs() {
    const { default: PocketBase } = await import('pocketbase');
    const pb = new PocketBase('http://127.0.0.1:8090');

    try {
        console.log("--- Inspecting Specs Data ---");
        // Get one item that has 'led' in specs
        const item = await pb.collection('equipment').getFirstListItem(`specs ~ 'led'`);

        console.log("Found Item:", item.id, item.name);
        console.log("Raw Specs Object:", JSON.stringify(item.specs, null, 2));

        // Check if we can see the raw string? 
        // PB SDK parses it automatically. We can't see the raw DB string easily via SDK.
        // But if it parses to valid JSON, then keys ARE quoted in the DB string (JSON standard).

        // If keys are quoted, then `specs ~ '"led"'` SHOULD work.
        // Let's verify that specifically.

        const list = await pb.collection('equipment').getList(1, 1, {
            filter: `specs ~ '"led"'`
        });
        console.log(`Filter specs ~ '"led"' count: ${list.totalItems}`);

        const list2 = await pb.collection('equipment').getList(1, 1, {
            filter: `specs ~ '"led":'`
        });
        console.log(`Filter specs ~ '"led":' (colon no space) count: ${list2.totalItems}`);

    } catch (e) {
        console.error("Error:", e.message);
    }
}

inspectSpecs();
