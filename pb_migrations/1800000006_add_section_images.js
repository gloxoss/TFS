/// <reference path="../pb_data/types.d.ts" />
/**
 * TFS Services - Add Section Images
 * 
 * Updates sections with image URLs (stored in JSON, not file field)
 */
migrate((app) => {
    const services = app.findRecordsByFilter("services", "id != ''", "", 50, 0);

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

    services.forEach(service => {
        const slug = service.get("slug");
        const images = imageMap[slug];

        if (images) {
            // Update sections with images
            const sections = service.get("sections") || [];
            if (sections.length > 0) {
                sections.forEach((section, idx) => {
                    if (images[idx]) {
                        section.image = images[idx];
                    }
                });
                service.set("sections", sections);
                app.save(service);
                console.log(`[Images] Updated sections for: ${slug}`);
            }
        }
    });

    console.log("[Migration] Section images added");
}, (app) => { });
