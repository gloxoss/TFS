migrate((app) => {
    const mapping = {
        "Location scouting": "Location Scouting",
        "Management": "Security & Set Management",
        "Film permits": "Film Permits",
        "Film shipping": "Film Shipping & Customs",
        "Equipment hire": "Equipment Hire",
        "Film crewing": "Film Crewing",
        "Accommodation": "Accommodation",
        "Catering": "Film Catering",
        "Casting": "Casting",
        "Costume": "Costume & Wardrobe",
        "Make-up & hair": "Make-up & Hair",
        "Props & set dressing": "Props & Set Dressing",
        "Transportation": "Transportation",
        "Digital": "Digital Services",
        "Sport": "Sporting Events",
        "Broadcast": "Broadcasting & Live Transmission"
    };

    const dbTitles = Object.values(mapping);

    dbTitles.forEach((title, index) => {
        try {
            const records = app.findRecordsByFilter("services", `title = "${title}"`, "", 1);

            if (records && records.length > 0) {
                const record = records[0];
                record.set("display_order", index + 1);
                app.save(record);
                console.log(`[Migration] Updated order for ${title} to ${index + 1}`);
            } else {
                console.log(`[Migration] Warning: Service not found: ${title}`);
            }
        } catch (e) {
            console.log(`[Migration] Error processing ${title}: ${e}`);
        }
    });

}, (app) => {
    // Revert logic (optional)
})
