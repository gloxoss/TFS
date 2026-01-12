/// <reference path="../pb_data/types.d.ts" />
/**
 * TFS Services - Add Section Images (Force Update)
 * Updates sections with image URLs
 */
migrate((app) => {
    // Image URLs for section backgrounds
    const imageMap = {
        "equipment-hire": [
            "https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=1920&q=80",
            "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1920&q=80"
        ],
        "film-shipping": [
            "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1920&q=80",
            "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1920&q=80"
        ],
        "film-permits": [
            "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920&q=80",
            "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=1920&q=80"
        ],
        "crewing": [
            "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=1920&q=80",
            "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&q=80"
        ],
        "scouting": [
            "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1920&q=80",
            "https://images.unsplash.com/photo-1517821099606-cef63a9bcda6?w=1920&q=80"
        ],
        "catering": [
            "https://images.unsplash.com/photo-1555244162-803834f70033?w=1920&q=80",
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80"
        ],
        "accommodation": [
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80",
            "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=80"
        ],
        "transportation": [
            "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&q=80",
            "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920&q=80"
        ],
        "casting": [
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80",
            "https://images.unsplash.com/photo-1576267423048-15c0040fec78?w=1920&q=80"
        ]
    };

    // Get all services
    let services;
    try {
        services = app.findRecordsByFilter("services", "slug != ''", "", 50, 0);
    } catch (e) {
        console.log("[Images] Error finding services:", e);
        return;
    }

    console.log(`[Images] Found ${services.length} services`);

    services.forEach(service => {
        const slug = service.get("slug");
        const urls = imageMap[slug];

        if (!urls) {
            console.log(`[Images] No images for: ${slug}`);
            return;
        }

        // Get current sections
        let sections = service.get("sections");
        if (!sections || !Array.isArray(sections)) {
            console.log(`[Images] No sections for: ${slug}`);
            return;
        }

        console.log(`[Images] Updating ${sections.length} sections for: ${slug}`);

        // Update each section with image
        const updatedSections = sections.map((section, idx) => {
            return {
                ...section,
                image: urls[idx] || urls[0]
            };
        });

        service.set("sections", updatedSections);

        try {
            app.save(service);
            console.log(`[Images] Saved: ${slug}`);
        } catch (e) {
            console.log(`[Images] Save error for ${slug}:`, e);
        }
    });

    console.log("[Migration] Section images update complete");
}, (app) => { });
