/**
 * Shared types between client and server.
 * Keep this file free of runtime code so it can be imported from anywhere.
 */

export type UserRole = "master" | "staff";

export interface User {
  id: number;
  username: string;
  role: UserRole;
  createdAt: string;
}

export const CARD_CATEGORIES: { key: string; label: string }[] = [
  { key: "gaming", label: "Gaming" },
  { key: "digital", label: "Digital & Software" },
  { key: "retail", label: "Retail & Shopping" },
  { key: "entertainment", label: "Entertainment & Streaming" },
  { key: "sportswear", label: "Sportswear" },
  { key: "lifestyle", label: "Beauty & Lifestyle" },
  { key: "financial", label: "Financial & Prepaid" },
];

export interface GiftCard {
  id: number;
  brand: string;
  slug: string;
  imageUrl: string;
  baseRate: number;       // e.g. 0.82 means $100 card → $82 payout (fallback when no card_rates row exists)
  isActive: boolean;
  category: string | null;
  sortOrder: number;
  updatedAt: string;
}

export interface Country {
  id: number;
  code: string;
  name: string;
  currencyCode: string;
  currencySymbol: string;
  flagEmoji: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface CardRate {
  id: number;
  cardId: number;
  countryId: number;
  faceValue: number;
  localRate: number;
  isActive: boolean;
  updatedAt: string;
  countryCode?: string;
  countryName?: string;
  currencyCode?: string;
  currencySymbol?: string;
}

export interface Staff {
  id: number;
  name: string;
  roleLabel: string | null;
  whatsappNumber: string;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export type SiteImagesMap = Record<string, string>;
export type SettingsMap = Record<string, string>;

export interface AuthSession {
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
  details?: string;
}
