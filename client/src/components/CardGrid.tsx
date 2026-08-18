import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import type { GiftCard } from "@/lib/types";
import { CARD_CATEGORIES } from "@/lib/types";
import { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";

interface CardGridProps {
  cards: GiftCard[];
  loading: boolean;
  onSelectCard?: (slug: string) => void;
}

const BRAND_DENOMINATIONS: Record<string, { values: number[]; custom?: boolean }> = {
  steam:         { values: [5, 10, 20, 25, 50, 100] },
  apple:         { values: [25, 50, 100, 200], custom: true },
  itunes:        { values: [25, 50, 100, 200], custom: true },
  amazon:        { values: [10, 25, 50, 100, 200, 500], custom: true },
  "google-play": { values: [10, 15, 25, 50, 100, 200] },
  xbox:          { values: [15, 25, 50, 100] },
  playstation:   { values: [25, 50, 75, 100, 200] },
  netflix:       { values: [15, 25, 30, 50, 100] },
  spotify:       { values: [10, 30, 60] },
  ebay:          { values: [25, 50, 100, 150, 200] },
  walmart:       { values: [25, 50, 100, 200, 500], custom: true },
  target:        { values: [10, 25, 50, 100, 500], custom: true },
  "best-buy":    { values: [25, 50, 100, 200, 500] },
  sephora:       { values: [10, 25, 50, 100, 250] },
  nike:          { values: [25, 50, 100, 200, 250] },
  adidas:        { values: [10, 25, 50, 100, 250] },
  roblox:        { values: [10, 25, 50, 100] },
  discord:       { values: [10, 25, 50, 100] },
  "epic-games":  { values: [10, 25, 50, 100] },
  epic:          { values: [10, 25, 50, 100] },
  uber:          { values: [15, 25, 50, 100, 500], custom: true },
  airbnb:        { values: [25, 50, 100, 200, 500], custom: true },
  visa:          { values: [25, 50, 100, 200, 500] },
  mastercard:    { values: [25, 50, 100, 200, 500] },
  amex:          { values: [25, 50, 100, 200, 500] },
  "american-express": { values: [25, 50, 100, 200, 500] },
  "razer-gold":  { values: [10, 20, 25, 50, 100] },
  razer:         { values: [10, 20, 25, 50, 100] },
};

const DEFAULT_DENOMINATIONS = { values: [25, 50, 100, 200, 500] as number[], custom: false };

export function CardGrid({ cards, loading, onSelectCard }: CardGridProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  const categoryTabs = useMemo(() => {
    const present = new Set(cards.map((c) => c.category).filter(Boolean));
    return [{ key: "all", label: "All cards" }, ...CARD_CATEGORIES.filter((c) => present.has(c.key))];
  }, [cards]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cards.filter((c) => {
      const matchesCategory = category === "all" || c.category === category;
      const matchesQuery = !q || c.brand.toLowerCase().includes(q) || c.slug.includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [cards, query, category]);

  const handleSelect = (slug: string) => {
    onSelectCard?.(slug);
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div id="cards" className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mb-8 max-w-xl"
      >
        <div className="group relative">
          <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B7384] transition-colors group-focus-within:text-[#0047AB]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search gift cards: Steam, Apple, Amazon…"
            className="w-full rounded-2xl border border-[#E2E8F0] bg-white py-4 pl-14 pr-12 text-base text-[#0A1224] shadow-sm placeholder:text-[#9CA3AF] focus:border-[#0047AB] focus:outline-none focus:ring-4 focus:ring-[#0047AB]/10 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#6B7384] hover:bg-[#F4F7FC] hover:text-[#0A1224] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </motion.div>

      {categoryTabs.length > 1 && (
        <div className="mx-auto mb-8 flex max-w-5xl flex-wrap items-center justify-center gap-2">
          {categoryTabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setCategory(t.key)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                category === t.key
                  ? "border-[#0047AB] bg-[#0047AB] text-white shadow-md shadow-[#0047AB]/25"
                  : "border-[#E2E8F0] bg-white text-[#3B4256] hover:border-[#0047AB]/40 hover:text-[#0047AB]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <p className="mb-8 text-center text-sm text-[#6B7384]">
        Showing{" "}
        <span className="font-semibold text-[#0047AB]">{filtered.length}</span> of{" "}
        <span className="font-semibold">{cards.length}</span> tradable cards · live rates
      </p>

      {loading ? (
        <CardSkeletonGrid />
      ) : filtered.length === 0 ? (
        <EmptyState query={query} onReset={() => { setQuery(""); setCategory("all"); }} />
      ) : (
        <StaggerContainer
          stagger={0.06}
          className="mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filtered.map((card) => (
            <StaggerItem key={card.id}>
              <CardTile card={card} onClick={() => handleSelect(card.slug)} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}

function CardTile({ card, onClick }: { card: GiftCard; onClick: () => void }) {
  const denoms = BRAND_DENOMINATIONS[card.slug] ?? DEFAULT_DENOMINATIONS;
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm hover:shadow-[0_20px_50px_-15px_rgba(0,71,171,0.25)] hover:border-[#0047AB]/30 transition-all duration-300"
    >
      <div className="relative h-28 overflow-hidden sm:h-44">
        {card.imageUrl ? (
          <img src={card.imageUrl} alt={card.brand} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#E2E8F0] to-[#F4F7FC]">
            <svg className="h-10 w-10 text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
            <span className="text-[11px] font-medium text-[#9CA3AF]">No image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-3 sm:p-5">
        <h3 className="font-display text-xs font-bold tracking-tight text-[#0A1224] sm:text-base line-clamp-1">
          {card.brand}
        </h3>
        <p className="mt-0.5 hidden text-xs text-[#6B7384] sm:mt-1 sm:block">
          Available card values
        </p>

        <div className="mt-3 flex flex-wrap gap-1 sm:gap-1.5">
          {denoms.values.map((d) => (
            <span
              key={d}
              className="rounded-lg bg-[#F4F7FC] px-1.5 py-1 text-center font-mono text-[9px] font-bold text-[#0047AB] sm:px-2 sm:py-1.5 sm:text-[11px]"
            >
              ${d}
            </span>
          ))}
          {denoms.custom && (
            <span className="rounded-lg bg-[#C9A24B]/15 px-1.5 py-1 text-center font-mono text-[9px] font-bold text-[#9B7A2E] sm:px-2 sm:py-1.5 sm:text-[11px]">
              Custom
            </span>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-2xl shimmer opacity-0 group-hover:opacity-100" />
    </motion.article>
  );
}

function CardSkeletonGrid() {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white"
        >
          <div className="h-28 animate-pulse bg-[#F4F7FC] sm:h-44" />
          <div className="p-3 sm:p-5">
            <div className="h-3 w-20 animate-pulse rounded bg-[#F4F7FC] sm:h-4 sm:w-24" />
            <div className="mt-3 hidden h-3 w-16 animate-pulse rounded bg-[#F4F7FC] sm:block" />
            <div className="mt-3 grid grid-cols-5 gap-1 sm:gap-1.5">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="h-7 animate-pulse rounded-lg bg-[#F4F7FC] sm:h-10" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ query, onReset }: { query: string; onReset: () => void }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="empty"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        className="mx-auto max-w-md rounded-2xl border border-dashed border-[#E2E8F0] bg-[#F4F7FC] p-10 text-center"
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
          <Search className="h-5 w-5 text-[#6B7384]" />
        </div>
        <p className="font-display text-base font-semibold text-[#0A1224]">
          No cards match "{query}"
        </p>
        <p className="mt-1 text-sm text-[#6B7384]">
          Try a different brand name or clear your search.
        </p>
        <button
          onClick={onReset}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0047AB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#002B6D] transition-colors"
        >
          <X className="h-4 w-4" />
          Clear search
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
