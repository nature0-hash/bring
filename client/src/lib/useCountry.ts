/**
 * useCountry — auto-detects the visitor's country (via Vercel's free geo
 * header, exposed at /api/geo) and lets them manually override it. The
 * manual choice is remembered in localStorage and always wins over
 * auto-detection on future visits.
 */
import { useEffect, useState } from "react";
import { fetchCountries, fetchGeo } from "./api";
import type { Country } from "./types";

const STORAGE_KEY = "bgc_country_code";
const DEFAULT_CODE = "NG"; // sensible fallback for local dev / undetectable IPs

export function useCountry() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [countryCode, setCountryCode] = useState<string>(DEFAULT_CODE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const list = await fetchCountries();
        if (!mounted) return;
        setCountries(list);

        // 1. Manual override always wins.
        const stored = (() => {
          try {
            return localStorage.getItem(STORAGE_KEY);
          } catch {
            return null;
          }
        })();

        if (stored && list.some((c) => c.code === stored)) {
          setCountryCode(stored);
          return;
        }

        // 2. Auto-detect via Vercel geo header.
        try {
          const { countryCode: detected } = await fetchGeo();
          if (!mounted) return;
          if (detected && list.some((c) => c.code === detected)) {
            setCountryCode(detected);
            return;
          }
        } catch {
          /* ignore — fall through to default */
        }

        // 3. Fall back to default (first country in list, or NG).
        if (list.some((c) => c.code === DEFAULT_CODE)) {
          setCountryCode(DEFAULT_CODE);
        } else if (list.length > 0) {
          setCountryCode(list[0].code);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const selectCountry = (code: string) => {
    setCountryCode(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* ignore */
    }
  };

  const selectedCountry = countries.find((c) => c.code === countryCode) ?? null;

  return { countries, countryCode, selectedCountry, selectCountry, loading };
}
