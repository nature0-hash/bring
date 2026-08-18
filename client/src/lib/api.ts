/**
 * API client — typed fetch wrapper for the Vercel serverless backend.
 * Reads JWT from localStorage and attaches it as a Bearer token.
 */
import type {
  AuthSession,
  GiftCard,
  User,
  UserRole,
  Country,
  CardRate,
  Staff,
  SiteImagesMap,
  SettingsMap,
} from "./types";

const TOKEN_KEY = "bgc_token";
const USER_KEY = "bgc_user";

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setSession(session: AuthSession) {
  try {
    localStorage.setItem(TOKEN_KEY, session.token);
    localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  } catch {
    /* ignore */
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    /* ignore */
  }
}

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(path, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = body.error || body.details || message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

/* Public: gift cards */

export function fetchGiftCards(): Promise<GiftCard[]> {
  return request<GiftCard[]>("/api/cards");
}

export function fetchAllGiftCards(): Promise<GiftCard[]> {
  return request<GiftCard[]>("/api/cards?includeInactive=1");
}

export function createGiftCard(data: {
  brand: string;
  slug: string;
  // imageUrl is optional — admin can save the card first and upload the
  // image afterwards. An empty string is stored when no image is set, and
  // the public catalog renders a clean neutral placeholder in that case.
  imageUrl?: string;
  baseRate: number;
  category?: string;
}): Promise<{ card: GiftCard }> {
  return request<{ card: GiftCard }>("/api/cards", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateGiftCard(
  id: number,
  data: Partial<{ brand: string; imageUrl: string; category: string; isActive: boolean; sortOrder: number; baseRate: number }>
): Promise<{ card: GiftCard }> {
  return request<{ card: GiftCard }>("/api/cards", {
    method: "PATCH",
    body: JSON.stringify({ id, ...data }),
  });
}

export function deleteGiftCard(id: number): Promise<{ ok: true }> {
  return request<{ ok: true }>(`/api/cards?id=${id}`, { method: "DELETE" });
}

/* Auth */

export function login(username: string, password: string): Promise<AuthSession> {
  return request<AuthSession>("/api/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function fetchMe(): Promise<{ user: User }> {
  return request<{ user: User }>("/api/me");
}

export function changeMyPassword(currentPassword: string, newPassword: string): Promise<{ ok: true }> {
  return request<{ ok: true }>("/api/users", {
    method: "PATCH",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

/* Admin: legacy rate management */

export function updateRate(id: number, baseRate: number): Promise<{ card: GiftCard }> {
  return request<{ card: GiftCard }>(`/api/rates`, {
    method: "POST",
    body: JSON.stringify({ id, baseRate }),
  });
}

export function toggleCardActive(id: number, isActive: boolean): Promise<{ card: GiftCard }> {
  return request<{ card: GiftCard }>(`/api/rates`, {
    method: "PATCH",
    body: JSON.stringify({ id, isActive }),
  });
}

/* Admin: user management (master only) */

export function listUsers(): Promise<{ users: User[] }> {
  return request<{ users: User[] }>("/api/users");
}

export function createUser(
  username: string,
  password: string,
  role: UserRole
): Promise<{ user: User }> {
  return request<{ user: User }>("/api/users", {
    method: "POST",
    body: JSON.stringify({ username, password, role }),
  });
}

export function deleteUser(id: number): Promise<{ ok: true }> {
  return request<{ ok: true }>(`/api/users?id=${id}`, { method: "DELETE" });
}

/* Countries */

export function fetchCountries(): Promise<Country[]> {
  return request<Country[]>("/api/countries");
}

export function fetchAllCountries(): Promise<Country[]> {
  return request<Country[]>("/api/countries?includeInactive=1");
}

export function createCountry(data: {
  code: string;
  name: string;
  currencyCode: string;
  currencySymbol: string;
  flagEmoji?: string;
  sortOrder?: number;
}): Promise<{ country: Country }> {
  return request<{ country: Country }>("/api/countries", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateCountry(
  id: number,
  data: Partial<{ name: string; currencyCode: string; currencySymbol: string; flagEmoji: string; isActive: boolean; sortOrder: number }>
): Promise<{ country: Country }> {
  return request<{ country: Country }>("/api/countries", {
    method: "PATCH",
    body: JSON.stringify({ id, ...data }),
  });
}

export function deleteCountry(id: number): Promise<{ ok: true }> {
  return request<{ ok: true }>(`/api/countries?id=${id}`, { method: "DELETE" });
}

/* Card rates (flexible face-value → local payout) */

export function fetchCardRates(cardId: number, countryId?: number): Promise<CardRate[]> {
  const qs = countryId ? `?cardId=${cardId}&countryId=${countryId}` : `?cardId=${cardId}`;
  return request<CardRate[]>(`/api/card-rates${qs}`);
}

export function saveCardRate(data: {
  cardId: number;
  countryId: number;
  faceValue: number;
  localRate: number;
}): Promise<{ rate: CardRate }> {
  return request<{ rate: CardRate }>("/api/card-rates", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function toggleCardRateActive(id: number, isActive: boolean): Promise<{ rate: CardRate }> {
  return request<{ rate: CardRate }>("/api/card-rates", {
    method: "PATCH",
    body: JSON.stringify({ id, isActive }),
  });
}

export function deleteCardRate(id: number): Promise<{ ok: true }> {
  return request<{ ok: true }>(`/api/card-rates?id=${id}`, { method: "DELETE" });
}

/* Staff / Team */

export function fetchStaff(): Promise<Staff[]> {
  return request<Staff[]>("/api/staff");
}

export function fetchAllStaff(): Promise<Staff[]> {
  return request<Staff[]>("/api/staff?includeInactive=1");
}

export function createStaff(data: {
  name: string;
  roleLabel?: string;
  whatsappNumber: string;
  imageUrl?: string;
  sortOrder?: number;
}): Promise<{ staff: Staff }> {
  return request<{ staff: Staff }>("/api/staff", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateStaff(
  id: number,
  data: Partial<{ name: string; roleLabel: string; whatsappNumber: string; imageUrl: string; isActive: boolean; sortOrder: number }>
): Promise<{ staff: Staff }> {
  return request<{ staff: Staff }>("/api/staff", {
    method: "PATCH",
    body: JSON.stringify({ id, ...data }),
  });
}

export function deleteStaff(id: number): Promise<{ ok: true }> {
  return request<{ ok: true }>(`/api/staff?id=${id}`, { method: "DELETE" });
}

/* Site images */

export function fetchSiteImages(): Promise<SiteImagesMap> {
  return request<SiteImagesMap>("/api/site-images");
}

export function saveSiteImage(key: string, imageUrl: string): Promise<{ key: string; imageUrl: string }> {
  return request<{ key: string; imageUrl: string }>("/api/site-images", {
    method: "POST",
    body: JSON.stringify({ key, imageUrl }),
  });
}

/* Settings */

export function fetchSettings(): Promise<SettingsMap> {
  return request<SettingsMap>("/api/settings");
}

export function saveSetting(key: string, value: string, description?: string): Promise<{ key: string; value: string }> {
  return request<{ key: string; value: string }>("/api/settings", {
    method: "POST",
    body: JSON.stringify({ key, value, description }),
  });
}

/* Image upload (Vercel Blob) */

export function uploadImage(file: File): Promise<{ url: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.onload = async () => {
      try {
        const dataBase64 = reader.result as string;
        const result = await request<{ url: string }>("/api/upload", {
          method: "POST",
          body: JSON.stringify({
            filename: file.name,
            dataBase64,
            contentType: file.type || "image/jpeg",
          }),
        });
        resolve(result);
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsDataURL(file);
  });
}

/* Geo (country auto-detect) */

export function fetchGeo(): Promise<{ countryCode: string | null }> {
  return request<{ countryCode: string | null }>("/api/geo");
}
