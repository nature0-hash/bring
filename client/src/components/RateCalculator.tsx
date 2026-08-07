import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Calculator, ChevronDown } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import type { GiftCard } from "@/lib/types";
import { useCountry } from "@/lib/useCountry";
import { fetchCardRates, fetchSettings } from "@/lib/api";
import { convertFromUSD } from "@/lib/fx";
import type { CardRate } from "@/lib/types";

const DEFAULT_WHATSAPP_NUMBER = "84779423224";

interface RateCalculatorProps {
  cards: GiftCard[];
  loading: boolean;
  selectedSlug?: string;
  onSelectSlug?: (slug: string) => void;
}

/**
 * Sanitizes a raw text input from the amount field into a clean integer
 * string with no leading zeros and no fractional cents (the calculator
 * only deals with whole-dollar face values). Returns "" for empty.
 *
 * Examples:
 *   ""        -> ""
 *   "0"       -> "0"
 *   "00"      -> "0"
 *   "050"     -> "50"
 *   "0070"    -> "70"
 *   "50"      -> "50"
 *   "12.99"   -> "12"
 *   "abc"     -> ""
 *   "-5"      -> "5"
 */
function sanitizeAmountInput(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.length === 0) return "";
  const stripped = digits.replace(/^0+(?=\d)/, "");
  return stripped.length === 0 ? "0" : stripped;
}

export function RateCalculator({ cards, loading, selectedSlug, onSelectSlug }: RateCalculatorProps) {
  const [internalSlug, setInternalSlug] = useState<string>("");
  const [faceValue, setFaceValue] = useState<number>(100);
  const [faceValueInput, setFaceValueInput] = useState<string>("100");
  const [rates, setRates] = useState<CardRate[]>([]);
  const [loadingRates, setLoadingRates] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState(DEFAULT_WHATSAPP_NUMBER);

  const { countries, countryCode, selectedCountry, selectCountry } = useCountry();

  // Controlled (from CardGrid click) or self-managed selection.
  const activeSlug = selectedSlug ?? internalSlug;
  const setActiveSlug = (slug: string) => {
    setInternalSlug(slug);
    onSelectSlug?.(slug);
  };

  useEffect(() => {
    if (!activeSlug && cards.length > 0) {
      setActiveSlug(cards[0].slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards]);

  useEffect(() => {
    fetchSettings()
      .then((s) => {
        if (s.whatsapp_number) setWhatsappNumber(s.whatsapp_number);
      })
      .catch(() => {});
  }, []);

  const selectedCard = cards.find((c) => c.slug === activeSlug) ?? cards[0];

  // Load flexible rates for the selected card + country.
  useEffect(() => {
    if (!selectedCard || !selectedCountry) {
      setRates([]);
      return;
    }
    setLoadingRates(true);
    fetchCardRates(selectedCard.id, selectedCountry.id)
      .then(setRates)
      .catch(() => setRates([]))
      .finally(() => setLoadingRates(false));
  }, [selectedCard?.id, selectedCountry?.id]);

  // Sorted list of configured face values for this card+country (denomination picker).
  const configuredValues = useMemo(
    () => [...rates].sort((a, b) => a.faceValue - b.faceValue),
    [rates]
  );

  const hasConfiguredRates = configuredValues.length > 0;

  // Keep faceValue snapped to a configured denomination when rates exist.
  useEffect(() => {
    if (hasConfiguredRates && !configuredValues.some((r) => r.faceValue === faceValue)) {
      const snapped = configuredValues[0].faceValue;
      setFaceValue(snapped);
      setFaceValueInput(String(snapped));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configuredValues]);

  // Sync the text input whenever faceValue changes from outside sources
  // (e.g. denomination picker or initial mount) so the displayed value
  // never drifts from the underlying number.
  useEffect(() => {
    setFaceValueInput((prev) => (prev === "" && faceValue === 0 ? "" : String(faceValue)));
  }, [faceValue]);

  // Single source of truth for the input change handler. Strips leading
  // zeros on every keystroke so typing "0","5","0" produces "5" not "050".
  const handleAmountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = sanitizeAmountInput(e.target.value);
    setFaceValueInput(cleaned);
    setFaceValue(cleaned === "" ? 0 : Math.min(10000, Math.max(0, parseInt(cleaned, 10))));
  };

  const matchedRate = configuredValues.find((r) => r.faceValue === faceValue);
  const baseRate = selectedCard?.baseRate ?? 0;

  const usdEstimate = Math.max(0, faceValue) * baseRate;
  // Always convert the estimate into the SELECTED country's currency, even
  // when no admin-configured local rate exists yet for this denomination.
  const localEstimate = convertFromUSD(usdEstimate, selectedCountry?.currencyCode);

  const formatted = matchedRate
    ? `${selectedCountry?.currencySymbol ?? ""}${matchedRate.localRate.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
    : `${selectedCountry?.currencySymbol ?? "$"}${localEstimate.toLocaleString("en-US", {
        minimumFractionDigits: selectedCountry?.currencyCode === "USD" ? 2 : 0,
        maximumFractionDigits: selectedCountry?.currencyCode === "USD" ? 2 : 0,
      })} (est.)`;

  const whatsappMessage = selectedCard
    ? `Hello Bring Gift Card! I want to trade $${faceValue} of ${selectedCard.brand} (${selectedCountry?.name ?? ""}). Estimated payout: ${formatted}. Please send me your payout details.`
    : `Hello Bring Gift Card! I'd like to get a quote for my gift card.`;

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section id="calculator" className="relative bg-gradient-to-b from-[#F4F7FC] to-white py-28 sm:py-36">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#0047AB]">
              Instant quotation
            </p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#0A1224] sm:text-4xl lg:text-5xl">
              Live exchange rate calculator
            </h2>
            <p className="mt-4 text-base text-[#6B7384] sm:text-lg">
              Select your country, card, and amount to see your exact payout estimate before starting your WhatsApp trade.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.12}>
          <div
            data-testid="rate-calculator-card"
            className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-[0_30px_60px_-25px_rgba(0,71,171,0.18)] sm:p-10"
          >
            {loading || cards.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0047AB]/10 text-[#0047AB]">
                  <Calculator className="h-5 w-5 animate-pulse" />
                </div>
                <p className="text-sm text-[#6B7384]">Loading live rates…</p>
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* 0. Country select */}
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#3B4256]">
                      Your country
                    </label>
                    <div className="relative">
                      <select
                        value={countryCode}
                        onChange={(e) => selectCountry(e.target.value)}
                        data-testid="calc-country-select"
                        className="w-full appearance-none rounded-xl border border-[#E2E8F0] bg-[#F8FAFF] px-4 py-3.5 text-sm font-medium text-[#0A1224] transition-colors focus:border-[#0047AB] focus:outline-none"
                      >
                        {countries.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flagEmoji ? `${c.flagEmoji} ` : ""}{c.name} ({c.currencyCode})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7384]" />
                    </div>
                  </div>

                  {/* 1. Brand select */}
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#3B4256]">
                      1. Select gift card brand
                    </label>
                    <select
                      value={activeSlug}
                      onChange={(e) => setActiveSlug(e.target.value)}
                      data-testid="calc-brand-select"
                      className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFF] px-4 py-3.5 text-sm font-medium text-[#0A1224] transition-colors focus:border-[#0047AB] focus:outline-none"
                    >
                      {cards.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.brand}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Face value */}
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#3B4256]">
                      2. Face value (USD)
                    </label>
                    {hasConfiguredRates ? (
                      <select
                        value={faceValue}
                        onChange={(e) => setFaceValue(Number(e.target.value))}
                        data-testid="calc-amount-select"
                        className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFF] px-4 py-3.5 text-sm font-bold text-[#0A1224] transition-colors focus:border-[#0047AB] focus:outline-none"
                      >
                        {configuredValues.map((r) => (
                          <option key={r.id} value={r.faceValue}>
                            ${r.faceValue}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#6B7384]">
                          $
                        </span>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          min={1}
                          max={10000}
                          value={faceValueInput}
                          onChange={handleAmountInput}
                          onBlur={() => {
                            if (faceValueInput === "" || faceValue === 0) {
                              setFaceValue(100);
                              setFaceValueInput("100");
                            }
                          }}
                          data-testid="calc-amount-input"
                          placeholder="50"
                          className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFF] py-3.5 pl-8 pr-4 text-sm font-bold text-[#0A1224] transition-colors focus:border-[#0047AB] focus:outline-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* 3. Current rate readout */}
                  <div className="flex items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F4F7FC] px-4 py-3.5 sm:col-span-2">
                    <span className="text-sm text-[#6B7384]">
                      {loadingRates
                        ? "Loading rate…"
                        : matchedRate ? (
                          <>
                            Local rate set by our team for{" "}
                            <strong className="text-[#0047AB]">{selectedCountry?.name}</strong>
                          </>
                        ) : (
                          <>
                            We offer some of the <strong className="text-[#0047AB]">best rates</strong> in the market. Chat with us for your exact quote.
                          </>
                        )}

                    </span>
                  </div>
                </div>

                {/* Result box */}
                <div className="relative mt-8 overflow-hidden rounded-2xl bg-gradient-to-br from-[#002B6D] via-[#0047AB] to-[#1E5BD6] p-6 text-white sm:p-7">
                  <div className="absolute inset-0 bg-grid-dark opacity-30" />
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
                  <div className="relative flex flex-col items-center justify-between gap-6 sm:flex-row">
                    <div className="text-center sm:text-left">
                      <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                        Estimated instant payout
                      </p>
                      <p
                        data-testid="calc-result"
                        className="mt-1 font-display text-3xl font-black tracking-tight sm:text-4xl"
                      >
                        {formatted}
                      </p>
                      <p className="mt-1 font-mono text-[11px] text-white/70">
                        {selectedCard?.brand ?? "..."} · ${faceValue} face value
                      </p>
                    </div>

                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid="calc-whatsapp-button"
                      className="inline-flex w-full flex-none items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-bold text-[#0047AB] shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Trade this amount now
                    </a>
                  </div>
                </div>

                <p className="mt-4 text-center text-[11px] text-[#6B7384]">
                  Rates are set live by our team and may vary with market demand. Instant payout
                  upon code verification.
                </p>
              </>
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
