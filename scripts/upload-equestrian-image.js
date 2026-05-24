const http = require('http');
const fs = require('fs');
const path = require('path');

const SERVICE_ID = 'bto6gl2241kdgw9';
const IMAGE_PATH = path.join(__dirname, '..', 'Équestres', 'low-section-woman-riding-horse-competition.jpg');

// Check file exists
if (!fs.existsSync(IMAGE_PATH)) {
  console.log('Image not found:', IMAGE_PATH);
  process.exit(1);
}

// Authenticate
const authData = JSON.stringify({ identity: 'zakiossama28@gmail.com', password: 'GloXoss123.' });
const authOpts = {
  hostname: '127.0.0.1', port: 8090,
  path: '/api/collections/_superusers/auth-with-password',
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(authData) }
};

const authReq = http.request(authOpts, (authRes) => {
  let body = '';
  authRes.on('data', c => body += c);
  authRes.on('end', () => {
    const token = JSON.parse(body).token;
    if (!token) { console.log('AUTH FAILED:', body); return; }

    // Read the image file
    const fileData = fs.readFileSync(IMAGE_PATH);
    const fileName = path.basename(IMAGE_PATH);
    
    // Build multipart form data manually
    const boundary = '----FormBoundary' + Date.now();
    const CRLF = '\r\n';
    
    const parts = [];
    
    // hero_image field
    parts.push(
      `--${boundary}${CRLF}` +
      `Content-Disposition: form-data; name="hero_image"; filename="${fileName}"${CRLF}` +
      `Content-Type: image/jpeg${CRLF}${CRLF}`
    );
    
    const header = Buffer.from(parts[0]);
    const footer = Buffer.from(`${CRLF}--${boundary}--${CRLF}`);
    const bodyBuffer = Buffer.concat([header, fileData, footer]);
    
    const uploadOpts = {
      hostname: '127.0.0.1', port: 8090,
      path: `/api/collections/services/records/${SERVICE_ID}`,
      method: 'PATCH',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': bodyBuffer.length,
        'Authorization': 'Bearer ' + token
      }
    };
    
    const uploadReq = http.request(uploadOpts, (uploadRes) => {
      let uBody = '';
      uploadRes.on('data', c => uBody += c);
      uploadRes.on('end', () => {
        const rec = JSON.parse(uBody);
        if (rec.hero_image) {
          console.log('SUCCESS! Uploaded hero_image:', rec.hero_image);
        } else {
          console.log('Upload result:', uBody.substring(0, 500));
        }
      });
    });
    uploadReq.write(bodyBuffer);
    uploadReq.end();
  });
});
authReq.write(authData);
authReq.end();
