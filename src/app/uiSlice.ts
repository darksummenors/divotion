import { createSlice } from '@reduxjs/toolkit';

/** UI state that several components share, but that is never saved. */
export const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isWishlistOpen: false,
  },
  reducers: {
    wishlistOpened(state) {
      state.isWishlistOpen = true;
    },
    wishlistClosed(state) {
      state.isWishlistOpen = false;
    },
  },
  selectors: {
    selectIsWishlistOpen: (state) => state.isWishlistOpen,
  },
});

export const { wishlistOpened, wishlistClosed } = uiSlice.actions;
export const { selectIsWishlistOpen } = uiSlice.selectors;
