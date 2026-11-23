import { describe, expect, it } from 'vitest';
import {
  itemAdded,
  itemRemoved,
  MAX_QUANTITY,
  quantityChanged,
  selectIsInWishlist,
  selectWishlistCount,
  unknownProductsPruned,
  wishlistCleared,
  wishlistSlice,
  wishlistSynced,
  type WishlistState,
} from './wishlistSlice';

const reducer = wishlistSlice.reducer;
const empty: WishlistState = { items: [] };
const withItems = (...items: [string, number][]): WishlistState => ({
  items: items.map(([productId, quantity]) => ({ productId, quantity })),
});
const asRoot = (wishlist: WishlistState) => ({ wishlist });

describe('wishlistSlice', () => {
  it('adds a product with quantity 1', () => {
    expect(reducer(empty, itemAdded('monstera'))).toEqual(withItems(['monstera', 1]));
  });

  it('puts the newest product first', () => {
    const state = reducer(withItems(['monstera', 1]), itemAdded('pilea'));
    expect(state.items.map((item) => item.productId)).toEqual(['pilea', 'monstera']);
  });

  it('does not add the same product twice', () => {
    const state = reducer(withItems(['monstera', 3]), itemAdded('monstera'));
    expect(state).toEqual(withItems(['monstera', 3]));
  });

  it('removes a product', () => {
    const state = reducer(withItems(['monstera', 1], ['pilea', 2]), itemRemoved('monstera'));
    expect(state).toEqual(withItems(['pilea', 2]));
  });

  it('changes the quantity', () => {
    const state = reducer(
      withItems(['monstera', 1]),
      quantityChanged({ productId: 'monstera', quantity: 4 }),
    );
    expect(state).toEqual(withItems(['monstera', 4]));
  });

  it('removes the product when the quantity goes below 1', () => {
    const state = reducer(
      withItems(['monstera', 1]),
      quantityChanged({ productId: 'monstera', quantity: 0 }),
    );
    expect(state).toEqual(empty);
  });

  it(`caps the quantity at ${MAX_QUANTITY}`, () => {
    const state = reducer(
      withItems(['monstera', 1]),
      quantityChanged({ productId: 'monstera', quantity: 500 }),
    );
    expect(state.items[0]?.quantity).toBe(MAX_QUANTITY);
  });

  it('ignores a quantity that is not a number', () => {
    const before = withItems(['monstera', 2]);
    expect(reducer(before, quantityChanged({ productId: 'monstera', quantity: Number.NaN }))).toBe(
      before,
    );
  });

  it('clears the wishlist', () => {
    expect(reducer(withItems(['monstera', 1], ['pilea', 2]), wishlistCleared())).toEqual(empty);
  });

  it('replaces the list with the version from another tab', () => {
    const state = reducer(
      withItems(['monstera', 1]),
      wishlistSynced([{ productId: 'pilea', quantity: 3 }]),
    );
    expect(state).toEqual(withItems(['pilea', 3]));
  });

  it('prunes products that no longer exist', () => {
    const state = reducer(
      withItems(['monstera', 1], ['gone', 2]),
      unknownProductsPruned(['monstera', 'pilea']),
    );
    expect(state).toEqual(withItems(['monstera', 1]));
  });

  it('keeps the same state object when there is nothing to prune (so nothing is saved)', () => {
    const before = withItems(['monstera', 1]);
    expect(reducer(before, unknownProductsPruned(['monstera']))).toBe(before);
  });
});

describe('selectors', () => {
  it('counts the total quantity, not the number of products', () => {
    expect(selectWishlistCount(asRoot(withItems(['monstera', 2], ['pilea', 1])))).toBe(3);
  });

  it('counts 0 for an empty wishlist', () => {
    expect(selectWishlistCount(asRoot(empty))).toBe(0);
  });

  it('knows whether a product is on the wishlist', () => {
    const state = asRoot(withItems(['monstera', 1]));
    expect(selectIsInWishlist(state, 'monstera')).toBe(true);
    expect(selectIsInWishlist(state, 'pilea')).toBe(false);
  });
});
