/**
 * Seed script — connects to Neon via DATABASE_URL and:
 *   1. Creates the master admin user (bringgiftcard / xuanjuanloki) if missing.
 *   2. Inserts the default gift cards if missing.
 *
 * Usage:
 *   1. Set DATABASE_URL and JWT_SECRET in your .env file.
 *   2. Run:  npm run seed
 *
 * This script is safe to run multiple times — it uses ON CONFLICT DO NOTHING.
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("ERROR: DATABASE_URL is not set. Add it to your .env file.");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

const MASTER_USERNAME = "bringgiftcard";
const MASTER_PASSWORD = "xuanjuanloki";

const DEFAULT_CARDS: Array<{
  brand: string;
  slug: string;
  image_url: string;
  base_rate: number;
}> = [
  { brand: "Steam",       slug: "steam",       image_url: "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=600&q=80", base_rate: 0.82 },
  { brand: "Apple",       slug: "apple",       image_url: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80", base_rate: 0.80 },
  { brand: "Amazon",      slug: "amazon",      image_url: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600&q=80", base_rate: 0.78 },
  { brand: "Google Play", slug: "google-play", image_url: "https://images.unsplash.com/photo-1611162617213-7d7a39b930d5?w=600&q=80", base_rate: 0.75 },
  { brand: "Xbox",        slug: "xbox",        image_url: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&q=80", base_rate: 0.79 },
  { brand: "PlayStation", slug: "playstation", image_url: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=600&q=80", base_rate: 0.81 },
  { brand: "Netflix",     slug: "netflix",     image_url: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&q=80", base_rate: 0.70 },
  { brand: "Spotify",     slug: "spotify",     image_url: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=600&q=80", base_rate: 0.72 },
  { brand: "iTunes",      slug: "itunes",      image_url: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&q=80", base_rate: 0.80 },
  { brand: "eBay",        slug: "ebay",        image_url: "https://images.unsplash.com/photo-1599661046827-dacde6976549?w=600&q=80", base_rate: 0.74 },
  { brand: "Walmart",     slug: "walmart",     image_url: "https://images.unsplash.com/photo-1578916171728-46638e163c23?w=600&q=80", base_rate: 0.73 },
  { brand: "Target",      slug: "target",      image_url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80", base_rate: 0.72 },
  { brand: "Best Buy",    slug: "best-buy",    image_url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80", base_rate: 0.71 },
  { brand: "Sephora",     slug: "sephora",     image_url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80", base_rate: 0.70 },
  { brand: "Nike",        slug: "nike",        image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80", base_rate: 0.68 },
  { brand: "Adidas",      slug: "adidas",      image_url: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=600&q=80", base_rate: 0.67 },
  { brand: "Roblox",      slug: "roblox",      image_url: "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=600&q=80", base_rate: 0.76 },
];

async function ensureSchema() {
  console.log("→ Creating schema if not exists…");
  await sql`
    CREATE EXTENSION IF NOT EXISTS pgcrypto
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id            BIGSERIAL PRIMARY KEY,
      username      TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role          TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('master', 'staff')),
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_users_username ON users (username)
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS gift_cards (
      id         BIGSERIAL PRIMARY KEY,
      brand      TEXT NOT NULL,
      slug       TEXT NOT NULL UNIQUE,
      image_url  TEXT NOT NULL,
      base_rate  NUMERIC(5,4) NOT NULL DEFAULT 0.8000 CHECK (base_rate >= 0 AND base_rate <= 1),
      is_active  BOOLEAN NOT NULL DEFAULT TRUE,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_gift_cards_active ON gift_cards (is_active)
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_gift_cards_brand ON gift_cards (brand)
  `;
  console.log("✓ Schema ready.");
}

async function ensureMasterUser() {
  console.log(`→ Ensuring master user "${MASTER_USERNAME}"…`);
  const existing = await sql`SELECT id FROM users WHERE username = ${MASTER_USERNAME}`;
  if (existing.length > 0) {
    console.log("✓ Master user already exists. (Skipping.)");
    return;
  }
  const hash = await bcrypt.hash(MASTER_PASSWORD, 10);
  await sql`
    INSERT INTO users (username, password_hash, role)
    VALUES (${MASTER_USERNAME}, ${hash}, 'master')
  `;
  console.log(`✓ Master user created. (username: ${MASTER_USERNAME})`);
}

async function ensureCards() {
  console.log(`→ Ensuring ${DEFAULT_CARDS.length} gift cards…`);
  for (const c of DEFAULT_CARDS) {
    await sql`
      INSERT INTO gift_cards (brand, slug, image_url, base_rate, is_active)
      VALUES (${c.brand}, ${c.slug}, ${c.image_url}, ${c.base_rate.toFixed(4)}, TRUE)
      ON CONFLICT (slug) DO NOTHING
    `;
  }
  const count = await sql`SELECT COUNT(*)::int AS n FROM gift_cards`;
  console.log(`✓ Gift cards ready. (${count[0].n} rows in table.)`);
}

async function main() {
  console.log("  Bring Gift Card — Database Seed");
  try {
    await ensureSchema();
    await ensureMasterUser();
    await ensureCards();
    console.log("\n✅ Seed complete.");
    console.log("\nNext steps:");
    console.log("  1. Deploy to Vercel.");
    console.log("  2. Open the site, click the hamburger menu → Admin Login.");
    console.log(`  3. Log in with ${MASTER_USERNAME} / ${MASTER_PASSWORD}.`);
  } catch (err) {
    console.error("\n❌ Seed failed:", err);
    process.exit(1);
  }
}

main();
