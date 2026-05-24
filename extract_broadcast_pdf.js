const fs = require('fs');

async function run() {
    const pdfModule = await import('pdf-parse');
    console.log('PDF Module Keys:', Object.keys(pdfModule));

    // Check if the default export is the function
    const pdf = pdfModule.default;
    console.log('pdf default type:', typeof pdf);

    const dataBuffer = fs.readFileSync('TYPE BT.pdf');

    if (typeof pdf === 'function') {
        try {
            const data = await pdf(dataBuffer);
            console.log("\n--- PDF TEXT START ---");
            console.log(data.text);
            console.log("--- PDF TEXT END ---");
        } catch (err) {
            console.error(err);
        }
    } else {
        console.error("Could not find pdf function in export.");
    }
}

run();
