/// <reference path="../pb_data/types.d.ts" />

migrate((dao) => {
    const attributes = [
        {
            name: 'Brand',
            slug: 'brand',
            type: 'select',
            options: ['ARRI', 'RED', 'Sony', 'Canon', 'Blackmagic', 'Cooke', 'Zeiss', 'Angenieux', 'Leica', 'Atlas'],
        },
        {
            name: 'Type',
            slug: 'type',
            type: 'select',
            options: ['Cinema Camera', 'Mirrorless', 'Prime Lens', 'Zoom Lens', 'Anamorphic', 'Spherical'],
        },
        {
            name: 'Mount',
            slug: 'mount',
            type: 'select',
            options: ['PL', 'EF', 'E-Mount', 'RF', 'L-Mount', 'MFT'],
        },
        {
            name: 'Sensor',
            slug: 'sensor',
            type: 'select',
            options: ['Large Format', 'Full Frame', 'Super 35', 'MFT'],
        },
        {
            name: 'Resolution',
            slug: 'resolution',
            type: 'select',
            options: ['12K', '8K', '6K', '4K', 'HD'],
        }
    ];

    const collection = dao.findCollectionByNameOrId("attributes");

    attributes.forEach((attr) => {
        try {
            // Check if attribute slug already exists
            // "attributes" is the collection name.
            // We look for a record where slug = attr.slug
            const existing = dao.findFirstRecordByData("attributes", "slug", attr.slug);
            console.log(`Attribute ${attr.slug} already exists.`);
        } catch (e) {
            // Not found, create it
            const record = new Record(collection);
            record.set("name", attr.name);
            record.set("slug", attr.slug);
            record.set("type", attr.type);
            record.set("options", attr.options);

            dao.save(record);
            console.log(`Created attribute ${attr.slug}`);
        }
    });

}, (dao) => {
    // down logic (optional)
})
