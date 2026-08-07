/**
 * BrandCardArt — renders a realistic, brand-styled gift-card face for each
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

function GiftLabel({ color = "rgba(255,255,255,0.55)" }: { color?: string }) {
  return (
    <span
      className="absolute bottom-2.5 text-[8px] font-semibold uppercase tracking-[0.3em]"
      style={{ color }}
    >
      Gift Card
    </span>
  );
}

export function BrandCardArt({ slug, brand }: Props) {
  switch (slug) {
    case "steam":
      return (
        <Face bg="linear-gradient(160deg, #1b2838 0%, #0a1420 70%, #050a12 100%)">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(102,192,244,0.18), transparent 55%), radial-gradient(circle at 80% 75%, rgba(66,122,155,0.20), transparent 55%)",
            }}
          />
          <svg viewBox="0 0 88 88" className="h-16 w-16" aria-hidden>
            <circle cx="44" cy="44" r="43" fill="#111d2e" stroke="#2a475e" strokeWidth="1.5" />
            <circle cx="30" cy="55" r="16" fill="none" stroke="#66c0f4" strokeOpacity="0.35" strokeWidth="2.5" />
            <circle cx="57" cy="27" r="13" fill="#67c1f5" />
            <circle cx="57" cy="27" r="6.2" fill="#0a1420" />
            <rect x="31" y="42" width="20" height="5.4" rx="2.7" fill="#67c1f5" transform="rotate(-32 41 44.5)" />
            <circle cx="30" cy="55" r="9" fill="#417a9b" />
            <circle cx="30" cy="55" r="4" fill="#0a1420" />
          </svg>
          <span className="font-display text-2xl font-extrabold tracking-[0.15em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">STEAM</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#66c0f4]">Wallet Code</span>
          <GiftLabel color="rgba(102,192,244,0.55)" />
        </Face>
      );

    case "razer-gold":
    case "razer":
      return (
        <Face bg="linear-gradient(160deg, #0a0a0a 0%, #050505 70%, #000000 100%)">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 35%, rgba(68,214,44,0.18), transparent 55%), radial-gradient(circle at 80% 90%, rgba(68,214,44,0.08), transparent 55%)",
            }}
          />
          <svg viewBox="0 0 200 60" className="w-[80%] max-w-[200px]" aria-hidden>
            <g fill="#44D62C">
              <path d="M10 12 H70 L46 30 H22 L34 42 H60 L36 60 H12 L30 42 L10 12 Z" transform="translate(0,0)" />
              <path d="M80 12 H140 L116 30 H92 L104 42 H130 L106 60 H82 L100 42 L80 12 Z" transform="translate(0,0) scale(0.85) translate(15,5)" opacity="0.85" />
              <path d="M150 12 H210 L186 30 H162 L174 42 H200 L176 60 H152 L170 42 L150 12 Z" transform="translate(0,0) scale(0.7) translate(35,12)" opacity="0.7" />
            </g>
          </svg>
          <span className="font-display text-xl font-extrabold tracking-[0.15em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">RAZER</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "#44D62C" }}>
            GOLD PIN
          </span>
          <GiftLabel color="rgba(68,214,44,0.5)" />
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
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/70">Nitro</span>
          <GiftLabel />
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
          <GiftLabel />
        </Face>
      );

    case "uber":
      return (
        <Face bg="#000000">
          <span className="font-display text-4xl font-black uppercase tracking-tight text-white">Uber</span>
          <GiftLabel color="rgba(255,255,255,0.5)" />
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
          <GiftLabel color="rgba(0,0,0,0.4)" />
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
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">Prepaid Card</span>
          <GiftLabel />
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
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">Prepaid Card</span>
          <GiftLabel />
        </Face>
      );

    case "amex":
      return (
        <Face bg="linear-gradient(135deg, #006FCF 0%, #016FD0 50%, #00487A 100%)">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 20% 15%, rgba(255,255,255,0.22), transparent 45%), linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.10) 60%, transparent 80%)",
            }}
          />
          <div className="absolute left-3 top-2.5 flex items-center gap-1.5">
            <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/70">
              American Express
            </span>
          </div>

          <div className="relative flex flex-col items-center gap-1.5">
            <svg viewBox="0 0 220 70" className="w-[78%] max-w-[220px]" aria-hidden>
              <rect x="6" y="6" width="208" height="58" rx="3" fill="white" />
              <text
                x="110"
                y="46"
                fontFamily="Arial, Helvetica, sans-serif"
                fontSize="30"
                fontWeight="900"
                fill="#006FCF"
                textAnchor="middle"
                letterSpacing="2"
              >
                AMEX
              </text>
              <rect x="14" y="14" width="22" height="14" rx="2" fill="#006FCF" opacity="0.85" />
              <rect x="14" y="14" width="22" height="14" rx="2" fill="none" stroke="#00487A" strokeWidth="0.6" opacity="0.5" />
              <line x1="20" y1="16" x2="20" y2="26" stroke="#9bc4ec" strokeWidth="0.7" />
              <line x1="26" y1="16" x2="26" y2="26" stroke="#9bc4ec" strokeWidth="0.7" />
              <line x1="30" y1="16" x2="30" y2="26" stroke="#9bc4ec" strokeWidth="0.7" />
            </svg>
            <span className="font-display text-[10px] font-bold uppercase tracking-[0.25em] text-white/85">
              Platinum Travel
            </span>
          </div>

          <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5">
            <span className="font-mono text-[10px] font-semibold tracking-[0.18em] text-white/80">
              3714 ••••• ••12
            </span>
          </div>
          <div className="absolute bottom-2.5 right-3">
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/70">
              Member Since 24
            </span>
          </div>
        </Face>
      );

    case "apple":
    case "itunes":
      return (
        <Face bg="linear-gradient(135deg, #fbfbfd 0%, #f0f0f3 60%, #e8e8ec 100%)">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 75% 25%, rgba(255,200,220,0.18), transparent 50%), radial-gradient(circle at 25% 75%, rgba(200,220,255,0.18), transparent 50%)",
            }}
          />
          <svg viewBox="0 0 24 24" className="h-12 w-12" fill="#1d1d1f" aria-hidden>
            <path d="M17.05 12.9c-.03-2.4 1.96-3.55 2.05-3.6-1.12-1.64-2.86-1.87-3.48-1.9-1.48-.15-2.89.87-3.64.87-.75 0-1.91-.85-3.14-.83-1.61.02-3.1.94-3.93 2.38-1.68 2.9-.43 7.2 1.2 9.56.8 1.15 1.75 2.44 3 2.4 1.2-.05 1.66-.78 3.11-.78 1.45 0 1.86.78 3.13.75 1.29-.02 2.11-1.17 2.9-2.33.92-1.34 1.3-2.64 1.32-2.7-.03-.02-2.53-.97-2.55-3.85zM14.63 5.2c.66-.8 1.11-1.92.99-3.03-.95.04-2.11.64-2.8 1.44-.61.7-1.15 1.84-1 2.92 1.06.08 2.15-.54 2.81-1.33z" />
          </svg>
          <span className="font-display text-base font-semibold tracking-tight text-[#1d1d1f]">
            {brand === "iTunes" ? "iTunes" : "App Store"}
          </span>
          <span className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#86868B]">
            Gift Card
          </span>
          <GiftLabel color="rgba(0,0,0,0.35)" />
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
          <GiftLabel />
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
          <GiftLabel color="rgba(0,0,0,0.4)" />
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
          <GiftLabel />
        </Face>
      );

    case "playstation":
      return (
        <Face bg="linear-gradient(135deg, #003791, #0070d1)">
          <span className="font-display text-[26px] font-bold italic tracking-tight text-white">PlayStation</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/70">Network</span>
          <GiftLabel />
        </Face>
      );

    case "netflix":
      return (
        <Face bg="#000000">
          <span className="font-display text-3xl font-extrabold tracking-[0.05em]" style={{ color: "#E50914" }}>
            NETFLIX
          </span>
          <GiftLabel color="rgba(255,255,255,0.5)" />
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
          <GiftLabel />
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
          <GiftLabel color="rgba(0,0,0,0.4)" />
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
          <GiftLabel />
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
          <GiftLabel />
        </Face>
      );

    case "best-buy":
      return (
        <Face bg="#003B64">
          <div className="flex items-center gap-2 rounded-md bg-[#FFF200] px-3 py-1.5">
            <span className="font-display text-lg font-extrabold uppercase leading-none text-[#003B64]">Best</span>
            <span className="font-display text-lg font-extrabold uppercase leading-none text-[#003B64]">Buy</span>
          </div>
          <GiftLabel />
        </Face>
      );

    case "sephora":
      return (
        <Face bg="#000000">
          <span className="font-display text-2xl font-bold tracking-[0.25em] text-white">SEPHORA</span>
          <div className="h-1 w-10 rounded-full" style={{ background: "linear-gradient(90deg,#ff512f,#dd2476)" }} />
          <GiftLabel color="rgba(255,255,255,0.5)" />
        </Face>
      );

    case "nike":
      return (
        <Face bg="#111111">
          <svg viewBox="0 0 100 40" className="h-12 w-24" aria-hidden>
            <path d="M6 30 C 30 12, 60 6, 96 2 C 60 14, 34 26, 12 34 C 9 35, 5 33, 6 30 Z" fill="#fff" />
          </svg>
          <span className="font-display text-lg font-extrabold uppercase tracking-[0.2em] text-white">Nike</span>
          <GiftLabel />
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
          <GiftLabel />
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
          <GiftLabel />
        </Face>
      );

    default:
      return (
        <Face bg="linear-gradient(135deg,#002B6D,#1E5BD6)">
          <span className="font-display text-4xl font-black text-white/90">
            {brand.charAt(0).toUpperCase()}
          </span>
          <span className="font-display text-sm font-bold tracking-tight text-white">{brand}</span>
          <GiftLabel />
        </Face>
      );
  }
}
