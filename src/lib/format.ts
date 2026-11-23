/**
 * Formats an amount in cents as a Dutch price, e.g. 3495 → "€ 34,95".
 */
export function formatPrice(amountInCents: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency }).format(
    amountInCents / 100,
  );
}
