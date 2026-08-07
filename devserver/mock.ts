/**
 * Mock preview API server.
 *
 * Returns hardcoded seed-data-shaped responses so the public-facing UI
 * (calculator, card grid, staff list, country list) renders with real
 * working content during local preview, without needing a live Neon
 * database connection.
 *
 * This file is ONLY used for local preview. Production runs the real
 * serverless handlers in /api/*.ts against the live Neon database.
 *
 * Endpoints mounted:
 *   GET  /api/health
 *   GET  /api/cards
 *   GET  /api/countries
 *   GET  /api/card-rates?cardId=...&countryId=...
 *   GET  /api/staff
 *   GET  /api/site-images
 *   GET  /api/settings
 *   GET  /api/geo            (returns a default country)
 *   POST /api/login          (returns a fake master token)
 *   GET  /api/me             (returns the fake master user)
 *   GET  /api/rates          (passthrough — returns the cards)
 *   ALL  /api/cards?includeInactive=1
 */
import express from "express";

const app = express();
app.use(express.json({ limit: "6mb" }));

const PORT = Number(process.env.PORT ?? 8001);

const now = () => new Date().toISOString();

const CARDS = [
  { id: 1,  brand: "Steam",        slug: "steam",        imageUrl: "", baseRate: 0.82, isActive: true,  category: "gaming",        sortOrder: 1,  updatedAt: now() },
  { id: 2,  brand: "Apple",        slug: "apple",        imageUrl: "", baseRate: 0.80, isActive: true,  category: "digital",       sortOrder: 2,  updatedAt: now() },
  { id: 3,  brand: "Amazon",       slug: "amazon",       imageUrl: "", baseRate: 0.78, isActive: true,  category: "retail",        sortOrder: 3,  updatedAt: now() },
  { id: 4,  brand: "Google Play",  slug: "google-play",  imageUrl: "", baseRate: 0.75, isActive: true,  category: "digital",       sortOrder: 4,  updatedAt: now() },
  { id: 5,  brand: "Xbox",         slug: "xbox",         imageUrl: "", baseRate: 0.79, isActive: true,  category: "gaming",        sortOrder: 5,  updatedAt: now() },
  { id: 6,  brand: "PlayStation",  slug: "playstation",  imageUrl: "", baseRate: 0.81, isActive: true,  category: "gaming",        sortOrder: 6,  updatedAt: now() },
  { id: 7,  brand: "Netflix",      slug: "netflix",      imageUrl: "", baseRate: 0.70, isActive: true,  category: "entertainment", sortOrder: 7,  updatedAt: now() },
  { id: 8,  brand: "Spotify",      slug: "spotify",      imageUrl: "", baseRate: 0.72, isActive: true,  category: "entertainment", sortOrder: 8,  updatedAt: now() },
  { id: 9,  brand: "iTunes",       slug: "itunes",       imageUrl: "", baseRate: 0.80, isActive: true,  category: "digital",       sortOrder: 9,  updatedAt: now() },
  { id: 10, brand: "eBay",         slug: "ebay",         imageUrl: "", baseRate: 0.74, isActive: true,  category: "retail",        sortOrder: 10, updatedAt: now() },
  { id: 11, brand: "Walmart",      slug: "walmart",      imageUrl: "", baseRate: 0.73, isActive: true,  category: "retail",        sortOrder: 11, updatedAt: now() },
  { id: 12, brand: "Target",       slug: "target",       imageUrl: "", baseRate: 0.72, isActive: true,  category: "retail",        sortOrder: 12, updatedAt: now() },
  { id: 13, brand: "Best Buy",     slug: "best-buy",     imageUrl: "", baseRate: 0.71, isActive: true,  category: "retail",        sortOrder: 13, updatedAt: now() },
  { id: 14, brand: "Sephora",      slug: "sephora",      imageUrl: "", baseRate: 0.70, isActive: true,  category: "lifestyle",     sortOrder: 14, updatedAt: now() },
  { id: 15, brand: "Nike",         slug: "nike",         imageUrl: "", baseRate: 0.68, isActive: true,  category: "sportswear",    sortOrder: 15, updatedAt: now() },
  { id: 16, brand: "Adidas",       slug: "adidas",       imageUrl: "", baseRate: 0.67, isActive: true,  category: "sportswear",    sortOrder: 16, updatedAt: now() },
  { id: 17, brand: "Roblox",       slug: "roblox",       imageUrl: "", baseRate: 0.76, isActive: true,  category: "gaming",        sortOrder: 17, updatedAt: now() },
  { id: 18, brand: "American Express", slug: "amex",     imageUrl: "", baseRate: 0.85, isActive: true,  category: "financial",     sortOrder: 18, updatedAt: now() },
  { id: 19, brand: "Visa",         slug: "visa",         imageUrl: "", baseRate: 0.84, isActive: true,  category: "financial",     sortOrder: 19, updatedAt: now() },
  { id: 20, brand: "Mastercard",   slug: "mastercard",   imageUrl: "", baseRate: 0.83, isActive: true,  category: "financial",     sortOrder: 20, updatedAt: now() },
  { id: 21, brand: "Razer Gold",   slug: "razer-gold",   imageUrl: "", baseRate: 0.78, isActive: true,  category: "gaming",        sortOrder: 21, updatedAt: now() },
  { id: 22, brand: "Discord Nitro",slug: "discord",      imageUrl: "", baseRate: 0.74, isActive: true,  category: "digital",       sortOrder: 22, updatedAt: now() },
  { id: 23, brand: "Epic Games",   slug: "epic-games",   imageUrl: "", baseRate: 0.77, isActive: true,  category: "gaming",        sortOrder: 23, updatedAt: now() },
  { id: 24, brand: "Uber",         slug: "uber",         imageUrl: "", baseRate: 0.69, isActive: true,  category: "retail",        sortOrder: 24, updatedAt: now() },
  { id: 25, brand: "Airbnb",       slug: "airbnb",       imageUrl: "", baseRate: 0.66, isActive: true,  category: "lifestyle",     sortOrder: 25, updatedAt: now() },
];

const COUNTRIES = [
  { id: 1,  code: "US", name: "United States",       currencyCode: "USD", currencySymbol: "$",   flagEmoji: "🇺🇸", isActive: true, sortOrder: 1 },
  { id: 2,  code: "VN", name: "Vietnam",             currencyCode: "VND", currencySymbol: "₫",   flagEmoji: "🇻🇳", isActive: true, sortOrder: 2 },
  { id: 3,  code: "NG", name: "Nigeria",             currencyCode: "NGN", currencySymbol: "₦",   flagEmoji: "🇳🇬", isActive: true, sortOrder: 3 },
  { id: 4,  code: "GB", name: "United Kingdom",      currencyCode: "GBP", currencySymbol: "£",   flagEmoji: "🇬🇧", isActive: true, sortOrder: 4 },
  { id: 5,  code: "CA", name: "Canada",              currencyCode: "CAD", currencySymbol: "C$",  flagEmoji: "🇨🇦", isActive: true, sortOrder: 5 },
  { id: 6,  code: "AU", name: "Australia",           currencyCode: "AUD", currencySymbol: "A$",  flagEmoji: "🇦🇺", isActive: true, sortOrder: 6 },
  { id: 7,  code: "IN", name: "India",               currencyCode: "INR", currencySymbol: "₹",   flagEmoji: "🇮🇳", isActive: true, sortOrder: 7 },
  { id: 8,  code: "BR", name: "Brazil",              currencyCode: "BRL", currencySymbol: "R$",  flagEmoji: "🇧🇷", isActive: true, sortOrder: 8 },
  { id: 9,  code: "DE", name: "Germany",             currencyCode: "EUR", currencySymbol: "€",   flagEmoji: "🇩🇪", isActive: true, sortOrder: 9 },
  { id: 10, code: "FR", name: "France",              currencyCode: "EUR", currencySymbol: "€",   flagEmoji: "🇫🇷", isActive: true, sortOrder: 10 },
  { id: 11, code: "ES", name: "Spain",               currencyCode: "EUR", currencySymbol: "€",   flagEmoji: "🇪🇸", isActive: true, sortOrder: 11 },
  { id: 12, code: "PT", name: "Portugal",            currencyCode: "EUR", currencySymbol: "€",   flagEmoji: "🇵🇹", isActive: true, sortOrder: 12 },
  { id: 13, code: "MX", name: "Mexico",              currencyCode: "MXN", currencySymbol: "Mex$",flagEmoji: "🇲🇽", isActive: true, sortOrder: 13 },
  { id: 14, code: "PH", name: "Philippines",         currencyCode: "PHP", currencySymbol: "₱",   flagEmoji: "🇵🇭", isActive: true, sortOrder: 14 },
  { id: 15, code: "GH", name: "Ghana",               currencyCode: "GHS", currencySymbol: "₵",   flagEmoji: "🇬🇭", isActive: true, sortOrder: 15 },
  { id: 16, code: "KE", name: "Kenya",               currencyCode: "KES", currencySymbol: "KSh", flagEmoji: "🇰🇪", isActive: true, sortOrder: 16 },
];

const STAFF = [
  { id: 1, name: "Boss Mandy",     roleLabel: "Co-Founder & CEO",   whatsappNumber: "84779423224", imageUrl: null,                          isActive: true, sortOrder: 1, createdAt: now() },
  { id: 2, name: "Boss Kevin",     roleLabel: "Co-Founder & Director", whatsappNumber: "84779423225", imageUrl: null,                       isActive: true, sortOrder: 2, createdAt: now() },
  { id: 3, name: "Agent Sarah",    roleLabel: "Senior Trader",      whatsappNumber: "84779423226", imageUrl: null,                          isActive: true, sortOrder: 3, createdAt: now() },
  { id: 4, name: "Agent David",    roleLabel: "Support Lead",       whatsappNumber: "84779423227", imageUrl: null,                          isActive: true, sortOrder: 4, createdAt: now() },
];

const SITE_IMAGES: Record<string, string> = {
  founder_mandy: "/founder-mandy.png",
  founder_kevin: "/founder-kevin.png",
};

const SETTINGS: Record<string, string> = {
  whatsapp_number: "84779423224",
};

const FAKE_USER = {
  id: 1,
  username: "preview",
  role: "master" as const,
  createdAt: now(),
};
const FAKE_TOKEN = "preview-token-not-real";

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.get("/api/cards", (req, res) => {
  const includeInactive = req.query.includeInactive === "1";
  const list = includeInactive ? CARDS : CARDS.filter((c) => c.isActive);
  res.json(list);
});

app.get("/api/countries", (_req, res) => {
  res.json(COUNTRIES.filter((c) => c.isActive));
});

app.get("/api/card-rates", (req, res) => {
  const cardId = Number(req.query.cardId);
  const countryId = Number(req.query.countryId);
  const card = CARDS.find((c) => c.id === cardId);
  const country = COUNTRIES.find((c) => c.id === countryId);
  if (!card || !country) {
    res.json([]);
    return;
  }
  // Synthesize a few denomination-based local rates by applying the
  // card's base rate to the face value, then converting into the
  // selected country's currency. This is the same shape the real
  // /api/card-rates endpoint returns.
  const faceValues = [25, 50, 100, 200, 500];
  const fxRate = country.currencyCode === "USD" ? 1 : 24000; // mock FX
  const rates = faceValues.map((fv, i) => ({
    id: cardId * 1000 + i,
    cardId: card.id,
    countryId: country.id,
    faceValue: fv,
    localRate: Math.round(fv * card.baseRate * fxRate),
    isActive: true,
    updatedAt: now(),
    countryCode: country.code,
    countryName: country.name,
    currencyCode: country.currencyCode,
    currencySymbol: country.currencySymbol,
  }));
  res.json(rates);
});

app.get("/api/staff", (_req, res) => {
  res.json(STAFF.filter((s) => s.isActive));
});

app.get("/api/site-images", (_req, res) => {
  res.json(SITE_IMAGES);
});

app.get("/api/settings", (_req, res) => {
  res.json(SETTINGS);
});

app.get("/api/geo", (_req, res) => {
  // Default to United States for the preview.
  res.json({ countryCode: "US" });
});

app.post("/api/login", (req, res) => {
  const { username } = req.body || {};
  if (!username) {
    res.status(400).json({ error: "Username required." });
    return;
  }
  res.json({ token: FAKE_TOKEN, user: { ...FAKE_USER, username } });
});

app.get("/api/me", (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    res.status(401).json({ error: "Not authenticated." });
    return;
  }
  res.json({ user: FAKE_USER });
});

app.get("/api/rates", (_req, res) => {
  res.json(CARDS.filter((c) => c.isActive));
});

app.get("/api/users", (_req, res) => {
  res.json({ users: [FAKE_USER] });
});

app.patch("/api/users", (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword) {
    res.status(400).json({ error: "Current password is required." });
    return;
  }
  if (!newPassword || String(newPassword).length < 6) {
    res.status(400).json({ error: "New password must be at least 6 characters." });
    return;
  }
  res.json({ ok: true });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[mock-api] listening on http://0.0.0.0:${PORT}`);
});
