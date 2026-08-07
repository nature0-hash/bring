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

/*
 * NOTE: The language switcher lives in the ADMIN DASHBOARD sidebar and
 * translates the whole admin panel. The public site (Home page) is
 * intentionally NOT translated: it never calls t(), so customers always
 * see English regardless of the admin's language choice.
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
  { code: "fr", label: "French",     nativeLabel: "Français",   flag: "🇫🇷" },
  { code: "pt", label: "Portuguese", nativeLabel: "Português",  flag: "🇵🇹" },
  { code: "vi", label: "Vietnamese", nativeLabel: "Tiếng Việt", flag: "🇻🇳" },
  { code: "zh", label: "Chinese",    nativeLabel: "中文",        flag: "🇨🇳" },
];

type Dictionary = Record<string, string>;

const DICTIONARIES: Record<LanguageCode, Dictionary> = {
  en: {
    "s.dashboard": "Dashboard",
    "s.public": "Public",
    "s.back": "Back to website",
    "s.signout": "Sign out",
    "s.language": "Language",
    "s.selectLanguage": "Select language",
    "s.access": "access",
    "tab.overview": "Overview",
    "tab.cards": "Gift Cards",
    "tab.rates": "Local Rates",
    "tab.countries": "Countries",
    "tab.team": "Team",
    "tab.content": "Site Content",
    "tab.users": "User Management",
    "c.loading": "Loading",
    "c.save": "Save",
    "c.saveChanges": "Save changes",
    "c.cancel": "Cancel",
    "c.username": "Username",
    "c.password": "Password",
    "c.role": "Role",
    "c.visible": "Visible on public site",
    "o.welcome": "Welcome back",
    "o.subtitle": "Here's what's happening on your platform today.",
    "o.totalCards": "Total cards",
    "o.activeCards": "Active cards",
    "o.yourRole": "Your role",
    "o.recentRates": "Recent card rates",
    "o.recentSub": "Latest 5 updated cards in your catalogue",
    "o.manageAll": "Manage all",
    "gc.subtitle": "Create, edit, and organize every brand on your storefront.",
    "gc.newCard": "New card",
    "gc.allCards": "All gift cards",
    "gc.tapEdit": "Tap a card to edit it",
    "gc.createCard": "Create card",
    "gc.deleteCard": "Delete card",
    "lr.subtitle": "Set exact payout amounts per country and denomination. These override the fallback percentage rate.",
    "lr.giftCard": "Gift card",
    "lr.country": "Country",
    "lr.pairSub": "Denominations configured for this pair",
    "lr.saveRate": "Save rate",
    "co.subtitle": "Manage which countries your calculator supports, and their currencies.",
    "co.add": "Add country",
    "co.all": "All countries",
    "tm.subtitle": "Support agents shown on the public site. Customers can WhatsApp them directly.",
    "tm.addMember": "Add member",
    "tm.members": "Team members",
    "sc.subtitle": "Manage images and global settings shown on the public site.",
    "sc.founderPhotos": "Founder photos",
    "sc.general": "General settings",
    "sc.whatsappLabel": "Default WhatsApp number",
    "u.subtitle": "Create staff accounts for your team. Staff users can manage rates but cannot create or delete users.",
    "u.createNew": "Create new user",
    "u.activeNote": "New account will be active immediately",
    "u.createUser": "Create user",
    "u.teamMembers": "Team members",
    "u.changePw": "Change my password",
    "u.changePwSub": "Update the password for your own account.",
    "u.currentPw": "Current password",
    "u.newPw": "New password",
    "u.confirmPw": "Confirm new password",
    "u.updatePw": "Update password",
  },
  es: {
    "s.dashboard": "Panel",
    "s.public": "Público",
    "s.back": "Volver al sitio web",
    "s.signout": "Cerrar sesión",
    "s.language": "Idioma",
    "s.selectLanguage": "Seleccionar idioma",
    "s.access": "acceso",
    "tab.overview": "Resumen",
    "tab.cards": "Tarjetas de regalo",
    "tab.rates": "Tasas locales",
    "tab.countries": "Países",
    "tab.team": "Equipo",
    "tab.content": "Contenido del sitio",
    "tab.users": "Gestión de usuarios",
    "c.loading": "Cargando",
    "c.save": "Guardar",
    "c.saveChanges": "Guardar cambios",
    "c.cancel": "Cancelar",
    "c.username": "Nombre de usuario",
    "c.password": "Contraseña",
    "c.role": "Rol",
    "c.visible": "Visible en el sitio público",
    "o.welcome": "Bienvenido de nuevo",
    "o.subtitle": "Esto es lo que está pasando hoy en tu plataforma.",
    "o.totalCards": "Tarjetas totales",
    "o.activeCards": "Tarjetas activas",
    "o.yourRole": "Tu rol",
    "o.recentRates": "Tasas de tarjetas recientes",
    "o.recentSub": "Últimas 5 tarjetas actualizadas de tu catálogo",
    "o.manageAll": "Gestionar todo",
    "gc.subtitle": "Crea, edita y organiza cada marca de tu tienda.",
    "gc.newCard": "Nueva tarjeta",
    "gc.allCards": "Todas las tarjetas de regalo",
    "gc.tapEdit": "Toca una tarjeta para editarla",
    "gc.createCard": "Crear tarjeta",
    "gc.deleteCard": "Eliminar tarjeta",
    "lr.subtitle": "Define pagos exactos por país y denominación. Estos anulan la tasa porcentual de respaldo.",
    "lr.giftCard": "Tarjeta de regalo",
    "lr.country": "País",
    "lr.pairSub": "Denominaciones configuradas para este par",
    "lr.saveRate": "Guardar tasa",
    "co.subtitle": "Gestiona qué países admite tu calculadora y sus monedas.",
    "co.add": "Añadir país",
    "co.all": "Todos los países",
    "tm.subtitle": "Agentes de soporte mostrados en el sitio público. Los clientes pueden escribirles por WhatsApp.",
    "tm.addMember": "Añadir miembro",
    "tm.members": "Miembros del equipo",
    "sc.subtitle": "Gestiona las imágenes y ajustes globales del sitio público.",
    "sc.founderPhotos": "Fotos de los fundadores",
    "sc.general": "Ajustes generales",
    "sc.whatsappLabel": "Número de WhatsApp predeterminado",
    "u.subtitle": "Crea cuentas de personal para tu equipo. El personal puede gestionar tasas pero no crear ni eliminar usuarios.",
    "u.createNew": "Crear nuevo usuario",
    "u.activeNote": "La nueva cuenta estará activa de inmediato",
    "u.createUser": "Crear usuario",
    "u.teamMembers": "Miembros del equipo",
    "u.changePw": "Cambiar mi contraseña",
    "u.changePwSub": "Actualiza la contraseña de tu propia cuenta.",
    "u.currentPw": "Contraseña actual",
    "u.newPw": "Nueva contraseña",
    "u.confirmPw": "Confirmar nueva contraseña",
    "u.updatePw": "Actualizar contraseña",
  },
  fr: {
    "s.dashboard": "Tableau de bord",
    "s.public": "Public",
    "s.back": "Retour au site",
    "s.signout": "Se déconnecter",
    "s.language": "Langue",
    "s.selectLanguage": "Choisir la langue",
    "s.access": "accès",
    "tab.overview": "Aperçu",
    "tab.cards": "Cartes cadeaux",
    "tab.rates": "Taux locaux",
    "tab.countries": "Pays",
    "tab.team": "Équipe",
    "tab.content": "Contenu du site",
    "tab.users": "Gestion des utilisateurs",
    "c.loading": "Chargement",
    "c.save": "Enregistrer",
    "c.saveChanges": "Enregistrer les modifications",
    "c.cancel": "Annuler",
    "c.username": "Nom d'utilisateur",
    "c.password": "Mot de passe",
    "c.role": "Rôle",
    "c.visible": "Visible sur le site public",
    "o.welcome": "Bon retour",
    "o.subtitle": "Voici ce qui se passe sur votre plateforme aujourd'hui.",
    "o.totalCards": "Cartes au total",
    "o.activeCards": "Cartes actives",
    "o.yourRole": "Votre rôle",
    "o.recentRates": "Taux de cartes récents",
    "o.recentSub": "Les 5 dernières cartes mises à jour de votre catalogue",
    "o.manageAll": "Tout gérer",
    "gc.subtitle": "Créez, modifiez et organisez chaque marque de votre boutique.",
    "gc.newCard": "Nouvelle carte",
    "gc.allCards": "Toutes les cartes cadeaux",
    "gc.tapEdit": "Touchez une carte pour la modifier",
    "gc.createCard": "Créer la carte",
    "gc.deleteCard": "Supprimer la carte",
    "lr.subtitle": "Définissez des paiements exacts par pays et par valeur. Ils remplacent le taux en pourcentage.",
    "lr.giftCard": "Carte cadeau",
    "lr.country": "Pays",
    "lr.pairSub": "Valeurs configurées pour cette paire",
    "lr.saveRate": "Enregistrer le taux",
    "co.subtitle": "Gérez les pays pris en charge par votre calculateur et leurs devises.",
    "co.add": "Ajouter un pays",
    "co.all": "Tous les pays",
    "tm.subtitle": "Agents de support affichés sur le site public. Les clients peuvent les contacter sur WhatsApp.",
    "tm.addMember": "Ajouter un membre",
    "tm.members": "Membres de l'équipe",
    "sc.subtitle": "Gérez les images et les réglages globaux du site public.",
    "sc.founderPhotos": "Photos des fondateurs",
    "sc.general": "Réglages généraux",
    "sc.whatsappLabel": "Numéro WhatsApp par défaut",
    "u.subtitle": "Créez des comptes pour votre équipe. Le personnel gère les taux mais ne peut pas créer ni supprimer d'utilisateurs.",
    "u.createNew": "Créer un nouvel utilisateur",
    "u.activeNote": "Le nouveau compte sera actif immédiatement",
    "u.createUser": "Créer l'utilisateur",
    "u.teamMembers": "Membres de l'équipe",
    "u.changePw": "Changer mon mot de passe",
    "u.changePwSub": "Mettez à jour le mot de passe de votre propre compte.",
    "u.currentPw": "Mot de passe actuel",
    "u.newPw": "Nouveau mot de passe",
    "u.confirmPw": "Confirmer le nouveau mot de passe",
    "u.updatePw": "Mettre à jour le mot de passe",
  },
  pt: {
    "s.dashboard": "Painel",
    "s.public": "Público",
    "s.back": "Voltar ao site",
    "s.signout": "Sair",
    "s.language": "Idioma",
    "s.selectLanguage": "Selecionar idioma",
    "s.access": "acesso",
    "tab.overview": "Visão geral",
    "tab.cards": "Cartões-presente",
    "tab.rates": "Taxas locais",
    "tab.countries": "Países",
    "tab.team": "Equipe",
    "tab.content": "Conteúdo do site",
    "tab.users": "Gestão de usuários",
    "c.loading": "Carregando",
    "c.save": "Salvar",
    "c.saveChanges": "Salvar alterações",
    "c.cancel": "Cancelar",
    "c.username": "Nome de usuário",
    "c.password": "Senha",
    "c.role": "Função",
    "c.visible": "Visível no site público",
    "o.welcome": "Bem-vindo de volta",
    "o.subtitle": "Veja o que está acontecendo na sua plataforma hoje.",
    "o.totalCards": "Total de cartões",
    "o.activeCards": "Cartões ativos",
    "o.yourRole": "Sua função",
    "o.recentRates": "Taxas de cartões recentes",
    "o.recentSub": "Últimos 5 cartões atualizados no seu catálogo",
    "o.manageAll": "Gerenciar tudo",
    "gc.subtitle": "Crie, edite e organize cada marca da sua loja.",
    "gc.newCard": "Novo cartão",
    "gc.allCards": "Todos os cartões-presente",
    "gc.tapEdit": "Toque em um cartão para editá-lo",
    "gc.createCard": "Criar cartão",
    "gc.deleteCard": "Excluir cartão",
    "lr.subtitle": "Defina pagamentos exatos por país e denominação. Eles substituem a taxa percentual padrão.",
    "lr.giftCard": "Cartão-presente",
    "lr.country": "País",
    "lr.pairSub": "Denominações configuradas para este par",
    "lr.saveRate": "Salvar taxa",
    "co.subtitle": "Gerencie quais países sua calculadora suporta e suas moedas.",
    "co.add": "Adicionar país",
    "co.all": "Todos os países",
    "tm.subtitle": "Agentes de suporte exibidos no site público. Os clientes podem falar com eles no WhatsApp.",
    "tm.addMember": "Adicionar membro",
    "tm.members": "Membros da equipe",
    "sc.subtitle": "Gerencie imagens e configurações globais exibidas no site público.",
    "sc.founderPhotos": "Fotos dos fundadores",
    "sc.general": "Configurações gerais",
    "sc.whatsappLabel": "Número padrão do WhatsApp",
    "u.subtitle": "Crie contas para sua equipe. A equipe pode gerenciar taxas, mas não pode criar ou excluir usuários.",
    "u.createNew": "Criar novo usuário",
    "u.activeNote": "A nova conta estará ativa imediatamente",
    "u.createUser": "Criar usuário",
    "u.teamMembers": "Membros da equipe",
    "u.changePw": "Alterar minha senha",
    "u.changePwSub": "Atualize a senha da sua própria conta.",
    "u.currentPw": "Senha atual",
    "u.newPw": "Nova senha",
    "u.confirmPw": "Confirmar nova senha",
    "u.updatePw": "Atualizar senha",
  },
  vi: {
    "s.dashboard": "Bảng điều khiển",
    "s.public": "Công khai",
    "s.back": "Quay lại trang web",
    "s.signout": "Đăng xuất",
    "s.language": "Ngôn ngữ",
    "s.selectLanguage": "Chọn ngôn ngữ",
    "s.access": "quyền truy cập",
    "tab.overview": "Tổng quan",
    "tab.cards": "Thẻ quà tặng",
    "tab.rates": "Tỷ giá địa phương",
    "tab.countries": "Quốc gia",
    "tab.team": "Đội ngũ",
    "tab.content": "Nội dung trang",
    "tab.users": "Quản lý người dùng",
    "c.loading": "Đang tải",
    "c.save": "Lưu",
    "c.saveChanges": "Lưu thay đổi",
    "c.cancel": "Hủy",
    "c.username": "Tên đăng nhập",
    "c.password": "Mật khẩu",
    "c.role": "Vai trò",
    "c.visible": "Hiển thị trên trang công khai",
    "o.welcome": "Chào mừng trở lại",
    "o.subtitle": "Đây là những gì đang diễn ra trên nền tảng của bạn hôm nay.",
    "o.totalCards": "Tổng số thẻ",
    "o.activeCards": "Thẻ đang hoạt động",
    "o.yourRole": "Vai trò của bạn",
    "o.recentRates": "Tỷ giá thẻ gần đây",
    "o.recentSub": "5 thẻ được cập nhật mới nhất trong danh mục của bạn",
    "o.manageAll": "Quản lý tất cả",
    "gc.subtitle": "Tạo, chỉnh sửa và sắp xếp mọi thương hiệu trên cửa hàng của bạn.",
    "gc.newCard": "Thẻ mới",
    "gc.allCards": "Tất cả thẻ quà tặng",
    "gc.tapEdit": "Chạm vào thẻ để chỉnh sửa",
    "gc.createCard": "Tạo thẻ",
    "gc.deleteCard": "Xóa thẻ",
    "lr.subtitle": "Đặt số tiền thanh toán chính xác theo quốc gia và mệnh giá. Chúng sẽ ghi đè tỷ lệ phần trăm dự phòng.",
    "lr.giftCard": "Thẻ quà tặng",
    "lr.country": "Quốc gia",
    "lr.pairSub": "Mệnh giá đã cấu hình cho cặp này",
    "lr.saveRate": "Lưu tỷ giá",
    "co.subtitle": "Quản lý các quốc gia mà máy tính của bạn hỗ trợ và tiền tệ của họ.",
    "co.add": "Thêm quốc gia",
    "co.all": "Tất cả quốc gia",
    "tm.subtitle": "Nhân viên hỗ trợ hiển thị trên trang công khai. Khách hàng có thể nhắn WhatsApp trực tiếp.",
    "tm.addMember": "Thêm thành viên",
    "tm.members": "Thành viên đội ngũ",
    "sc.subtitle": "Quản lý hình ảnh và cài đặt chung hiển thị trên trang công khai.",
    "sc.founderPhotos": "Ảnh nhà sáng lập",
    "sc.general": "Cài đặt chung",
    "sc.whatsappLabel": "Số WhatsApp mặc định",
    "u.subtitle": "Tạo tài khoản nhân viên cho đội của bạn. Nhân viên có thể quản lý tỷ giá nhưng không thể tạo hoặc xóa người dùng.",
    "u.createNew": "Tạo người dùng mới",
    "u.activeNote": "Tài khoản mới sẽ hoạt động ngay lập tức",
    "u.createUser": "Tạo người dùng",
    "u.teamMembers": "Thành viên đội ngũ",
    "u.changePw": "Đổi mật khẩu của tôi",
    "u.changePwSub": "Cập nhật mật khẩu cho tài khoản của chính bạn.",
    "u.currentPw": "Mật khẩu hiện tại",
    "u.newPw": "Mật khẩu mới",
    "u.confirmPw": "Xác nhận mật khẩu mới",
    "u.updatePw": "Cập nhật mật khẩu",
  },
  zh: {
    "s.dashboard": "仪表板",
    "s.public": "公开页面",
    "s.back": "返回网站",
    "s.signout": "退出登录",
    "s.language": "语言",
    "s.selectLanguage": "选择语言",
    "s.access": "权限",
    "tab.overview": "总览",
    "tab.cards": "礼品卡",
    "tab.rates": "本地汇率",
    "tab.countries": "国家",
    "tab.team": "团队",
    "tab.content": "网站内容",
    "tab.users": "用户管理",
    "c.loading": "加载中",
    "c.save": "保存",
    "c.saveChanges": "保存更改",
    "c.cancel": "取消",
    "c.username": "用户名",
    "c.password": "密码",
    "c.role": "角色",
    "c.visible": "在公开网站上可见",
    "o.welcome": "欢迎回来",
    "o.subtitle": "这是您的平台今天的动态。",
    "o.totalCards": "卡片总数",
    "o.activeCards": "活跃卡片",
    "o.yourRole": "您的角色",
    "o.recentRates": "最近的卡片汇率",
    "o.recentSub": "目录中最近更新的 5 张卡片",
    "o.manageAll": "管理全部",
    "gc.subtitle": "创建、编辑和管理店面上的每个品牌。",
    "gc.newCard": "新建卡片",
    "gc.allCards": "所有礼品卡",
    "gc.tapEdit": "点击卡片进行编辑",
    "gc.createCard": "创建卡片",
    "gc.deleteCard": "删除卡片",
    "lr.subtitle": "按国家和面值设置准确的付款金额。这些将覆盖默认百分比汇率。",
    "lr.giftCard": "礼品卡",
    "lr.country": "国家",
    "lr.pairSub": "为此组合配置的面值",
    "lr.saveRate": "保存汇率",
    "co.subtitle": "管理您的计算器支持的国家及其货币。",
    "co.add": "添加国家",
    "co.all": "所有国家",
    "tm.subtitle": "在公开网站上显示的客服人员。客户可以直接通过 WhatsApp 联系他们。",
    "tm.addMember": "添加成员",
    "tm.members": "团队成员",
    "sc.subtitle": "管理公开网站上显示的图片和全局设置。",
    "sc.founderPhotos": "创始人照片",
    "sc.general": "常规设置",
    "sc.whatsappLabel": "默认 WhatsApp 号码",
    "u.subtitle": "为您的团队创建员工账户。员工可以管理汇率，但不能创建或删除用户。",
    "u.createNew": "创建新用户",
    "u.activeNote": "新账户将立即生效",
    "u.createUser": "创建用户",
    "u.teamMembers": "团队成员",
    "u.changePw": "修改我的密码",
    "u.changePwSub": "更新您自己账户的密码。",
    "u.currentPw": "当前密码",
    "u.newPw": "新密码",
    "u.confirmPw": "确认新密码",
    "u.updatePw": "更新密码",
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
