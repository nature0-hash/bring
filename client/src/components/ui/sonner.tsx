import { Toaster as Sonner, type ToasterProps } from "sonner";

/**
 * Thin wrapper around sonner's Toaster.
 * `next-themes` integration removed — this app is single-theme (light).
 */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
