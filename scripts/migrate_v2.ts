/**
 * Migration v2 — adds the new "control panel" schema on top of the existing
 * users/gift_cards tables. Safe to run multiple times (idempotent).
 *
 * Adds:
 *   - gift_cards.category, gift_cards.sort_order  (existing rows are ONLY
 *     given a category label — brand, slug, image_url, base_rate, is_active
 *     are never touched)
 *   - countries          (list of countries + currency for rate targeting)
 *   - card_rates         (flexible face-value → local-currency payout rows)
 *   - staff              (team members: name, whatsapp, photo)
 *   - site_images        (admin-editable images, e.g. founder photos)
 *   - system_settings    (key/value config, e.g. main WhatsApp number)
 *   - 7 new gift cards to round out all 7 categories (24 cards total)
 *
 * Usage:
 *   npm run migrate
 */
import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("ERROR: DATABASE_URL is not set. Add it to your .env file.");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

/* 1. New / altered tables */

async function migrateSchema() {
  console.log("→ Altering gift_cards (category, sort_order)…");
  await sql`ALTER TABLE gift_cards ADD COLUMN IF NOT EXISTS category TEXT`;
  await sql`ALTER TABLE gift_cards ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0`;
  await sql`CREATE INDEX IF NOT EXISTS idx_gift_cards_category ON gift_cards (category)`;

  console.log("→ Creating countries table…");
  await sql`
    CREATE TABLE IF NOT EXISTS countries (
      id              BIGSERIAL PRIMARY KEY,
      code            CHAR(2) NOT NULL UNIQUE,
      name            TEXT NOT NULL,
      currency_code   CHAR(3) NOT NULL,
      currency_symbol TEXT NOT NULL,
      flag_emoji      TEXT,
      is_active       BOOLEAN NOT NULL DEFAULT TRUE,
      sort_order      INT NOT NULL DEFAULT 0
    )
  `;

  console.log("→ Creating card_rates table (flexible face-value/local-rate pairs)…");
  await sql`
    CREATE TABLE IF NOT EXISTS card_rates (
      id          BIGSERIAL PRIMARY KEY,
      card_id     BIGINT NOT NULL REFERENCES gift_cards(id) ON DELETE CASCADE,
      country_id  BIGINT NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
      face_value  NUMERIC(10,2) NOT NULL CHECK (face_value > 0),
      local_rate  NUMERIC(15,2) NOT NULL CHECK (local_rate >= 0),
      is_active   BOOLEAN NOT NULL DEFAULT TRUE,
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (card_id, country_id, face_value)
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_card_rates_card ON card_rates (card_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_card_rates_country ON card_rates (country_id)`;

  console.log("→ Creating staff table…");
  await sql`
    CREATE TABLE IF NOT EXISTS staff (
      id              BIGSERIAL PRIMARY KEY,
      name            TEXT NOT NULL,
      role_label      TEXT,
      whatsapp_number TEXT NOT NULL,
      image_url       TEXT,
      is_active       BOOLEAN NOT NULL DEFAULT TRUE,
      sort_order      INT NOT NULL DEFAULT 0,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  console.log("→ Creating site_images table…");
  await sql`
    CREATE TABLE IF NOT EXISTS site_images (
      id         BIGSERIAL PRIMARY KEY,
      key        TEXT NOT NULL UNIQUE,
      image_url  TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  console.log("→ Creating system_settings table…");
  await sql`
    CREATE TABLE IF NOT EXISTS system_settings (
      id          BIGSERIAL PRIMARY KEY,
      key         TEXT NOT NULL UNIQUE,
      value       TEXT NOT NULL,
      description TEXT,
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  console.log("✓ Schema v2 ready.");
}

/* 2. Seed countries */

const COUNTRIES: Array<{
  code: string;
  name: string;
  currency_code: string;
  currency_symbol: string;
  flag_emoji: string;
  sort_order: number;
}> = [
  { code: "NG", name: "Nigeria",       currency_code: "NGN", currency_symbol: "₦", flag_emoji: "🇳🇬", sort_order: 1 },
  { code: "US", name: "United States", currency_code: "USD", currency_symbol: "$", flag_emoji: "🇺🇸", sort_order: 2 },
  { code: "GB", name: "United Kingdom",currency_code: "GBP", currency_symbol: "£", flag_emoji: "🇬🇧", sort_order: 3 },
  { code: "GH", name: "Ghana",         currency_code: "GHS", currency_symbol: "₵", flag_emoji: "🇬🇭", sort_order: 4 },
  { code: "KE", name: "Kenya",         currency_code: "KES", currency_symbol: "KSh", flag_emoji: "🇰🇪", sort_order: 5 },
  { code: "ZA", name: "South Africa",  currency_code: "ZAR", currency_symbol: "R", flag_emoji: "🇿🇦", sort_order: 6 },
  { code: "CA", name: "Canada",        currency_code: "CAD", currency_symbol: "$", flag_emoji: "🇨🇦", sort_order: 7 },
  { code: "IN", name: "India",         currency_code: "INR", currency_symbol: "₹", flag_emoji: "🇮🇳", sort_order: 8 },
  { code: "PK", name: "Pakistan",      currency_code: "PKR", currency_symbol: "₨", flag_emoji: "🇵🇰", sort_order: 9 },
  { code: "PH", name: "Philippines",   currency_code: "PHP", currency_symbol: "₱", flag_emoji: "🇵🇭", sort_order: 10 },
  { code: "EG", name: "Egypt",         currency_code: "EGP", currency_symbol: "£E", flag_emoji: "🇪🇬", sort_order: 11 },
  { code: "AE", name: "United Arab Emirates", currency_code: "AED", currency_symbol: "د.إ", flag_emoji: "🇦🇪", sort_order: 12 },
  { code: "CM", name: "Cameroon",      currency_code: "XAF", currency_symbol: "FCFA", flag_emoji: "🇨🇲", sort_order: 13 },
  { code: "EU", name: "Eurozone",      currency_code: "EUR", currency_symbol: "€", flag_emoji: "🇪🇺", sort_order: 14 },
];

async function seedCountries() {
  console.log(`→ Ensuring ${COUNTRIES.length} countries…`);
  for (const c of COUNTRIES) {
    await sql`
      INSERT INTO countries (code, name, currency_code, currency_symbol, flag_emoji, is_active, sort_order)
      VALUES (${c.code}, ${c.name}, ${c.currency_code}, ${c.currency_symbol}, ${c.flag_emoji}, TRUE, ${c.sort_order})
      ON CONFLICT (code) DO NOTHING
    `;
  }
  console.log("✓ Countries ready.");
}

/* 3. Categorize existing cards (no other field touched) */

const CATEGORY_BY_SLUG: Record<string, string> = {
  // Gaming
  steam: "gaming",
  xbox: "gaming",
  playstation: "gaming",
  roblox: "gaming",
  // Digital & Software
  apple: "digital",
  "google-play": "digital",
  itunes: "digital",
  // Retail & Shopping
  amazon: "retail",
  ebay: "retail",
  walmart: "retail",
  target: "retail",
  "best-buy": "retail",
  // Entertainment & Streaming
  netflix: "entertainment",
  spotify: "entertainment",
  // Sportswear
  nike: "sportswear",
  adidas: "sportswear",
  // Beauty & Lifestyle
  sephora: "lifestyle",
};

async function categorizeExistingCards() {
  console.log("→ Assigning categories to existing cards (no other fields touched)…");
  let n = 0;
  for (const [slug, category] of Object.entries(CATEGORY_BY_SLUG)) {
    const res = await sql`
      UPDATE gift_cards SET category = ${category}
      WHERE slug = ${slug} AND category IS NULL
    `;
    n += (res as unknown as { length?: number }).length ? 1 : 0;
  }
  console.log(`✓ Categorized ${Object.keys(CATEGORY_BY_SLUG).length} existing cards.`);
}

/* 4. New cards — fills out Gaming + Financial categories */

const NEW_CARDS: Array<{
  brand: string;
  slug: string;
  image_url: string;
  base_rate: number;
  category: string;
}> = [
  { brand: "Discord Nitro",     slug: "discord",     image_url: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=600&q=80", base_rate: 0.75, category: "gaming" },
  { brand: "Epic Games",        slug: "epic-games",  image_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80", base_rate: 0.77, category: "gaming" },
  { brand: "Uber",              slug: "uber",        image_url: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80", base_rate: 0.73, category: "lifestyle" },
  { brand: "Airbnb",            slug: "airbnb",      image_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80", base_rate: 0.75, category: "lifestyle" },
  { brand: "Visa Prepaid",      slug: "visa",        image_url: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=600&q=80", base_rate: 0.85, category: "financial" },
  { brand: "Mastercard Prepaid",slug: "mastercard",  image_url: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=600&q=80", base_rate: 0.84, category: "financial" },
  { brand: "American Express",  slug: "amex",        image_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80", base_rate: 0.83, category: "financial" },
];

async function seedNewCards() {
  console.log(`→ Ensuring ${NEW_CARDS.length} new gift cards (Gaming/Lifestyle/Financial)…`);
  for (const c of NEW_CARDS) {
    await sql`
      INSERT INTO gift_cards (brand, slug, image_url, base_rate, is_active, category)
      VALUES (${c.brand}, ${c.slug}, ${c.image_url}, ${c.base_rate.toFixed(4)}, TRUE, ${c.category})
      ON CONFLICT (slug) DO NOTHING
    `;
  }
  const count = await sql`SELECT COUNT(*)::int AS n FROM gift_cards`;
  console.log(`✓ Gift cards ready. (${(count[0] as { n: number }).n} rows in table.)`);
}

/* 5. Default system settings */

async function seedSettings() {
  console.log("→ Ensuring default system settings…");
  await sql`
    INSERT INTO system_settings (key, value, description)
    VALUES ('whatsapp_number', '84779423224', 'Main WhatsApp contact number (with country code, no + or spaces)')
    ON CONFLICT (key) DO NOTHING
  `;
  console.log("✓ Settings ready.");
}

/* main */

async function main() {
  console.log("  Bring Gift Card — Migration v2");
  try {
    await migrateSchema();
    await seedCountries();
    await categorizeExistingCards();
    await seedNewCards();
    await seedSettings();
    console.log("\n✅ Migration v2 complete.");
  } catch (err) {
    console.error("\n❌ Migration failed:", err);
    process.exit(1);
  }
}

main();
