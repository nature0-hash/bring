/**
 * fx — static, approximate USD → local-currency conversion rates used ONLY
 * as an "estimate" fallback when the admin hasn't configured an explicit
 * card_rates row for a given card + country + face value combination.
 *
 * This ensures the calculator ALWAYS reflects the selected country's
 * currency (e.g. selecting Nigeria shows an NGN estimate, not a raw USD
 * figure), even before an admin has set a precise local rate.
 *
 * These are indicative only and should be updated periodically; once the
 * admin sets a real rate in the dashboard for a given denomination, that
 * configured rate always takes priority over this estimate.
 */
export const USD_TO_CURRENCY: Record<string, number> = {
  USD: 1,
  NGN: 1550,
  GBP: 0.79,
  GHS: 15.5,
  KES: 129,
  ZAR: 18.5,
  CAD: 1.37,
  INR: 83.5,
  PKR: 278,
  PHP: 58.7,
  EGP: 48.5,
  AED: 3.67,
  XAF: 610,
  EUR: 0.92,
};

/**
 * Convert a USD amount into the given currency code using the static table
 * above. Falls back to a 1:1 (USD) rate if the currency isn't listed.
 */
export function convertFromUSD(usdAmount: number, currencyCode: string | undefined): number {
  const rate = (currencyCode && USD_TO_CURRENCY[currencyCode]) || 1;
  return usdAmount * rate;
}
