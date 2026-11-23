import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createAppStore } from '../../app/store';
import { itemAdded, quantityChanged } from './wishlistSlice';
import { createLocalStorageRepository, wishlistStorageKey } from './wishlistStorage';

const KEY = wishlistStorageKey();

describe('wishlistStorageKey', () => {
  it('uses a key per user, with the guest as default', () => {
    expect(wishlistStorageKey()).toBe('wishlist:guest');
    expect(wishlistStorageKey('gydo')).toBe('wishlist:gydo');
  });
});

describe('createLocalStorageRepository', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it('saves and loads the wishlist', () => {
    const repository = createLocalStorageRepository();
    repository.save([{ productId: 'monstera', quantity: 2 }]);
    expect(repository.load()).toEqual([{ productId: 'monstera', quantity: 2 }]);
  });

  it('stores the items as JSON', () => {
    createLocalStorageRepository().save([{ productId: 'monstera', quantity: 2 }]);
    expect(JSON.parse(localStorage.getItem(KEY) ?? '')).toEqual({
      items: [{ productId: 'monstera', quantity: 2 }],
    });
  });

  it('starts empty when nothing is stored', () => {
    expect(createLocalStorageRepository().load()).toEqual([]);
  });

  it('starts empty instead of crashing on broken JSON', () => {
    localStorage.setItem(KEY, '{not json');
    expect(createLocalStorageRepository().load()).toEqual([]);
  });

  it('starts empty when the stored data has the wrong shape', () => {
    localStorage.setItem(KEY, JSON.stringify([{ productId: 'monstera', quantity: 1 }]));
    expect(createLocalStorageRepository().load()).toEqual([]);
  });

  it('starts empty when a quantity is invalid', () => {
    localStorage.setItem(KEY, JSON.stringify({ items: [{ productId: 'monstera', quantity: -3 }] }));
    expect(createLocalStorageRepository().load()).toEqual([]);
  });

  it('drops duplicate products', () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        items: [
          { productId: 'monstera', quantity: 1 },
          { productId: 'monstera', quantity: 5 },
        ],
      }),
    );
    expect(createLocalStorageRepository().load()).toEqual([{ productId: 'monstera', quantity: 1 }]);
  });

  it('keeps working when the browser blocks storage', () => {
    const blocked = {
      getItem: () => {
        throw new Error('SecurityError');
      },
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
    } as unknown as Storage;
    const repository = createLocalStorageRepository(KEY, blocked);
    expect(() => repository.save([{ productId: 'monstera', quantity: 1 }])).not.toThrow();
    expect(repository.load()).toEqual([]);
  });
});

describe('store persistence', () => {
  it('saves every wishlist change to localStorage', () => {
    const store = createAppStore();
    store.dispatch(itemAdded('monstera'));
    store.dispatch(quantityChanged({ productId: 'monstera', quantity: 3 }));
    expect(JSON.parse(localStorage.getItem(KEY) ?? '').items).toEqual([
      { productId: 'monstera', quantity: 3 },
    ]);
  });

  it('restores the wishlist in a new store, like after closing and reopening the browser', () => {
    createAppStore().dispatch(itemAdded('monstera'));

    const reopened = createAppStore();
    expect(reopened.getState().wishlist.items).toEqual([{ productId: 'monstera', quantity: 1 }]);
  });
});

/** What the browser does in THIS tab when ANOTHER tab writes to localStorage. */
function simulateOtherTab(key: string | null, items?: { productId: string; quantity: number }[]) {
  if (key && items) localStorage.setItem(key, JSON.stringify({ items }));
  window.dispatchEvent(new StorageEvent('storage', { key, storageArea: localStorage }));
}

describe('cross-tab sync', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it('notifies the listener when another tab changes the wishlist', () => {
    const listener = vi.fn();
    const stop = createLocalStorageRepository().subscribe(listener);

    simulateOtherTab(KEY, [{ productId: 'pilea', quantity: 2 }]);

    expect(listener).toHaveBeenCalledWith([{ productId: 'pilea', quantity: 2 }]);
    stop();
  });

  it('ignores changes to other localStorage keys', () => {
    const listener = vi.fn();
    const stop = createLocalStorageRepository().subscribe(listener);

    simulateOtherTab('something-else', [{ productId: 'pilea', quantity: 2 }]);

    expect(listener).not.toHaveBeenCalled();
    stop();
  });

  it('treats localStorage.clear() in another tab as an empty wishlist', () => {
    const listener = vi.fn();
    const stop = createLocalStorageRepository().subscribe(listener);

    simulateOtherTab(null);

    expect(listener).toHaveBeenCalledWith([]);
    stop();
  });

  it('validates data from another tab like any other stored data', () => {
    const listener = vi.fn();
    const stop = createLocalStorageRepository().subscribe(listener);

    localStorage.setItem(KEY, '{broken');
    simulateOtherTab(KEY);

    expect(listener).toHaveBeenCalledWith([]);
    stop();
  });

  it('stops listening after unsubscribing', () => {
    const listener = vi.fn();
    const stop = createLocalStorageRepository().subscribe(listener);
    stop();

    simulateOtherTab(KEY, [{ productId: 'pilea', quantity: 2 }]);

    expect(listener).not.toHaveBeenCalled();
  });

  it('updates the store when another tab changes the wishlist, without saving it back', () => {
    const store = createAppStore();
    const setItem = vi.spyOn(Storage.prototype, 'setItem');

    simulateOtherTab(KEY, [{ productId: 'pilea', quantity: 2 }]);

    expect(store.getState().wishlist.items).toEqual([{ productId: 'pilea', quantity: 2 }]);
    // Only the simulated other tab wrote to storage; this tab did not write it back
    expect(setItem).toHaveBeenCalledTimes(1);
    store.stopSync();
  });
});
