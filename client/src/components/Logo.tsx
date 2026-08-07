import { cn } from "@/lib/utils";

type Variant = "onLight" | "onDark";

interface LogoProps {
  variant?: Variant;
  size?: number;
  className?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
}

/**
 * Brand logo for Bring Gift Card.
 *
 * Uses the real full brand mark (globe + handshake + wordmark) with a
 * transparent background so it blends on any surface:
 *   - `onLight` → blue mark (for light bars / white sections).
 *   - `onDark`  → white mark (for the dark royal-blue hero / footer).
 */
export function Logo({
  variant = "onLight",
  size = 44,
  className,
  showWordmark = true,
  wordmarkClassName,
}: LogoProps) {
  const src = variant === "onDark" ? "/bgc-logo-white.png" : "/bgc-logo-blue.png";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <img
        src={src}
        alt="Bring Gift Card logo"
        className="object-contain"
        style={{ width: size, height: size }}
        draggable={false}
      />
      {showWordmark && (
        <span
          className={cn(
            "font-display font-extrabold tracking-tight",
            variant === "onDark" ? "text-white" : "text-[#0047AB]",
            wordmarkClassName
          )}
          style={{ fontSize: size * 0.4 }}
        >
          Bring Gift Card
        </span>
      )}
    </span>
  );
}
