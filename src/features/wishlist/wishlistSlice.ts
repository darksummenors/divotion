import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export const MAX_QUANTITY = 99;

export type WishlistItem = {
  productId: string;
  quantity: number;
};

export type WishlistState = {
  items: WishlistItem[];
};

const initialState: WishlistState = { items: [] };

const clampQuantity = (quantity: number) =>
  Math.min(MAX_QUANTITY, Math.max(1, Math.trunc(quantity)));

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    itemAdded(state, action: PayloadAction<string>) {
      if (state.items.some((item) => item.productId === action.payload)) return;

      state.items.unshift({ productId: action.payload, quantity: 1 });
    },
    itemRemoved(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.productId !== action.payload);
    },
    quantityChanged(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const { productId, quantity } = action.payload;
      if (!Number.isFinite(quantity)) return;

      if (quantity < 1) {
        state.items = state.items.filter((item) => item.productId !== productId);
        return;
      }

      const item = state.items.find((entry) => entry.productId === productId);
      if (item) item.quantity = clampQuantity(quantity);
    },
    wishlistCleared(state) {
      state.items = [];
    },
    wishlistSynced(state, action: PayloadAction<WishlistItem[]>) {
      state.items = action.payload;
    },
    unknownProductsPruned(state, action: PayloadAction<string[]>) {
      const knownIds = new Set(action.payload);
      if (state.items.every((item) => knownIds.has(item.productId))) return;

      state.items = state.items.filter((item) => knownIds.has(item.productId));
    },
  },
  selectors: {
    selectWishlistItems: (state) => state.items,
    selectWishlistCount: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    selectIsInWishlist: (state, productId: string) =>
      state.items.some((item) => item.productId === productId),
  },
});

export const {
  itemAdded,
  itemRemoved,
  quantityChanged,
  wishlistCleared,
  wishlistSynced,
  unknownProductsPruned,
} = wishlistSlice.actions;

export const { selectWishlistItems, selectWishlistCount, selectIsInWishlist } =
  wishlistSlice.selectors;
