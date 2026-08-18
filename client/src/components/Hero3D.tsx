import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ShieldCheck, Zap } from "lucide-react";

/**
 * Premium hero showcase — three realistic gift cards
 * (Apple, Amazon, Google Play) in a WIDE SPREAD fan.
 *
 * Click cycle (simple alternating toggle):
 *   State 0 (default): SPREAD DOWN  (back cards rotated+offset DOWN)
 *   Click to State 1:  STACKED      (all aligned)
 *   Click to State 2:  SPREAD UP    (back cards rotated+offset UP)
 *   Click to State 3:  STACKED
 *   Click to State 0:  SPREAD DOWN  (cycle repeats)
 *
 * The "100% Secure" and "Instant Pay" badges are POSITIONED ABSOLUTELY
 * relative to the card-area container (NOT attached to any card), so they
 * float in the same spot no matter what state the cards are in.
 *
 * A continuous gentle floating animation makes the whole stack hover.
 */
export function Hero3D() {
  const ref = useRef<HTMLDivElement>(null);
  const [clickCount, setClickCount] = useState(0);

  const phase = clickCount % 4;
  const isStacked = phase === 1 || phase === 3;
  const isSpreadUp = phase === 2;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    mass: 0.6,
  });

  const glowOpacity = useTransform(progress, [0, 0.5, 1], [0.55, 0.85, 0.35]);
  const glowScale = useTransform(progress, [0, 1], [1, 1.2]);

  const sceneY = useTransform(progress, [0, 1], [0, -40]);

  const dir = isSpreadUp ? -1 : 1;
  const SPREAD_OFFSET_Y = 100;
  const SPREAD_OFFSET_X = 220;

  const card1Target = isStacked
    ? { x: 0, y: -8, rotate: -3, zIndex: 30, scale: 1 }
    : { x: 0, y: 0, rotate: -16, zIndex: 30, scale: 1 };

  const card2Target = isStacked
    ? { x: 0, y: 0, rotate: 0, zIndex: 20, scale: 1 }
    : {
        x: -SPREAD_OFFSET_X,
        y: SPREAD_OFFSET_Y * dir,
        rotate: -32,
        zIndex: 20,
        scale: 1,
      };

  const card3Target = isStacked
    ? { x: 0, y: 8, rotate: 3, zIndex: 10, scale: 1 }
    : {
        x: -SPREAD_OFFSET_X * 2,
        y: SPREAD_OFFSET_Y * 2 * dir,
        rotate: -48,
        zIndex: 10,
        scale: 1,
      };

  const spring = { type: "spring" as const, stiffness: 140, damping: 18, mass: 0.9 };

  return (
    <div
      ref={ref}
      className="absolute inset-0 perspective-2000"
      style={{ pointerEvents: "none" }}
    >
      <motion.div
        style={{ opacity: glowOpacity, scale: glowScale }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1E5BD6] blur-[120px]"
      />
      <motion.div
        style={{ opacity: glowOpacity }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C9A24B]/25 blur-[110px]"
      />

      <div
        className="absolute top-1/2 -translate-y-1/2"
        style={{
          left: "55%",
          right: "4%",
          height: "680px",
          pointerEvents: "auto",
        }}
      >
      <motion.div
        style={{ y: sceneY }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative h-[460px] w-[900px] sm:h-[500px] sm:w-[1000px]">
            <div
              className="absolute -bottom-4 left-1/2 h-12 w-[70%] -translate-x-1/2 rounded-[50%] bg-black/50 blur-2xl"
              aria-hidden
            />

            <motion.div
              className="absolute left-1/2 top-1/2 cursor-pointer"
              onClick={() => setClickCount((c) => c + 1)}
              animate={card3Target}
              transition={spring}
              whileHover={{ scale: 1.04 }}
            >
              <div className="-translate-x-1/2 -translate-y-1/2">
                <GooglePlayCard />
              </div>
            </motion.div>

            <motion.div
              className="absolute left-1/2 top-1/2 cursor-pointer"
              onClick={() => setClickCount((c) => c + 1)}
              animate={card2Target}
              transition={spring}
              whileHover={{ scale: 1.04 }}
            >
              <div className="-translate-x-1/2 -translate-y-1/2">
                <AmazonCard />
              </div>
            </motion.div>

            <motion.div
              className="absolute left-1/2 top-1/2 cursor-pointer"
              onClick={() => setClickCount((c) => c + 1)}
              animate={card1Target}
              transition={spring}
              whileHover={{ scale: 1.04 }}
            >
              <div className="-translate-x-1/2 -translate-y-1/2">
                <AppleCard />
              </div>
            </motion.div>

            <div className="pointer-events-none absolute left-[28%] top-[38%] z-50">
              <div className="flex -translate-x-1/2 items-center gap-2 rounded-2xl bg-white/90 p-2.5 shadow-xl ring-1 ring-black/5 backdrop-blur">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0047AB]/10 text-[#0047AB]">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#0A1224]">100% Secure</p>
                  <p className="text-[9px] text-[#6B7384]">Bank-grade encryption</p>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute right-[28%] top-[42%] z-50">
              <div className="flex translate-x-1/2 items-center gap-2 rounded-2xl bg-white/90 p-2.5 shadow-xl ring-1 ring-black/5 backdrop-blur">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C9A24B]/15 text-[#C9A24B]">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#0A1224]">Instant Pay</p>
                  <p className="text-[9px] text-[#6B7384]">≤ 5 min average</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      </div>
    </div>
  );
}

/* CARD DIMENSIONS — gift-card aspect ratio (1.586 : 1) */
const CARD_W = 440;
const CARD_H = Math.round(CARD_W / 1.586);

interface CardProps {
  children: React.ReactNode;
  background: React.ReactNode;
  withWatermark?: boolean;
}

/**
 * CardShell — the shared card frame.
 *
 * Contains a MASSIVE transparent logo watermark using mix-blend-mode: screen.
 * Only the white parts of the logo show through; the transparent background
 * of the PNG is invisible. The watermark sits at z-index 0; the card content
 * (text, logos) sits at z-index 10 so it's always on top.
 *
 * Pass `withWatermark={false}` to skip the watermark (used on the Amazon card
 * where the user explicitly requested it be removed).
 */
function CardShell({ children, background, withWatermark = true }: CardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl shadow-[0_40px_90px_-20px_rgba(0,0,0,0.6)] ring-1 ring-black/10"
      style={{ width: CARD_W, height: CARD_H, transformStyle: "preserve-3d" }}
    >
      {background}

      {withWatermark && (
        <img
          src="/logo-transparent.png"
          alt=""
          aria-hidden
          draggable={false}
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-contain"
          style={{
            width: "150%",
            height: "150%",
            mixBlendMode: "screen",
            opacity: 0.3,
            zIndex: 0,
          }}
        />
      )}

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-3xl"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 100%)",
          zIndex: 5,
        }}
      />

      <div className="absolute inset-0 p-7" style={{ position: "relative", zIndex: 10 }}>
        {children}
      </div>
    </div>
  );
}

/* APPLE GIFT CARD — clean white card with a colorful Apple logo
   composed as the dominant focal element. The logo sits in a balanced
   three-row vertical rhythm (label → logo → store tag) and is visually
   integrated into the white card via a soft color halo that bleeds its
   rainbow palette into the surrounding surface, plus a quiet background
   wash. The result reads as one properly designed Apple gift card rather
   than a white card with a logo pasted on top. */
function AppleCard() {
  return (
    <CardShell
      background={
        <>
          <div className="absolute inset-0 bg-white" />
          {/* Quiet background wash that echoes the logo's rainbow palette
              so the white card feels like an extension of the artwork,
              not a neutral frame around it. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 55%, rgba(255,120,180,0.10), transparent 65%), radial-gradient(ellipse 50% 50% at 22% 30%, rgba(120,200,255,0.10), transparent 65%), radial-gradient(ellipse 50% 50% at 78% 75%, rgba(255,210,120,0.10), transparent 65%)",
            }}
          />
        </>
      }
    >
      <div className="flex h-full flex-col items-center justify-between py-1 text-center">
        {/* Top label */}
        <div className="pt-1">
          <p className="font-display text-[20px] font-normal leading-tight text-[#1D1D1F]">
            The gift card for
          </p>
          <p className="font-display text-[20px] font-semibold leading-tight text-[#1D1D1F]">
            everything Apple.
          </p>
        </div>

        {/* Apple logo — dominant focal element. A soft color halo behind
            it bridges the rainbow fill with the white card surface so the
            artwork feels integrated rather than pasted on. The logo is
            sized to read as the hero of the card while leaving generous
            breathing room above and below. */}
        <div className="relative flex items-center justify-center">
          <div
            className="pointer-events-none absolute inset-0 -m-6 rounded-full opacity-70 blur-2xl"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(255,105,180,0.45), transparent 55%), radial-gradient(circle at 70% 30%, rgba(255,165,90,0.40), transparent 55%), radial-gradient(circle at 30% 70%, rgba(120,200,255,0.40), transparent 55%), radial-gradient(circle at 70% 70%, rgba(150,90,255,0.40), transparent 55%)",
            }}
            aria-hidden
          />
          <AppleScribbleLogo className="relative h-32 w-32 drop-shadow-[0_6px_18px_rgba(0,0,0,0.12)]" />
        </div>

        {/* Bottom store tag */}
        <p className="pb-1 text-[9px] font-medium uppercase tracking-[0.3em] text-[#86868B]">
          App Store · iTunes
        </p>
      </div>
    </CardShell>
  );
}

function AppleScribbleLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        {/* Smooth diagonal rainbow gradient that replaces the original
            block-color patches — one continuous flow of color across
            the silhouette for a polished, premium look. */}
        <linearGradient id="apple-rainbow" x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF5E8A" />
          <stop offset="22%" stopColor="#FF8A5C" />
          <stop offset="42%" stopColor="#FFD24D" />
          <stop offset="62%" stopColor="#3DD9A6" />
          <stop offset="82%" stopColor="#3AA7FF" />
          <stop offset="100%" stopColor="#8A5CFF" />
        </linearGradient>
        {/* Glossy top-to-bottom sheen — white highlight at the top,
            subtle darkening at the bottom — to give the flat silhouette
            dimensional depth. */}
        <linearGradient id="apple-shine" x1="0%" y1="0%" x2="0%" y2="100%" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(255,255,255,0.50)" />
          <stop offset="45%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.12)" />
        </linearGradient>
        <clipPath id="apple-clip">
          <path d="M74.05 84.28c-3.98 3.85-8.05 3.49-11.92 1.74-4.23-1.83-8.09-1.95-12.56 0-5.59 2.38-8.55 1.69-11.88-1.74C9.79 62.25 12.51 30.59 35.05 30.31c5.35.07 9.09 2.96 12.18 3.21 4.66-.97 9.16-3.79 14.07-3.43 5.96.48 10.46 2.92 13.45 7.31-12.36 7.61-9.44 24.18 1.94 28.55-2.30 5.99-5.31 11.97-10.18 16.18zM47.03 30.25c-.59-9.06 6.65-16.46 14.74-17.21 1.16 9.49-9.20 17.16-14.74 17.21z" />
        </clipPath>
      </defs>

      {/* Rainbow gradient fill covering the entire apple silhouette */}
      <g clipPath="url(#apple-clip)">
        <rect x="0" y="0" width="100" height="100" fill="url(#apple-rainbow)" />
        {/* Glossy highlight overlay for dimension */}
        <rect x="0" y="0" width="100" height="100" fill="url(#apple-shine)" />
      </g>

      {/* Clean inner highlight along the silhouette edge */}
      <path
        d="M74.05 84.28c-3.98 3.85-8.05 3.49-11.92 1.74-4.23-1.83-8.09-1.95-12.56 0-5.59 2.38-8.55 1.69-11.88-1.74C9.79 62.25 12.51 30.59 35.05 30.31c5.35.07 9.09 2.96 12.18 3.21 4.66-.97 9.16-3.79 14.07-3.43 5.96.48 10.46 2.92 13.45 7.31-12.36 7.61-9.44 24.18 1.94 28.55-2.30 5.99-5.31 11.97-10.18 16.18zM47.03 30.25c-.59-9.06 6.65-16.46 14.74-17.21 1.16 9.49-9.20 17.16-14.74 17.21z"
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.2"
      />
      {/* Subtle outer edge so the logo reads cleanly on a white card */}
      <path
        d="M74.05 84.28c-3.98 3.85-8.05 3.49-11.92 1.74-4.23-1.83-8.09-1.95-12.56 0-5.59 2.38-8.55 1.69-11.88-1.74C9.79 62.25 12.51 30.59 35.05 30.31c5.35.07 9.09 2.96 12.18 3.21 4.66-.97 9.16-3.79 14.07-3.43 5.96.48 10.46 2.92 13.45 7.31-12.36 7.61-9.44 24.18 1.94 28.55-2.30 5.99-5.31 11.97-10.18 16.18zM47.03 30.25c-.59-9.06 6.65-16.46 14.74-17.21 1.16 9.49-9.20 17.16-14.74 17.21z"
        fill="none"
        stroke="rgba(0,0,0,0.08)"
        strokeWidth="1"
      />
    </svg>
  );
}

/* AMAZON GIFT CARD — clean dark charcoal background, centered white
   "amazon" wordmark with the signature orange smile/arrow underneath.
   NO tagline, NO watermark (per user request). */
function AmazonCard() {
  return (
    <CardShell
      withWatermark={false}
      background={
        <>
          <div className="absolute inset-0 bg-[#131921]" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.04), transparent 70%)",
            }}
          />
        </>
      }
    >
      <div className="flex h-full items-center justify-center">
        <AmazonWordmarkLarge />
      </div>
    </CardShell>
  );
}

function AmazonWordmarkLarge() {
  return (
    <svg viewBox="0 0 200 90" className="w-[75%] max-w-[340px]" aria-hidden>
      <text
        x="100"
        y="42"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="46"
        fontWeight="700"
        fill="white"
        textAnchor="middle"
        letterSpacing="-1"
      >
        amazon
      </text>
      <path
        d="M30 52 Q 100 76, 170 50"
        stroke="#FF9900"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M158 42 L 172 50 L 161 62"
        stroke="#FF9900"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* GOOGLE PLAY GIFT CARD — clean white background, centered multicolor
   Google Play triangle logo, "Google Play" text below in grey.
   NO tagline. */
function GooglePlayCard() {
  return (
    <CardShell
      background={
        <>
          <div className="absolute inset-0 bg-white" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.02), transparent 70%)",
            }}
          />
        </>
      }
    >
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
        <GooglePlayTriangleLarge className="h-24 w-24" />
        <p
          className="font-display text-[30px] font-medium leading-tight text-[#5F6368]"
          style={{ letterSpacing: "-0.5px" }}
        >
          Google Play
        </p>
      </div>
    </CardShell>
  );
}

/* MOBILE HERO — a centered fan of the three real card designs, spread
   the way you'd fan out banknotes in your hand: the middle card stays
   upright while the outer two tilt away left and right from a shared
   bottom pivot. The whole fan sits in the middle of the hero and stays
   fully inside the screen on every phone width.

   Tapping anywhere on the fan toggles between the money-fan spread
   (default) and a neat stack, then back again. */
export function Hero3DMobilePreview() {
  const [clickCount, setClickCount] = useState(0);

  const isSpread = clickCount % 2 === 0;

  const FAN_OFFSET_X = 66;
  const FAN_OFFSET_Y = 14;
  const FAN_ANGLE = 17;

  // Left card of the fan (back).
  const card3Target = isSpread
    ? { x: -FAN_OFFSET_X, y: FAN_OFFSET_Y, rotate: -FAN_ANGLE, zIndex: 10, scale: 0.98 }
    : { x: -8, y: 5, rotate: -4, zIndex: 10, scale: 0.96 };

  // Middle card of the fan.
  const card2Target = isSpread
    ? { x: 0, y: 0, rotate: 0, zIndex: 20, scale: 1 }
    : { x: -4, y: 2, rotate: -2, zIndex: 20, scale: 0.98 };

  // Right card of the fan (front).
  const card1Target = isSpread
    ? { x: FAN_OFFSET_X, y: FAN_OFFSET_Y, rotate: FAN_ANGLE, zIndex: 30, scale: 0.98 }
    : { x: 0, y: 0, rotate: 0, zIndex: 30, scale: 1 };

  const spring = { type: "spring" as const, stiffness: 220, damping: 22, mass: 0.8 };

  return (
    <div className="relative">
      <div
        className="relative mx-auto flex h-[230px] w-full max-w-sm items-center justify-center"
        style={{ perspective: 1400 }}
        onClick={() => setClickCount((c) => c + 1)}
      >
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-44 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1E5BD6]/25 blur-[80px]"
          aria-hidden
        />

        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative h-[190px] w-[280px]"
        >
          <motion.div
            className="absolute left-1/2 top-1/2 cursor-pointer"
            animate={card3Target}
            transition={spring}
            style={{ transform: "translate(-50%, -50%)" }}
          >
            <div style={{ transform: "scale(0.38)", transformOrigin: "center" }}>
              <GooglePlayCard />
            </div>
          </motion.div>

          <motion.div
            className="absolute left-1/2 top-1/2 cursor-pointer"
            animate={card2Target}
            transition={spring}
            style={{ transform: "translate(-50%, -50%)" }}
          >
            <div style={{ transform: "scale(0.38)", transformOrigin: "center" }}>
              <AmazonCard />
            </div>
          </motion.div>

          <motion.div
            className="absolute left-1/2 top-1/2 cursor-pointer"
            animate={card1Target}
            transition={spring}
            style={{ transform: "translate(-50%, -50%)" }}
          >
            <div style={{ transform: "scale(0.38)", transformOrigin: "center" }}>
              <AppleCard />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function GooglePlayTriangleLarge({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <path d="M22 14 L22 86 L48 50 Z" fill="#4285F4" />
      <path d="M22 14 L62 36 L48 50 Z" fill="#34A853" />
      <path d="M22 86 L62 64 L48 50 Z" fill="#EA4335" />
      <path d="M48 50 L62 36 L86 50 L62 64 Z" fill="#FBBC04" />
    </svg>
  );
}
