/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const collection = app.findCollectionByNameOrId("quotes");

    // Allow anyone to create (already default implies anyone if not set, but explicit is better)
    // For create: anyone with an ID (authenticated)
    collection.createRule = "@request.auth.id != ''";

    // Allow admins to list/view all, users to view their own
    // Note: user field is a relation to users collection
    collection.listRule = "@request.auth.role = 'admin' || user = @request.auth.id";
    collection.viewRule = "@request.auth.role = 'admin' || user = @request.auth.id";

    // Allow admins to update (THIS FIXES THE 403)
    collection.updateRule = "@request.auth.role = 'admin'";

    // Allow admins to delete
    collection.deleteRule = "@request.auth.role = 'admin'";

    app.save(collection);
}, (app) => {
    // Revert to null (locked/superuser only) or previous state
    const collection = app.findCollectionByNameOrId("quotes");

    collection.listRule = null;
    collection.viewRule = null;
    collection.createRule = null;
    collection.updateRule = null;
    collection.deleteRule = null;

    app.save(collection);
})
