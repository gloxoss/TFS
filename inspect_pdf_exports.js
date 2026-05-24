const pdf = require('pdf-parse');

console.log('Type of export:', typeof pdf);
console.log('Keys:', Object.keys(pdf));

for (const key of Object.keys(pdf)) {
    console.log(`Key: ${key}, Type: ${typeof pdf[key]}`);
}

// Try to print the function definition if PDFParse is a function
if (pdf.PDFParse) {
    console.log('PDFParse toString:', pdf.PDFParse.toString().substring(0, 200));
}
