import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, User, X, Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";

interface AdminLoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AdminLoginModal({ open, onClose, onSuccess }: AdminLoginModalProps) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setUsername("");
      setPassword("");
      setSubmitting(false);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      toast.error("Please enter both username and password.");
      return;
    }
    setSubmitting(true);
    try {
      await login(username.trim(), password);
      toast.success("Welcome back. Redirecting to dashboard…");
      onSuccess?.();
      onClose();
      // Small delay so the toast can render before navigation.
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 600);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-[#0A1224]/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              initial={{ scale: 0.96, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 24, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="login-title"
            >
              {/* Top brand band */}
              <div className="relative bg-gradient-to-br from-[#002B6D] via-[#0047AB] to-[#1E5BD6] px-8 pt-8 pb-10 text-white overflow-hidden">
                <div className="absolute inset-0 bg-grid-dark opacity-40" />
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-[#C9A24B]/20 blur-3xl" />

                <button
                  onClick={onClose}
                  aria-label="Close login"
                  className="absolute right-4 top-4 rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="relative">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 ring-1 ring-white/20">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Secure Admin Portal
                  </div>
                  <Logo variant="onDark" size={44} />
                  <h2 id="login-title" className="mt-5 font-display text-2xl font-bold tracking-tight">
                    Sign in to your dashboard
                  </h2>
                  <p className="mt-1 text-sm text-white/70">
                    Manage rates, cards, and team members.
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-8 py-7">
                <label className="block text-sm font-medium text-[#0A1224] mb-1.5">
                  Username
                </label>
                <div className="relative mb-4">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7384]" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    autoFocus
                    placeholder="Enter your username"

                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F4F7FC] py-3 pl-10 pr-4 text-sm text-[#0A1224] placeholder:text-[#9CA3AF] focus:border-[#0047AB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 transition-all"
                  />
                </div>

                <label className="block text-sm font-medium text-[#0A1224] mb-1.5">
                  Password
                </label>
                <div className="relative mb-6">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7384]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F4F7FC] py-3 pl-10 pr-4 text-sm text-[#0A1224] placeholder:text-[#9CA3AF] focus:border-[#0047AB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0047AB] to-[#1E5BD6] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#0047AB]/30 transition-all hover:shadow-xl hover:shadow-[#0047AB]/40 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign in to dashboard
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </>
                  )}
                </button>

                <p className="mt-5 text-center text-xs leading-relaxed text-[#6B7384]">
                  Protected by JWT session. Unauthorized access is prohibited and logged.
                </p>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
