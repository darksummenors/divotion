import { describe, expect, it } from 'vitest';
import { monstera, pilea } from '../../test/fixtures';
import { buildWishlistSummary } from './wishlistLines';

describe('buildWishlistSummary', () => {
  it('combines items with product data and calculates totals in cents', () => {
    const summary = buildWishlistSummary(
      [
        { productId: monstera.id, quantity: 2 },
        { productId: pilea.id, quantity: 1 },
      ],
      [monstera, pilea],
    );

    expect(summary.lines.map((line) => [line.product.name, line.quantity, line.lineTotal])).toEqual(
      [
        ['Monstera Deliciosa', 2, 6990],
        ['Pilea Peperomioides', 1, 1495],
      ],
    );
    expect(summary.totalQuantity).toBe(3);
    expect(summary.totalAmount).toBe(8485);
  });

  it('skips items whose product no longer exists', () => {
    const summary = buildWishlistSummary(
      [
        { productId: 'gone', quantity: 4 },
        { productId: monstera.id, quantity: 1 },
      ],
      [monstera],
    );

    expect(summary.lines).toHaveLength(1);
    expect(summary.totalQuantity).toBe(1);
  });

  it('returns zeros for an empty wishlist', () => {
    expect(buildWishlistSummary([], [monstera])).toEqual({
      lines: [],
      totalQuantity: 0,
      totalAmount: 0,
    });
  });
});
