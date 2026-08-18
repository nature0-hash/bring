import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CreditCard,
  Users,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Plus,
  Trash2,
  ShieldCheck,
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
  Activity,
  ChevronRight,
  Globe2,
  Image as ImageIcon,
  Settings as SettingsIcon,
  Upload,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  fetchAllGiftCards,
  createGiftCard,
  updateGiftCard,
  deleteGiftCard,
  listUsers,
  createUser,
  deleteUser,
  changeMyPassword,
  fetchAllCountries,
  createCountry,
  updateCountry,
  deleteCountry,
  fetchCardRates,
  saveCardRate,
  toggleCardRateActive,
  deleteCardRate,
  fetchAllStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  fetchSiteImages,
  saveSiteImage,
  fetchSettings,
  saveSetting,
  uploadImage,
} from "@/lib/api";
import type {
  GiftCard,
  User,
  UserRole,
  Country,
  CardRate,
  Staff,
  SiteImagesMap,
  SettingsMap,
} from "@/lib/types";
import { CARD_CATEGORIES } from "@/lib/types";
import { Logo } from "@/components/Logo";
import { LanguageSelector } from "@/components/LanguageSelector";
import { formatUSD } from "@/lib/utils";

type TabKey = "overview" | "cards" | "rates" | "countries" | "team" | "content" | "users";

export default function Dashboard() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const [tab, setTab] = useState<TabKey>("overview");
  const [cards, setCards] = useState<GiftCard[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = "/";
    }
  }, [loading, isAuthenticated]);

  const refreshCards = async () => {
    try {
      setCards(await fetchAllGiftCards());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load cards");
    } finally {
      setLoadingCards(false);
    }
  };

  const refreshUsers = async () => {
    setLoadingUsers(true);
    try {
      const { users } = await listUsers();
      setUsers(users);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const refreshCountries = async () => {
    setLoadingCountries(true);
    try {
      setCountries(await fetchAllCountries());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load countries");
    } finally {
      setLoadingCountries(false);
    }
  };

  const refreshStaff = async () => {
    setLoadingStaff(true);
    try {
      setStaff(await fetchAllStaff());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load staff");
    } finally {
      setLoadingStaff(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    refreshCards();
    refreshCountries();
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "master" && tab === "users") {
      refreshUsers();
    }
    if (isAuthenticated && tab === "team" && staff.length === 0) {
      refreshStaff();
    }
  }, [isAuthenticated, user, tab]);

  if (loading || !isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F7FC]">
        <Loader2 className="h-6 w-6 animate-spin text-[#0047AB]" />
      </div>
    );
  }

  const tabs: { key: TabKey; label: string; icon: React.ReactNode; masterOnly?: boolean }[] = [
    { key: "overview", label: t("tab.overview"), icon: <LayoutDashboard className="h-4 w-4" /> },
    { key: "cards", label: t("tab.cards"), icon: <CreditCard className="h-4 w-4" /> },
    { key: "rates", label: t("tab.rates"), icon: <TrendingUp className="h-4 w-4" /> },
    { key: "countries", label: t("tab.countries"), icon: <Globe2 className="h-4 w-4" /> },
    { key: "team", label: t("tab.team"), icon: <Users className="h-4 w-4" /> },
    { key: "content", label: t("tab.content"), icon: <ImageIcon className="h-4 w-4" /> },
    {
      key: "users",
      label: t("tab.users"),
      icon: <SettingsIcon className="h-4 w-4" />,
      masterOnly: true,
    },
  ];

  const visibleTabs = tabs.filter((tb) => !tb.masterOnly || user.role === "master");

  return (
    <div className="min-h-screen bg-[#F4F7FC]">
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#E2E8F0] bg-white px-4 py-3 lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 text-[#0A1224] hover:bg-[#F4F7FC]"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Logo variant="onLight" size={32} />
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-[#0A1224]/40 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              className="fixed left-0 top-0 z-50 h-full w-72 bg-white shadow-2xl lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <SidebarContent
                user={user}
                tabs={visibleTabs}
                tab={tab}
                onTab={(k) => {
                  setTab(k);
                  setSidebarOpen(false);
                }}
                onLogout={logout}
                onClose={() => setSidebarOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-72 flex-none border-r border-[#E2E8F0] bg-white lg:flex lg:flex-col">
          <SidebarContent user={user} tabs={visibleTabs} tab={tab} onTab={setTab} onLogout={logout} />
        </aside>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <div className="mx-auto max-w-6xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                {tab === "overview" && (
                  <OverviewTab user={user} cards={cards} loadingCards={loadingCards} onGoToCards={() => setTab("cards")} />
                )}
                {tab === "cards" && (
                  <CardsTab cards={cards} loading={loadingCards} onRefresh={refreshCards} />
                )}
                {tab === "rates" && <LocalRatesTab cards={cards} countries={countries} />}
                {tab === "countries" && (
                  <CountriesTab countries={countries} loading={loadingCountries} onRefresh={refreshCountries} />
                )}
                {tab === "team" && (
                  <TeamTab staff={staff} loading={loadingStaff} onRefresh={refreshStaff} />
                )}
                {tab === "content" && <SiteContentTab />}
                {tab === "users" && user.role === "master" && (
                  <UsersTab users={users} loading={loadingUsers} currentUser={user} onRefresh={refreshUsers} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

/* SIDEBAR */
interface SidebarContentProps {
  user: User;
  tabs: { key: TabKey; label: string; icon: React.ReactNode }[];
  tab: TabKey;
  onTab: (k: TabKey) => void;
  onLogout: () => void;
  onClose?: () => void;
}

function SidebarContent({ user, tabs, tab, onTab, onLogout, onClose }: SidebarContentProps) {
  const { t } = useLanguage();
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-5">
        <Logo variant="onLight" size={36} />
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#6B7384] hover:bg-[#F4F7FC] lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="border-b border-[#E2E8F0] px-4 py-4">
        <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-[#F4F7FC] to-[#E6EEFB] p-3">
          <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gradient-to-br from-[#0047AB] to-[#1E5BD6] font-display text-sm font-bold text-white">
            {user.username.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-bold text-[#0A1224]">{user.username}</p>
            <p className="text-xs capitalize text-[#6B7384]">{user.role} {t("s.access", "access")}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-4">
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9CA3AF]">{t("s.dashboard", "Dashboard")}</p>
        <ul className="space-y-1">
          {tabs.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => onTab(item.key)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  tab === item.key
                    ? "bg-gradient-to-r from-[#0047AB] to-[#1E5BD6] text-white shadow-lg shadow-[#0047AB]/25"
                    : "text-[#3B4256] hover:bg-[#F4F7FC] hover:text-[#0047AB]"
                }`}
              >
                <span className={tab === item.key ? "text-white" : "text-[#6B7384] group-hover:text-[#0047AB]"}>
                  {item.icon}
                </span>
                {item.label}
                <ChevronRight
                  className={`ml-auto h-3.5 w-3.5 transition-transform ${
                    tab === item.key ? "translate-x-0 text-white" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-3">
          <LanguageSelector />
        </div>

        <p className="mb-2 mt-6 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9CA3AF]">{t("s.public", "Public")}</p>
        <a
          href="/"
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#3B4256] transition-colors hover:bg-[#F4F7FC] hover:text-[#0047AB]"
        >
          <ArrowLeft className="h-4 w-4 text-[#6B7384] group-hover:text-[#0047AB]" />
          {t("s.back", "Back to website")}
        </a>
      </nav>

      <div className="border-t border-[#E2E8F0] p-4">
        <button
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-semibold text-[#DC2626] hover:bg-[#DC2626] hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4" />
          {t("s.signout", "Sign out")}
        </button>
      </div>
    </div>
  );
}

/* SHARED HELPERS */
function PageHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-display text-2xl font-extrabold tracking-tight text-[#0A1224] sm:text-3xl"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mt-1.5 text-sm text-[#6B7384]"
        >
          {subtitle}
        </motion.p>
      </div>
      {action}
    </div>
  );
}

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 flex-none items-center rounded-full transition-colors disabled:opacity-50 ${
        checked ? "bg-[#16A34A]" : "bg-[#D1D5DB]"
      }`}
    >
      <span
        className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function ImageUploader({
  value,
  onUploaded,
  label,
}: {
  value: string | null | undefined;
  onUploaded: (url: string) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const inputId = `upload-${Math.random().toString(36).slice(2)}`;

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      onUploaded(url);
      toast.success("Image uploaded.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-16 w-16 flex-none items-center justify-center overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#F4F7FC]">
        {value ? (
          <img src={value} alt={label ?? "preview"} className="h-full w-full object-cover" />
        ) : (
          <ImageIcon className="h-5 w-5 text-[#9CA3AF]" />
        )}
      </div>
      <label
        htmlFor={inputId}
        className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-semibold text-[#3B4256] hover:bg-[#F4F7FC] transition-colors"
      >
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {uploading ? "Uploading…" : "Upload image"}
        <input id={inputId} type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
      </label>
    </div>
  );
}

/* OVERVIEW TAB */
function OverviewTab({
  user,
  cards,
  loadingCards,
  onGoToCards,
}: {
  user: User;
  cards: GiftCard[];
  loadingCards: boolean;
  onGoToCards: () => void;
}) {
  const { t } = useLanguage();
  const activeCards = cards.filter((c) => c.isActive);

  const stats = [
    { label: t("o.totalCards", "Total cards"), value: cards.length.toString(), icon: <CreditCard className="h-4 w-4" />, accent: "from-[#0047AB] to-[#1E5BD6]" },
    { label: t("o.activeCards", "Active cards"), value: activeCards.length.toString(), icon: <Activity className="h-4 w-4" />, accent: "from-[#16A34A] to-[#22C55E]" },
    { label: t("o.yourRole", "Your role"), value: user.role, icon: <ShieldCheck className="h-4 w-4" />, accent: "from-[#7C3AED] to-[#A855F7]" },
  ];

  return (
    <div>
      <PageHeader title={`${t("o.welcome", "Welcome back")}, ${user.username}.`} subtitle={t("o.subtitle", "Here's what's happening on your platform today.")} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm"
          >
            <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${s.accent} opacity-10 blur-2xl`} />
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.accent} text-white shadow-lg`}>
              {s.icon}
            </div>
            <p className="mt-4 font-display text-2xl font-extrabold tracking-tight text-[#0A1224]">{s.value}</p>
            <p className="mt-1 text-xs font-medium text-[#6B7384]">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4">
          <div>
            <h3 className="font-display text-base font-bold text-[#0A1224]">{t("o.recentRates", "Recent card rates")}</h3>
            <p className="text-xs text-[#6B7384]">{t("o.recentSub", "Latest 5 updated cards in your catalogue")}</p>
          </div>
          <button onClick={onGoToCards} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0047AB] hover:underline">
            {t("o.manageAll", "Manage all")}
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="divide-y divide-[#F4F7FC]">
          {loadingCards ? (
            <div className="p-8 text-center text-sm text-[#6B7384]">{t("c.loading", "Loading")}…</div>
          ) : (
            [...cards]
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .slice(0, 5)
              .map((c) => (
              <div key={c.id} className="flex items-center justify-between px-6 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F4F7FC] text-xs font-bold text-[#0047AB]">
                    {c.brand.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0A1224]">{c.brand}</p>
                    <p className="text-xs text-[#6B7384]">/ {c.slug}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-bold text-[#0047AB]">{Math.round(c.baseRate * 100)}%</p>
                  <p className="text-xs text-[#6B7384]">
                    $100 → {formatUSD(100 * c.baseRate, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* GIFT CARDS TAB */
function CardsTab({
  cards,
  loading,
  onRefresh,
}: {
  cards: GiftCard[];
  loading: boolean;
  onRefresh: () => void;
}) {
  const { t } = useLanguage();
  const [selectedId, setSelectedId] = useState<number | "new" | null>(null);
  const [brand, setBrand] = useState("");
  const [slug, setSlug] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [rateInput, setRateInput] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const selected = typeof selectedId === "number" ? cards.find((c) => c.id === selectedId) ?? null : null;
  const isNew = selectedId === "new";

  useEffect(() => {
    if (selected) {
      setBrand(selected.brand);
      setSlug(selected.slug);
      setImageUrl(selected.imageUrl);
      setCategory(selected.category ?? "");
      setRateInput((selected.baseRate * 100).toFixed(1));
      setSortOrder(String(selected.sortOrder));
      setIsActive(selected.isActive);
    } else if (isNew) {
      setBrand("");
      setSlug("");
      setImageUrl("");
      setCategory("");
      setRateInput("80");
      setSortOrder("0");
      setIsActive(true);
    }
  }, [selected, isNew]);

  const handleSave = async () => {
    const pct = parseFloat(rateInput);
    if (isNaN(pct) || pct < 0 || pct > 100) {
      toast.error("Rate must be a number between 0 and 100.");
      return;
    }
    if (!brand.trim()) {
      toast.error("Brand name is required.");
      return;
    }
    if (isNew && !imageUrl.trim()) {
      toast.error("Upload a card image first.");
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        const finalSlug = (slug.trim() || brand).toLowerCase().replace(/\s+/g, "-");
        const { card } = await createGiftCard({
          brand: brand.trim(),
          slug: finalSlug,
          imageUrl: imageUrl.trim(),
          baseRate: pct / 100,
          category: category || undefined,
        });
        toast.success(`${card.brand} created.`);
        setSelectedId(card.id);
      } else if (selected) {
        const { card } = await updateGiftCard(selected.id, {
          brand: brand.trim(),
          imageUrl: imageUrl.trim(),
          category: category || undefined,
          baseRate: pct / 100,
          sortOrder: Number(sortOrder) || 0,
          isActive,
        });
        toast.success(`${card.brand} updated.`);
      }
      onRefresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save card.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (!confirm(`Delete "${selected.brand}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteGiftCard(selected.id);
      toast.success(`${selected.brand} deleted.`);
      setSelectedId(null);
      onRefresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete card.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={t("tab.cards", "Gift Cards")}
        subtitle={t("gc.subtitle", "Create, edit, and organize every brand on your storefront.")}
        action={
          <button
            onClick={() => setSelectedId("new")}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0047AB] to-[#1E5BD6] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0047AB]/25 hover:shadow-xl transition-all"
          >
            <Plus className="h-4 w-4" />
            {t("gc.newCard", "New card")}
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
            <div className="border-b border-[#E2E8F0] px-6 py-4">
              <h3 className="font-display text-base font-bold text-[#0A1224]">{t("gc.allCards", "All gift cards")}</h3>
              <p className="text-xs text-[#6B7384]">{t("gc.tapEdit", "Tap a card to edit it")}</p>
            </div>
            {loading ? (
              <div className="p-8 text-center text-sm text-[#6B7384]">Loading cards…</div>
            ) : (
              <div className="max-h-[600px] divide-y divide-[#F4F7FC] overflow-y-auto">
                {cards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => setSelectedId(card.id)}
                    className={`flex w-full items-center justify-between px-6 py-4 text-left transition-colors ${
                      selectedId === card.id ? "bg-[#F4F7FC]" : "hover:bg-[#F4F7FC]/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#0047AB]/10 to-[#1E5BD6]/10 text-xs font-bold text-[#0047AB]">
                        {card.imageUrl ? (
                          <img src={card.imageUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          card.brand.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0A1224]">{card.brand}</p>
                        <p className="text-xs text-[#6B7384]">
                          /{card.slug} {card.category && `· ${card.category}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-mono text-sm font-bold text-[#0047AB]">{(card.baseRate * 100).toFixed(1)}%</p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          card.isActive ? "bg-[#16A34A]/10 text-[#16A34A]" : "bg-[#9CA3AF]/10 text-[#6B7384]"
                        }`}
                      >
                        {card.isActive ? "Active" : "Hidden"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-6 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
            <div className="border-b border-[#E2E8F0] bg-gradient-to-br from-[#F4F7FC] to-[#E6EEFB] px-6 py-4">
              <h3 className="font-display text-base font-bold text-[#0A1224]">
                {isNew ? "New gift card" : selected ? "Edit gift card" : "Edit gift card"}
              </h3>
              <p className="text-xs text-[#6B7384]">Changes go live instantly</p>
            </div>

            {!selected && !isNew ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F7FC]">
                  <CreditCard className="h-5 w-5 text-[#6B7384]" />
                </div>
                <p className="text-sm font-semibold text-[#0A1224]">No card selected</p>
                <p className="mt-1 text-xs text-[#6B7384]">Pick a card from the list, or create a new one.</p>
              </div>
            ) : (
              <div className="space-y-4 p-6">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#0A1224]">Card image</label>
                  <ImageUploader value={imageUrl} onUploaded={setImageUrl} label={brand} />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#0A1224]">Brand name</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Steam"
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F4F7FC] py-2.5 px-4 text-sm text-[#0A1224] focus:border-[#0047AB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 transition-all"
                  />
                </div>

                {isNew && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#0A1224]">Slug (URL id, optional)</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="auto-generated from brand"
                      className="w-full rounded-xl border border-[#E2E8F0] bg-[#F4F7FC] py-2.5 px-4 text-sm text-[#0A1224] focus:border-[#0047AB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 transition-all"
                    />
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#0A1224]">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F4F7FC] py-2.5 px-4 text-sm text-[#0A1224] focus:border-[#0047AB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 transition-all"
                  >
                    <option value="">No category</option>
                    {CARD_CATEGORIES.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#0A1224]">Fallback payout rate (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={rateInput}
                      onChange={(e) => setRateInput(e.target.value)}
                      className="w-full rounded-xl border border-[#E2E8F0] bg-[#F4F7FC] py-2.5 pl-4 pr-10 text-sm font-mono font-bold text-[#0A1224] focus:border-[#0047AB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#6B7384]">%</span>
                  </div>
                  <p className="mt-1.5 text-xs text-[#6B7384]">
                    Used when no country-specific local rate is set for a given amount.
                  </p>
                </div>

                {!isNew && (
                  <>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#0A1224]">Sort order</label>
                      <input
                        type="number"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="w-full rounded-xl border border-[#E2E8F0] bg-[#F4F7FC] py-2.5 px-4 text-sm text-[#0A1224] focus:border-[#0047AB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 transition-all"
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-[#F4F7FC] px-4 py-3">
                      <span className="text-sm font-medium text-[#0A1224]">Visible on public site</span>
                      <Toggle checked={isActive} onChange={() => setIsActive((v) => !v)} />
                    </div>
                  </>
                )}

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0047AB] to-[#1E5BD6] py-3 text-sm font-semibold text-white shadow-lg shadow-[#0047AB]/25 transition-all hover:shadow-xl disabled:opacity-70"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                  {isNew ? "Create card" : "Save changes"}
                </button>

                {!isNew && selected && (
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#DC2626]/30 bg-white py-2.5 text-sm font-semibold text-[#DC2626] hover:bg-[#DC2626]/5 transition-colors disabled:opacity-70"
                  >
                    {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    Delete card
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* LOCAL RATES TAB */
function LocalRatesTab({ cards, countries }: { cards: GiftCard[]; countries: Country[] }) {
  const { t } = useLanguage();
  const [cardId, setCardId] = useState<number | null>(cards[0]?.id ?? null);
  const [countryId, setCountryId] = useState<number | null>(countries[0]?.id ?? null);
  const [rates, setRates] = useState<CardRate[]>([]);
  const [loadingRates, setLoadingRates] = useState(false);
  const [newFaceValue, setNewFaceValue] = useState("100");
  const [newLocalRate, setNewLocalRate] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!cardId && cards.length) setCardId(cards[0].id);
  }, [cards, cardId]);

  useEffect(() => {
    if (!countryId && countries.length) setCountryId(countries[0].id);
  }, [countries, countryId]);

  const refresh = async () => {
    if (!cardId || !countryId) return;
    setLoadingRates(true);
    try {
      setRates(await fetchCardRates(cardId, countryId));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load rates.");
    } finally {
      setLoadingRates(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardId, countryId]);

  const selectedCard = cards.find((c) => c.id === cardId);
  const selectedCountry = countries.find((c) => c.id === countryId);

  const handleAdd = async () => {
    if (!cardId || !countryId) return;
    const fv = Number(newFaceValue);
    const lr = Number(newLocalRate);
    if (!Number.isFinite(fv) || fv <= 0) {
      toast.error("Enter a valid face value.");
      return;
    }
    if (!Number.isFinite(lr) || lr < 0) {
      toast.error("Enter a valid local payout amount.");
      return;
    }
    setSaving(true);
    try {
      await saveCardRate({ cardId, countryId, faceValue: fv, localRate: lr });
      toast.success("Rate saved.");
      setNewLocalRate("");
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save rate.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (rate: CardRate) => {
    try {
      await toggleCardRateActive(rate.id, !rate.isActive);
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update rate.");
    }
  };

  const handleDelete = async (rate: CardRate) => {
    if (!confirm(`Delete the $${rate.faceValue} rate?`)) return;
    try {
      await deleteCardRate(rate.id);
      toast.success("Rate deleted.");
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete rate.");
    }
  };

  return (
    <div>
      <PageHeader
        title={t("tab.rates", "Local Rates")}
        subtitle={t("lr.subtitle", "Set exact payout amounts per country and denomination. These override the fallback percentage rate.")}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#0A1224]">{t("lr.giftCard", "Gift card")}</label>
          <select
            value={cardId ?? ""}
            onChange={(e) => setCardId(Number(e.target.value))}
            className="w-full rounded-xl border border-[#E2E8F0] bg-white py-2.5 px-4 text-sm font-medium text-[#0A1224] focus:border-[#0047AB] focus:outline-none"
          >
            {cards.map((c) => (
              <option key={c.id} value={c.id}>
                {c.brand}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#0A1224]">{t("lr.country", "Country")}</label>
          <select
            value={countryId ?? ""}
            onChange={(e) => setCountryId(Number(e.target.value))}
            className="w-full rounded-xl border border-[#E2E8F0] bg-white py-2.5 px-4 text-sm font-medium text-[#0A1224] focus:border-[#0047AB] focus:outline-none"
          >
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flagEmoji ? `${c.flagEmoji} ` : ""}{c.name} ({c.currencyCode})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
        <div className="border-b border-[#E2E8F0] px-6 py-4">
          <h3 className="font-display text-base font-bold text-[#0A1224]">
            {selectedCard?.brand ?? "..."} · {selectedCountry?.name ?? "..."}
          </h3>
          <p className="text-xs text-[#6B7384]">{t("lr.pairSub", "Denominations configured for this pair")}</p>
        </div>

        {loadingRates ? (
          <div className="p-8 text-center text-sm text-[#6B7384]">Loading…</div>
        ) : rates.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#6B7384]">
            No local rates yet. The public calculator will fall back to the card's global percentage rate.
          </div>
        ) : (
          <div className="divide-y divide-[#F4F7FC]">
            {[...rates].sort((a, b) => a.faceValue - b.faceValue).map((r) => (
              <div key={r.id} className="flex items-center justify-between px-6 py-3.5">
                <div>
                  <p className="text-sm font-semibold text-[#0A1224]">${r.faceValue} face value</p>
                  <p className="text-xs text-[#6B7384]">
                    Pays {selectedCountry?.currencySymbol}
                    {r.localRate.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Toggle checked={r.isActive} onChange={() => handleToggle(r)} />
                  <button
                    onClick={() => handleDelete(r)}
                    className="rounded-lg p-1.5 text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors"
                    aria-label="Delete rate"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-end gap-3 border-t border-[#E2E8F0] bg-[#F8FAFF] px-6 py-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#3B4256]">Face value ($)</label>
            <input
              type="number"
              value={newFaceValue}
              onChange={(e) => setNewFaceValue(e.target.value)}
              className="w-28 rounded-lg border border-[#E2E8F0] bg-white py-2 px-3 text-sm font-mono text-[#0A1224] focus:border-[#0047AB] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#3B4256]">
              Local payout ({selectedCountry?.currencyCode ?? "..."})
            </label>
            <input
              type="number"
              value={newLocalRate}
              onChange={(e) => setNewLocalRate(e.target.value)}
              placeholder="e.g. 120000"
              className="w-40 rounded-lg border border-[#E2E8F0] bg-white py-2 px-3 text-sm font-mono text-[#0A1224] focus:border-[#0047AB] focus:outline-none"
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#0047AB] to-[#1E5BD6] px-4 py-2.5 text-sm font-semibold text-white shadow-md disabled:opacity-70"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {t("lr.saveRate", "Save rate")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* COUNTRIES TAB */
function CountriesTab({
  countries,
  loading,
  onRefresh,
}: {
  countries: Country[];
  loading: boolean;
  onRefresh: () => void;
}) {
  const { t } = useLanguage();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [currencyCode, setCurrencyCode] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [flagEmoji, setFlagEmoji] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim() || !currencyCode.trim() || !currencySymbol.trim()) {
      toast.error("Code, name, currency code, and currency symbol are required.");
      return;
    }
    setCreating(true);
    try {
      await createCountry({
        code: code.trim().toUpperCase(),
        name: name.trim(),
        currencyCode: currencyCode.trim().toUpperCase(),
        currencySymbol: currencySymbol.trim(),
        flagEmoji: flagEmoji.trim() || undefined,
      });
      toast.success(`${name} added.`);
      setCode("");
      setName("");
      setCurrencyCode("");
      setCurrencySymbol("");
      setFlagEmoji("");
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add country.");
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (c: Country) => {
    try {
      await updateCountry(c.id, { isActive: !c.isActive });
      onRefresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update country.");
    }
  };

  const handleDelete = async (c: Country) => {
    if (!confirm(`Delete ${c.name}? Any local rates for this country will also be removed.`)) return;
    try {
      await deleteCountry(c.id);
      toast.success(`${c.name} deleted.`);
      onRefresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete country.");
    }
  };

  return (
    <div>
      <PageHeader title={t("tab.countries", "Countries")} subtitle={t("co.subtitle", "Manage which countries your calculator supports, and their currencies.")} />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <form onSubmit={handleCreate} className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
            <div className="border-b border-[#E2E8F0] bg-gradient-to-br from-[#F4F7FC] to-[#E6EEFB] px-6 py-4">
              <h3 className="font-display text-base font-bold text-[#0A1224]">{t("co.add", "Add country")}</h3>
            </div>
            <div className="space-y-3 p-6">
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Code (NG)"
                  maxLength={2}
                  className="rounded-xl border border-[#E2E8F0] bg-[#F4F7FC] py-2.5 px-4 text-sm text-[#0A1224] focus:border-[#0047AB] focus:bg-white focus:outline-none"
                />
                <input
                  value={flagEmoji}
                  onChange={(e) => setFlagEmoji(e.target.value)}
                  placeholder="Flag 🇳🇬"
                  className="rounded-xl border border-[#E2E8F0] bg-[#F4F7FC] py-2.5 px-4 text-sm text-[#0A1224] focus:border-[#0047AB] focus:bg-white focus:outline-none"
                />
              </div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Country name"
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#F4F7FC] py-2.5 px-4 text-sm text-[#0A1224] focus:border-[#0047AB] focus:bg-white focus:outline-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={currencyCode}
                  onChange={(e) => setCurrencyCode(e.target.value)}
                  placeholder="Currency (NGN)"
                  className="rounded-xl border border-[#E2E8F0] bg-[#F4F7FC] py-2.5 px-4 text-sm text-[#0A1224] focus:border-[#0047AB] focus:bg-white focus:outline-none"
                />
                <input
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                  placeholder="Symbol (₦)"
                  className="rounded-xl border border-[#E2E8F0] bg-[#F4F7FC] py-2.5 px-4 text-sm text-[#0A1224] focus:border-[#0047AB] focus:bg-white focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={creating}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0047AB] to-[#1E5BD6] py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-70"
              >
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                {t("co.add", "Add country")}
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
            <div className="border-b border-[#E2E8F0] px-6 py-4">
              <h3 className="font-display text-base font-bold text-[#0A1224]">{t("co.all", "All countries")}</h3>
              <p className="text-xs text-[#6B7384]">{countries.length} supported</p>
            </div>
            {loading ? (
              <div className="p-8 text-center text-sm text-[#6B7384]">Loading…</div>
            ) : (
              <div className="max-h-[520px] divide-y divide-[#F4F7FC] overflow-y-auto">
                {countries.map((c) => (
                  <div key={c.id} className="flex items-center justify-between px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{c.flagEmoji || "🏳️"}</span>
                      <div>
                        <p className="text-sm font-semibold text-[#0A1224]">{c.name}</p>
                        <p className="text-xs text-[#6B7384]">
                          {c.code} · {c.currencyCode} ({c.currencySymbol})
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Toggle checked={c.isActive} onChange={() => handleToggle(c)} />
                      <button
                        onClick={() => handleDelete(c)}
                        className="rounded-lg p-1.5 text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors"
                        aria-label="Delete country"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* TEAM TAB */
function TeamTab({
  staff,
  loading,
  onRefresh,
}: {
  staff: Staff[];
  loading: boolean;
  onRefresh: () => void;
}) {
  const { t } = useLanguage();
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [name, setName] = useState("");
  const [roleLabel, setRoleLabel] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const editing = typeof editingId === "number" ? staff.find((s) => s.id === editingId) ?? null : null;
  const isNew = editingId === "new";

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setRoleLabel(editing.roleLabel ?? "");
      setWhatsappNumber(editing.whatsappNumber);
      setImageUrl(editing.imageUrl ?? "");
      setIsActive(editing.isActive);
    } else if (isNew) {
      setName("");
      setRoleLabel("");
      setWhatsappNumber("");
      setImageUrl("");
      setIsActive(true);
    }
  }, [editing, isNew]);

  const handleSave = async () => {
    if (!name.trim() || !whatsappNumber.trim()) {
      toast.error("Name and WhatsApp number are required.");
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        await createStaff({
          name: name.trim(),
          roleLabel: roleLabel.trim() || undefined,
          whatsappNumber: whatsappNumber.trim(),
          imageUrl: imageUrl.trim() || undefined,
        });
        toast.success(`${name} added to the team.`);
      } else if (editing) {
        await updateStaff(editing.id, {
          name: name.trim(),
          roleLabel: roleLabel.trim(),
          whatsappNumber: whatsappNumber.trim(),
          imageUrl: imageUrl.trim(),
          isActive,
        });
        toast.success(`${name} updated.`);
      }
      setEditingId(null);
      onRefresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save team member.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (member: Staff) => {
    if (!confirm(`Remove ${member.name} from the team?`)) return;
    try {
      await deleteStaff(member.id);
      toast.success(`${member.name} removed.`);
      onRefresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to remove team member.");
    }
  };

  return (
    <div>
      <PageHeader
        title={t("tab.team", "Team")}
        subtitle={t("tm.subtitle", "Support agents shown on the public site. Customers can WhatsApp them directly.")}
        action={
          <button
            onClick={() => setEditingId("new")}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0047AB] to-[#1E5BD6] px-4 py-2.5 text-sm font-semibold text-white shadow-lg"
          >
            <Plus className="h-4 w-4" />
            {t("tm.addMember", "Add member")}
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
            <div className="border-b border-[#E2E8F0] px-6 py-4">
              <h3 className="font-display text-base font-bold text-[#0A1224]">{t("tm.members", "Team members")}</h3>
            </div>
            {loading ? (
              <div className="p-8 text-center text-sm text-[#6B7384]">Loading…</div>
            ) : staff.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#6B7384]">No team members yet.</div>
            ) : (
              <div className="divide-y divide-[#F4F7FC]">
                {staff.map((s) => (
                  <div key={s.id} className="flex items-center justify-between px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#0047AB] to-[#1E5BD6] text-xs font-bold text-white">
                        {s.imageUrl ? <img src={s.imageUrl} alt="" className="h-full w-full object-cover" /> : s.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0A1224]">{s.name}</p>
                        <p className="text-xs text-[#6B7384]">{s.roleLabel || s.whatsappNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          s.isActive ? "bg-[#16A34A]/10 text-[#16A34A]" : "bg-[#9CA3AF]/10 text-[#6B7384]"
                        }`}
                      >
                        {s.isActive ? "Active" : "Hidden"}
                      </span>
                      <button
                        onClick={() => setEditingId(s.id)}
                        className="rounded-lg p-1.5 text-[#0047AB] hover:bg-[#0047AB]/10 transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(s)}
                        className="rounded-lg p-1.5 text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {(editing || isNew) && (
            <div className="sticky top-6 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
              <div className="border-b border-[#E2E8F0] bg-gradient-to-br from-[#F4F7FC] to-[#E6EEFB] px-6 py-4">
                <h3 className="font-display text-base font-bold text-[#0A1224]">{isNew ? "New team member" : "Edit team member"}</h3>
              </div>
              <div className="space-y-4 p-6">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#0A1224]">Photo</label>
                  <ImageUploader value={imageUrl} onUploaded={setImageUrl} label={name} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#0A1224]">Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F4F7FC] py-2.5 px-4 text-sm text-[#0A1224] focus:border-[#0047AB] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#0A1224]">Role label (optional)</label>
                  <input
                    value={roleLabel}
                    onChange={(e) => setRoleLabel(e.target.value)}
                    placeholder="e.g. Support Agent"
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F4F7FC] py-2.5 px-4 text-sm text-[#0A1224] focus:border-[#0047AB] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#0A1224]">WhatsApp number</label>
                  <input
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="e.g. 2348012345678"
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F4F7FC] py-2.5 px-4 text-sm text-[#0A1224] focus:border-[#0047AB] focus:bg-white focus:outline-none"
                  />
                </div>
                {!isNew && (
                  <div className="flex items-center justify-between rounded-xl bg-[#F4F7FC] px-4 py-3">
                    <span className="text-sm font-medium text-[#0A1224]">Visible on public site</span>
                    <Toggle checked={isActive} onChange={() => setIsActive((v) => !v)} />
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0047AB] to-[#1E5BD6] py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-70"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {isNew ? "Add member" : "Save changes"}
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-semibold text-[#3B4256] hover:bg-[#F4F7FC]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* SITE CONTENT TAB */
function SiteContentTab() {
  const { t } = useLanguage();
  const [images, setImages] = useState<SiteImagesMap>({});
  const [settings, setSettingsState] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [savingWhatsapp, setSavingWhatsapp] = useState(false);

  useEffect(() => {
    Promise.all([fetchSiteImages(), fetchSettings()])
      .then(([imgs, sett]) => {
        setImages(imgs);
        setSettingsState(sett);
        setWhatsappNumber(sett.whatsapp_number ?? "");
      })
      .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load site content."))
      .finally(() => setLoading(false));
  }, []);

  const handleImageUpload = async (key: string, url: string) => {
    try {
      await saveSiteImage(key, url);
      setImages((prev) => ({ ...prev, [key]: url }));
      toast.success("Image saved.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save image.");
    }
  };

  const handleSaveWhatsapp = async () => {
    if (!whatsappNumber.trim()) {
      toast.error("Enter a WhatsApp number.");
      return;
    }
    setSavingWhatsapp(true);
    try {
      await saveSetting("whatsapp_number", whatsappNumber.trim(), "Default WhatsApp number for customer chats");
      toast.success("WhatsApp number updated.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save setting.");
    } finally {
      setSavingWhatsapp(false);
    }
  };

  const imageSlots = [
    { key: "founder_mandy", label: "Founder: Boss Mandy" },
    { key: "founder_kevin", label: "Founder: Boss Kevin" },
  ];

  if (loading) {
    return <div className="p-8 text-center text-sm text-[#6B7384]">Loading site content…</div>;
  }

  return (
    <div>
      <PageHeader title={t("tab.content", "Site Content")} subtitle={t("sc.subtitle", "Manage images and global settings shown on the public site.")} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
          <div className="border-b border-[#E2E8F0] px-6 py-4">
            <h3 className="font-display text-base font-bold text-[#0A1224]">{t("sc.founderPhotos", "Founder photos")}</h3>
            <p className="text-xs text-[#6B7384]">Shown in the "Meet Our Founders" section</p>
          </div>
          <div className="space-y-5 p-6">
            {imageSlots.map((slot) => (
              <div key={slot.key}>
                <label className="mb-1.5 block text-sm font-medium text-[#0A1224]">{slot.label}</label>
                <ImageUploader
                  value={images[slot.key]}
                  onUploaded={(url) => handleImageUpload(slot.key, url)}
                  label={slot.label}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
          <div className="border-b border-[#E2E8F0] px-6 py-4">
            <h3 className="font-display text-base font-bold text-[#0A1224]">{t("sc.general", "General settings")}</h3>
          </div>
          <div className="space-y-4 p-6">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#0A1224]">{t("sc.whatsappLabel", "Default WhatsApp number")}</label>
              <input
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="e.g. 84779423224"
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#F4F7FC] py-2.5 px-4 text-sm text-[#0A1224] focus:border-[#0047AB] focus:bg-white focus:outline-none"
              />
              <p className="mt-1.5 text-xs text-[#6B7384]">
                Used for the site-wide "Chat on WhatsApp" buttons when no team member is selected.
              </p>
            </div>
            <button
              onClick={handleSaveWhatsapp}
              disabled={savingWhatsapp}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0047AB] to-[#1E5BD6] px-5 py-2.5 text-sm font-semibold text-white shadow-lg disabled:opacity-70"
            >
              {savingWhatsapp ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {t("c.save", "Save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* USERS TAB (master only) */
function UsersTab({
  users,
  loading,
  currentUser,
  onRefresh,
}: {
  users: User[];
  loading: boolean;
  currentUser: User;
  onRefresh: () => void;
}) {
  const { t } = useLanguage();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [role, setRole] = useState<UserRole>("staff");
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Change-my-password form state.
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showChangePw, setShowChangePw] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPw) {
      toast.error("Enter your current password.");
      return;
    }
    if (newPw.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPw !== confirmPw) {
      toast.error("New password and confirmation do not match.");
      return;
    }
    setChangingPw(true);
    try {
      await changeMyPassword(currentPw, newPw);
      toast.success("Password updated. Use your new password next time you log in.");
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to change password.");
    } finally {
      setChangingPw(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || password.length < 6) {
      toast.error("Username required and password must be at least 6 characters.");
      return;
    }
    setCreating(true);
    try {
      await createUser(username.trim(), password, role);
      toast.success(`User "${username}" created with ${role} role.`);
      setUsername("");
      setPassword("");
      setRole("staff");
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create user.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (u: User) => {
    if (u.id === currentUser.id) {
      toast.error("You cannot delete your own account.");
      return;
    }
    if (!confirm(`Delete user "${u.username}"? This cannot be undone.`)) return;
    setDeletingId(u.id);
    try {
      await deleteUser(u.id);
      toast.success(`User "${u.username}" deleted.`);
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete user.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title={t("tab.users", "User Management")}
        subtitle={t("u.subtitle", "Create staff accounts for your team. Staff users can manage rates but cannot create or delete users.")}
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-2">
          <form onSubmit={handleCreate} className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
            <div className="border-b border-[#E2E8F0] bg-gradient-to-br from-[#F4F7FC] to-[#E6EEFB] px-6 py-4">
              <h3 className="font-display text-base font-bold text-[#0A1224]">{t("u.createNew", "Create new user")}</h3>
              <p className="text-xs text-[#6B7384]">{t("u.activeNote", "New account will be active immediately")}</p>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <label className="block text-sm font-medium text-[#0A1224] mb-1.5">{t("c.username", "Username")}</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
                  placeholder="e.g. sarah_ops"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F4F7FC] py-2.5 px-4 text-sm text-[#0A1224] placeholder:text-[#9CA3AF] focus:border-[#0047AB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0A1224] mb-1.5">{t("c.password", "Password")}</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    placeholder="Min 6 characters"
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F4F7FC] py-2.5 pl-4 pr-11 text-sm text-[#0A1224] placeholder:text-[#9CA3AF] focus:border-[#0047AB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#6B7384] hover:bg-[#F4F7FC]"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0A1224] mb-1.5">{t("c.role", "Role")}</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["staff", "master"] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`rounded-xl border px-4 py-2.5 text-sm font-semibold capitalize transition-all ${
                        role === r
                          ? "border-[#0047AB] bg-[#0047AB]/5 text-[#0047AB] ring-1 ring-[#0047AB]/20"
                          : "border-[#E2E8F0] bg-white text-[#6B7384] hover:border-[#0047AB]/30"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-[#6B7384]">
                  {role === "master"
                    ? "Master: full access. Manages rates and users."
                    : "Staff: rate management only. Cannot manage users."}
                </p>
              </div>

              <button
                type="submit"
                disabled={creating}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0047AB] to-[#1E5BD6] py-3 text-sm font-semibold text-white shadow-lg shadow-[#0047AB]/25 transition-all hover:shadow-xl hover:shadow-[#0047AB]/35 disabled:opacity-70"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating…
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    {t("u.createUser", "Create user")}
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Change my password */}
          <form onSubmit={handleChangePassword} className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
            <div className="border-b border-[#E2E8F0] bg-gradient-to-br from-[#F4F7FC] to-[#E6EEFB] px-6 py-4">
              <h3 className="font-display text-base font-bold text-[#0A1224]">{t("u.changePw", "Change my password")}</h3>
              <p className="text-xs text-[#6B7384]">{t("u.changePwSub", "Update the password for your own account.")}</p>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <label className="block text-sm font-medium text-[#0A1224] mb-1.5">{t("u.currentPw", "Current password")}</label>
                <input
                  type={showChangePw ? "text" : "password"}
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F4F7FC] py-2.5 px-4 text-sm text-[#0A1224] placeholder:text-[#9CA3AF] focus:border-[#0047AB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0A1224] mb-1.5">{t("u.newPw", "New password")}</label>
                <div className="relative">
                  <input
                    type={showChangePw ? "text" : "password"}
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    autoComplete="new-password"
                    placeholder="Min 6 characters"
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F4F7FC] py-2.5 pl-4 pr-11 text-sm text-[#0A1224] placeholder:text-[#9CA3AF] focus:border-[#0047AB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowChangePw(!showChangePw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#6B7384] hover:bg-[#F4F7FC]"
                    aria-label={showChangePw ? "Hide password" : "Show password"}
                  >
                    {showChangePw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0A1224] mb-1.5">{t("u.confirmPw", "Confirm new password")}</label>
                <input
                  type={showChangePw ? "text" : "password"}
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F4F7FC] py-2.5 px-4 text-sm text-[#0A1224] placeholder:text-[#9CA3AF] focus:border-[#0047AB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={changingPw}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0047AB] to-[#1E5BD6] py-3 text-sm font-semibold text-white shadow-lg shadow-[#0047AB]/25 transition-all hover:shadow-xl hover:shadow-[#0047AB]/35 disabled:opacity-70"
              >
                {changingPw ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}
                {t("u.updatePw", "Update password")}
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
            <div className="border-b border-[#E2E8F0] px-6 py-4">
              <h3 className="font-display text-base font-bold text-[#0A1224]">{t("u.teamMembers", "Team members")}</h3>
              <p className="text-xs text-[#6B7384]">{users.length} user{users.length === 1 ? "" : "s"} total</p>
            </div>
            {loading ? (
              <div className="p-8 text-center text-sm text-[#6B7384]">Loading users…</div>
            ) : (
              <div className="divide-y divide-[#F4F7FC]">
                {users.map((u) => (
                  <div key={u.id} className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#0047AB] to-[#1E5BD6] text-xs font-bold text-white">
                        {u.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0A1224]">
                          {u.username}
                          {u.id === currentUser.id && (
                            <span className="ml-2 rounded-full bg-[#0047AB]/10 px-2 py-0.5 text-[10px] font-bold text-[#0047AB]">
                              YOU
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-[#6B7384]">
                          Joined {new Date(u.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          u.role === "master"
                            ? "bg-[#C9A24B]/15 text-[#9B7A2E]"
                            : "bg-[#0047AB]/10 text-[#0047AB]"
                        }`}
                      >
                        {u.role}
                      </span>
                      {u.id !== currentUser.id && (
                        <button
                          onClick={() => handleDelete(u)}
                          disabled={deletingId === u.id}
                          className="rounded-lg p-1.5 text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors disabled:opacity-50"
                          aria-label={`Delete ${u.username}`}
                        >
                          {deletingId === u.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
