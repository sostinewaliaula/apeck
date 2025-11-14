# APECK CMS Admin Rollout Plan

This document captures the content models, API surfaces, and admin navigation structure we’ll implement over the next iterations so the React site becomes fully CMS-driven.

## 1. Core Collections

| Collection | Purpose | Key Fields | Status |
| --- | --- | --- | --- |
| `routes` | Map pretty slugs to underlying React route targets. | `slug`, `target`, `is_active` | **Read-only UI done.** CRUD next. |
| `pages` | Store top-level page metadata (title, SEO, hero image). | `slug`, `title`, `seo_title`, `seo_description`, `featured_media_id`, `status` | API read ready (`GET /api/pages/:slug`). Need admin CRUD + publish workflow. |
| `page_sections` | Ordered JSON blocks per page (hero, stats, CTA). | `page_id`, `key`, `display_order`, `content`, `status` | Schema exists. Need API + visual editor. |
| `programs` | Program cards + detail content. | `title`, `slug`, `summary`, `body`, `hero_media_id`, `status`, `metadata` | Requires admin list + detail editing. |
| `events` | News & events timeline. | `title`, `slug`, `description`, `start_date`, `end_date`, `location`, `status` | Requires CRUD + calendar display. |
| `news_posts` | Articles for “Latest News”. | `title`, `slug`, `excerpt`, `body`, `hero_media_id`, `status`, `published_at`, `author_id` | Need scheduler + preview. |
| `membership_plans` | Manage membership tiers. | `name`, `slug`, `fee_amount`, `currency`, `description`, `benefits`, `requirements`, `status` | Minimal UI needed (3 tiers). |
| `media_assets` | Media library for hero/background images. | `file_name`, `url`, `alt_text`, `width`, `height`, `category` | Later integration with Cloudinary/S3. |

## 2. API Milestones (server)

1. **Routes Module**
   - `GET /api/admin/routes` (done indirectly via `/api/pages`)
   - `POST /api/admin/routes` (create slug)
   - `PATCH /api/admin/routes/:id` (update target/status)
   - `DELETE /api/admin/routes/:id`

2. **Pages + Sections**
   - `GET /api/admin/pages` (list)
   - `GET /api/admin/pages/:id`
   - `POST /api/admin/pages`
   - `PATCH /api/admin/pages/:id`
   - `POST /api/admin/pages/:id/sections` (create block)
   - `PATCH /api/admin/page-sections/:id`
   - `POST /api/admin/pages/:id/publish` (copy draft → published)

3. **Programs / News / Events**
   - Standard CRUD endpoints + media linking.

4. **Membership Plans**
   - Light CRUD (mostly text + pricing).

## 3. Admin Navigation Plan

| Nav Group | Route | Notes |
| --- | --- | --- |
| Overview | `/admin` | KPI cards + roadmap (done). |
| Routes | `/admin/routes` | Table now live. Editing to follow after server endpoints. |
| Pages | `/admin/pages` | List + detail editor with section builder. |
| Programs | `/admin/programs` | Manage cards + detail copy. |
| News & Events | `/admin/news`, `/admin/events` | Combined listing with filters. |
| Membership | `/admin/membership` | Manage plan copy + fees. |
| Media | `/admin/media` | Upload + re-use assets. |
| Settings | `/admin/settings` | Manage hero backgrounds, theme toggles, meta. |

### Navigation rollout order
1. Routes (CRUD) ✔ in progress.
2. Pages (list + detail + sections) → **next focus.**
3. Programs + News modules (since they power multiple pages).
4. Media manager (enables image selection for all modules).

## 4. Frontend Admin Components Needed

- **Data grid** (sortable table w/ filters) for routes, pages, programs.
- **Drawer modal** to edit metadata quickly.
- **Section builder**: reorder blocks, edit JSON schema via form (hero, stats, gallery, etc.).
- **Rich text/markdown editor** for news + program body.
- **Media picker** dialog once the library is ready.

## 5. Implementation Steps (next sprint)

1. Backend: add `/api/admin/routes` CRUD + protect with `JwtAuthGuard`.
2. Frontend: convert route table to TanStack Query + mutation modals (Create, Edit, Toggle status).
3. Backend: add `/api/admin/pages` list/create/update + `/api/admin/page-sections`.
4. Frontend: scaffold `/admin/pages` screen using layout cards, detail view, section editor.

With this plan, we can iterate module by module while keeping the admin shell consistent. Let me know if you want a visual sitemap or ERD added next.

