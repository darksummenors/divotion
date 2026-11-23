import { z } from 'zod';
import { MAX_QUANTITY, type WishlistItem } from './wishlistSlice';

export const wishlistStorageKey = (user: string | null = null) => `wishlist:${user ?? 'guest'}`;

const StoredWishlistSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().min(1).max(MAX_QUANTITY),
    }),
  ),
});

export interface WishlistRepository {
  load(): WishlistItem[];
  save(items: WishlistItem[]): void;
  subscribe(listener: (items: WishlistItem[]) => void): () => void;
}

export function createLocalStorageRepository(
  key = wishlistStorageKey(),
  storage: Storage = localStorage,
): WishlistRepository {
  const repository: WishlistRepository = {
    load() {
      try {
        const raw = storage.getItem(key);
        if (!raw) return [];

        const result = StoredWishlistSchema.safeParse(JSON.parse(raw));
        if (!result.success) {
          console.warn('Opgeslagen verlanglijst is ongeldig en wordt genegeerd.', result.error);
          return [];
        }

        return withoutDuplicates(result.data.items);
      } catch (error) {
        console.warn('Verlanglijst kon niet worden geladen.', error);
        return [];
      }
    },

    save(items) {
      try {
        storage.setItem(key, JSON.stringify({ items }));
      } catch (error) {
        console.warn('Verlanglijst kon niet worden opgeslagen.', error);
      }
    },

    subscribe(listener) {
      const handleStorage = (event: StorageEvent) => {
        if (event.storageArea !== storage) return;

        if (event.key !== key && event.key !== null) return;

        listener(repository.load());
      };

      window.addEventListener('storage', handleStorage);
      return () => window.removeEventListener('storage', handleStorage);
    },
  };

  return repository;
}

function withoutDuplicates(items: WishlistItem[]): WishlistItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.productId)) return false;
    seen.add(item.productId);
    return true;
  });
}
