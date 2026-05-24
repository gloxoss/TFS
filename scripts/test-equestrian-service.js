/**
 * Test script: Verify the Equestrian service record in PocketBase
 * Run: node scripts/test-equestrian-service.js
 */
const http = require('http');

const PB_HOST = '127.0.0.1';
const PB_PORT = 8090;

function fetch(path) {
  return new Promise((resolve, reject) => {
    http.get({ hostname: PB_HOST, port: PB_PORT, path }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { reject(new Error(`Invalid JSON from ${path}: ${body.slice(0, 200)}`)); }
      });
    }).on('error', reject);
  });
}

async function run() {
  let pass = 0, fail = 0;

  function check(label, condition, detail) {
    if (condition) { console.log(`  ✓ ${label}`); pass++; }
    else { console.log(`  ✗ ${label} — ${detail || 'FAILED'}`); fail++; }
  }

  // 1. Check PocketBase health
  console.log('\n=== PocketBase Health ===');
  try {
    const health = await fetch('/api/health');
    check('PocketBase is running', health.code === 200);
  } catch (e) {
    console.log('  ✗ PocketBase is not running on port 8090. Start it first.');
    process.exit(1);
  }

  // 2. Fetch equestrian service by slug
  console.log('\n=== Equestrian Service (slug: equestrian) ===');
  let equestrian;
  try {
    const result = await fetch('/api/collections/services/records?filter=(slug="equestrian")');
    check('Service record found', result.items && result.items.length === 1,
      `Found ${result.items ? result.items.length : 0} records`);
    equestrian = result.items[0];
  } catch (e) {
    console.log('  ✗ Failed to query service:', e.message);
    process.exit(1);
  }

  // 3. Validate basic fields
  console.log('\n=== Basic Fields ===');
  check('Title (EN)', equestrian.title === 'Equestrian Sports', `Got: "${equestrian.title}"`);
  check('Title (FR)', equestrian.title_fr === 'Sports Équestres', `Got: "${equestrian.title_fr}"`);
  check('Slug', equestrian.slug === 'equestrian', `Got: "${equestrian.slug}"`);
  check('is_active', equestrian.is_active === true, `Got: ${equestrian.is_active}`);
  check('template', equestrian.template === 'default', `Got: "${equestrian.template}"`);
  check('type', equestrian.type === 'content_page', `Got: "${equestrian.type}"`);
  check('icon', equestrian.icon === 'Horse', `Got: "${equestrian.icon}"`);

  // 4. Validate descriptions
  console.log('\n=== Descriptions ===');
  check('brief_description (EN) set',
    equestrian.brief_description && equestrian.brief_description.length > 20,
    `Length: ${equestrian.brief_description?.length || 0}`);
  check('brief_description_fr set',
    equestrian.brief_description_fr && equestrian.brief_description_fr.length > 20,
    `Length: ${equestrian.brief_description_fr?.length || 0}`);
  check('full_description (EN) contains SOREC',
    equestrian.full_description && equestrian.full_description.includes('SOREC'),
    'Missing SOREC reference');
  check('full_description_fr contains SOREC',
    equestrian.full_description_fr && equestrian.full_description_fr.includes('SOREC'),
    'Missing SOREC reference');
  check('full_description contains "High-Speed Tracking"',
    equestrian.full_description && equestrian.full_description.includes('High-Speed Tracking'),
    'Missing section');
  check('full_description_fr contains "systèmes de suivi"',
    equestrian.full_description_fr && equestrian.full_description_fr.includes('suivi'),
    'Missing section');

  // 5. Validate features
  console.log('\n=== Features ===');
  const features = equestrian.features || [];
  check('Has 3 features', features.length === 3, `Got ${features.length}`);
  if (features.length > 0) {
    check('Feature titles present', features.every(f => f.title && f.title.length > 0));
    check('Feature descriptions present', features.every(f => f.description && f.description.length > 0));
    check('Feature icons present', features.every(f => f.icon && f.icon.length > 0));
  }

  // 6. Validate sections
  console.log('\n=== Sections ===');
  const sections = equestrian.sections || [];
  check('Has 3 sections', sections.length === 3, `Got ${sections.length}`);
  if (sections.length > 0) {
    check('Section titles present', sections.every(s => s.title && s.title.length > 0));
    check('Section content present', sections.every(s => s.content && s.content.length > 20));
    check('Section layouts set', sections.every(s => s.layout === 'left' || s.layout === 'right'));
  }

  // 7. Validate images
  console.log('\n=== Images ===');
  check('hero_image set', equestrian.hero_image && equestrian.hero_image.length > 0,
    `Got: "${equestrian.hero_image || ''}"`);
  const images = equestrian.images || [];
  check('images array has files', images.length >= 3, `Got ${images.length} images`);
  const sliders = equestrian.slider_images || [];
  check('slider_images array has files', sliders.length >= 3, `Got ${sliders.length} slider images`);

  // Verify images are accessible
  if (images.length > 0) {
    const imgUrl = `/api/files/${equestrian.collectionId}/${equestrian.id}/${images[0]}`;
    try {
      const imgCheck = await new Promise((resolve, reject) => {
        http.get({ hostname: PB_HOST, port: PB_PORT, path: imgUrl }, (res) => {
          resolve(res.statusCode);
        }).on('error', reject);
      });
      check('First image accessible (HTTP 200)', imgCheck === 200, `HTTP ${imgCheck}`);
    } catch (e) {
      check('First image accessible', false, e.message);
    }
  }

  // 8. Check Sport Hub includes equestrian
  console.log('\n=== Sport Hub Integration ===');
  try {
    const hubResult = await fetch('/api/collections/services/records?filter=(slug="sport")');
    const hub = hubResult.items && hubResult.items[0];
    check('Sport hub found', !!hub);
    if (hub) {
      const subs = hub.sub_services || [];
      check('equestrian in sub_services', subs.includes('equestrian'),
        `sub_services: ${JSON.stringify(subs)}`);
      check('Total sub_services count', subs.length === 11, `Got ${subs.length}`);
    }
  } catch (e) {
    check('Sport hub query', false, e.message);
  }

  // 9. Check equestrian icon SVG exists
  console.log('\n=== Static Assets ===');
  const fs = require('fs');
  const iconPath = require('path').join(__dirname, '..', 'web', 'public', 'images', 'icons', 'sports', 'equestrian.svg');
  check('equestrian.svg icon exists', fs.existsSync(iconPath), `Path: ${iconPath}`);
  const athleticsPath = require('path').join(__dirname, '..', 'web', 'public', 'images', 'icons', 'sports', 'athletics.svg');
  check('athletics.svg icon exists', fs.existsSync(athleticsPath), `Path: ${athleticsPath}`);

  // Summary
  console.log(`\n${'='.repeat(40)}`);
  console.log(`Results: ${pass} passed, ${fail} failed out of ${pass + fail} checks`);
  if (fail === 0) console.log('All checks passed!');
  else process.exit(1);
}

run().catch(e => { console.error('Script error:', e); process.exit(1); });
