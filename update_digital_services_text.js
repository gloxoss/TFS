const PocketBase = require('pocketbase').default;

async function updateDigitalServicesText() {
    const pb = new PocketBase('http://127.0.0.1:8090');

    try {
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');
        console.log('Authenticated successfully');

        const service = await pb.collection('services').getFirstListItem('slug="digital-services"');
        console.log('Found service ID:', service.id);
        console.log('Current EN:', service.brief_description);
        console.log('Current FR:', service.brief_description_fr);

        await pb.collection('services').update(service.id, {
            brief_description: 'At TFS, we offer innovative digital solutions tailored to your needs.',
            brief_description_fr: 'Chez TFS nous proposons des solutions digitales innovantes adaptées à vos besoins.'
        });

        console.log('--- UPDATED ---');
        const updated = await pb.collection('services').getOne(service.id);
        console.log('New EN:', updated.brief_description);
        console.log('New FR:', updated.brief_description_fr);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

updateDigitalServicesText();
