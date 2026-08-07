# Bring Gift Card — PRD & Project State

## Original request
Existing project ("Bring Gift Card" — premium gift card trading platform). User asked to build/run everything as-is to preview it live in this environment and decide on changes.

## Architecture
- **Frontend:** React 18 + Vite 6 + TypeScript + Tailwind v4 + Framer Motion + wouter. Root at `client/`.
- **Backend (production):** Vercel serverless functions in `api/*.ts` + Neon Postgres (`@neondatabase/serverless`).
- **Auth:** JWT (jsonwebtoken) + bcryptjs. Roles: `master`, `staff`.
- **DB tables:** `users`, `gift_cards`.

## Preview setup in THIS environment (Emergent container)
Supervisor's default `backend` (uvicorn) / `frontend` (yarn) programs don't fit this Node stack, so:
- `/etc/supervisor/conf.d/node_app.conf` adds `node_backend` (tsx watch `devserver/index.ts` on :8001) and `node_frontend` (vite on :3000). Default `backend`/`frontend` are stopped (show FATAL — harmless).
- `devserver/index.ts` mounts the Vercel handlers on an Express server for local preview only (production still uses Vercel functions).
- `api/_lib/db.ts` now supports BOTH drivers behind one `sql` interface: Neon (production) and node-postgres `pg` (local, triggered by `USE_PG=1` or localhost DATABASE_URL). **Neon/Vercel deploy path is unchanged.**
- Local Postgres seeded via `scripts/seed-local.ts` (17 cards + master user). `.env` holds local `DATABASE_URL`, `JWT_SECRET`, `USE_PG=1`.

## Implemented / verified (2026-08-01)
- Public home: hero, 3D floating cards, stats, live 17-card grid from `GET /api/cards`, live search filter. ✅
- Admin login (master) via drawer → Dashboard with Overview / Rate Management / User Management tabs. ✅
- Rate update (`POST /api/rates`), active toggle (`PATCH /api/rates`). ✅
- User management (`GET/POST/DELETE /api/users`, master-only). ✅
- Backend: 13/13 pytest pass; Frontend: 6/6 flows pass. No blocking bugs.

## Backlog / notes
- No `data-testid` attributes anywhere (low E2E testability) — add if more automated testing is planned.
- Framer Motion "non-static position" console warning on modal/drawer open (non-blocking).
- To deploy: follow README (Neon + Vercel). This env's preview is for review only.

## Update (2026-08-01) — Session 2
- Google Play hero card logo replaced with clean 4-color play triangle.
- Card grid now uses branded gift-card artwork (BrandCardArt.tsx) for all 17 brands instead of stock photos.
- Hero background watermark enlarged (1400px, opacity 0.16).
- Header redesigned: always-light frosted bar + circular logo badge (Logo.tsx onLight) + "Bring Gift Card" wordmark; removed transparent/scrolled variant.
- Fixed "Browse live rates" button: Hero3D overlay motion.div was intercepting clicks — added pointer-events-none. Button + "See live rates" use scrollToCards() smooth scroll.
- About section rebuilt into two cards: (left) About us "A premium company, built on trust." + "Our promise" retitled "Bring Gift Card"; (right) "Meet Our Founders" with Boss Mandy (Co-Founder & CEO) and Boss Kevin (Co-Founder & Director). Founder photos: /founder-mandy.png, /founder-kevin.png.
