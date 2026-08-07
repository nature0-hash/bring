-- BRING GIFT CARD — NEON POSTGRES SCHEMA
-- Run this in your Neon SQL editor (https://console.neon.tech) before deploying.

-- Optional: create a dedicated role for the app (recommended).
-- CREATE ROLE bringgiftcard LOGIN PASSWORD 'YOUR_SECURE_PASSWORD';
-- GRANT ALL ON SCHEMA public TO bringgiftcard;

-- Enable extension for crypt() — Neon supports pgcrypto out of the box.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id            BIGSERIAL PRIMARY KEY,
  username      TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('master', 'staff')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);

-- GIFT CARDS
CREATE TABLE IF NOT EXISTS gift_cards (
  id         BIGSERIAL PRIMARY KEY,
  brand      TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  image_url  TEXT NOT NULL,
  base_rate  NUMERIC(5,4) NOT NULL DEFAULT 0.8000 CHECK (base_rate >= 0 AND base_rate <= 1),
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gift_cards_active ON gift_cards (is_active);
CREATE INDEX IF NOT EXISTS idx_gift_cards_brand  ON gift_cards (brand);

-- SEED: master admin  (password: xuanjuanloki)
-- ⚠️  We hash the password with bcrypt cost=10 to match the API's bcryptjs
-- output. Run `npm run seed` from your local machine to insert this row
-- with a properly-hashed password. If you can't run the seed script, you
-- can use this SQL but you MUST replace the placeholder hash with a real
-- bcrypt hash of 'xuanjuanloki' — otherwise login will fail.
--
-- INSERT INTO users (username, password_hash, role)
-- VALUES ('bringgiftcard', '$2a$10$REPLACE_WITH_REAL_BCRYPT_HASH', 'master')
-- ON CONFLICT (username) DO NOTHING;

-- SEED: gift cards
INSERT INTO gift_cards (brand, slug, image_url, base_rate, is_active)
VALUES
  ('Steam',          'steam',          'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=600&q=80', 0.82, TRUE),
  ('Apple',          'apple',          'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80', 0.80, TRUE),
  ('Amazon',         'amazon',         'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600&q=80', 0.78, TRUE),
  ('Google Play',    'google-play',    'https://images.unsplash.com/photo-1611162617213-7d7a39b930d5?w=600&q=80', 0.75, TRUE),
  ('Xbox',           'xbox',           'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&q=80', 0.79, TRUE),
  ('PlayStation',    'playstation',    'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=600&q=80', 0.81, TRUE),
  ('Netflix',        'netflix',        'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&q=80', 0.70, TRUE),
  ('Spotify',        'spotify',        'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=600&q=80', 0.72, TRUE),
  ('iTunes',         'itunes',         'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&q=80', 0.80, TRUE),
  ('eBay',           'ebay',           'https://images.unsplash.com/photo-1599661046827-dacde6976549?w=600&q=80', 0.74, TRUE),
  ('Walmart',        'walmart',        'https://images.unsplash.com/photo-1578916171728-46638e163c23?w=600&q=80', 0.73, TRUE),
  ('Target',         'target',         'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&q=80', 0.72, TRUE),
  ('Best Buy',       'best-buy',       'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80', 0.71, TRUE),
  ('Macy''s',        'macys',          'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80', 0.69, TRUE),
  ('Visa',           'visa',           'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=600&q=80', 0.85, TRUE),
  ('Mastercard',     'mastercard',     'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=600&q=80', 0.84, TRUE),
  ('Sephora',        'sephora',        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80', 0.70, TRUE),
  ('Nike',           'nike',           'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', 0.68, TRUE),
  ('Adidas',         'adidas',         'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=600&q=80', 0.67, TRUE),
  ('Roblox',         'roblox',         'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=600&q=80', 0.76, TRUE)
ON CONFLICT (slug) DO NOTHING;
