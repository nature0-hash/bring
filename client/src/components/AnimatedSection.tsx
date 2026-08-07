import { useRef, type ReactNode } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}

/**
 * Reusable scroll-reveal wrapper.
 * Fades children up + in with a smooth cubic-bezier when they enter the viewport.
 */
export function AnimatedSection({
  children,
  className = "",
  delay = 0,
  y = 36,
  once = true,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Stagger container — children with `staggerItem` reveal in sequence. */
export function StaggerContainer({
  children,
  className = "",
  stagger = 0.08,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * RevealText — word-by-word slide-up reveal (used in older heroes).
 * Kept for backwards compatibility but not used in the new hero.
 */
export function RevealText({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const words = text.split(" ");
  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={isInView ? { y: 0 } : { y: "110%" }}
            transition={{
              duration: 0.6,
              delay: delay + i * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/**
 * DropText — letters drop down one-by-one from above and settle into place.
 *
 * Triggers:
 *   - On mount (page load / reload)
 *   - When the element re-enters the viewport after scrolling away (so the user
 *     can replay the effect by scrolling back to the top of the page).
 *
 * Each letter starts above its slot (y: -120%), fades in from opacity 0, and
 * drops with a spring bounce — like rain falling into a row.
 *
 * The trigger fires whenever `inView` flips from false → true. Because
 * `once` is false, scrolling away and back re-triggers the drop.
 */
export function DropText({
  text,
  className = "",
  delay = 0,
  stagger = 0.05,
  dropDistance = "120%",
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  /** Seconds between consecutive letters. */
  stagger?: number;
  /** How far above each letter starts. Any CSS length, e.g. "120%" or "-80px". */
  dropDistance?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { amount: 0.4 });

  return (
    <Tag
      ref={ref as React.Ref<HTMLHeadingElement>}
      className={className}
      aria-label={text}
    >
      {text.split("").map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          className="inline-block overflow-hidden align-bottom"
          style={{ whiteSpace: "pre" }}
        >
          <motion.span
            className="inline-block"
            initial={{ y: `-${dropDistance}` , opacity: 0 }}
            animate={
              isInView
                ? { y: 0, opacity: 1 }
                : { y: `-${dropDistance}`, opacity: 0 }
            }
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 18,
              mass: 0.7,
              delay: delay + i * stagger,
            }}
          >
            {ch}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/**
 * useHeroDropTrigger — a small hook that returns `true` whenever the hero is
 * near the top of the viewport, so the DropText re-fires when the user scrolls
 * back up. This is wired into the Home hero so the headline re-drops on scroll
 * back to top, on top of DropText's own in/out trigger.
 */
export function useHeroDropTrigger() {
  const { scrollY } = useScroll();
  // Boolean-ish transform: 1 when at top (scrollY < 50), 0 when scrolled past 200.
  return useTransform(scrollY, [0, 50, 200], [1, 1, 0]);
}
