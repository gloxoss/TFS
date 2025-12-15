/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    // 1. Get all users
    // In JSVM, we can use $app.dao().findRecordsByFilter(...) or similar helpers.
    // app argument in recent PB versions is the App instance.

    const users = app.findAllRecords("users");
    const emailToId = {};

    // Iterate users (in JSVM these are Record objects)
    // users is likely an array of models
    users.forEach((u) => {
        const email = u.email(); // Getter method in Go->JS bridge often
        if (email) {
            emailToId[email.toLowerCase()] = u.id;
        }
    });

    // 2. Get orphaned quotes
    const quotes = app.findAllRecords("quotes", $dbx.exp("user = '' OR user IS NULL"));

    console.log(`Found ${quotes.length} orphaned quotes to check.`);

    let updatedCount = 0;

    quotes.forEach((quote) => {
        // Access fields using .get() or direct property depending on version. 
        // Safest is to check documentation, but usually property works for read.
        // However, specifically for 'email' on users it's standard, for custom fields 'client_email' might differ.
        // Let's try .get("client_email") which is robust.
        const clientEmail = quote.getString("client_email");

        if (clientEmail && emailToId[clientEmail.toLowerCase()]) {
            const userId = emailToId[clientEmail.toLowerCase()];

            // 3. Update using record setter
            quote.set("user", userId);
            app.save(quote);

            console.log(`Linked quote ${quote.id} to user ${userId} (${clientEmail})`);
            updatedCount++;
        }
    });

    console.log(`Migration complete. Linked ${updatedCount} quotes.`);

}, (app) => {
    console.log("Revert skipped for quote linking migration.");
})
