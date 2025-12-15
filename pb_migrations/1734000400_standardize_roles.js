/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_");

  // Find the role field
  const roleField = collection.fields.find(f => f.name === "role");

  if (roleField) {
    // Update the select options
    roleField.values = ["admin", "customer"];

    // Save the collection
    app.save(collection);
    console.log("Updated role field options to ['admin', 'customer']");
  } else {
    console.warn("Role field not found in users collection");
  }

  // Migrate existing user records
  const users = app.findCollectionByNameOrId("_pb_users_auth_");
  const records = app.findRecordsByFilter("_pb_users_auth_", "role != null");

  for (const record of records) {
    if (record.role === "user") {
      record.role = "customer";
      app.save(record);
      console.log(`Migrated user ${record.id} role from 'user' to 'customer'`);
    }
  }

  console.log("Role standardization migration completed");
}, (app) => {
  // Revert: Change back to old options and revert roles
  const collection = app.findCollectionByNameOrId("_pb_users_auth_");
  const roleField = collection.fields.find(f => f.name === "role");

  if (roleField) {
    roleField.values = ["user", "admin"];
    app.save(collection);
  }

  // Revert migrated records
  const records = app.findRecordsByFilter("_pb_users_auth_", "role = 'customer'");
  for (const record of records) {
    record.role = "user";
    app.save(record);
  }
});