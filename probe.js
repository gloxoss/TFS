console.log('Node Version:', process.version);
console.log('Fetch available:', typeof fetch !== 'undefined');
console.log('FormData available:', typeof FormData !== 'undefined');
console.log('Blob available:', typeof Blob !== 'undefined');
try {
    const PocketBase = await import('pocketbase');
    console.log('PocketBase SDK loaded');
} catch (e) {
    console.log('PocketBase SDK load failed:', e.message);
}
