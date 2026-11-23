import { combineReducers, configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import { wishlistSlice, wishlistSynced } from '../features/wishlist/wishlistSlice';
import {
  createLocalStorageRepository,
  type WishlistRepository,
} from '../features/wishlist/wishlistStorage';
import { uiSlice } from './uiSlice';

const rootReducer = combineReducers({
  [wishlistSlice.reducerPath]: wishlistSlice.reducer,
  [uiSlice.reducerPath]: uiSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

type StoreOptions = {
  wishlistRepository?: WishlistRepository;
};

/**
 * A factory instead of a single global store: every test gets a fresh store.
 */
export function createAppStore({
  wishlistRepository = createLocalStorageRepository(),
}: StoreOptions = {}) {
  // Persistence as middleware: components and reducers never touch localStorage themselves
  const persistence = createListenerMiddleware();

  persistence.startListening.withTypes<RootState>()({
    predicate: (action, currentState, previousState) =>
      currentState.wishlist.items !== previousState.wishlist.items &&
      // Changes from another tab are already saved: writing them back would be pointless
      !wishlistSynced.match(action),
    effect: (_action, api) => {
      wishlistRepository.save(api.getState().wishlist.items);
    },
  });

  // Loaded before the first render, so the badge never flashes "0" and then jumps
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: { wishlist: { items: wishlistRepository.load() } },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(persistence.middleware),
  });

  // Sync: add a plant in one tab, and the badge and side panel update in the others
  const stopSync = wishlistRepository.subscribe((items) => store.dispatch(wishlistSynced(items)));

  return Object.assign(store, {
    stopSync,
  });
}

export type AppStore = ReturnType<typeof createAppStore>;
export type AppDispatch = AppStore['dispatch'];
