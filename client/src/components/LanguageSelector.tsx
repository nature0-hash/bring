import { useEffect, useRef, useState } from "react";
import { Check, Globe, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

/**
 * LanguageSelector
 *
 * A compact, self-contained dropdown that lets the user switch the
 * global UI language. Plugged into the dashboard sidebar directly
 * under "User Management".
 *
 * The component is purely presentational. The actual state lives in
 * LanguageContext, so every screen that calls useLanguage() re-renders
 * instantly when the user picks a new language.
 */
export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, options, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = options.find((o) => o.code === language) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
          "text-[#3B4256] hover:bg-[#F4F7FC] hover:text-[#0047AB]",
          open && "bg-[#F4F7FC] text-[#0047AB]"
        )}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0047AB]/10 text-[#0047AB] group-hover:bg-[#0047AB] group-hover:text-white transition-colors">
          <Globe className="h-4 w-4" />
        </span>
        <span className="flex-1 text-left">
          <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#9CA3AF]">
            {t("s.language", "Language")}
          </span>
          <span className="flex items-center gap-1.5 font-semibold text-[#0A1224]">
            <span className="text-base leading-none">{current.flag}</span>
            {current.nativeLabel}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-[#6B7384] transition-transform",
            open && "rotate-180 text-[#0047AB]"
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className={cn(
            "absolute z-50 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_20px_50px_-15px_rgba(0,71,171,0.25)]",
            compact
              ? "left-0 right-0 bottom-full mb-2"
              : "left-0 right-0 top-full mt-2"
          )}
        >
          <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9CA3AF]">
            {t("s.selectLanguage", "Select language")}
          </p>
          <ul className="max-h-72 overflow-y-auto py-1.5">
            {options.map((opt) => {
              const active = opt.code === language;
              return (
                <li key={opt.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      setLanguage(opt.code);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors",
                      active
                        ? "bg-[#0047AB]/5 text-[#0047AB]"
                        : "text-[#3B4256] hover:bg-[#F4F7FC]"
                    )}
                  >
                    <span className="text-lg leading-none">{opt.flag}</span>
                    <span className="flex-1">
                      <span className="block font-semibold text-[#0A1224]">
                        {opt.nativeLabel}
                      </span>
                      <span className="block text-xs text-[#6B7384]">
                        {opt.label}
                      </span>
                    </span>
                    {active && <Check className="h-4 w-4 text-[#0047AB]" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
