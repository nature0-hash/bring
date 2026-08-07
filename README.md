# Bring Gift Card — Premium Platform

A premium, enterprise-grade gift card trading platform. Royal Blue & White
fintech aesthetic, 3D hero, scroll-reveal animations, live card grid with
search, JWT-authenticated admin dashboard with rate + user management.

Built with **React 18 + Vite + Tailwind v4 + Framer Motion** on the frontend,
**Vercel Serverless Functions + Neon Postgres** on the backend.

---

## Tech Stack

| Layer        | Tech                                                            |
| ------------ | --------------------------------------------------------------- |
| Frontend     | React 18, Vite 6, TypeScript 5, Tailwind CSS v4, Framer Motion |
| UI           | shadcn/ui (Radix primitives), Lucide icons                      |
| Backend      | Vercel Serverless Functions (Node 20)                           |
| Database     | Neon Postgres (serverless driver `@neondatabase/serverless`)    |
| Auth         | JWT (`jsonwebtoken`) + bcrypt password hashing                  |
| Routing      | `wouter` (lightweight, SSR-friendly)                           |
| Hosting      | Vercel (auto-detected Vite framework)                          |

---

## Project Structure

```
bring-gift-card-pro/
├── api/                      # Vercel serverless functions
│   ├── _lib/
│   │   ├── auth.ts           # JWT + bcrypt helpers
│   │   ├── db.ts             # Neon query helper
│   │   └── http.ts           # CORS + auth middleware
│   ├── cards.ts              # GET  /api/cards            (public)
│   ├── login.ts              # POST /api/login            (public)
│   ├── me.ts                 # GET  /api/me               (auth)
│   ├── rates.ts              # POST|PATCH /api/rates      (auth)
│   └── users.ts              # GET|POST|DELETE /api/users (master)
├── client/
│   ├── index.html
│   ├── public/
│   │   ├── logo-blue.jpg     # Blue tile logo (for light backgrounds)
│   │   └── logo-white.png    # White tile logo (for blue backgrounds)
│   └── src/
│       ├── components/       # Header, Drawer, Hero3D, CardGrid, Footer, …
│       ├── contexts/
│       │   └── AuthContext.tsx
│       ├── lib/
│       │   ├── api.ts        # Typed fetch wrapper for /api
│       │   ├── types.ts
│       │   └── utils.ts
│       ├── pages/
│       │   ├── Home.tsx
│       │   ├── Dashboard.tsx
│       │   └── NotFound.tsx
│       ├── App.tsx
│       ├── main.tsx
│       └── index.css         # Royal Blue design system
├── scripts/
│   └── seed.ts               # Run once to create master user + cards
├── schema.sql                # Plain-SQL schema (alternative to seed.ts)
├── vercel.json
├── vite.config.ts
├── tsconfig.json
├── package.json
└── .env.example
```

---

## Quick Start (Local Dev)

```bash
# 1. Install deps
npm install

# 2. Configure env
cp .env.example .env
# Fill in DATABASE_URL and JWT_SECRET in .env

# 3. Seed the database (creates master user + default cards)
npm run seed

# 4. Start the dev server
npm run dev
# → http://localhost:3000
```

Open the site, click the hamburger icon (top right), scroll to the bottom of
the drawer, click **Admin Login**, and sign in with:

| Username         | Password       | Role   |
| ---------------- | -------------- | ------ |
| `bringgiftcard`  | `xuanjuanloki` | master |

---

## Vercel Deployment — Step-by-Step

### Step 1 — Unzip the project

Unzip `bring-gift-card-pro.zip` somewhere on your computer. You should end up
with a folder called `bring-gift-card-pro/` containing `package.json`,
`vite.config.ts`, `api/`, `client/`, etc.

### Step 2 — Create a Neon database

1. Go to **https://console.neon.tech** and sign up (free).
2. Click **Create Project** → name it `bring-gift-card`.
3. Pick the region closest to your users (default `US East` is fine).
4. On the project dashboard, click **Connection Details**.
5. Copy the **Connection string**. It looks like:
   ```
   postgres://bringgiftcard:abc123def@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
   Save this — it's your `DATABASE_URL`.

### Step 3 — Generate a JWT secret

Open a terminal and run:

```bash
openssl rand -base64 48
```

Copy the output. It will look like `k7Hs9j2K…` (48 chars). This is your
`JWT_SECRET`.

### Step 4 — Seed the database (local, one-time)

You only do this once — to create the master admin user and the default gift
cards.

```bash
cd bring-gift-card-pro
npm install
cp .env.example .env
```

Open `.env` and paste your real values:

```
DATABASE_URL=postgres://bringgiftcard:abc123def@ep-cool-name-…neon.tech/neondb?sslmode=require
JWT_SECRET=k7Hs9j2K…your-generated-secret
```

Then run:

```bash
npm run seed
```

You should see output ending in `✅ Seed complete.` The script:
- Creates the `users` and `gift_cards` tables.
- Inserts the master user `bringgiftcard` (password `xuanjuanloki`).
- Inserts 16 default gift cards with sample rates.

### Step 5 — Upload to a new GitHub repository

1. Go to **https://github.com/new**.
2. Repository name: `bring-gift-card` (or anything you like).
3. Set to **Private** (recommended).
4. **Do not** initialize with README / .gitignore / license (we already have them).
5. Click **Create repository**.
6. In your terminal, from inside `bring-gift-card-pro/`:

```bash
git init
git add .
git commit -m "Initial commit — Bring Gift Card premium platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bring-gift-card.git
git push -u origin main
```

> Verify that **`.env` is NOT committed** — it's in `.gitignore`. The file
> `.env.example` (without secrets) IS committed, which is correct.

### Step 6 — Import into Vercel

1. Go to **https://vercel.com/new**.
2. Under **Import Git Repository**, find `bring-gift-card` and click **Import**.
3. Vercel auto-detects Vite. The defaults should be:
   - **Framework Preset:** Vite
   - **Build Command:** `vite build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)
4. **Do NOT click Deploy yet** — first add environment variables.

### Step 7 — Add environment variables in Vercel

Scroll down to **Environment Variables** and add **two** entries:

| Name           | Value                                                          | Environments           |
| -------------- | -------------------------------------------------------------- | ---------------------- |
| `DATABASE_URL` | `postgres://bringgiftcard:abc123def@ep-….neon.tech/neondb?sslmode=require` | Production, Preview, Development |
| `JWT_SECRET`   | `k7Hs9j2K…your-generated-secret`                               | Production, Preview, Development |

> Tip: check the boxes for **Production**, **Preview**, and **Development**
> for both variables so they work in all deploy contexts.

### Step 8 — Deploy

Click **Deploy**. Vercel will:
1. Run `npm install`.
2. Run `vite build` (builds `client/` → `dist/`).
3. Deploy `api/*.ts` as serverless functions.
4. Serve `dist/` as static assets with SPA fallback to `index.html`.

Build takes ~60 seconds. When it's done, click **Visit** to see your live site.

### Step 9 — Verify

1. **Public site loads** — you should see the premium royal-blue hero, 3D card,
   stats bar, "How it works" steps, and the live gift-card grid with search.
2. **Search works** — type "steam" in the search bar, the grid filters live.
3. **Admin login works** — click the hamburger (top right) → scroll to bottom →
   click **Admin Login** → sign in with `bringgiftcard` / `xuanjuanloki`.
4. **Dashboard renders** — you should see Overview, Rate Management, and User
   Management tabs.
5. **Rate update works** — open Rate Management → pick a card → change the rate
   → click **Update** → go back to the public site (refresh) → the new rate
   shows in the card grid.
6. **User creation works** — open User Management → create a `staff` user → log
   out → log back in as that user → you should NOT see the User Management tab.

If all six checks pass, you're done. 🎉

---

## Environment Variables Reference

| Name           | Required | Description                                  |
| -------------- | -------- | -------------------------------------------- |
| `DATABASE_URL` | ✅ Yes   | Neon Postgres connection string (with `?sslmode=require`) |
| `JWT_SECRET`   | ✅ Yes   | Random string ≥ 32 chars used to sign JWTs   |

That's it. No `PGPASSWORD` needed — Neon's connection string embeds credentials.

---

## Admin Credentials (default)

| Username         | Password       | Role   | Can manage rates? | Can manage users? |
| ---------------- | -------------- | ------ | ----------------- | ----------------- |
| `bringgiftcard`  | `xuanjuanloki` | master | ✅ Yes             | ✅ Yes             |
| (any you create) | (you set)      | staff  | ✅ Yes             | ❌ No              |

> After first login, **create a new master user for yourself and delete the
> default `bringgiftcard` account** for production security.

---

## API Reference

| Method   | Endpoint       | Auth     | Description                          |
| -------- | -------------- | -------- | ------------------------------------ |
| `GET`    | `/api/cards`   | Public   | List active gift cards               |
| `POST`   | `/api/login`   | Public   | Sign in, returns JWT                 |
| `GET`    | `/api/me`      | Bearer   | Get current user                     |
| `POST`   | `/api/rates`   | Bearer   | Update a card's `base_rate`          |
| `PATCH`  | `/api/rates`   | Bearer   | Toggle a card's `is_active`          |
| `GET`    | `/api/users`   | Master   | List all users                       |
| `POST`   | `/api/users`   | Master   | Create a new user                    |
| `DELETE` | `/api/users`   | Master   | Delete a user (cannot delete self)   |

---

## Build Verification

Run these locally before deploying to be 100% sure:

```bash
npm install
npm run check   # tsc --noEmit  — zero TypeScript errors
npm run build   # vite build    — zero build errors, outputs dist/
```

Both commands must exit with code 0 and no warnings. If either fails, fix
before deploying — Vercel will fail the same way.

---

## Troubleshooting

**Build fails on Vercel with "Cannot find module @neondatabase/serverless"**
→ `npm install` didn't run. Make sure `package.json` is at the repo root and
`@neondatabase/serverless` is in `dependencies` (not `devDependencies`).

**Login fails with "DATABASE_URL is not configured"**
→ The env var isn't set in Vercel. Go to Project Settings → Environment
Variables and add it (see Step 7).

**Login fails with "Invalid username or password"**
→ You didn't run the seed script. Run `npm run seed` locally with
`DATABASE_URL` pointing to your Neon DB. Verify with:
```sql
SELECT username, role FROM users;
```

**Cards don't load on the public site**
→ Same cause as above. The seed script inserts the cards. Verify with:
```sql
SELECT brand, is_active FROM gift_cards;
```

**Rate update succeeds but the public site shows old rates**
→ Hard refresh the page (Cmd+Shift+R / Ctrl+Shift+R). The cards endpoint
returns fresh data on every request — there's no caching layer.

**3D hero looks flat on mobile**
→ The 3D hero is hidden on screens < `lg` breakpoint for performance. The
mobile hero still has all the copy and CTAs.

---

## License

MIT — Built for Bring Gift Card.
