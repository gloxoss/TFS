# Development Notes - Cinema Equipment Rental Platform

## [2026-02-16] - Bug Fixes, Equestrian Sports Service, Icon Updates

* **Type:** feature | fix
* **Action:**
  - Fixed contact form 400 error: form inputs had `id` but no `name` attributes, so `FormData.get()` returned null for all fields. PocketBase rejected the request because required fields (name, email, message) were empty.
  - Fixed Next.js image quality warnings: added `qualities: [25, 50, 75, 90]` to `images` config so `quality={90}` used in `hero-impact.tsx` is properly configured.
  - Added **Equestrian Sports** ("Sports Équestres") service to PocketBase with full FR/EN content, features, sections, and hero image. Linked to Sport hub via `sub_services`.
  - Updated athletics sport icon with dedicated athlete SVG.
  - Added equestrian horse+jockey SVG icon to sports icon set and mapped it in the hub icons grid.
  - Increased `hero_image` and `images` PocketBase field size limits from 5MB to 20MB to accommodate high-res photos.
* **Logic:** Contact form was completely non-functional due to missing HTML `name` attributes. Image quality warning will become an error in Next.js 16. Equestrian service extends the sports coverage offering with SOREC partnership content.
* **Files:**
  - `web/src/components/marketing/contact/contact-form.tsx` - Added `name` attributes to all form inputs
  - `web/next.config.ts` - Added `qualities` array to images config
  - `web/public/images/icons/sports/athletics.svg` - Replaced with athlete SVG
  - `web/public/images/icons/sports/equestrian.svg` - New equestrian horse+jockey icon
  - `web/src/components/marketing/services/hub-icons-grid.tsx` - Added equestrian to SPORT_ICONS map
  - PocketBase: New service record `bto6gl2241kdgw9` (slug: `equestrian`, display_order: 110)
  - PocketBase: Sport hub `di7oep5bcat70fr` sub_services updated to include `equestrian`

## [2026-02-15] - Remove Documents Collection, Use Service File Uploads

* **Type:** refactor
* **Action:** Eliminated the broken `documents` collection for PDF uploads. Files are now uploaded directly to a new `download_files` file field on the `services` collection. The existing `downloads` JSON field stores metadata (title, url, category) referencing those files via PocketBase file URLs.
* **Logic:**
  - The `documents` collection was broken (missing `title`/`file` fields due to old PocketBase migration format incompatible with v0.23+)
  - Browser PB client has no auth token by design (XSS prevention), so direct uploads from client were impossible anyway
  - New approach: server action uploads files to the service record's `download_files` multi-file field using `createAdminClient()`, then stores the resulting URL in the `downloads` JSON
* **Files:**
  - `pb_migrations/1802005000_add_download_files_to_services.js` - Migration adding `download_files` file field (50 files, 50MB, PDFs/docs/images)
  - `web/src/lib/actions/service-files.ts` - New server action: `uploadServiceFile()` and `deleteServiceFile()`
  - `web/src/components/admin/broadcast/service-downloads-editor.tsx` - Rewired to use `uploadServiceFile` instead of broken `uploadDocument`
  - `web/src/components/admin/broadcast/downloads-editor.tsx` - Updated to use `uploadServiceFile` (dead code but cleaned up)
  - `web/src/lib/actions/documents.ts` - Deprecated (was targeting broken documents collection)

## [2026-02-03] - Security Audit & XSS Vulnerability Fixes

* **Type:** fix
* **Action:** Conducted comprehensive security audit of all admin pages and server actions. Fixed XSS vulnerabilities and missing authorization checks.
* **Logic:** 
  - All `dangerouslySetInnerHTML` usages must sanitize content with DOMPurify to prevent XSS attacks
  - Server actions that use `createAdminClient()` must first verify user permissions via `verifyAdminAccess()`
* **Files:**
  - `web/src/components/features/broadcast/BroadcastPage.tsx` - Added `DOMPurify.sanitize()` to description content
  - `web/src/components/marketing/services/service-content-section.tsx` - Added `DOMPurify.sanitize()` to section content
  - `web/src/lib/actions/blog.ts` - Added `verifyAdminAccess()` checks to `createPost()`, `updatePost()`, `deletePost()`

### Security Findings:

**✅ PASSED:**
- Admin layout (`(admin)/layout.tsx`) - Uses `verifyInventoryAccess()` with path-based restrictions
- Server actions (`admin-requests.ts`, `admin-inventory.ts`, `admin-dashboard.ts`, `settings.ts`) - All have proper auth checks
- RBAC system properly defined with `admin`, `products_manager`, `customer` roles
- PocketBase admin client properly secured with env vars

**🔧 FIXED:**
1. **XSS in BroadcastPage** - `descriptionSection.content` rendered without sanitization
2. **XSS in service-content-section** - Section content rendered without sanitization  
3. **Missing auth in blog.ts** - Admin-only actions (`createPost`, `updatePost`, `deletePost`) used `createAdminClient()` without verifying user permissions

### Recommendations:
- Continue using `DOMPurify.sanitize()` for ALL `dangerouslySetInnerHTML` usage
- All server actions that use `createAdminClient()` MUST call `verifyAdminAccess()` or `verifyInventoryAccess()` first
- Consider adding input validation schemas (Zod) to server actions for defense in depth

---

## [2026-02-03] - Sport Cards Hero Images & Custom SVG Icons

* **Type:** feature
* **Action:** Updated HubIconsGrid component to display sport cards with hero background images and custom SVG icons
* **Logic:** Each sport sub-service now shows its hero image as a cinematic background with gradient overlay for text readability, plus a custom SVG icon replacing generic Lucide icons
* **Files:**
  - `web/src/components/marketing/services/hub-icons-grid.tsx` - Complete rewrite with background images and SVG icons
  - `web/public/images/icons/sports/` - Added 9 sport-specific SVG icons

### Changes Made:
1. **Background Images:** Cards now display service heroImage as full-bleed background with zoom-on-hover effect
2. **Custom SVG Icons:** Replaced Lucide icons with sport-specific SVG icons (athletics, baseball, basketball, combat-sports, cycling, football, motorsports, rugby, tennis)
3. **Overlay Design:** Dark gradient overlay (from-black via-black/70 to-black/40) ensures text readability over images
4. **Improved Layout:** Cards now 320px min-height, content pushed to bottom, icon at top-left
5. **Red Accent Theme:** Consistent red hover effects for borders, shadows, and accent colors

### Icon Mapping:
- athletics.svg → Athletics
- baseball.svg → Baseball  
- basketball.svg → Basketball
- combat-sports.svg → Combat Sports (Boxing, MMA, etc.)
- cycling.svg → Cycling
- football.svg → Football (Soccer)
- motorsports.svg → Motorsports
- rugby.svg → Rugby
- tennis.svg → Tennis
- extreme-sports → Falls back to athletics.svg

---

## [2026-01-30] - Sports Page Enhancements

* **Type:** feature
* **Action:** Enhanced sports page with red hover colors, TFS description section, and Vimeo video slider
* **Logic:** Improved the hub_alt template for sports services with cinematic design elements and comprehensive content
* **Files:**
  - `web/src/components/marketing/services/hub-icons-grid.tsx` - Changed RGB color variants to all red hover effects
  - `web/src/components/marketing/services/hub-content-section.tsx` - Added TFS description text and updated content structure
  - `web/src/components/marketing/services/hub-video-slider.tsx` - Created new Vimeo video slider component
  - `web/src/app/[lng]/(public)/services/[slug]/hub-service-client.tsx` - Added video slider integration

### Changes Made:
1. **Color Scheme:** Updated hub-icons-grid to use consistent red hover effects instead of RGB cycling
2. **Content Enhancement:** Added comprehensive TFS description section with company overview and technology details
3. **Video Integration:** Created HubVideoSlider component with Vimeo video carousel, similar to showcase template composition
4. **Layout Structure:** Added video slider between sub-services carousel and content section for better flow

### Technical Details:
- Video slider uses Vimeo thumbnail API for preview images
- Maintains responsive design with carousel navigation
- Follows existing design system with red accent colors
- Supports both English and French localization