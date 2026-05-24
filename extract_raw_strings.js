const fs = require('fs');

try {
    const buffer = fs.readFileSync('TYPE BT.pdf');
    // Simple regex to extract text sequences
    // PDF text is often in (...) or stream...endstream
    // But raw reading might give garbage.
    // Let's try to find text between parentheses (literal strings in PDF)
    const content = buffer.toString('binary');
    const matches = content.match(/\(([^)]+)\)/g);

    if (matches) {
        console.log("Found text segments:");
        matches.forEach(m => {
            // decipher? PDF strings can be escaped or encoded.
            // basic ASCII check
            const text = m.slice(1, -1); // remove parens
            if (text.length > 5 && /^[a-zA-Z0-9 ]+$/.test(text)) {
                console.log(text);
            }
        });
    } else {
        console.log("No literal text strings found (probably compressed).");
    }

} catch (e) {
    console.error(e);
}
