const formatters = new Map<string, Intl.NumberFormat>();

/**
 * Formats an amount in cents as a Dutch price, e.g. 3495 → "€ 34,95".
 */
export function formatPrice(amountInCents: number, currency = 'EUR', locale = 'nl-NL'): string {
  const key = `${locale}-${currency}`;
  let formatter = formatters.get(key);

  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, { style: 'currency', currency });
    formatters.set(key, formatter);
  }

  return formatter.format(amountInCents / 100);
}
