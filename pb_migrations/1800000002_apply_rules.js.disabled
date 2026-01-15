/// <reference path="../pb_data/types.d.ts" />
/**
 * Stage 3: Apply Rules and User Relations
 * Adds user relations to carts/quotes and applies security rules.
 */
migrate((app) => {
    const users = app.findCollectionByNameOrId("users");

    if (!users) {
        console.log("[Rules] Warning: users collection not found, skipping user relations");
        return;
    }

    // =========================================================================
    // 1. CARTS: Add user relation and rules
    // =========================================================================
    const carts = app.findCollectionByNameOrId("carts");
    carts.fields.add(new Field({
        name: "user",
        type: "relation",
        collectionId: users.id,
        cascadeDelete: true,
        maxSelect: 1
    }));
    carts.listRule = "@request.auth.id = user";
    carts.viewRule = "@request.auth.id = user";
    carts.createRule = "@request.auth.id != ''";
    carts.updateRule = "@request.auth.id = user";
    carts.deleteRule = "@request.auth.id = user";
    app.save(carts);
    console.log("[Rules] Carts rules applied");

    // =========================================================================
    // 2. CART ITEMS: Rules (simplified - auth required)
    // =========================================================================
    const cartItems = app.findCollectionByNameOrId("cart_items");
    cartItems.listRule = "@request.auth.id != ''";
    cartItems.viewRule = "@request.auth.id != ''";
    cartItems.createRule = "@request.auth.id != ''";
    cartItems.updateRule = "@request.auth.id != ''";
    cartItems.deleteRule = "@request.auth.id != ''";
    app.save(cartItems);
    console.log("[Rules] Cart items rules applied");

    // =========================================================================
    // 3. QUOTES: Add user relation and rules
    // =========================================================================
    const quotes = app.findCollectionByNameOrId("quotes");
    quotes.fields.add(new Field({
        name: "user",
        type: "relation",
        collectionId: users.id,
        cascadeDelete: false,
        maxSelect: 1
    }));
    // Public can create quotes, only owner can view/update
    quotes.listRule = "@request.auth.id = user";
    quotes.viewRule = "@request.auth.id = user || access_token = @request.query.token";
    quotes.createRule = "";
    quotes.updateRule = "@request.auth.id = user";
    quotes.deleteRule = null; // Admin only
    app.save(quotes);
    console.log("[Rules] Quotes rules applied");

    // =========================================================================
    // 4. EMAIL QUEUE: Admin only
    // =========================================================================
    const emailQueue = app.findCollectionByNameOrId("email_queue");
    emailQueue.listRule = null;
    emailQueue.viewRule = null;
    emailQueue.createRule = "@request.auth.id != ''";
    emailQueue.updateRule = null;
    emailQueue.deleteRule = null;
    app.save(emailQueue);
    console.log("[Rules] Email queue rules applied");

    // =========================================================================
    // 5. BOOKING ITEMS: Admin only
    // =========================================================================
    const bookingItems = app.findCollectionByNameOrId("booking_items");
    bookingItems.listRule = null;
    bookingItems.viewRule = null;
    bookingItems.createRule = null;
    bookingItems.updateRule = null;
    bookingItems.deleteRule = null;
    app.save(bookingItems);
    console.log("[Rules] Booking items rules applied");

    console.log("[Migration] Stage 3 Complete: Rules and relations applied");

}, (app) => {
    // Rollback: Remove added relations would require field removal
    console.log("[Migration] Stage 3 rollback - manual cleanup required");
});
