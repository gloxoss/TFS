---
name: pocketbase-workspace
description: PocketBase v0.34.2 workspace patterns. Collection schemas, CRUD operations, migrations, hooks, categories management, and admin tooling for the TFS project.
triggers:
  - pocketbase
  - pb
  - collection
  - categories
  - equipment
  - services
  - quotes
  - migration
  - database
  - schema
  - admin inventory
---

# PocketBase Workspace Skill

> **Version:** PocketBase v0.34.2  
> **Runtime:** Embedded Go binary (`pocketbase.exe`)  
> **Data:** `pb_data/data.db` + `pb_data/auxiliary.db`  
> **Migrations:** `pb_migrations/` (JS format, PB 0.26+ verbose fields)

---

## Architecture Overview

```
PB-Next/
├── pocketbase.exe          # PB v0.34.2 binary
├── pb_data/                # Runtime data (SQLite)
│   ├── data.db             # Main database (~16MB)
│   ├── auxiliary.db        # System/auth data (~24MB)
│   ├── storage/            # Uploaded files
│   └── types.d.ts          # Auto-generated type definitions
├── pb_hooks/               # Server-side hooks (JS)
│   ├── sync_images.pb.js
│   └── sync_images_v2.pb.js
├── pb_migrations/          # Migration files (JS, 98 files)
├── web/
│   └── src/
│       ├── lib/pocketbase/         # Client layer
│       │   ├── config.ts           # URL, file helpers, CSP
│       │   ├── client.ts           # Browser client (cookie auth)
│       │   ├── server.ts           # Server client (AsyncAuthStore)
│       │   ├── middleware.ts       # Auth refresh middleware
│       │   └── types.ts            # Auto-generated types (pocketbase-typegen)
│       ├── services/               # Domain services
│       │   ├── services/pocketbase-service.ts   # Services collection
│       │   ├── products/pocketbase-service.ts   # Equipment + Categories
│       │   └── quotes/pocketbase-service.ts     # Quotes collection
│       └── lib/actions/
│           └── admin-inventory.ts  # Server Actions (CRUD)
```

---

## Collections Reference

### Core Business Collections

| Collection        | Type | List Rule          | Key Fields |
|-------------------|------|--------------------|------------|
| `categories`      | base | `null` (public)    | name, slug, description, thumbnail, sort_order |
| `equipment`       | base | `""` (public)      | name, name_en, name_fr, slug, brand, category→categories, daily_rate, stock, visibility, image, images[], specs(JSON), specs_en, specs_fr, description_en, description_fr |
| `services`        | base | `is_active = true` | title, title_fr, slug, icon, brief_description, brief_description_fr, full_description, full_description_fr, type(select), hero_image, sections(JSON), stats(JSON), tags(JSON), features(JSON), template(select), sub_services(JSON), display_order, is_active, downloads(JSON), slider_images[], video_url, download_files[] |
| `attributes`      | base | public             | name, slug, type, options(JSON), categories(relation[]) |
| `quotes`          | base | `null` (admin)     | client_name, client_email, client_phone, client_company, items_json(JSON), rental_start_date, rental_end_date, status(select), confirmation_number, access_token, quote_pdf(file), estimated_price, language, locked, signature, signed_at |
| `users`           | auth | —                  | name, email, avatar, role |
| `posts`           | base | `published = true` | title_en, title_fr, slug, excerpt_en, excerpt_fr, content_en, content_fr, cover_image, category, published, published_at |
| `documents`       | base | —                  | file uploads with expanded MIME support |

### System/Config Collections

| Collection          | Purpose |
|---------------------|---------|
| `settings`          | Company config (name, email, phone, fax, address, show_prices, maintenance_mode) |
| `ui_configurations` | Key-value UI settings |
| `content_blocks`    | CMS content blocks (key, content, image) |
| `email_queue`       | Outbound email queue with retry logic |

### Cart/Booking Collections

| Collection      | Purpose |
|-----------------|---------|
| `carts`         | Shopping carts (status: active/abandoned/converted) |
| `cart_items`    | Cart line items (cart→carts, product→equipment, quantity, dates) |
| `kit_templates` | Pre-configured equipment kits |
| `kit_slots`     | Kit slot definitions (template→kit_templates, category→categories) |
| `booking_items` | Confirmed booking line items |

---

## Categories Deep-Dive

### Schema (Migration Source)
```js
// Fields: id (auto), name (required), slug (required), description, thumbnail (file)
// Additional runtime field: sort_order (number)
```

### CRUD Operations (Server Actions)

**Create:** `admin-inventory.ts → createCategory(formData)`
```typescript
// Requires: verifyInventoryAccess()
// Uses: createAdminClient()
// Auto-generates slug from name if not provided
await client.collection('categories').create({
    name,
    slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
})
```

**Read:** `admin-inventory.ts → getEquipmentCategories()`
```typescript
// Returns: { id, name, slug }[]
const result = await client.collection('categories').getFullList({ sort: 'name' })
```

**Update:** `admin-inventory.ts → updateCategory(id, formData)`
```typescript
await client.collection('categories').update(id, { name, slug: slug || undefined })
```

**Delete:** `admin-inventory.ts → deleteCategory(id)`
```typescript
// Requires: canDeleteProducts() permission
await client.collection('categories').delete(id)
```

### Categories in Product Service
```typescript
// Products expand category via PB relation
const record = await pb.collection('equipment').getFirstListItem(`slug = "${slug}"`, {
    expand: 'category'
})

// Category mapping
const mapRecordToCategory = (record) => ({
    id: record.id,
    name: record.name,
    slug: record.slug || record.id,
    description: record.description,
    thumbnail: record.thumbnail
        ? `${PB_URL}/api/files/${record.collectionId}/${record.id}/${record.thumbnail}`
        : undefined,
    sortOrder: record.sort_order,
})
```

### Category Visual Config (`productCategories.ts`)
Each category slug maps to icon, gradient, colors, and keywords:
- `cameras` → Camera icon, purple gradient
- `lenses` → Focus icon, blue gradient
- `lighting` → Lightbulb icon, amber gradient
- `grip` → Move icon, green gradient
- `audio` → Mic icon, red gradient
- `accessories` → Package2 icon, zinc gradient
- `kits` → Layers icon, indigo gradient (priority 0)

---

## Client Patterns

### Server-Side (Next.js Server Components / Actions)
```typescript
import { createServerClient, createAdminClient } from '@/lib/pocketbase/server'

// Read-only (respects user auth)
const pb = await createServerClient(false)

// Admin operations (uses env credentials)
const pb = await createAdminClient()
```

### Client-Side (React Components)
```typescript
import { createBrowserClient } from '@/lib/pocketbase/client'
const pb = createBrowserClient()
```

### File URLs
```typescript
import { getFileUrl, getThumbUrl } from '@/lib/pocketbase/config'

getFileUrl('equipment', recordId, filename)
// → http://127.0.0.1:8090/api/files/equipment/{id}/{filename}

getThumbUrl('equipment', recordId, filename, '200x200')
// → ...?thumb=200x200
```

---

## Environment Variables

| Variable | Context | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_POCKETBASE_URL` | Public | PB URL for client-side (e.g., `https://tfs.zouskym.com`) |
| `POCKETBASE_URL` | Server-only | Internal PB URL (avoids loopback) |
| `POCKETBASE_ADMIN_EMAIL` | Server-only | Admin auth email |
| `POCKETBASE_ADMIN_PASSWORD` | Server-only | Admin auth password |

---

## Migration Patterns

### Creating a New Collection
```js
/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const collection = new Collection({
        id: "pbc_unique_id",
        name: "collection_name",
        type: "base",
        system: false,
        listRule: "",        // "" = public, null = admin only
        viewRule: "",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
            {
                id: "field_id", name: "field_name", type: "text",
                system: false, hidden: false, presentable: false,
                required: true, autogeneratePattern: "", max: 0, min: 0,
                pattern: "", primaryKey: false
            }
        ]
    })
    return app.save(collection)
}, (app) => {
    const collection = app.findCollectionByNameOrId("pbc_unique_id")
    return app.delete(collection)
})
```

### Adding Fields to Existing Collection
```js
migrate((app) => {
    const collection = app.findCollectionByNameOrId("collection_name")
    collection.fields.addAt(collection.fields.length, new Field({
        id: "field_id", name: "new_field", type: "text",
        system: false, hidden: false, presentable: false, required: false
    }))
    return app.save(collection)
}, (app) => {
    const collection = app.findCollectionByNameOrId("collection_name")
    collection.fields.removeByName("new_field")
    return app.save(collection)
})
```

### Seeding Data
```js
migrate((app) => {
    const collection = app.findCollectionByNameOrId("services")
    const record = new Record(collection)
    record.set("title", "My Service")
    record.set("slug", "my-service")
    record.set("is_active", true)
    app.save(record)
}, (app) => {
    // Rollback: delete seeded records
})
```

---

## Common Operations Cheatsheet

### PocketBase JS SDK (v0.34.x)
```typescript
// List with filter + sort
pb.collection('equipment').getFullList({ filter: 'visibility = true', sort: 'name' })

// Paginated list
pb.collection('equipment').getList(page, perPage, { filter, sort, expand: 'category' })

// Single by filter
pb.collection('services').getFirstListItem(`slug = "${slug}" && is_active = true`)

// Create with FormData (for file uploads)
const data = new FormData()
data.append('name', 'value')
data.append('image', fileBlob)
pb.collection('equipment').create(data)

// Update
pb.collection('categories').update(id, { name: 'New Name' })

// Delete files from multi-file field
pb.collection('equipment').update(id, { 'images-': ['file1.jpg', 'file2.jpg'] })

// Expand relations
pb.collection('equipment').getOne(id, { expand: 'category' })
// Access: record.expand?.category
```

### Filter Syntax
```
// Equality
slug = "cameras"

// Contains (text search)
name ~ "RED"

// Boolean
visibility = true

// JSON field access
specs.mount = "PL"

// JSON string match (for keys with hyphens)
specs ~ '"day-light":"true"'

// Combined
(name ~ "sony" || brand ~ "sony") && visibility = true

// Relation filter
category = "record_id_here"
```

---

## Rules Quick Reference

| Rule Value | Meaning |
|------------|---------|
| `""` (empty string) | Public access (no auth required) |
| `null` | Admin-only (requires superuser auth) |
| `"@request.auth.id != ''"` | Any authenticated user |
| `"user = @request.auth.id"` | Only record owner |
| `"is_active = true"` | Conditional public access |

---

## Running PocketBase

```powershell
# Start PB server (dev)
.\pocketbase.exe serve --http="0.0.0.0:8090"

# Check version
.\pocketbase.exe --version
# → pocketbase.exe version 0.34.2

# Admin dashboard
# http://127.0.0.1:8090/_/
```

---

## Hooks (`pb_hooks/`)

Server-side JavaScript hooks that run inside PocketBase runtime:
- `sync_images.pb.js` / `sync_images_v2.pb.js` — Image synchronization logic

Hooks use PocketBase's built-in JS VM (not Node.js). They have access to `$app`, `$apis`, and event hooks like `onRecordCreate`, `onRecordUpdate`, etc.

---

## Bilingual Pattern

Most content collections follow the `field_en` / `field_fr` pattern:
- `name_en`, `name_fr` → Equipment names
- `description_en`, `description_fr` → Equipment descriptions
- `specs_en`, `specs_fr` → Equipment specifications
- `title`, `title_fr` → Service titles
- `brief_description`, `brief_description_fr` → Service briefs
- `full_description`, `full_description_fr` → Service full content

Language selection happens in the service layer based on the `lang` parameter.
