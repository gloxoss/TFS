import PocketBase from 'pocketbase';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';
import { fileURLToPath } from 'url';

const execPromise = util.promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pb = new PocketBase('http://127.0.0.1:8090');
const BROADCAST_SLUG = 'broadcasting-live';

async function uploadFileWithCurl(url, token, filepath, fieldName = 'images') {
    const absPath = path.resolve(filepath);
    const curlCmd = `curl.exe -X PATCH -H "Authorization: ${token}" -F "${fieldName}=@${absPath}" "${url}"`;
    console.log(`Executing: ${curlCmd}`);
    const { stdout, stderr } = await execPromise(curlCmd);
    return JSON.parse(stdout);
}

async function run() {
    try {
        console.log('Authenticating...');
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');
        const token = pb.authStore.token;
        console.log('Auth success.');

        const service = await pb.collection('services').getFirstListItem(`slug="${BROADCAST_SLUG}"`);
        const uploadUrl = `http://127.0.0.1:8090/api/collections/services/records/${service.id}`;

        const dummyPath = path.join(__dirname, 'test.txt');
        fs.writeFileSync(dummyPath, 'test content');

        console.log('Uploading test file...');
        await uploadFileWithCurl(uploadUrl, token, dummyPath);
        console.log('Upload success.');

        fs.unlinkSync(dummyPath);
    } catch (e) {
        console.error('Test failed:', e);
    }
}

run();
