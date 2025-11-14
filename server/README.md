<h1 align="center">APECK CMS API</h1>

This NestJS service powers the editable content experience for the public site. It exposes secure REST endpoints backed by MySQL/MariaDB (via Knex) so every page section, media asset, route alias, and article can be managed from an admin UI.

## Stack

- **Runtime:** Node 20 / NestJS 11
- **Database:** MySQL or MariaDB (direct SQL through Knex.js)
- **Auth:** JWT access + refresh tokens, bcrypt-hashed passwords, session tracking table
- **Schema:** `users`, `user_sessions`, `media_assets`, `pages`, `page_sections`, `routes`, `news_posts`, `events`, `programs`, `membership_plans`

## Getting started

```bash
cd server
npm install
cp env.sample .env.local   # fill in DB + JWT secrets
npm run migrate:latest     # creates tables in DB_NAME
npm run start:dev          # http://localhost:4000/api
```

The app reads configuration from `.env.local` (dev) or `.env` (prod). Update DB credentials and JWT secrets before booting.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run start:dev` | Start Nest in watch mode |
| `npm run start` | Start once (no watch) |
| `npm run build` | Compile to `dist/` |
| `npm run migrate:make -- <name>` | Create a new Knex migration |
| `npm run migrate:latest` | Apply migrations |
| `npm run migrate:rollback` | Roll back last migration batch |

## API surface (initial)

| Method / Route | Description |
| --- | --- |
| `POST /api/auth/login` | Email/password login, returns access + refresh tokens |
| `POST /api/auth/refresh` | Exchange refresh token for new tokens |
| `POST /api/auth/logout` | Revoke refresh session |
| `GET /api/pages` | List active route aliases (`routes` table) |
| `GET /api/pages/:slug` | Fetch published page + sections |

Additional modules (news, events, programs, membership, media manager, admin CRUD) plug into the same pattern—use Knex via injected connection and protect mutating endpoints with `JwtAuthGuard` + role checks.

## Content model highlights

- **Pages & Sections**: Each page slug has ordered JSON sections with `draft/published` states so editors can stage changes.
- **Media assets**: Stores metadata + URLs (pointing to S3/Cloudinary/etc.). Link via foreign keys.
- **Dynamic routes**: `routes` table lets admins remap `/about` → `about-us` etc. The frontend can fetch once and hydrate React Router.
- **Collections**: `news_posts`, `events`, `programs`, `membership_plans` cover homepage sliders, news feeds, membership tiers, etc.

## Next steps

1. Seed at least one admin user (temporary script or INSERT) so you can log into the admin SPA.
2. Build the `/admin` React client that consumes these endpoints (e.g., Vite + TanStack Query).
3. Expand modules with CRUD controllers + DTOs for every collection, guarded by roles.
4. Integrate media uploads (S3/Cloudinary) and store resulting URLs in `media_assets`.
5. Wire the public-facing React pages to fetch data from `/api/pages/:slug` instead of hard-coded JSON.

This README replaces the Nest starter boilerplate and should stay current as the CMS grows. Feel free to add ERDs, admin workflows, or deployment docs as additional sections.
