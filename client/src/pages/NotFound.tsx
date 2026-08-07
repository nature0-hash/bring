import { Link } from "wouter";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#0A1224] via-[#002B6D] to-[#0047AB] px-4 text-center">
      <div className="absolute inset-0 bg-grid-dark opacity-30" />
      <div className="relative">
        <Logo variant="onDark" size={56} />
        <h1 className="mt-8 font-display text-7xl font-black tracking-tight text-white sm:text-9xl">
          404
        </h1>
        <p className="mt-3 text-lg text-white/70">
          The page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#0047AB] hover:bg-white/90 transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
