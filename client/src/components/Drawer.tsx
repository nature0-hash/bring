import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  onAdminLogin: () => void;
}

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "How it works", href: "#how" },
  { label: "Rates Calculator", href: "#calculator" },
  { label: "Card Rates", href: "#cards" },
  { label: "Why us", href: "#why" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Drawer({ open, onClose, onAdminLogin }: DrawerProps) {
  // Lock body scroll while open.
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Close on ESC.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Scrim */}
          <motion.div
            className="fixed inset-0 z-[60] bg-[#0A1224]/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            className="fixed right-0 top-0 z-[70] h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Top brand bar */}
            <div className="relative bg-gradient-to-br from-[#0047AB] via-[#1E5BD6] to-[#002B6D] px-8 py-10 text-white overflow-hidden">
              <div className="absolute inset-0 bg-grid-dark opacity-40" />
              <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-[#C9A24B]/20 blur-3xl" />

              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 mb-3">
                    Menu
                  </p>
                  <Logo variant="onDark" size={40} />
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close menu"
                  className="rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="relative mt-8 text-sm leading-relaxed text-white/75 max-w-xs">
                Premium global gift card trading. Fast, secure, and trusted worldwide.
              </p>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto px-4 py-6 no-scrollbar">
              <ul className="space-y-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                  >
                    <a
                      href={link.href}
                      onClick={onClose}
                      className="group flex items-center justify-between rounded-xl px-5 py-4 text-[#0A1224] hover:bg-[#F4F7FC] transition-colors"
                    >
                      <span className="font-display text-lg font-semibold">{link.label}</span>
                      <ArrowRight className="h-4 w-4 text-[#6B7384] transition-transform group-hover:translate-x-1 group-hover:text-[#0047AB]" />
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Bottom: admin login */}
            <div className="border-t border-[#E2E8F0] p-6 bg-[#F4F7FC]">
              <button
                onClick={() => {
                  onClose();
                  onAdminLogin();
                }}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#0A1224] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#0047AB] transition-colors"
              >
                <Lock className="h-4 w-4" />
                Admin Login
              </button>
              <p className="mt-3 text-center text-xs text-[#6B7384]">
                Secure portal for staff & rate management.
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
