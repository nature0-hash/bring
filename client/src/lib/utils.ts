import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as USD currency. */
export function formatUSD(value: number, opts: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...opts,
  }).format(value);
}

/** Format a rate (0.82) as a percentage (82%). */
export function formatRate(rate: number) {
  return `${(rate * 100).toFixed(1)}%`;
}

/** Sleep helper. */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
