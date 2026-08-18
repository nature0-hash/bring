import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, Pencil, Save, Loader2, Image as ImageIcon, Lock, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchGiftCards,
  uploadImage,
  createGiftCard,
  updateGiftCard,
} from "@/lib/api";
import type { GiftCard } from "@/lib/types";

/**
 * UploadEditSave
 *
 * A simple, self-contained admin form that replaces the old gift-card grid.
 *
 *   1. Upload  — pick a brand image from disk
 *   2. Edit    — type / rename the brand name
 *   3. Save    — persists to /api/cards (creates or updates)
 *
 * Only master-logged-in users can actually submit. Non-admins see a
 * friendly "log in to manage cards" panel instead, so the public page
 * stays usable but the form is gated.
 *
 * All API calls use the existing helpers in @/lib/api so the form is
 * wired into the real backend that's already deployed on Vercel.
 */
export function UploadEditSave() {
  const { isMaster, loading: authLoading } = useAuth();

  const [cards, setCards] = useState<GiftCard[]>([]);
  const [loadingCards, setLoadingCards] = useState(true);

  const [selectedId, setSelectedId] = useState<number | "new">("new");
  const [brand, setBrand] = useState("");
  const [slug, setSlug] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [baseRate, setBaseRate] = useState(80);
  const [category, setCategory] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial load of existing cards (so the dropdown can be populated).
  useEffect(() => {
    fetchGiftCards()
      .then((list) => {
        setCards(list);
        setLoadingCards(false);
      })
      .catch(() => setLoadingCards(false));
  }, []);

  // When the user picks a card from the dropdown, hydrate the form with
  // that card's current values so "edit + save" actually edits it.
  useEffect(() => {
    if (selectedId === "new") {
      setBrand("");
      setSlug("");
      setImageUrl("");
      setBaseRate(80);
      setCategory("");
      setFile(null);
      setPreviewUrl("");
      return;
    }
    const found = cards.find((c) => c.id === selectedId);
    if (!found) return;
    setBrand(found.brand);
    setSlug(found.slug);
    setImageUrl(found.imageUrl);
    setBaseRate(Math.round((found.baseRate || 0) * 100));
    setCategory(found.category ?? "");
    setFile(null);
    setPreviewUrl(found.imageUrl || "");
  }, [selectedId, cards]);

  function handleFileChosen(f: File | null) {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Please pick an image file (PNG / JPG / WebP).");
      return;
    }
    if (f.size > 4.5 * 1024 * 1024) {
      toast.error("That image is over 4.5 MB — please use a smaller one.");
      return;
    }
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  }

  function autoSlug(input: string) {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async function handleSave() {
    if (!isMaster) {
      toast.error("You need to log in as admin first.");
      return;
    }
    if (!brand.trim()) {
      toast.error("Brand name is required.");
      return;
    }

    const finalSlug = slug.trim() ? autoSlug(slug) : autoSlug(brand);

    setSaving(true);
    try {
      // Step 1 — upload (if a new file was picked)
      let finalUrl = imageUrl;
      if (file) {
        toast.loading("Uploading image…", { id: "upl" });
        const { url } = await uploadImage(file);
        finalUrl = url;
        toast.success("Image uploaded.", { id: "upl" });
      }

      // Step 2 — edit: nothing to do client-side, brand/slug already set

      // Step 3 — save: create or update
      if (selectedId === "new") {
        if (!finalUrl) {
          toast.error("Please upload an image before creating a new card.");
          setSaving(false);
          return;
        }
        const { card } = await createGiftCard({
          brand: brand.trim(),
          slug: finalSlug,
          imageUrl: finalUrl,
          baseRate: Number(baseRate) / 100,
          category: category || undefined,
        });
        toast.success(`Created “${card.brand}”.`);
        setCards((prev) => [...prev, card]);
        setSelectedId(card.id);
      } else {
        const { card } = await updateGiftCard(selectedId, {
          brand: brand.trim(),
          imageUrl: finalUrl,
          category: category || undefined,
          baseRate: Number(baseRate) / 100,
        });
        toast.success(`Saved “${card.brand}”.`);
        setCards((prev) => prev.map((c) => (c.id === card.id ? card : c)));
      }
      setFile(null);
    } catch (err) {
      console.error("[UploadEditSave] save failed", err);
      toast.error("Save failed — see console.");
    } finally {
      setSaving(false);
    }
  }

  function reset() {
    setSelectedId("new");
    setBrand("");
    setSlug("");
    setImageUrl("");
    setBaseRate(80);
    setCategory("");
    setFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // Public, non-admin view: prompt to log in.
  if (!authLoading && !isMaster) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-dashed border-[#E2E8F0] bg-[#F4F7FC] p-10 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
          <Lock className="h-5 w-5 text-[#0047AB]" />
        </div>
        <h3 className="font-display text-lg font-bold text-[#0A1224]">
          Admin only
        </h3>
        <p className="mt-1 text-sm text-[#6B7384]">
          Log in as master from the menu to upload, edit, and save cards.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Top row: card selector + reset */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#6B7384]">
            Card to edit
          </label>
          <select
            value={selectedId}
            onChange={(e) =>
              setSelectedId(
                e.target.value === "new" ? "new" : Number(e.target.value)
              )
            }
            disabled={loadingCards || saving}
            className="w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0A1224] shadow-sm focus:border-[#0047AB] focus:outline-none focus:ring-4 focus:ring-[#0047AB]/10"
          >
            <option value="new">+ New card</option>
            {cards.map((c) => (
              <option key={c.id} value={c.id}>
                {c.brand} ({c.slug})
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={reset}
          type="button"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-semibold text-[#3B4256] hover:border-[#0047AB]/40 hover:text-[#0047AB] disabled:opacity-50"
        >
          <RefreshCw className="h-4 w-4" />
          Reset
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white shadow-sm"
      >
        {/* Three-step header */}
        <div className="grid grid-cols-3 divide-x divide-[#E2E8F0] border-b border-[#E2E8F0] bg-[#F4F7FC]">
          {[
            { n: 1, label: "Upload", icon: <Upload className="h-4 w-4" /> },
            { n: 2, label: "Edit", icon: <Pencil className="h-4 w-4" /> },
            { n: 3, label: "Save", icon: <Save className="h-4 w-4" /> },
          ].map((s) => (
            <div
              key={s.n}
              className="flex items-center justify-center gap-2 px-3 py-3 text-xs font-bold uppercase tracking-wider text-[#0047AB]"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0047AB] text-white">
                {s.n}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
              <span className="sm:hidden">{s.icon}</span>
            </div>
          ))}
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
          {/* LEFT — Upload + preview */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#6B7384]">
              Image
            </label>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group relative flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#E2E8F0] bg-[#F4F7FC] hover:border-[#0047AB]/40 hover:bg-[#EBF1FB] transition-colors"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="preview"
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-[#6B7384]">
                  <ImageIcon className="h-8 w-8" />
                  <span className="text-sm font-medium">Click to upload</span>
                  <span className="text-xs text-[#9CA3AF]">PNG, JPG, WebP — &lt; 4.5 MB</span>
                </div>
              )}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChosen(e.target.files?.[0] ?? null)}
            />

            {file && (
              <p className="mt-2 truncate text-xs text-[#6B7384]">
                <span className="font-semibold text-[#0047AB]">Selected:</span>{" "}
                {file.name}
              </p>
            )}
            {!file && imageUrl && (
              <p className="mt-2 truncate text-xs text-[#6B7384]">
                <span className="font-semibold text-[#0047AB]">Current:</span>{" "}
                {imageUrl.split("/").pop()}
              </p>
            )}
          </div>

          {/* RIGHT — Edit fields */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#6B7384]">
                Brand name
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Steam"
                className="w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0A1224] shadow-sm focus:border-[#0047AB] focus:outline-none focus:ring-4 focus:ring-[#0047AB]/10"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#6B7384]">
                Slug (URL id)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="auto-generated from brand"
                  className="flex-1 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0A1224] shadow-sm focus:border-[#0047AB] focus:outline-none focus:ring-4 focus:ring-[#0047AB]/10"
                />
                <button
                  type="button"
                  onClick={() => setSlug(autoSlug(brand))}
                  className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-3 text-xs font-semibold text-[#3B4256] hover:border-[#0047AB]/40 hover:text-[#0047AB]"
                >
                  Auto
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#6B7384]">
                  Payout %
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={baseRate}
                  onChange={(e) => setBaseRate(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0A1224] shadow-sm focus:border-[#0047AB] focus:outline-none focus:ring-4 focus:ring-[#0047AB]/10"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#6B7384]">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="gaming"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0A1224] shadow-sm focus:border-[#0047AB] focus:outline-none focus:ring-4 focus:ring-[#0047AB]/10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer — Save */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E8F0] bg-[#F4F7FC] px-6 py-4 sm:px-8">
          <p className="text-xs text-[#6B7384]">
            {selectedId === "new"
              ? "A new card will be created on save."
              : `Editing card #${selectedId} — changes go live instantly.`}
          </p>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0047AB] px-6 py-3 text-sm font-bold text-white shadow-md shadow-[#0047AB]/25 hover:bg-[#002B6D] disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving
              ? "Saving…"
              : selectedId === "new"
                ? "Create card"
                : "Save changes"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
