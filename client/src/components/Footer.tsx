import { motion } from "framer-motion";
import { MessageCircle, Mail, Globe, ShieldCheck, Zap, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { AnimatedSection } from "@/components/AnimatedSection";

const WHATSAPP_NUMBER = "84779423224";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hello Bring Gift Card! I'd like to know more about your services."
)}`;

export function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-[#0A1224] text-white">
      {/* Top spotlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#1E5BD6]/60 to-transparent" />
      <div className="absolute -top-40 left-1/2 h-80 w-[120%] -translate-x-1/2 rounded-full bg-[#0047AB]/30 blur-[120px]" />

      {/* CTA strip */}
      <AnimatedSection className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-px overflow-hidden rounded-3xl bg-gradient-to-br from-[#0047AB] via-[#1E5BD6] to-[#002B6D] p-8 sm:p-12 lg:p-16">
            <div className="absolute inset-0 bg-grid-dark opacity-30" />
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-12 h-48 w-48 rounded-full bg-[#C9A24B]/20 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
                  Ready to trade?
                </p>
                <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  Start trading in under{" "}
                  <span className="text-[#E5C77B]">5 minutes</span>.
                </h2>
                <p className="mt-4 max-w-md text-base leading-relaxed text-white/75">
                  Get an instant quote, ship your card, and receive payment in your
                  preferred currency, anywhere in the world.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-sm font-semibold text-[#0047AB] shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a
                  href="mailto:hello@bringgiftcard.com"
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/5 px-7 py-4 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/10"
                >
                  <Mail className="h-4 w-4" />
                  Email us
                </a>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Footer body */}
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand column */}
          <div className="lg:col-span-5">
            <Logo variant="onDark" size={44} />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
              Bring Gift Card is a premium global platform for trading gift cards,
              cryptocurrency, and money transfers. Bank-grade security, lightning-fast
              payouts, and trusted by customers across every continent.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Pill icon={<ShieldCheck className="h-3.5 w-3.5" />}>256-bit secured</Pill>
              <Pill icon={<Zap className="h-3.5 w-3.5" />}>Instant payouts</Pill>
              <Pill icon={<Globe className="h-3.5 w-3.5" />}>Global coverage</Pill>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            <FooterCol
              title="Platform"
              links={[
                { label: "Home", href: "#home" },
                { label: "How it works", href: "#how" },
                { label: "Card rates", href: "#cards" },
                { label: "Why us", href: "#why" },
              ]}
            />
            <FooterCol
              title="Services"
              links={[
                { label: "Gift card trading", href: "#cards" },
                { label: "Crypto exchange", href: "#services" },
                { label: "Money transfers", href: "#services" },
                { label: "Bulk orders", href: "#contact" },
              ]}
            />
            <FooterCol
              title="Contact"
              links={[
                { label: "WhatsApp", href: WHATSAPP_LINK },
                { label: "Email", href: "mailto:hello@bringgiftcard.com" },
                { label: "Live support", href: WHATSAPP_LINK },
                { label: "Office", href: "#office" },
              ]}
            />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} Bring Gift Card. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            Crafted with precision · Royal Blue Standard
          </p>
        </div>
      </div>
    </footer>
  );
}

function Pill({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 ring-1 ring-white/10">
      {icon}
      {children}
    </span>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-white/50">
        {title}
      </h4>
      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.05 } },
        }}
        className="mt-4 space-y-2.5"
      >
        {links.map((link) => (
          <motion.li
            key={link.label}
            variants={{
              hidden: { opacity: 0, x: -10 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            <a
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="link-underline text-sm text-white/70 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
