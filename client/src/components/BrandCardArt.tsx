/**
 * BrandCardArt renders a realistic, brand-styled gift-card face for each
 * brand (real brand colors + iconic marks / wordmarks) instead of a stock
 * photo. Keyed by card slug; falls back to a branded initial tile.
 *
 * Rendered full-bleed inside the CardTile image area (~1.7:1).
 */

interface Props {
  slug: string;
  brand: string;
}

function Face({
  bg,
  children,
}: {
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 overflow-hidden"
      style={{ background: bg }}
    >
      {/* subtle top sheen for depth */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0))",
        }}
      />
      {children}
    </div>
  );
}

export function BrandCardArt({ slug, brand }: Props) {
  switch (slug) {
    case "steam":
      /* Inspired by the classic physical Steam card: a collage of game
         artwork tiles behind the big white Steam logo + STEAM wordmark. */
      return (
        <Face bg="#0e1c2e">
          <div className="pointer-events-none absolute inset-0 grid grid-cols-6 grid-rows-3 gap-[2px] opacity-55">
            {[
              "#7a3b2e", "#2d4a6b", "#4a2d5e", "#1f5c46", "#6b4a1f", "#3b2d6b",
              "#5e2d3a", "#2d5e5a", "#6b5e2d", "#46315e", "#315e39", "#5e3131",
              "#31465e", "#5e4631", "#3a5e2d", "#5e2d52", "#2d3a5e", "#4f5e2d",
            ].map((c, i) => (
              <div
                key={i}
                style={{
                  background: `linear-gradient(${135 + (i % 4) * 45}deg, ${c}, rgba(10,18,30,0.9))`,
                }}
              />
            ))}
          </div>
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 42%, rgba(10,20,32,0.25), rgba(8,15,26,0.85) 80%)",
            }}
          />
          <svg viewBox="0 0 88 88" className="relative h-12 w-12 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]" aria-hidden>
            <circle cx="30" cy="55" r="16" fill="none" stroke="#ffffff" strokeOpacity="0.9" strokeWidth="3" />
            <circle cx="57" cy="27" r="13" fill="#ffffff" />
            <circle cx="57" cy="27" r="6.2" fill="#0e1c2e" />
            <rect x="31" y="42" width="20" height="5.4" rx="2.7" fill="#ffffff" transform="rotate(-32 41 44.5)" />
            <circle cx="30" cy="55" r="9" fill="#ffffff" />
            <circle cx="30" cy="55" r="4" fill="#0e1c2e" />
          </svg>
          <span className="relative font-display text-2xl font-extrabold tracking-[0.18em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            STEAM
          </span>
        </Face>
      );

    case "razer-gold":
    case "razer":
      /* Inspired by the official Razer Gold card: black face, green
         diagonal wedge top-left, gold coin, "RAZER Gold" lockup. */
      return (
        <Face bg="linear-gradient(150deg, #1c1c1c 0%, #0a0a0a 55%, #000000 100%)">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(125deg, #44D62C 0%, #3bc026 24%, transparent 24.5%)",
            }}
          />
          <div className="relative flex items-center gap-3">
            <svg viewBox="0 0 64 64" className="h-14 w-14 drop-shadow-[0_3px_8px_rgba(0,0,0,0.7)]" aria-hidden>
              <defs>
                <radialGradient id="rz-coin" cx="38%" cy="32%" r="75%">
                  <stop offset="0%" stopColor="#ffe98a" />
                  <stop offset="55%" stopColor="#f5c518" />
                  <stop offset="100%" stopColor="#b8860b" />
                </radialGradient>
              </defs>
              <circle cx="32" cy="32" r="30" fill="url(#rz-coin)" />
              <circle cx="32" cy="32" r="24" fill="none" stroke="#8a6508" strokeWidth="1.6" />
              <path
                d="M22 20 h20 l-13 10 h11 l-2 4 h-9 l13 10 h-20 l2-4 h10 l-14-11 h12 l2-3 h-14 Z"
                fill="#7a5a06"
                opacity="0.9"
              />
            </svg>
            <div className="flex flex-col items-start leading-none">
              <span className="font-display text-sm font-bold uppercase tracking-[0.42em] text-[#44D62C]">
                Razer
              </span>
              <span className="mt-1 font-display text-3xl font-semibold tracking-tight text-white">
                Gold
              </span>
            </div>
          </div>
        </Face>
      );

    case "discord":
      return (
        <Face bg="linear-gradient(135deg, #5865F2, #3a45c4)">
          <svg viewBox="0 0 48 48" className="h-14 w-14" aria-hidden>
            <path
              d="M17 15c4.7-2.2 9.3-2.2 14 0l.7 1.4c1.5 3.3 2.3 7 2.3 10.9 0 0-2.7 2.2-6.5 2.7l-.9-1.8c1.4-.4 2.6-1 3.6-1.7-.3-.2-.6-.4-.9-.6-4.7 2.2-9.6 2.2-14.3 0-.3.2-.6.4-.9.6 1 .7 2.2 1.3 3.6 1.7l-.9 1.8c-3.8-.5-6.5-2.7-6.5-2.7 0-3.9.8-7.6 2.3-10.9L17 15Z"
              fill="#fff"
            />
            <circle cx="18.5" cy="24.5" r="2.2" fill="#5865F2" />
            <circle cx="29.5" cy="24.5" r="2.2" fill="#5865F2" />
          </svg>
          <span className="font-display text-xl font-extrabold tracking-tight text-white">Discord</span>
        </Face>
      );

    case "epic-games":
    case "epic":
      return (
        <Face bg="linear-gradient(135deg, #2a2a2a, #0e0e0e)">
          <svg viewBox="0 0 48 48" className="h-14 w-14" aria-hidden>
            <rect x="7" y="7" width="34" height="34" rx="6" fill="#fff" />
            <path d="M14 15 h20 v4 h-14 v5 h12 v4 h-12 v5 h14 v4 h-20 Z" fill="#111" />
          </svg>
          <span className="font-display text-lg font-extrabold uppercase tracking-[0.1em] text-white">Epic Games</span>
        </Face>
      );

    case "uber":
      return (
        <Face bg="#000000">
          <span className="font-display text-4xl font-black uppercase tracking-tight text-white">Uber</span>
        </Face>
      );

    case "airbnb":
      return (
        <Face bg="linear-gradient(135deg, #ffffff, #fff5f6)">
          <svg viewBox="0 0 48 48" className="h-14 w-14" aria-hidden>
            <path
              d="M24 6c1.6 0 3 1 4 2.7 3.3 5.5 10.9 17.6 10.9 23.1 0 6-4.7 10.6-10.6 10.6-1.6 0-3.1-.4-4.3-1-1.2.6-2.7 1-4.3 1C13.7 42.4 9 37.8 9 31.8 9 26.3 16.6 14.2 19.9 8.7 20.9 7 22.3 6 24 6Z"
              fill="#FF5A5F"
            />
          </svg>
          <span className="font-display text-xl font-bold tracking-tight text-[#FF5A5F]">airbnb</span>
        </Face>
      );

    case "visa":
      return (
        <Face bg="linear-gradient(135deg, #1A1F71, #0c1050)">
          <span
            className="font-display text-4xl font-black italic tracking-tight text-white"
            style={{ fontFamily: "Georgia, serif" }}
          >
            VISA
          </span>
        </Face>
      );

    case "mastercard":
      return (
        <Face bg="linear-gradient(135deg, #1a1a1a, #000)">
          <svg viewBox="0 0 60 36" className="h-12 w-20" aria-hidden>
            <circle cx="22" cy="18" r="16" fill="#EB001B" />
            <circle cx="38" cy="18" r="16" fill="#F79E1B" />
            <path d="M30 6a16 16 0 0 1 0 24 16 16 0 0 1 0-24Z" fill="#FF5F00" />
          </svg>
          <span className="font-display text-base font-bold tracking-tight text-white">Mastercard</span>
        </Face>
      );

    case "amex":
    case "american-express":
      /* The classic American Express blue-box logo: royal-blue square
         with stacked white "AMERICAN EXPRESS" lettering. */
      return (
        <Face bg="linear-gradient(140deg, #2E77BC 0%, #006FCF 45%, #00487A 100%)">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 22% 18%, rgba(255,255,255,0.20), transparent 45%)",
            }}
          />
          <svg viewBox="0 0 96 96" className="relative h-[72px] w-[72px] drop-shadow-[0_4px_12px_rgba(0,20,50,0.45)]" aria-hidden>
            <rect x="2" y="2" width="92" height="92" rx="6" fill="#006FCF" stroke="#ffffff" strokeWidth="2.5" />
            <text
              x="48" y="44"
              fontFamily="Arial, Helvetica, sans-serif"
              fontSize="12.5"
              fontWeight="900"
              fill="#ffffff"
              textAnchor="middle"
              letterSpacing="0.5"
            >
              AMERICAN
            </text>
            <text
              x="48" y="60"
              fontFamily="Arial, Helvetica, sans-serif"
              fontSize="12.5"
              fontWeight="900"
              fill="#ffffff"
              textAnchor="middle"
              letterSpacing="0.5"
            >
              EXPRESS
            </text>
          </svg>
          <span className="relative text-[11px] font-bold uppercase tracking-[0.2em] text-white/90">
            American Express
          </span>
        </Face>
      );

    case "apple":
      return (
        <Face bg="linear-gradient(135deg, #fbfbfd 0%, #f0f0f3 60%, #e8e8ec 100%)">
          <svg viewBox="0 0 24 24" className="h-14 w-14" fill="#1d1d1f" aria-hidden>
            <path d="M17.05 12.9c-.03-2.4 1.96-3.55 2.05-3.6-1.12-1.64-2.86-1.87-3.48-1.9-1.48-.15-2.89.87-3.64.87-.75 0-1.91-.85-3.14-.83-1.61.02-3.1.94-3.93 2.38-1.68 2.9-.43 7.2 1.2 9.56.8 1.15 1.75 2.44 3 2.4 1.2-.05 1.66-.78 3.11-.78 1.45 0 1.86.78 3.13.75 1.29-.02 2.11-1.17 2.9-2.33.92-1.34 1.3-2.64 1.32-2.7-.03-.02-2.53-.97-2.55-3.85zM14.63 5.2c.66-.8 1.11-1.92.99-3.03-.95.04-2.11.64-2.8 1.44-.61.7-1.15 1.84-1 2.92 1.06.08 2.15-.54 2.81-1.33z" />
          </svg>
          <span className="font-display text-xl font-semibold tracking-tight text-[#1d1d1f]">
            Apple
          </span>
        </Face>
      );

    case "itunes":
      return (
        <Face bg="linear-gradient(135deg, #fbfbfd 0%, #f0f0f3 60%, #e8e8ec 100%)">
          <svg viewBox="0 0 48 48" className="h-14 w-14" aria-hidden>
            <defs>
              <linearGradient id="itunes-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F452FF" />
                <stop offset="100%" stopColor="#832BC1" />
              </linearGradient>
            </defs>
            <circle cx="24" cy="24" r="21" fill="url(#itunes-grad)" />
            <path
              d="M31.5 12.5 l-12 2.6 a1.4 1.4 0 0 0 -1.1 1.37 v13.1 a4.1 4.1 0 0 0 -1.9 -.45 c-2 0 -3.6 1.2 -3.6 2.75 s1.6 2.75 3.6 2.75 c1.95 0 3.55 -1.17 3.6 -2.68 V20.1 l10 -2.15 v8.32 a4.1 4.1 0 0 0 -1.9 -.45 c-2 0 -3.6 1.23 -3.6 2.75 s1.6 2.75 3.6 2.75 c1.98 0 3.58 -1.2 3.6 -2.7 V13.85 a1.4 1.4 0 0 0 -1.7 -1.35 Z"
              fill="#ffffff"
            />
          </svg>
          <span className="font-display text-xl font-semibold tracking-tight text-[#1d1d1f]">
            iTunes
          </span>
        </Face>
      );

    case "amazon":
      return (
        <Face bg="#131921">
          <svg viewBox="0 0 200 70" className="w-[62%]" aria-hidden>
            <text x="100" y="40" fontFamily="Arial, sans-serif" fontSize="42" fontWeight="700" fill="#fff" textAnchor="middle" letterSpacing="-1">amazon</text>
            <path d="M42 48 Q 100 68, 158 46" stroke="#FF9900" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M148 40 L 160 46 L 151 55" stroke="#FF9900" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Face>
      );

    case "google-play":
      return (
        <Face bg="linear-gradient(135deg, #ffffff, #f2f3f5)">
          <svg viewBox="0 0 100 100" className="h-14 w-14" aria-hidden>
            <path d="M22 14 L22 86 L48 50 Z" fill="#4285F4" />
            <path d="M22 14 L62 36 L48 50 Z" fill="#34A853" />
            <path d="M22 86 L62 64 L48 50 Z" fill="#EA4335" />
            <path d="M48 50 L62 36 L86 50 L62 64 Z" fill="#FBBC04" />
          </svg>
          <span className="font-display text-lg font-medium tracking-tight text-[#5F6368]">Google Play</span>
        </Face>
      );

    case "xbox":
      return (
        <Face bg="radial-gradient(circle at 50% 40%, #10a010, #0b590b)">
          <svg viewBox="0 0 48 48" className="h-14 w-14" aria-hidden>
            <circle cx="24" cy="24" r="21" fill="#fff" />
            <path d="M24 12 C18 18, 12 28, 14 36 C18 28, 22 24, 24 22 C26 24, 30 28, 34 36 C36 28, 30 18, 24 12Z" fill="#107C10" />
          </svg>
          <span className="font-display text-2xl font-extrabold tracking-[0.12em] text-white">XBOX</span>
        </Face>
      );

    case "playstation":
      return (
        <Face bg="linear-gradient(135deg, #003791, #0070d1)">
          <span className="font-display text-[26px] font-bold italic tracking-tight text-white">PlayStation</span>
        </Face>
      );

    case "netflix":
      return (
        <Face bg="#000000">
          <span className="font-display text-3xl font-extrabold tracking-[0.05em]" style={{ color: "#E50914" }}>
            NETFLIX
          </span>
        </Face>
      );

    case "spotify":
      return (
        <Face bg="#191414">
          <svg viewBox="0 0 48 48" className="h-14 w-14" aria-hidden>
            <circle cx="24" cy="24" r="22" fill="#1DB954" />
            <g stroke="#191414" strokeWidth="3" strokeLinecap="round" fill="none">
              <path d="M13 19 Q 24 16, 35 21" />
              <path d="M14 25 Q 24 22, 33 27" />
              <path d="M15 31 Q 23 29, 31 32" />
            </g>
          </svg>
          <span className="font-display text-xl font-bold tracking-tight text-white">Spotify</span>
        </Face>
      );

    case "ebay":
      return (
        <Face bg="linear-gradient(135deg,#ffffff,#f2f3f5)">
          <div className="font-display text-4xl font-extrabold tracking-tight" style={{ fontStyle: "italic" }}>
            <span style={{ color: "#E53238" }}>e</span>
            <span style={{ color: "#0064D2" }}>b</span>
            <span style={{ color: "#F5AF02" }}>a</span>
            <span style={{ color: "#86B817" }}>y</span>
          </div>
        </Face>
      );

    case "walmart":
      return (
        <Face bg="#0071DC">
          <svg viewBox="0 0 48 48" className="h-11 w-11" aria-hidden>
            <g fill="#FFC220">
              {Array.from({ length: 6 }).map((_, i) => (
                <rect key={i} x="22.5" y="6" width="3" height="12" rx="1.5" transform={`rotate(${i * 60} 24 24)`} />
              ))}
            </g>
          </svg>
          <span className="font-display text-2xl font-bold tracking-tight text-white">Walmart</span>
        </Face>
      );

    case "target":
      return (
        <Face bg="#CC0000">
          <svg viewBox="0 0 48 48" className="h-14 w-14" aria-hidden>
            <circle cx="24" cy="24" r="20" fill="#fff" />
            <circle cx="24" cy="24" r="13" fill="#CC0000" />
            <circle cx="24" cy="24" r="6" fill="#fff" />
          </svg>
          <span className="font-display text-xl font-bold tracking-tight text-white">Target</span>
        </Face>
      );

    case "best-buy":
      return (
        <Face bg="#003B64">
          <div className="flex items-center gap-2 rounded-md bg-[#FFF200] px-3 py-1.5">
            <span className="font-display text-lg font-extrabold uppercase leading-none text-[#003B64]">Best</span>
            <span className="font-display text-lg font-extrabold uppercase leading-none text-[#003B64]">Buy</span>
          </div>
        </Face>
      );

    case "sephora":
      return (
        <Face bg="#000000">
          <span className="font-display text-2xl font-bold tracking-[0.25em] text-white">SEPHORA</span>
        </Face>
      );

    case "nike":
      return (
        <Face bg="#111111">
          <svg viewBox="0 0 100 40" className="h-12 w-24" aria-hidden>
            <path d="M6 30 C 30 12, 60 6, 96 2 C 60 14, 34 26, 12 34 C 9 35, 5 33, 6 30 Z" fill="#fff" />
          </svg>
          <span className="font-display text-lg font-extrabold uppercase tracking-[0.2em] text-white">Nike</span>
        </Face>
      );

    case "adidas":
      return (
        <Face bg="#111111">
          <svg viewBox="0 0 60 40" className="h-11 w-16" aria-hidden>
            <g fill="#fff">
              <path d="M4 34 L 18 34 L 8 12 L 2 12 Z" />
              <path d="M20 34 L 34 34 L 22 8 L 16 8 Z" />
              <path d="M36 34 L 50 34 L 36 4 L 30 4 Z" />
            </g>
          </svg>
          <span className="font-display text-lg font-bold lowercase tracking-tight text-white">adidas</span>
        </Face>
      );

    case "roblox":
      return (
        <Face bg="#0f0f10">
          <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden>
            <rect x="10" y="10" width="28" height="28" rx="3" fill="#fff" transform="rotate(8 24 24)" />
            <rect x="19" y="19" width="10" height="10" fill="#0f0f10" transform="rotate(8 24 24)" />
          </svg>
          <span className="font-display text-xl font-extrabold uppercase tracking-[0.1em] text-white">Roblox</span>
        </Face>
      );

    default:
      return (
        <Face bg="linear-gradient(135deg,#002B6D,#1E5BD6)">
          <span className="font-display text-4xl font-black text-white/90">
            {brand.charAt(0).toUpperCase()}
          </span>
          <span className="font-display text-sm font-bold tracking-tight text-white">{brand}</span>
        </Face>
      );
  }
}
