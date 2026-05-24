const fs = require('fs');
try {
    const path = require.resolve('pdf-parse');
    console.log('Resolved path:', path);
    // Read the file to see exports
    console.log('Content head:', fs.readFileSync(path, 'utf8').substring(0, 500));
} catch (e) {
    console.error(e);
}
