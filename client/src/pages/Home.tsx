import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  CreditCard,
  Bitcoin,
  DollarSign,
  MessageCircle,
  ChevronDown,
  Users,
  TrendingUp,
  Lock,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Hero3D, Hero3DMobilePreview } from "@/components/Hero3D";

import { CardGrid } from "@/components/CardGrid";
import { RateCalculator } from "@/components/RateCalculator";
import { Footer } from "@/components/Footer";

import { AdminLoginModal } from "@/components/AdminLoginModal";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import { fetchGiftCards, fetchStaff, fetchSiteImages, fetchSettings } from "@/lib/api";
import type { GiftCard, Staff, SiteImagesMap } from "@/lib/types";

const DEFAULT_WHATSAPP_NUMBER = "84779423224";

function scrollToCards() {
  document
    .getElementById("cards")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [cards, setCards] = useState<GiftCard[]>([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [staff, setStaff] = useState<Staff[]>([]);
  const [siteImages, setSiteImages] = useState<SiteImagesMap>({});
  const [whatsappNumber, setWhatsappNumber] = useState(DEFAULT_WHATSAPP_NUMBER);

  useEffect(() => {
    fetchGiftCards()
      .then(setCards)
      .catch((err) => {
        console.error("Failed to load gift cards:", err);
        setCards([]);
      })
      .finally(() => setLoadingCards(false));

    fetchStaff().then(setStaff).catch(() => setStaff([]));
    fetchSiteImages().then(setSiteImages).catch(() => setSiteImages({}));
    fetchSettings()
      .then((s) => {
        if (s.whatsapp_number) setWhatsappNumber(s.whatsapp_number);
      })
      .catch(() => {});
  }, []);

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hello Bring Gift Card! I'd like to get a quote for my gift card."
  )}`;

  return (
    <div className="relative min-h-screen bg-white">
      <Header onAdminLogin={() => setLoginOpen(true)} />
      <AdminLoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <main>
        <Hero onAdminLogin={() => setLoginOpen(true)} whatsappLink={whatsappLink} />
        <StatsBar />
        <HowItWorks />
        <RateCalculator
          cards={cards}
          loading={loadingCards}
          selectedSlug={selectedSlug}
          onSelectSlug={setSelectedSlug}
        />
        <CardsSection cards={cards} loading={loadingCards} onSelectCard={setSelectedSlug} />

        <ServicesSection />
        <WhyUs />
        <AboutSection siteImages={siteImages} whatsappLink={whatsappLink} />
        <TeamSection staff={staff} />
      </main>

      <Footer />
    </div>
  );
}

/* HERO */
function Hero({
  onAdminLogin: _onAdminLogin,
  whatsappLink,
}: {
  onAdminLogin: () => void;
  whatsappLink: string;
}) {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden bg-[#0A1224]"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A1224] via-[#002B6D] to-[#0047AB]" />
      <div className="absolute inset-0 bg-grid-dark opacity-40" />
      <div className="absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[#1E5BD6]/30 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-[#C9A24B]/10 blur-[100px]" />

      {/* Logo watermark — the new transparent white-globe logo.
          BIG and centered behind the cards. Because the PNG has no
          background, only the white globe silhouette shows against the
          royal-blue gradient — no white blob, just the logo shape.
          Scaled down for mobile so the hero proportions stay clean and
          balanced, then grows back to full size on tablet and desktop. */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none"
        aria-hidden
      >
        <img
          src="/logo-transparent.png"
          alt=""
          className="h-[420px] w-[420px] max-w-none object-contain opacity-[0.18] sm:h-[680px] sm:w-[680px] sm:opacity-[0.16] md:h-[960px] md:w-[960px] lg:h-[1400px] lg:w-[1400px] lg:opacity-[0.16]"
          draggable={false}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
        {/* Left — copy (takes left half; cards are absolutely positioned over the right half) */}
        <div className="lg:max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#16A34A] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#16A34A]" />
            </span>
            Trusted by 12,000+ traders worldwide
          </motion.div>

          <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              Your trusted
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              global gift card
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="block text-gradient-royal"
            >
              partner.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg"
          >
            <span className="font-semibold text-white">BRING GIFT CARD</span> delivers secure, instant, and reliable gift card trading worldwide. Get the best rates for Amazon, Steam, iTunes, Google Play, Xbox and many more, paid out within minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-sm font-bold text-[#0047AB] shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <button
              type="button"
              onClick={scrollToCards}
              data-testid="hero-browse-rates-button"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-7 py-4 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/10"
            >
              Browse live rates
              <ChevronDown className="h-4 w-4" />
            </button>
          </motion.div>

          {/* Trust mini-row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-white/50"
          >
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-[#5B85E5]" /> 100% secure
            </span>
            <span className="inline-flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-[#5B85E5]" /> Instant pay
            </span>
            <span className="inline-flex items-center gap-2">
              <Globe className="h-3.5 w-3.5 text-[#5B85E5]" /> 80+ countries served
            </span>
          </motion.div>

          {/* Mobile/tablet card preview — the full interactive 3D spread is
              desktop-only (lg:block below), so smaller screens get a
              lightweight static preview of the real card designs instead
              of nothing at all. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10 lg:hidden"
          >
            <Hero3DMobilePreview />
          </motion.div>
        </div>
      </div>

      {/* 3D hero — absolutely positioned over the right half of the hero section.
          Rendered OUTSIDE the grid so it can spread wide without being clipped
          by the grid column. Hidden on mobile (lg:block). */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 z-10 hidden pointer-events-none lg:block"
      >
        <Hero3D />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-6 w-6 text-white/40" />
      </motion.div>
    </section>
  );
}

/* STATS BAR */
function StatsBar() {
  const stats = [
    { value: "12K+", label: "Active traders", icon: <Users className="h-4 w-4" /> },
    { value: "$48M+", label: "Volume traded", icon: <DollarSign className="h-4 w-4" /> },
    { value: "50+", label: "Gift card brands", icon: <CreditCard className="h-4 w-4" /> },
    { value: "80+", label: "Countries served", icon: <Globe className="h-4 w-4" /> },
  ];
  return (
    <section className="relative -mt-16 z-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="grid grid-cols-2 gap-4 rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-[0_30px_60px_-20px_rgba(0,71,171,0.2)] sm:grid-cols-4 sm:p-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0047AB]/10 text-[#0047AB]">
                  {s.icon}
                </div>
                <p className="font-display text-2xl font-extrabold tracking-tight text-[#0A1224] sm:text-3xl">
                  {s.value}
                </p>
                <p className="mt-1 text-xs font-medium text-[#6B7384] sm:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* HOW IT WORKS */
function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Get a live quote",
      desc: "Search any brand, see the current rate instantly. No signup required to browse.",
    },
    {
      num: "02",
      title: "Send your card",
      desc: "Submit your card details via WhatsApp or our secure form. Encrypted end-to-end.",
    },
    {
      num: "03",
      title: "Get paid in minutes",
      desc: "Choose your preferred payout — bank, crypto, or wallet. Funds land in under 5 minutes.",
    },
  ];
  return (
    <section id="how" className="py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#0047AB]">
              How it works
            </p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#0A1224] sm:text-4xl lg:text-5xl">
              Trade in three simple steps
            </h2>
            <p className="mt-4 text-base text-[#6B7384] sm:text-lg">
              From quote to payout in under five minutes. No hidden fees, no surprises.
            </p>
          </div>
        </AnimatedSection>

        <StaggerContainer className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <StaggerItem key={step.num}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-8 transition-all hover:border-[#0047AB]/30 hover:shadow-[0_20px_50px_-15px_rgba(0,71,171,0.2)]">
                <div className="absolute right-6 top-6 font-display text-5xl font-black text-[#F4F7FC] transition-colors group-hover:text-[#E6EEFB]">
                  {step.num}
                </div>
                <div className="relative">
                  <div className="mb-5 h-1 w-10 rounded-full bg-gradient-to-r from-[#0047AB] to-[#1E5BD6]" />
                  <h3 className="font-display text-xl font-bold tracking-tight text-[#0A1224]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#6B7384]">{step.desc}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* CARDS SECTION */
function CardsSection({
  cards,
  loading,
  onSelectCard,
}: {
  cards: GiftCard[];
  loading: boolean;
  onSelectCard?: (slug: string) => void;
}) {
  return (
    <section className="relative bg-gradient-to-b from-white to-[#F4F7FC] py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#0047AB]">
              Live card rates
            </p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#0A1224] sm:text-4xl lg:text-5xl">
              All brands. Best rates.
            </h2>
            <p className="mt-4 text-base text-[#6B7384] sm:text-lg">
              Rates update in real time. Search any brand to see what you'll get paid today.
            </p>
          </div>
        </AnimatedSection>

        <CardGrid cards={cards} loading={loading} onSelectCard={onSelectCard} />
      </div>
    </section>
  );
}

/* SERVICES */
function ServicesSection() {
  const services = [
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Gift Card Trading",
      desc: "Steam, Apple, Amazon, Google Play, Xbox, and 50+ more. We buy and sell all major brands at the most competitive rates globally.",
      tag: "Most popular",
    },
    {
      icon: <Bitcoin className="h-6 w-6" />,
      title: "Cryptocurrency Exchange",
      desc: "Buy and sell Bitcoin, USDT, Ethereum, and 20+ other coins. Fast settlement, transparent fees, and wallet-to-wallet transfers.",
      tag: "24/7 market",
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Global Money Transfers",
      desc: "Send money to 80+ countries in minutes. Lock in competitive FX rates and track your transfer from send to receive.",
      tag: "80+ countries",
    },
  ];

  return (
    <section id="services" className="py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#0047AB]">
              Our services
            </p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#0A1224] sm:text-4xl lg:text-5xl">
              One platform, three powerful services
            </h2>
            <p className="mt-4 text-base text-[#6B7384] sm:text-lg">
              Built for individuals and businesses who demand speed, security, and the best rates.
            </p>
          </div>
        </AnimatedSection>

        <StaggerContainer className="grid gap-6 lg:grid-cols-3">
          {services.map((s) => (
            <StaggerItem key={s.title}>
              <article className="group relative h-full overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white p-8 transition-all hover:-translate-y-1 hover:shadow-[0_30px_60px_-20px_rgba(0,71,171,0.25)]">
                <div className="absolute right-6 top-6 rounded-full bg-[#F4F7FC] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0047AB]">
                  {s.tag}
                </div>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0047AB] to-[#1E5BD6] text-white shadow-lg shadow-[#0047AB]/30">
                  {s.icon}
                </div>
                <h3 className="font-display text-xl font-bold tracking-tight text-[#0A1224]">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#6B7384]">{s.desc}</p>
                <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0047AB] opacity-0 transition-all group-hover:opacity-100">
                  Learn more
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* WHY US */
function WhyUs() {
  const features = [
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      title: "Bank-grade security",
      desc: "Every transaction is protected with 256-bit encryption and multi-layer fraud detection. Your funds and data are always safe.",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Lightning-fast payouts",
      desc: "Average payout time is under 5 minutes. No waiting days for your money to clear — we move at the speed of your business.",
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Best market rates",
      desc: "Our pricing engine scans the market in real time so you always get the most competitive rate, updated live on the dashboard.",
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: "Truly global coverage",
      desc: "We serve customers in 80+ countries with local payment rails, multi-currency payouts, and 24/7 multilingual support.",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Dedicated support",
      desc: "A real human responds within minutes on WhatsApp, every hour of every day. No bots, no tickets, just answers.",
    },
    {
      icon: <Lock className="h-5 w-5" />,
      title: "Compliance & KYC",
      desc: "We operate within strict AML/KYC frameworks and partner with regulated payment institutions across all major jurisdictions.",
    },
  ];
  return (
    <section id="why" className="relative overflow-hidden bg-[#0A1224] py-28 text-white sm:py-36">
      <div className="absolute inset-0 bg-grid-dark opacity-30" />
      <div className="absolute -top-32 left-1/2 h-96 w-[800px] -translate-x-1/2 rounded-full bg-[#0047AB]/40 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#5B85E5]">
              Why choose us
            </p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Built like a bank. Moves like a startup.
            </h2>
            <p className="mt-4 text-base text-white/60 sm:text-lg">
              Every detail engineered for trust, speed, and scale.
            </p>
          </div>
        </AnimatedSection>

        <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <StaggerItem key={f.title}>
              <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur transition-all hover:border-[#5B85E5]/30 hover:bg-white/[0.06]">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#0047AB]/30 text-[#5B85E5] ring-1 ring-white/10 transition-colors group-hover:bg-[#0047AB] group-hover:text-white">
                  {f.icon}
                </div>
                <h3 className="font-display text-lg font-bold tracking-tight">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{f.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ABOUT */
function AboutSection({
  siteImages,
  whatsappLink,
}: {
  siteImages: SiteImagesMap;
  whatsappLink: string;
}) {
  const promises = [
    "Best rate guarantee — we'll match any verified competitor",
    "5-minute average payout, or your fee back",
    "Real human support, 24/7, on WhatsApp",
    "Full compliance with AML/KYC in every market we serve",
  ];
  const founders = [
    {
      name: "Boss Mandy",
      role: "Co-Founder & CEO",
      img: siteImages.founder_mandy || "/founder-mandy.png",
      desc: "Leading Bring Gift Card's global operations with a passion for connecting people through seamless trading services.",
    },
    {
      name: "Boss Kevin",
      role: "Co-Founder & Director",
      img: siteImages.founder_kevin || "/founder-kevin.png",
      desc: "Driving the company's vision and strategic growth, ensuring top-tier service for customers across the globe.",
    },
  ];

  return (
    <section id="about" className="bg-gradient-to-b from-white to-[#F4F7FC] py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
          {/* LEFT — About us + Our promise */}
          <AnimatedSection>
            <div
              data-testid="about-us-card"
              className="flex h-full flex-col rounded-3xl border border-[#E2E8F0] bg-white p-8 shadow-[0_30px_60px_-25px_rgba(0,71,171,0.18)] sm:p-10"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#0047AB]">
                About us
              </p>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#0A1224] sm:text-4xl">
                A premium company, built on trust.
              </h2>
              <div className="mt-6 space-y-5 text-sm leading-relaxed text-[#3B4256] sm:text-base">
                <p>
                  Bring Gift Card was founded with one mission: to make global gift card
                  trading as fast, transparent, and secure as a wire transfer. We pair
                  bank-grade infrastructure with the agility of a modern fintech, so our
                  customers can move money anywhere in the world without friction.
                </p>
                <p>
                  Today, we serve over 12,000 active traders across 80+ countries and
                  process millions in monthly volume. Our team operates 24/7 from offices
                  in three continents, with deep expertise in payments, crypto, and
                  cross-border compliance.
                </p>
                <p>
                  Whether you're an individual cashing out a single gift card or a
                  business managing bulk inventory, you get the same premium experience:
                  the best rates, instant payouts, and a real human on the other end of
                  WhatsApp whenever you need help.
                </p>
              </div>

              {/* Our promise */}
              <div className="relative mt-8 overflow-hidden rounded-2xl bg-gradient-to-br from-[#002B6D] via-[#0047AB] to-[#1E5BD6] p-6 text-white sm:p-7">
                <div className="absolute inset-0 bg-grid-dark opacity-30" />
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
                <div className="relative">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                    Our promise
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-bold tracking-tight">
                    Bring Gift Card
                  </h3>
                  <ul className="mt-5 space-y-3">
                    {promises.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                        className="flex items-start gap-3"
                      >
                        <div className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-white/15 ring-1 ring-white/20">
                          <ShieldCheck className="h-3 w-3 text-[#E5C77B]" />
                        </div>
                        <span className="text-sm leading-relaxed text-white/85">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="about-talk-to-us"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0047AB] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#002B6D]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Talk to us
                </a>
                <button
                  type="button"
                  onClick={scrollToCards}
                  data-testid="about-see-live-rates"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-6 py-3 text-sm font-semibold text-[#0A1224] transition-colors hover:border-[#0047AB]/30"
                >
                  See live rates
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </AnimatedSection>

          {/* RIGHT — Meet Our Founders */}
          <AnimatedSection delay={0.15}>
            <div
              data-testid="founders-card"
              className="flex h-full flex-col rounded-3xl border border-[#E2E8F0] bg-[#F8FAFF] p-8 shadow-[0_30px_60px_-25px_rgba(0,71,171,0.18)] sm:p-10"
            >
              <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A24B]">
                Leadership
              </p>
              <h2 className="mt-2 text-center font-display text-3xl font-extrabold tracking-tight text-[#0A1224] sm:text-4xl">
                Meet Our Founders
              </h2>
              <p className="mx-auto mt-3 max-w-md text-center text-sm text-[#6B7384] sm:text-base">
                The people behind Bring Gift Card — dedicated to providing you with the
                best global trading experience.
              </p>

              <div className="mt-8 grid flex-1 gap-6 sm:grid-cols-2">
                {founders.map((f) => (
                  <div
                    key={f.name}
                    data-testid={`founder-${f.name.split(" ")[1].toLowerCase()}`}
                    className="flex flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(0,71,171,0.3)]"
                  >
                    <div className="overflow-hidden rounded-xl bg-gradient-to-b from-[#EAF1FF] to-white">
                      <img
                        src={f.img}
                        alt={f.name}
                        className="h-56 w-full object-contain"
                        draggable={false}
                      />
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#0047AB] text-white">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-display text-base font-bold tracking-tight text-[#0A1224]">
                          {f.name}
                        </p>
                        <p className="text-xs font-semibold text-[#C9A24B]">{f.role}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-[#6B7384]">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/* TEAM */
function TeamSection({ staff }: { staff: Staff[] }) {
  if (staff.length === 0) return null;

  return (
    <section id="team" className="bg-white py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#0047AB]">
              Our team
            </p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#0A1224] sm:text-4xl lg:text-5xl">
              Talk to a real human, anytime
            </h2>
            <p className="mt-4 text-base text-[#6B7384] sm:text-lg">
              Reach any of our support agents directly on WhatsApp — pick whoever's online.
            </p>
          </div>
        </AnimatedSection>

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {staff.map((member) => {
            const link = `https://wa.me/${member.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
              `Hello ${member.name}! I'd like to get a quote for my gift card.`
            )}`;
            return (
              <StaggerItem key={member.id}>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center rounded-2xl border border-[#E2E8F0] bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_rgba(0,71,171,0.25)]"
                >
                  <div className="mb-4 h-24 w-24 overflow-hidden rounded-full bg-gradient-to-br from-[#0047AB] to-[#1E5BD6] ring-4 ring-[#F4F7FC]">
                    {member.imageUrl ? (
                      <img src={member.imageUrl} alt={member.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <p className="font-display text-base font-bold tracking-tight text-[#0A1224]">
                    {member.name}
                  </p>
                  {member.roleLabel && (
                    <p className="mt-1 text-xs font-semibold text-[#C9A24B]">{member.roleLabel}</p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#16A34A]/10 px-3 py-1.5 text-xs font-semibold text-[#16A34A]">
                    <MessageCircle className="h-3 w-3" />
                    Chat now
                  </span>
                </a>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
