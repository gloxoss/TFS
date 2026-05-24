const PocketBase = require('pocketbase').default;
const pb = new PocketBase('http://127.0.0.1:8090');

(async () => {
    await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');
    
    const updates = [
        // Remove 'tfs-' from slugs and 'TFS ' from titles
        { oldSlug: 'tfs-football', newSlug: 'football', newTitle: 'Football', newTitleFr: 'Football' },
        { oldSlug: 'tfs-baseball', newSlug: 'baseball', newTitle: 'Baseball', newTitleFr: 'Baseball' },
        { oldSlug: 'tfs-basketball', newSlug: 'basketball', newTitle: 'Basketball', newTitleFr: 'Basketball' },
        { oldSlug: 'tfs-motorsports', newSlug: 'motorsports', newTitle: 'Motorsports', newTitleFr: 'Sports Mécaniques' },
        { oldSlug: 'tfs-athletics', newSlug: 'athletics', newTitle: 'Athletics', newTitleFr: 'Athlétisme' },
        { oldSlug: 'tfs-combat-sports', newSlug: 'combat-sports', newTitle: 'Combat Sports', newTitleFr: 'Sports de Combat' },
        { oldSlug: 'tfs-tennis', newSlug: 'tennis', newTitle: 'Tennis', newTitleFr: 'Tennis' },
        { oldSlug: 'tfs-rugby', newSlug: 'rugby', newTitle: 'Rugby', newTitleFr: 'Rugby' },
        { oldSlug: 'tfs-cycling', newSlug: 'cycling', newTitle: 'Cycling', newTitleFr: 'Cyclisme' },
        { oldSlug: 'tfs-extreme-sports', newSlug: 'extreme-sports', newTitle: 'Extreme & Action Sports', newTitleFr: 'Sports Extrêmes' },
        // Rename sporting-events/TFS Sports Broadcasting to just "Sport"
        { oldSlug: 'sporting-events', newSlug: 'sport', newTitle: 'Sport', newTitleFr: 'Sport' },
    ];

    console.log('Updating service slugs and titles...\n');
    for (const u of updates) {
        try {
            const service = await pb.collection('services').getFirstListItem(`slug="${u.oldSlug}"`);
            await pb.collection('services').update(service.id, { 
                slug: u.newSlug,
                title: u.newTitle,
                title_fr: u.newTitleFr
            });
            console.log(`  ✅ ${u.oldSlug} → ${u.newSlug} | Title: "${u.newTitle}"`);
        } catch (e) {
            console.log(`  ❌ ${u.oldSlug} - not found or error: ${e.message}`);
        }
    }
    
    console.log('\n✅ Done!');
})();
