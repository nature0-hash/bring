import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * LanguageContext
 *
 * A lightweight, frontend-only language switcher. It does not touch the
 * backend, the database, or any API route. It only persists the user's
 * preferred UI language in localStorage and reflects it on the
 * <html lang="..."> attribute so screen readers and translation tools
 * pick it up correctly.
 *
 * The actual translated strings are intentionally kept small and live
 * inside this file. Adding a new language is as simple as adding a new
 * entry to the LANGUAGES array and a matching dictionary.
 */

export type LanguageCode = "en" | "es" | "fr" | "pt" | "vi" | "zh";

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English",    nativeLabel: "English",    flag: "🇺🇸" },
  { code: "es", label: "Spanish",    nativeLabel: "Español",    flag: "🇪🇸" },
  { code: "fr", label: "French",     nativeLabel: "Français",   flag: " " },
  { code: "pt", label: "Portuguese", nativeLabel: "Português",  flag: "🇵🇹" },
  { code: "vi", label: "Vietnamese", nativeLabel: "Tiếng Việt", flag: "🇻🇳" },
  { code: "zh", label: "Chinese",    nativeLabel: "中文",        flag: "🇨🇳" },
];

type Dictionary = Record<string, string>;

const DICTIONARIES: Record<LanguageCode, Dictionary> = {
  en: {
    "nav.home": "Home",
    "nav.how": "How it works",
    "nav.calculator": "Rates Calculator",
    "nav.cards": "Card Rates",
    "nav.why": "Why us",
    "nav.about": "About",
    "nav.contact": "Contact",
    "cta.whatsapp": "Chat on WhatsApp",
    "cta.browseRates": "Browse live rates",
    "cta.tradeNow": "Trade this amount now",
    "calc.title": "Live exchange rate calculator",
    "calc.subtitle":
      "Select your country, card, and amount to see your exact payout estimate before starting your WhatsApp trade.",
    "calc.country": "Your country",
    "calc.brand": "Select gift card brand",
    "calc.amount": "Face value (USD)",
    "calc.resultLabel": "Estimated instant payout",
  },
  es: {
    "nav.home": "Inicio",
    "nav.how": "Cómo funciona",
    "nav.calculator": "Calculadora de tasas",
    "nav.cards": "Tasas de tarjetas",
    "nav.why": "Por qué nosotros",
    "nav.about": "Acerca de",
    "nav.contact": "Contacto",
    "cta.whatsapp": "Chatear en WhatsApp",
    "cta.browseRates": "Ver tasas en vivo",
    "cta.tradeNow": "Operar esta cantidad ahora",
    "calc.title": "Calculadora de tasas de cambio en vivo",
    "calc.subtitle":
      "Selecciona tu país, tarjeta y monto para ver tu estimación de pago exacta antes de iniciar tu operación por WhatsApp.",
    "calc.country": "Tu país",
    "calc.brand": "Selecciona la marca de tarjeta",
    "calc.amount": "Valor nominal (USD)",
    "calc.resultLabel": "Pago instantáneo estimado",
  },
  fr: {
    "nav.home": "Accueil",
    "nav.how": "Comment ça marche",
    "nav.calculator": "Calculateur de taux",
    "nav.cards": "Taux des cartes",
    "nav.why": "Pourquoi nous",
    "nav.about": "À propos",
    "nav.contact": "Contact",
    "cta.whatsapp": "Discuter sur WhatsApp",
    "cta.browseRates": "Voir les taux en direct",
    "cta.tradeNow": "Échanger ce montant maintenant",
    "calc.title": "Calculateur de taux de change en direct",
    "calc.subtitle":
      "Sélectionnez votre pays, votre carte et le montant pour voir votre estimation de paiement exacte avant de commencer votre transaction WhatsApp.",
    "calc.country": "Votre pays",
    "calc.brand": "Sélectionnez la marque de carte",
    "calc.amount": "Valeur faciale (USD)",
    "calc.resultLabel": "Paiement instantané estimé",
  },
  pt: {
    "nav.home": "Início",
    "nav.how": "Como funciona",
    "nav.calculator": "Calculadora de taxas",
    "nav.cards": "Taxas de cartões",
    "nav.why": "Por que nós",
    "nav.about": "Sobre",
    "nav.contact": "Contato",
    "cta.whatsapp": "Conversar no WhatsApp",
    "cta.browseRates": "Ver taxas ao vivo",
    "cta.tradeNow": "Negociar este valor agora",
    "calc.title": "Calculadora de taxa de câmbio ao vivo",
    "calc.subtitle":
      "Selecione seu país, cartão e valor para ver sua estimativa exata de pagamento antes de iniciar sua negociação no WhatsApp.",
    "calc.country": "Seu país",
    "calc.brand": "Selecione a marca do cartão",
    "calc.amount": "Valor de face (USD)",
    "calc.resultLabel": "Pagamento instantâneo estimado",
  },
  vi: {
    "nav.home": "Trang chủ",
    "nav.how": "Cách hoạt động",
    "nav.calculator": "Máy tính tỷ giá",
    "nav.cards": "Tỷ giá thẻ",
    "nav.why": "Vì sao chọn chúng tôi",
    "nav.about": "Giới thiệu",
    "nav.contact": "Liên hệ",
    "cta.whatsapp": "Trò chuyện trên WhatsApp",
    "cta.browseRates": "Xem tỷ giá trực tiếp",
    "cta.tradeNow": "Giao dịch số tiền này ngay",
    "calc.title": "Máy tính tỷ giá hối đoái trực tiếp",
    "calc.subtitle":
      "Chọn quốc gia, thẻ và số tiền để xem ước tính thanh toán chính xác trước khi bắt đầu giao dịch WhatsApp của bạn.",
    "calc.country": "Quốc gia của bạn",
    "calc.brand": "Chọn thương hiệu thẻ",
    "calc.amount": "Mệnh giá (USD)",
    "calc.resultLabel": "Thanh toán tức thì ước tính",
  },
  zh: {
    "nav.home": "首页",
    "nav.how": "如何运作",
    "nav.calculator": "汇率计算器",
    "nav.cards": "卡片汇率",
    "nav.why": "为什么选择我们",
    "nav.about": "关于我们",
    "nav.contact": "联系我们",
    "cta.whatsapp": "在 WhatsApp 上聊天",
    "cta.browseRates": "查看实时汇率",
    "cta.tradeNow": "立即交易此金额",
    "calc.title": "实时汇率计算器",
    "calc.subtitle":
      "选择您的国家、卡片和金额，在开始 WhatsApp 交易前查看您的准确付款估算。",
    "calc.country": "您的国家",
    "calc.brand": "选择礼品卡品牌",
    "calc.amount": "面值（美元）",
    "calc.resultLabel": "预计即时付款",
  },
};

const STORAGE_KEY = "bgc_lang";

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  options: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function detectInitial(): LanguageCode {
  if (typeof window === "undefined") return "en";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
    if (stored && DICTIONARIES[stored]) return stored;
  } catch {
    /* ignore */
  }
  const nav = window.navigator.language?.toLowerCase() ?? "";
  if (nav.startsWith("es")) return "es";
  if (nav.startsWith("fr")) return "fr";
  if (nav.startsWith("pt")) return "pt";
  if (nav.startsWith("vi")) return "vi";
  if (nav.startsWith("zh")) return "zh";
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(detectInitial);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => {
    const dict = DICTIONARIES[language] ?? DICTIONARIES.en;
    return {
      language,
      setLanguage: setLanguageState,
      t: (key: string, fallback?: string) => dict[key] ?? fallback ?? key,
      options: LANGUAGES,
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside <LanguageProvider>");
  }
  return ctx;
}
