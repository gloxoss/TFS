/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    try {
        const collection = app.findCollectionByNameOrId("users");

        // PocketBase v0.23+ moved fields to root .fields list
        // We check if field exists by name using standard array find or helper if available
        // In JSVM, access to fields is usually via .fields property (which is a list)

        let hasRole = false;

        // Robust check for field existence
        // In some versions collection.schema exists, in others it is gone.
        // We try both or iterate fields.
        if (collection.fields) {
            // It's a Go slice proxy in JS, often iterable
            // We can loop or use getFieldByName if exposed on Collection directly
            // Or try/catch access?

            // Simplest: use helper
            try {
                if (collection.getFieldByName("role")) {
                    hasRole = true;
                }
            } catch (e) {
                // ignore
            }
        }

        if (!hasRole) {
            const roleField = new SelectField({
                name: "role",
                maxSelect: 1,
                values: ["user", "admin"],
            });

            // Add field
            collection.fields.add(roleField);

            app.save(collection);
            console.log("Added 'role' field to users collection.");
        }
    } catch (e) {
        console.warn("Migration failed or 'users' collection not found: " + e);
        // Do not throw to avoid boot loop if non-critical
    }

}, (app) => {
    // Revert usually skipped
})
