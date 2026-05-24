
const desiredOrder = [
    { match: ['cameras'], label: 'CAMERA' },
    { match: ['lenses'], label: 'LENSES' },
    { match: ['lens-control', 'wireless-control'], label: 'wireless control' },
    { match: ['wireless-video'], label: 'wireless video system' },
    { match: ['fluide-head', 'fluid-head'], label: 'fluid head' },
    { match: ['stabilizers'], label: 'stabilisation' },
    { match: ['support'], label: 'support system' },
    { match: ['matte-boxes'], label: 'matte box' },
    { match: ['monitors'], label: 'monitors' },
    { match: ['power'], label: 'power' },
    { match: ['lighting'], label: 'lighting' },
    { match: ['Power Distributions', 'power-distributions'], label: 'power distributions' },
    { match: ['grip', 'dolly'], label: 'doly and magnom' }
];

async function updateOrder() {
    const { default: PocketBase } = await import('pocketbase');
    const pb = new PocketBase('http://127.0.0.1:8090');

    try {
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

        const categories = await pb.collection('categories').getFullList();

        console.log("--- Updating Category Order ---");

        let sortIndex = 10;

        for (const item of desiredOrder) {
            // Find category matching any of the match keys (slug check)
            const category = categories.find(c => item.match.some(m => c.slug.toLowerCase() === m.toLowerCase()));

            if (category) {
                await pb.collection('categories').update(category.id, {
                    sort_order: sortIndex
                });
                console.log(`[${sortIndex}] Updated '${category.name}' (${category.slug}) matching '${item.label}'`);
                sortIndex += 10;
            } else {
                console.log(`[WARN] No category found for '${item.label}' (Tried: ${item.match.join(', ')})`);
            }
        }

        // Handle unmapped categories (put them at the end or leave alone?)
        // Let's put them at the end to ensure they don't mess up the order
        const mappedIds = new Set();
        for (const item of desiredOrder) {
            const c = categories.find(c => item.match.some(m => c.slug.toLowerCase() === m.toLowerCase()));
            if (c) mappedIds.add(c.id);
        }

        const unmapped = categories.filter(c => !mappedIds.has(c.id));
        if (unmapped.length > 0) {
            console.log("--- Unmapped Categories (Appending to end) ---");
            for (const c of unmapped) {
                await pb.collection('categories').update(c.id, {
                    sort_order: sortIndex
                });
                console.log(`[${sortIndex}] Appended '${c.name}' (${c.slug})`);
                sortIndex += 10;
            }
        }

    } catch (e) {
        console.error("Error:", e.message);
    }
}

updateOrder();
