const fs = require('fs');
const path = require('path');

// Target the .js file now since we overwrote it previously, or fallback to .bak if needed.
// User output shows: migration 1766600000_batch3_kits_seed.js
const filePath = String.raw`c:\Users\zakio\Documents\Project\PB-Next\pb_migrations\1766600000_batch3_kits_seed.js`;

try {
    let content = fs.readFileSync(filePath, 'utf8');

    // We need to find ALL manually assigned IDs that are being used.
    // The previous regex caught them. We can reuse the logic but improve the "newId" generation.

    // Regex to find "id": "value"
    // We capture the ID value.
    // We relax the regex to catch underscores and potentially longer things we messed up.
    // But primarily we want to catch the ones we just padded or the original ones if we are running on clean state.
    // Since we ran the script once, we might have IDs like "kit_venice_pkgx". 
    // We want to turn "kit_venice_pkgx" -> "kitvenicepkgxxx" (15 chars, no underscore)

    // Let's sweep for any ID-like string that is in our dataset.
    // The dataset keys are: id, main_product_id, template_id, product_id
    // But simpler approach: Find anything looking like a manual ID string.
    // Our manual IDs usually start with: lens_, kit_, cam_, mb_, supp_, wl_, stab_, item_, mon_
    // or the 'x' padded versions from previous run.

    const idRegex = /"(id|main_product_id|template_id|product_id)":\s*"([^"]+)"/g;

    const candidates = new Set();
    let match;
    while ((match = idRegex.exec(content)) !== null) {
        // match[2] is the value
        const val = match[2];
        // Filter out system IDs (usually 15 mixed chars, hard to distinguish from our bad ones if we padded them)
        // But our manual ones have meaningful prefixes usually or underscores.
        if (val.includes('_') || val.length !== 15 || /[^a-z0-9]/.test(val)) {
            candidates.add(val);
        }
    }

    console.log(`Found ${candidates.size} candidate invalid ID strings.`);

    const replacements = {};

    candidates.forEach(oldId => {
        // Sanitize: remove non-alphanumeric, toLowerCase
        let stripped = oldId.replace(/[^a-z0-9]/gi, '').toLowerCase();

        let newId = stripped;
        if (newId.length < 15) {
            newId = newId + 'x'.repeat(15 - newId.length);
        } else if (newId.length > 15) {
            newId = newId.substring(0, 15);
        }

        if (oldId !== newId) {
            replacements[oldId] = newId;
            console.log(`  "${oldId}" -> "${newId}"`);
        }
    });

    // Replace in content
    // Sort by length desc to avoid substring issues
    const sortedKeys = Object.keys(replacements).sort((a, b) => b.length - a.length);

    for (const oldId of sortedKeys) {
        const newId = replacements[oldId];
        // Replace all quoted occurrences globally
        // This is safe because these specific semantic strings are unique enough in this context
        // and we are matching exact quoted strings mostly by the way we found them (though we do global replace)
        const globalRegex = new RegExp(`"${oldId}"`, 'g');
        content = content.replace(globalRegex, `"${newId}"`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed file written to ${filePath}`);

} catch (err) {
    console.error("Error:", err);
    process.exit(1);
}
