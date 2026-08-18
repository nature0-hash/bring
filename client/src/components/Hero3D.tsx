import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
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

/* APPLE GIFT CARD — soft premium pastel gradient with a large centered
   white Apple logo and a small "Apple Gift Card" wordmark in the
   bottom-right. Recreated from the supplied reference design: a smooth
   diagonal blend of peach/pink → lavender → pale blue → soft mint
   green, with a flat-white Apple silhouette and minimal typography.
   No promotional copy, no App Store / iTunes tag, no rainbow scribble.
   The card keeps the same CardShell + dimensions (440×277, ~1.586:1)
   so the existing three-card hero composition is unchanged. */
function AppleCard() {
  return (
    <CardShell
      withWatermark={false}
      background={
        <div
          className="absolute inset-0"
          style={{
            /* Pastel multi-stop diagonal gradient matching the supplied
               Apple Gift Card reference: peach → pink → lavender →
               pale blue → soft mint green. */
            background:
              "linear-gradient(135deg, #FAD0C4 0%, #FFD1FF 25%, #E0C3FC 50%, #A1C4FD 75%, #C6FFDD 100%)",
          }}
        />
      }
    >
      <div className="relative flex h-full w-full items-center justify-center">
        {/* Large centered white Apple silhouette — flat fill, no
            outline, with a very soft drop shadow for depth. */}
        <svg
          viewBox="0 0 100 100"
          className="h-24 w-24 drop-shadow-[0_4px_10px_rgba(0,0,0,0.10)]"
          aria-hidden
        >
          <path
            d="M74.05 84.28c-3.98 3.85-8.05 3.49-11.92 1.74-4.23-1.83-8.09-1.95-12.56 0-5.59 2.38-8.55 1.69-11.88-1.74C9.79 62.25 12.51 30.59 35.05 30.31c5.35.07 9.09 2.96 12.18 3.21 4.66-.97 9.16-3.79 14.07-3.43 5.96.48 10.46 2.92 13.45 7.31-12.36 7.61-9.44 24.18 1.94 28.55-2.30 5.99-5.31 11.97-10.18 16.18zM47.03 30.25c-.59-9.06 6.65-16.46 14.74-17.21 1.16 9.49-9.20 17.16-14.74 17.21z"
            fill="#FFFFFF"
          />
        </svg>

        {/* Small "Apple Gift Card" wordmark in the bottom-right, matching
            the supplied reference. Light weight, slightly tracked. */}
        <p
          className="absolute bottom-4 right-5 text-[11px] font-normal text-white/90"
          style={{ letterSpacing: "0.5px" }}
        >
          Apple Gift Card
        </p>
      </div>
    </CardShell>
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

/* MOBILE HERO — a draggable fan of the three real card designs.

   Architecture (correcting the previous version's scrolling + viewport-
   fixed-positioning problems):

   • The widget is `position: absolute` at the document level (rendered
     OUTSIDE the hero section in Home.tsx, so the hero's `overflow-hidden`
     doesn't clip it when dragged to other sections). It scrolls
     naturally with the page — it is NOT a permanent floating viewport
     widget.

   • Framer Motion `x` and `y` motion values control the widget's
     document position via `transform: translate(x, y)`. The default
     position (centered horizontally, ~70% down the viewport on initial
     load, sitting in the hero's empty blue area) is computed in a
     layout effect on mount. Reload re-runs this and resets the
     position — no persistence anywhere.

   Gesture handling (independent of page scroll):

   • NO `touch-action: none` on the resting widget — the browser scrolls
     normally even when the touch starts on the widget.

   • NO `setPointerCapture` on pointerdown — the browser is free to
     claim the gesture for scrolling if the user swipes.

   • On pointerdown: start a 380ms long-press timer. If the user moves
     more than 8px before it fires, cancel the timer (the user is
     swiping/scrolling; the browser takes over and fires pointercancel).

   • When the long-press timer fires (no movement for 380ms): arm drag
     mode, capture the pointer (so subsequent pointermove events keep
     firing on the widget even if the finger leaves its bounds), and
     a non-passive `touchmove` listener now calls `preventDefault()` on
     subsequent touchmove events so the browser stops scrolling while
     the finger is dragging.

   • pointermove (with drag armed): updates the widget's document
     position by the finger delta. Page doesn't scroll during drag
     (because of the preventDefault on touchmove).

   • On pointerup: release pointer capture, end drag mode. If drag was
     NOT armed and pointer barely moved, it's a tap → toggle
     spread/close. If drag WAS armed, do NOT fire tap (so release-after-
     drag doesn't accidentally toggle the cards).

   Layered transform architecture (each layer owns ONE transform so they
   don't conflict — the original "lower-right corner" drift was caused
   by Framer Motion's animate overwriting an inline transform):
     • Outer motion.div  — `position: absolute` + Framer Motion x/y
                            (document position + drag offset).
     • Float motion.div  — `animate={{ y: [0,-6,0] }}` for the gentle
                            hovering bob.
     • Card fan          — 280×190 box that holds the three cards.
     • Per-card wrapper  — `absolute left-1/2 top-1/2 -translate-x-1/2
                            -translate-y-1/2` (CSS, on a non-animated div)
                            so the centering survives.
     • Per-card motion.div — `animate={cardNTarget}` for spread/close.
     • Card content div   — `scale(0.38)` for sizing.

   No instructional UI is rendered. */
export function Hero3DMobilePreview() {
  const [clickCount, setClickCount] = useState(0);

  // Drag state — kept in refs so the non-passive touchmove listener
  // (attached once via addEventListener) can read the current value
  // from its stable closure, without needing a state update + re-render
  // + listener reattachment on every gesture.
  const isDragArmedRef = useRef(false);
  const isPointerDownRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const longPressTimer = useRef<number | null>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  // Snapshot of the widget's document position at the moment the current
  // gesture started, so we can compute the new position as start + delta.
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Widget's document position. Initialized in a layout effect below
  // (NOT in useMotionValue's initial arg) because we need window dims.
  const widgetX = useMotionValue(0);
  const widgetY = useMotionValue(0);

  // Ref to the outer motion.div so we can attach the non-passive
  // touchmove listener + call setPointerCapture/releasePointerCapture.
  const widgetRef = useRef<HTMLDivElement>(null);

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

  // --- Long-press + drag tuning -------------------------------------------
  const LONG_PRESS_MS = 380;       // hold duration before drag mode arms
  const MOVE_THRESHOLD_PX = 8;    // movement beyond this cancels long-press
  const EDGE_MARGIN_PX = 60;      // keep at least this much of the widget
                                  // visible at any viewport edge during drag
  const WIDGET_W = 280;           // card fan container width
  const WIDGET_H = 190;           // card fan container height

  // --- Initial document position (centered horizontally, in the empty
  //     blue hero area below the text content). Computed in a layout
  //     effect so the widget renders at the correct position on first
  //     paint — no flash at (0, 0). Reload re-runs this and resets
  //     the position. Not persisted anywhere. ---
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const x = window.innerWidth / 2 - WIDGET_W / 2;
    const y = window.innerHeight * 0.7 - WIDGET_H / 2;
    widgetX.set(x);
    widgetY.set(y);
  }, [widgetX, widgetY]);

  // --- Non-passive touchmove listener (attached once). On real touch
  //     devices, touchmove events continue firing on the original touch
  //     target even after the finger leaves its bounds (per the Touch
  //     Events spec) — so this listener reliably receives every touchmove
  //     during the drag, regardless of pointer-capture quirks. It both:
  //       • calls preventDefault() to stop the browser from scrolling
  //         the page while the finger is dragging
  //       • updates the widget's document position based on the finger
  //         delta
  //     Before drag is armed, this listener does nothing — the browser
  //     scrolls normally. ---
  useEffect(() => {
    const el = widgetRef.current;
    if (!el) return;
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragArmedRef.current) return;
      e.preventDefault();
      const touch = e.touches[0];
      if (!touch || !pointerStart.current) return;
      const dx = touch.clientX - pointerStart.current.x;
      const dy = touch.clientY - pointerStart.current.y;
      const { x, y } = clampDocPos(dragStart.current.x + dx, dragStart.current.y + dy);
      widgetX.set(x);
      widgetY.set(y);
    };
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", handleTouchMove);
  }, []);

  const clearLongPressTimer = () => {
    if (longPressTimer.current !== null) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // Clamp the widget's document position so the widget can never be
  // dragged completely off-screen — at least EDGE_MARGIN_PX of it stays
  // visible at any viewport edge, accounting for the current scroll.
  // The widget is `position: absolute; top: 0; left: 0; transform:
  // translate(x, y)`, so its bounding box's document position is:
  //   left  edge = x              → must be ≤ vw - EDGE_MARGIN_PX
  //   right edge = x + WIDGET_W   → must be ≥ EDGE_MARGIN_PX
  //   top    edge = y             → must be ≤ sy + vh - EDGE_MARGIN_PX
  //   bottom edge = y + WIDGET_H  → must be ≥ sy + EDGE_MARGIN_PX
  // (where sy = current scrollY). This allows the widget to be dragged
  // partially off-screen as long as EDGE_MARGIN_PX remains visible
  // somewhere on the viewport — even when WIDGET_W > vw (which is the
  // case on very narrow phones where the 280px widget is wider than
  // the 320px viewport minus margins).
  const clampDocPos = (x: number, y: number) => {
    if (typeof window === "undefined") return { x, y };
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const sy = window.scrollY;
    const xLower = EDGE_MARGIN_PX - WIDGET_W;   // widget's right edge = EDGE_MARGIN_PX
    const xUpper = vw - EDGE_MARGIN_PX;          // widget's left edge = vw - EDGE_MARGIN_PX
    const yLower = sy + EDGE_MARGIN_PX - WIDGET_H;
    const yUpper = sy + vh - EDGE_MARGIN_PX;
    const clamp = (v: number, lo: number, hi: number) =>
      Math.max(lo, Math.min(hi, v));
    return {
      x: clamp(x, xLower, xUpper),
      y: clamp(y, yLower, yUpper),
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!e.isPrimary) return;
    pointerStart.current = { x: e.clientX, y: e.clientY };
    dragStart.current = { x: widgetX.get(), y: widgetY.get() };
    pointerIdRef.current = e.pointerId;
    isPointerDownRef.current = true;
    isDragArmedRef.current = false;
    // NOTE: deliberately NOT calling setPointerCapture here — the browser
    // must remain free to interpret this gesture as a normal scroll if the
    // user starts swiping. Pointer capture is only claimed AFTER the
    // long-press timer fires (see below).
    clearLongPressTimer();
    longPressTimer.current = window.setTimeout(() => {
      // Long-press fired without significant movement → arm drag mode.
      isDragArmedRef.current = true;
      // NOW we capture the pointer so subsequent pointermove events keep
      // firing on the widget even if the finger leaves its bounds while
      // dragging. The non-passive touchmove listener will also start
      // calling preventDefault() now, so the browser stops scrolling.
      if (widgetRef.current && pointerIdRef.current !== null) {
        try {
          widgetRef.current.setPointerCapture(pointerIdRef.current);
        } catch {
          /* ignore — pointer capture is best-effort */
        }
      }
    }, LONG_PRESS_MS);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointerStart.current || !isPointerDownRef.current || !e.isPrimary) return;
    const dx = e.clientX - pointerStart.current.x;
    const dy = e.clientY - pointerStart.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (isDragArmedRef.current) {
      // Drag mode — update document position. Because the non-passive
      // touchmove listener is calling preventDefault(), the page is NOT
      // scrolling during drag, so viewport delta == document delta.
      const { x, y } = clampDocPos(dragStart.current.x + dx, dragStart.current.y + dy);
      widgetX.set(x);
      widgetY.set(y);
    } else if (dist > MOVE_THRESHOLD_PX) {
      // User moved before long-press fired → this is a swipe/scroll
      // attempt. Cancel the timer so it can't fire later and steal the
      // gesture. The browser will continue handling the gesture as a
      // normal scroll (and will fire pointercancel on the original
      // pointer, which our handler will clean up).
      clearLongPressTimer();
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    clearLongPressTimer();
    if (widgetRef.current && pointerIdRef.current !== null) {
      try {
        widgetRef.current.releasePointerCapture(pointerIdRef.current);
      } catch {
        /* ignore */
      }
    }

    if (!isDragArmedRef.current && pointerStart.current) {
      // No long-press fired — was this a tap?
      const dx = e.clientX - pointerStart.current.x;
      const dy = e.clientY - pointerStart.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOVE_THRESHOLD_PX) {
        // Tap → toggle spread/close.
        setClickCount((c) => c + 1);
      }
    }
    // If drag was armed, the user dragged — do NOT fire the tap, so
    // release-after-drag doesn't accidentally toggle the cards.

    isDragArmedRef.current = false;
    isPointerDownRef.current = false;
    pointerIdRef.current = null;
    pointerStart.current = null;
  };

  const handlePointerCancel = () => {
    // Browser took over the gesture for scrolling (or it was cancelled
    // for another reason). Reset everything; no tap or drag fires.
    clearLongPressTimer();
    isDragArmedRef.current = false;
    isPointerDownRef.current = false;
    pointerIdRef.current = null;
    pointerStart.current = null;
  };

  return (
    // Outer motion.div — `position: absolute` at the document level
    // (rendered OUTSIDE the hero section in Home.tsx, so the hero's
    // `overflow-hidden` doesn't clip it). Framer Motion `x`/`y` motion
    // values control the document position via transform. The widget
    // scrolls naturally with the page — it is NOT a permanent viewport
    // overlay. NO `touch-action: none` — the browser scrolls normally
    // even when a touch starts on the widget.
    //
    // `top: 0; left: 0` is set explicitly so the widget's anchor is the
    // top-left corner of its containing block (the document-level div in
    // Home.tsx). Without this, `position: absolute` with no offsets
    // would default to the "static position" — which is wherever the
    // `<div className="lg:hidden">` wrapper sits in the document flow
    // (near the end, since it's a sibling of <main>). That would push
    // the widget far down the page on initial render. Setting top:0;
    // left:0 makes the Framer Motion x/y the sole source of truth for
    // the document position.
    <motion.div
      ref={widgetRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        x: widgetX,
        y: widgetY,
        zIndex: 40,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      {/* Float layer — owns the gentle hovering bob. A separate
          motion.div so the y-animation doesn't fight the drag x/y. */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-[190px] w-[280px]"
      >
        {/* Soft glow behind the cards */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-44 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1E5BD6]/25 blur-[80px]"
          aria-hidden
        />

        {/* Each card wrapper is a NON-animated div that owns the
            `translate(-50%, -50%)` centering. Previously this was on
            the motion.div itself, where Framer Motion's animate
            overwrote it and pushed cards to the lower-right of their
            anchor — putting the wrapper here keeps the centering
            intact regardless of what the inner motion.div animates. */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div animate={card3Target} transition={spring}>
            <div style={{ transform: "scale(0.38)", transformOrigin: "center" }}>
              <GooglePlayCard />
            </div>
          </motion.div>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div animate={card2Target} transition={spring}>
            <div style={{ transform: "scale(0.38)", transformOrigin: "center" }}>
              <AmazonCard />
            </div>
          </motion.div>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div animate={card1Target} transition={spring}>
            <div style={{ transform: "scale(0.38)", transformOrigin: "center" }}>
              <AppleCard />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
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
