import { useRef, useState } from "react";
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

/* MOBILE HERO — a floating, draggable fan of the three real card
   designs. Rendered `position: fixed` so the widget escapes the hero
   section's `overflow-hidden` and can be moved around the visible
   viewport (not just inside the hero). It starts centered in the lower
   portion of the viewport — sitting in the empty blue area below the
   hero text content, above the statistics panel.

   Layered transform architecture (each layer owns ONE transform so they
   don't conflict, which was the cause of the original "lower-right
   corner" drift):
     • Outer wrapper div  — position:fixed + left/top + translate(-50%,-50%)
                            for base centering. No Framer Motion animation
                            here, so the centering transform is never
                            overridden.
     • Drag motion.div    — style={{ x: dragX, y: dragY }} for the drag
                            offset (manual, via pointer events).
     • Float motion.div   — animate={{ y: [0,-6,0] }} for the gentle
                            hovering bob.
     • Card fan container — 280×190 box that holds the three cards.
     • Per-card wrapper   — absolute left-1/2 top-1/2 + translate(-50%,-50%)
                            (CSS, on a non-animated div) so the anchor
                            centering survives.
     • Per-card motion.div — animate={cardNTarget} for spread/close.
     • Card content div    — scale(0.38) for sizing.

   Interactions:
     • Short tap         → toggles the card fan between spread and stacked.
     • Press+hold (380ms)→ arms drag mode (no spread/close fired).
     • Hold+move         → drags the entire widget as one object.
     • Release           → widget stays where it was released.
     • Reload            → widget returns to the centered default
                           (drag offsets are React state, not persisted).

   No instructional UI is rendered — the gestures are discoverable. */
export function Hero3DMobilePreview() {
  const [clickCount, setClickCount] = useState(0);
  // isDragArmed: long-press timer has fired for the current gesture.
  // isPointerDown: a pointer is currently down on the widget (used to
  //                gate pointermove handling).
  const [isDragArmed, setIsDragArmed] = useState(false);
  const [isPointerDown, setIsPointerDown] = useState(false);

  // Drag offset (MotionValues — NOT persisted to localStorage or any
  // backend). They reset to 0 on every page load, which is the
  // intended "reload resets to center" behaviour.
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  const longPressTimer = useRef<number | null>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  // Snapshot of the drag offset at the moment the current gesture
  // started, so we can compute the new offset as start + delta.
  const dragStartOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

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
  const MOVE_THRESHOLD_PX = 8;     // movement beyond this cancels long-press
  const EDGE_MARGIN_PX = 60;       // keep at least this much of the widget
                                   // visible at any viewport edge during drag
  const WIDGET_W = 280;            // card fan container width
  const WIDGET_H = 190;            // card fan container height

  const clearLongPressTimer = () => {
    if (longPressTimer.current !== null) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // Clamp the drag offset so the widget can never be dragged completely
  // off-screen — at least EDGE_MARGIN_PX of it stays visible at any
  // edge, so the user can always grab it again.
  const clampDrag = (dx: number, dy: number) => {
    if (typeof window === "undefined") return { x: dx, y: dy };
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // Widget starts centered horizontally (left:50%) and at 70% of
    // viewport height (top:70%). Compute the allowed drag range so
    // that the widget's bounding box keeps at least EDGE_MARGIN_PX on
    // the screen at all times.
    //   widget right edge = vw/2 + dx + WIDGET_W/2  →  ≥ EDGE_MARGIN_PX
    //   widget left  edge = vw/2 + dx - WIDGET_W/2  →  ≤ vw - EDGE_MARGIN_PX
    //   widget bottom edge = vh*0.7 + dy + WIDGET_H/2  →  ≥ EDGE_MARGIN_PX
    //   widget top    edge = vh*0.7 + dy - WIDGET_H/2  →  ≤ vh - EDGE_MARGIN_PX
    const xLower = EDGE_MARGIN_PX - vw / 2 - WIDGET_W / 2;
    const xUpper = vw - EDGE_MARGIN_PX - vw / 2 + WIDGET_W / 2;
    const yLower = EDGE_MARGIN_PX - vh * 0.7 - WIDGET_H / 2;
    const yUpper = vh - EDGE_MARGIN_PX - vh * 0.7 + WIDGET_H / 2;
    const clamp = (v: number, lo: number, hi: number) =>
      Math.max(lo, Math.min(hi, v));
    return {
      x: clamp(dx, xLower, xUpper),
      y: clamp(dy, yLower, yUpper),
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!e.isPrimary) return;
    pointerStart.current = { x: e.clientX, y: e.clientY };
    dragStartOffset.current = { x: dragX.get(), y: dragY.get() };
    setIsPointerDown(true);
    setIsDragArmed(false);
    // Capture the pointer so we keep receiving move/up events even if
    // the finger leaves the widget bounds while dragging.
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    clearLongPressTimer();
    longPressTimer.current = window.setTimeout(() => {
      // Long-press fired without significant movement → arm drag mode.
      setIsDragArmed(true);
    }, LONG_PRESS_MS);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointerStart.current || !isPointerDown || !e.isPrimary) return;
    const dx = e.clientX - pointerStart.current.x;
    const dy = e.clientY - pointerStart.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (isDragArmed) {
      // Drag mode — update offset, with viewport clamping so the widget
      // can't be dragged completely off-screen.
      const { x, y } = clampDrag(dragStartOffset.current.x + dx, dragStartOffset.current.y + dy);
      dragX.set(x);
      dragY.set(y);
    } else if (dist > MOVE_THRESHOLD_PX) {
      // Not armed yet and the user moved more than the threshold → this
      // is a swipe/scroll attempt, not a long-press. Cancel the timer
      // so it can't fire later and steal the gesture.
      clearLongPressTimer();
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    clearLongPressTimer();
    (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);

    if (!isDragArmed && pointerStart.current) {
      // No long-press fired — was this a tap?
      const dx = e.clientX - pointerStart.current.x;
      const dy = e.clientY - pointerStart.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOVE_THRESHOLD_PX) {
        // Tap → toggle spread/close.
        setClickCount((c) => c + 1);
      }
    }
    // If isDragArmed was true, the user dragged — do NOT fire the tap,
    // so release-after-drag doesn't accidentally toggle the cards.

    setIsDragArmed(false);
    setIsPointerDown(false);
    pointerStart.current = null;
  };

  const handlePointerCancel = () => {
    clearLongPressTimer();
    setIsDragArmed(false);
    setIsPointerDown(false);
    pointerStart.current = null;
  };

  return (
    // Outer wrapper — `position: fixed` so the widget escapes the hero
    // section's `overflow-hidden` and can be dragged anywhere on the
    // visible page. Centered horizontally, positioned in the lower
    // portion of the viewport (sitting in the empty blue hero area).
    // `touch-action: none` is scoped to this widget only — touches that
    // start anywhere else on the page still scroll normally.
    <div
      style={{
        position: "fixed",
        left: "50%",
        top: "70%",
        transform: "translate(-50%, -50%)",
        zIndex: 40,
        touchAction: "none",
      }}
    >
      {/* Drag layer — owns the drag offset (x, y). Pointer events for
          long-press detection + drag are attached here, on the same
          element that owns the drag transform. */}
      <motion.div
        style={{ x: dragX, y: dragY }}
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
