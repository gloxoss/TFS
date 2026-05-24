import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function test() {
    try {
        console.log('Authenticating...');
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');
        console.log('Auth success!');
    } catch (e) {
        console.error('Auth failed:', e);
    }
}

test();
