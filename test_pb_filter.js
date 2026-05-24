
async function testFilter() {
    const { default: PocketBase } = await import('pocketbase');
    const pb = new PocketBase('http://127.0.0.1:8090');

    try {
        console.log("Testing filter with dot notation (specs.day-light)...")
        try {
            const list1 = await pb.collection('equipment').getList(1, 10, {
                filter: 'specs.day-light = "Arri M-Series"'
            });
            console.log(`Dot notation result items: ${list1.items.length}`);
        } catch (e) {
            console.error("Dot notation failed:", e.message);
        }

        console.log("\nTesting filter with bracket notation (specs['day-light'])...")
        try {
            const list2 = await pb.collection('equipment').getList(1, 10, {
                filter: "specs['day-light'] = 'Arri M-Series'"
            });
            console.log(`Bracket notation result items: ${list2.items.length}`);
        } catch (e) {
            console.error("Bracket notation failed:", e.message);
        }

        console.log("\nTesting filter with quoted key (specs.\"day-light\")...")
        try {
            const list3 = await pb.collection('equipment').getList(1, 10, {
                filter: 'specs."day-light" = "Arri M-Series"'
            });
            console.log(`Quoted key result items: ${list3.items.length}`);
        } catch (e) {
            console.error("Quoted key failed:", e.message);
        }

    } catch (e) {
        console.error("General Error:", e);
    }
}

testFilter();
