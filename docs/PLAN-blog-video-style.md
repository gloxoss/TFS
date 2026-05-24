# PLAN-blog-video-style

> **Status**: APPROVED
> **Goal**: Upgrade Blog to support Video Posts and Premium UI ("Cinema Dark" aesthetic)
> **Agent**: `@frontend-specialist`, `@backend-specialist`

## 1. Context & Requirements

**User Request**:
- "Summary how to make ones" (How to create posts/pages)
- "Can I add videos in there" (Add Video Support)
- "Can I make better styling" (Premium UI Upgrade)

**Current State**:
- Simple text/image posts.
- Basic HTML rendering.
- No native video field in schema.
- Basic list styling.

**Objectives**:
1.  **Video Support**: Add first-class support for Video headers (YouTube/Vimeo/MP4).
2.  **Premium Styling**: Redesign Blog List via `ui-ux-pro-max` (Masonry/Grid, Hero Post, Tags).
3.  **Developer Experience**: strict types for new fields.

---

## 2. Technical Architecture

### A. Database Schema (PocketBase)
**Collection**: `posts`
- [x] Existing: `title`, `slug`, `content`, `coverImage`
- [ ] **NEW**: `videoUrl` (text) - URL for YouTube/Vimeo embed
- [ ] **NEW**: `videoFile` (file) - Direct MP4 upload (optional, for exclusives)
- [ ] **NEW**: `type` (select) - `standard`, `video`, `gallery`

### B. Frontend Data Model (`Post` Interface)
```typescript
interface BlogPost {
  // ...existing
  videoUrl?: string; // e.g. "https://youtube.com/watch?v=..."
  postType: 'standard' | 'video'; // Derived from presence of videoUrl
}
```

### C. UI Components
1.  **BlogHero**: Featured post at top (large image/video).
2.  **PostGrid**: Masonry or Bento grid for feed.
3.  **VideoPlayer**: Wrapper for `react-player` or native `<video>`.
4.  **CategoryPill**: Styled badges.

---

## 3. Implementation Steps

### Phase 1: Foundation (Backend & Types)
- [ ] **Step 1.1**: Update `types.ts` to include `videoUrl` and `videoProvider` fields.
- [ ] **Step 1.2**: Update `blogService` to fetch these fields.
- [ ] **Step 1.3**: (Manual) User must add `videoUrl` field to PocketBase `posts` collection.

### Phase 2: Design System (`ui-ux-pro-max`)
- [ ] **Step 2.1**: Run `search.py` for "cinema blog dark mode".
- [ ] **Step 2.2**: Define "Blog Card" variants (Standard, Video, Featured).
- [ ] **Step 2.3**: Define "Article Typography" (Prose overrides).

### Phase 3: Video Integration
- [ ] **Step 3.1**: Create `components/ui/video-player.tsx`.
- [ ] **Step 3.2**: Update `blog/[slug]/page.tsx` to render Video Player if `videoUrl` exists.
- [ ] **Step 3.3**: Handle iframe interactivity and responsiveness.

### Phase 4: Page Redesign
- [ ] **Step 4.1**: Refactor `blog/page.tsx` to use new `PostGrid` layout.
- [ ] **Step 4.2**: Add animations (Framer Motion) for page transitions.
- [ ] **Step 4.3**: "Read More" hover effects.

---

## 4. Operational Guide ("How to make ones")

**To create a Video Post:**
1.  Go to Admin Dashboard > Collections > Posts.
2.  Create New Post.
3.  Fill `Title` and `Content`.
4.  Paste YouTube URL into `videoUrl`.
5.  Upload `coverImage` (used as thumbnail).
6.  Publish.

---

## 5. Verification
- [ ] Verify `videoUrl` fetches correctly.
- [ ] Verify YouTube embeds render responsively.
- [ ] Verify Mobile layout for mixed content.
- [ ] Verify "Cinema Dark" styling matches site theme.
