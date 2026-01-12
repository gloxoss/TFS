/// <reference path="../pb_data/types.d.ts" />

onRecordAfterCreateSuccess((e) => {
    try {
        const record = e.record;
        const categoryId = record.get("category");
        if (categoryId) {
            const category = $app.findRecordById("categories", categoryId);
            if (category) {
                const sortOrder = category.getInt("sort_order");
                // Avoid infinite loop if value is already set
                if (record.getInt("category_sort_order") !== sortOrder) {
                    record.set("category_sort_order", sortOrder);
                    $app.save(record);
                }
            }
        }
    } catch (err) {
        $app.logger().warn("Failed to set category_sort_order: " + err.message);
    }
}, "equipment");

onRecordAfterUpdateSuccess((e) => {
    try {
        const record = e.record;
        const categoryId = record.get("category");
        if (categoryId) {
            const category = $app.findRecordById("categories", categoryId);
            if (category) {
                const sortOrder = category.getInt("sort_order");
                // Avoid infinite loop since we are saving again
                if (record.getInt("category_sort_order") !== sortOrder) {
                    record.set("category_sort_order", sortOrder);
                    $app.save(record);
                }
            }
        }
    } catch (err) {
        $app.logger().warn("Failed to set category_sort_order: " + err.message);
    }
}, "equipment");
