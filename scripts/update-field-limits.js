const http = require('http');

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

    // First, get the current collection schema
    const getOpts = {
      hostname: '127.0.0.1', port: 8090,
      path: '/api/collections/services',
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + token }
    };

    const getReq = http.request(getOpts, (getRes) => {
      let gBody = '';
      getRes.on('data', c => gBody += c);
      getRes.on('end', () => {
        const collection = JSON.parse(gBody);
        const fields = collection.fields;
        
        // Find and update the hero_image field
        const heroField = fields.find(f => f.name === 'hero_image');
        if (heroField) {
          console.log('Current hero_image maxSize:', heroField.maxSize);
          // Update to 20 MB
          heroField.maxSize = 20971520; // 20 MB
          
          // Also check images field
          const imagesField = fields.find(f => f.name === 'images');
          if (imagesField) {
            console.log('Current images maxSize:', imagesField.maxSize);
            imagesField.maxSize = 20971520; // 20 MB
          }
          
          // Update the collection
          const updateData = JSON.stringify({ fields: fields });
          const updateOpts = {
            hostname: '127.0.0.1', port: 8090,
            path: '/api/collections/services',
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(updateData),
              'Authorization': 'Bearer ' + token
            }
          };
          
          const updateReq = http.request(updateOpts, (updateRes) => {
            let uBody = '';
            updateRes.on('data', c => uBody += c);
            updateRes.on('end', () => {
              const uRec = JSON.parse(uBody);
              const updatedHero = uRec.fields?.find(f => f.name === 'hero_image');
              if (updatedHero) {
                console.log('Updated hero_image maxSize:', updatedHero.maxSize);
                console.log('SUCCESS! Field size limits updated.');
              } else {
                console.log('Update result:', uBody.substring(0, 500));
              }
            });
          });
          updateReq.write(updateData);
          updateReq.end();
        } else {
          console.log('hero_image field not found in collection schema');
        }
      });
    });
    getReq.end();
  });
});
authReq.write(authData);
authReq.end();
