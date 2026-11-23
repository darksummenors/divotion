import { describe, expect, it } from 'vitest';
import { formatPrice } from './format';

// Intl uses a narrow no-break space between "€" and the amount; normalise it for readable assertions
const normalise = (value: string) => value.replace(/\s/g, ' ');

describe('formatPrice', () => {
  it('formats cents as a Dutch euro price', () => {
    expect(normalise(formatPrice(3495))).toBe('€ 34,95');
  });

  it('always shows two decimals', () => {
    expect(normalise(formatPrice(2000))).toBe('€ 20,00');
  });

  it('uses a dot as thousands separator', () => {
    expect(normalise(formatPrice(123456))).toBe('€ 1.234,56');
  });

  it('formats zero', () => {
    expect(normalise(formatPrice(0))).toBe('€ 0,00');
  });
});
