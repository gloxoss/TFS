#!/usr/bin/env node
/**
 * Lowercase All Category Names (With Undo Support)
 * 
 * Connects to PocketBase via REST API and converts all category names to lowercase.
 * Creates a backup file automatically to allow undoing the operation.
 * Works with both local PB (v0.34.2) and Docker PB (v0.27.1).
 * 
 * Usage:
 *   LOCAL:  node scripts/lowercase_categories.js
 *   VPS:    node scripts/lowercase_categories.js --url=https://tfs.ma --email=admin@example.com --password=pass
 *   DRY:    node scripts/lowercase_categories.js --dry-run
 *   UNDO:   node scripts/lowercase_categories.js --undo
 */

const PocketBase = require('pocketbase/cjs')
const fs = require('fs')
const path = require('path')

// =============================================================================
// CONFIG — Override via CLI args or env vars
// =============================================================================
const args = process.argv.slice(2).reduce((acc, arg) => {
    const [key, val] = arg.replace(/^--/, '').split('=')
    acc[key] = val ?? true
    return acc
}, {})

const PB_URL = args.url || process.env.POCKETBASE_URL || 'http://127.0.0.1:8090'
const ADMIN_EMAIL = args.email || process.env.POCKETBASE_ADMIN_EMAIL || 'zakiossama28@gmail.com'
const ADMIN_PASSWORD = args.password || process.env.POCKETBASE_ADMIN_PASSWORD || ''
const DRY_RUN = args['dry-run'] === true
const UNDO = args['undo'] === true
const BACKUP_FILE = args.backup || path.join(__dirname, 'categories_backup.json')

// =============================================================================
// MAIN
// =============================================================================
async function main() {
    console.log('═══════════════════════════════════════════════════')
    console.log(`  Categories Migration: ${UNDO ? 'UNDO (Restore)' : 'LOWERCASE'}`)
    console.log('═══════════════════════════════════════════════════')
    console.log(`  Target:   ${PB_URL}`)
    console.log(`  Admin:    ${ADMIN_EMAIL}`)
    console.log(`  Dry Run:  ${DRY_RUN ? 'YES (no changes)' : 'NO (will update)'}`)
    console.log(`  Backup:   ${BACKUP_FILE}`)
    console.log('═══════════════════════════════════════════════════\n')

    // 1. Connect & authenticate
    const pb = new PocketBase(PB_URL)

    if (!ADMIN_PASSWORD) {
        console.error('❌ Admin password is required.')
        console.error('   Pass it via: --password=YourPass  or  set POCKETBASE_ADMIN_PASSWORD env var')
        process.exit(1)
    }

    try {
        await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD)
        console.log('✅ Authenticated as admin\n')
    } catch (err) {
        // Fallback for older PB versions that use admins collection
        try {
            await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD)
            console.log('✅ Authenticated as admin (legacy API)\n')
        } catch (err2) {
            console.error('❌ Failed to authenticate:', err.message || err)
            process.exit(1)
        }
    }

    // 2. UNDO MODE
    if (UNDO) {
        if (!fs.existsSync(BACKUP_FILE)) {
            console.error(`❌ Backup file not found: ${BACKUP_FILE}`)
            console.error('   Cannot undo without a backup file.')
            process.exit(1)
        }

        const backupData = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf8'))
        const ids = Object.keys(backupData)
        console.log(`📦 Found ${ids.length} categories in backup to restore:\n`)

        let restored = 0
        let errors = 0

        for (const id of ids) {
            const originalName = backupData[id]

            console.log(`  🔄 Restoring ID "${id}" → "${originalName}"`)

            if (!DRY_RUN) {
                try {
                    await pb.collection('categories').update(id, { name: originalName })
                    restored++
                } catch (err) {
                    console.error(`  ❌ Failed to restore "${originalName}":`, err.message || err)
                    errors++
                }
            } else {
                restored++
            }
        }

        console.log('\n═══════════════════════════════════════════════════')
        if (DRY_RUN) {
            console.log(`  DRY RUN complete: ${restored} would be restored.`)
        } else {
            console.log(`  ✅ UNDO Done: ${restored} restored, ${errors} errors.`)
        }
        console.log('═══════════════════════════════════════════════════')
        return;
    }

    // 3. LOWERCASE MODE
    let categories
    try {
        categories = await pb.collection('categories').getFullList({ sort: 'name' })
    } catch (err) {
        console.error('❌ Failed to fetch categories:', err.message || err)
        process.exit(1)
    }

    console.log(`📦 Found ${categories.length} categories:\n`)

    // Create Backup
    const backupData = {}
    for (const cat of categories) {
        backupData[cat.id] = cat.name
    }

    if (!DRY_RUN) {
        fs.writeFileSync(BACKUP_FILE, JSON.stringify(backupData, null, 2))
        console.log(`💾 Backup saved to ${BACKUP_FILE}\n`)
    } else {
        console.log(`💾 [DRY RUN] Would save backup of ${Object.keys(backupData).length} items\n`)
    }

    // Process each category
    let updated = 0
    let skipped = 0

    for (const cat of categories) {
        const currentName = cat.name
        const lowercaseName = currentName.toLowerCase()

        if (currentName === lowercaseName) {
            console.log(`  ⏭  "${currentName}" → already lowercase`)
            skipped++
            continue
        }

        console.log(`  🔄 "${currentName}" → "${lowercaseName}"`)

        if (!DRY_RUN) {
            try {
                await pb.collection('categories').update(cat.id, { name: lowercaseName })
                updated++
            } catch (err) {
                console.error(`  ❌ Failed to update "${currentName}":`, err.message || err)
            }
        } else {
            updated++
        }
    }

    // 4. Summary
    console.log('\n═══════════════════════════════════════════════════')
    if (DRY_RUN) {
        console.log(`  DRY RUN complete: ${updated} would be updated, ${skipped} already lowercase`)
        console.log('  Run without --dry-run to apply changes and save backup.')
    } else {
        console.log(`  ✅ Done: ${updated} updated, ${skipped} already lowercase`)
        console.log(`  ↩️  To undo, run: node scripts/lowercase_categories.js --undo --password=...`)
    }
    console.log('═══════════════════════════════════════════════════')
}

main().catch(err => {
    console.error('Fatal error:', err)
    process.exit(1)
})
