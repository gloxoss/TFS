import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

console.log('PDF Function:', pdf);

const dataBuffer = fs.readFileSync('TYPE BT.pdf');

try {
    pdf(dataBuffer).then(function (data) {
        console.log("\n--- PDF TEXT START ---");
        console.log(data.text);
        console.log("--- PDF TEXT END ---");
    }).catch(err => {
        console.error("PDF Parsing Error:", err);
    });
} catch (e) {
    console.error("Error:", e);
}
