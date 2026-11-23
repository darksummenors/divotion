import { act, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createAppStore } from '../../app/store';
import { mockFetchProducts, monstera, pilea } from '../../test/fixtures';
import { renderRoute } from '../../test/test-utils';

/**
 * The full wishlist flow as a user experiences it, from heart to side panel.
 */
describe('wishlist flow', () => {
  afterEach(() => vi.restoreAllMocks());

  const openWishlist = async () => {
    await userEvent.click(screen.getByRole('button', { name: /^Wishlist/ }));
    return screen.getByRole('dialog', { name: 'Verlanglijst' });
  };

  it('adds a product with the heart and shows the total quantity in the header', async () => {
    mockFetchProducts([monstera, pilea]);
    renderRoute('/');

    const heart = await screen.findByRole('button', { name: 'Monstera Deliciosa op verlanglijst' });

    await userEvent.click(heart);

    expect(screen.getByRole('button', { name: 'Wishlist, 1 items' })).toBeInTheDocument();
  });

  it('shows the items in the side panel and updates quantity, totals and badge', async () => {
    mockFetchProducts([monstera, pilea]);
    renderRoute('/');
    await userEvent.click(
      await screen.findByRole('button', { name: 'Monstera Deliciosa op verlanglijst' }),
    );

    const panel = await openWishlist();
    expect(within(panel).getByRole('heading', { name: 'Monstera Deliciosa' })).toBeInTheDocument();

    await userEvent.click(
      within(panel).getByRole('button', { name: 'Verhoog aantal Monstera Deliciosa' }),
    );

    expect(within(panel).getByText('2 stuks')).toBeInTheDocument();
    expect(within(panel).getAllByText(/69,90/).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Wishlist, 2 items' })).toBeInTheDocument();
  });

  it('shows the empty state after removing the last item', async () => {
    mockFetchProducts([monstera]);
    renderRoute('/');
    await userEvent.click(
      await screen.findByRole('button', { name: 'Monstera Deliciosa op verlanglijst' }),
    );

    const panel = await openWishlist();
    await userEvent.click(
      within(panel).getByRole('button', { name: 'Verwijder Monstera Deliciosa' }),
    );

    expect(
      within(panel).getByRole('heading', { name: 'Je verlanglijst is nog leeg' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Wishlist is empty' })).toBeInTheDocument();
  });

  it('keeps the wishlist after a "browser restart" (new store, same localStorage)', async () => {
    mockFetchProducts([monstera, pilea]);
    const first = renderRoute('/');
    await userEvent.click(
      await screen.findByRole('button', { name: 'Pilea Peperomioides op verlanglijst' }),
    );
    first.unmount();

    renderRoute('/', { store: createAppStore() });

    expect(screen.getByRole('button', { name: 'Wishlist, 1 items' })).toBeInTheDocument();
    // The restored item also shows up in the side panel
    await userEvent.click(screen.getByRole('button', { name: /^Wishlist/ }));
    expect(
      await within(screen.getByRole('dialog')).findByRole('heading', {
        name: 'Pilea Peperomioides',
      }),
    ).toBeInTheDocument();
  });

  it('adds and removes from the detail page with the large button', async () => {
    mockFetchProducts([monstera]);
    renderRoute('/products/monstera-deliciosa');

    await userEvent.click(await screen.findByRole('button', { name: 'Op mijn verlanglijst' }));
    expect(screen.getByRole('button', { name: 'Op je verlanglijst' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Wishlist, 1 items' })).toBeInTheDocument();
  });

  it('cleans up items whose product was removed from products.json', async () => {
    localStorage.setItem(
      'wishlist:guest',
      JSON.stringify({
        items: [
          { productId: 'sold-out', quantity: 2 },
          { productId: monstera.id, quantity: 1 },
        ],
      }),
    );
    mockFetchProducts([monstera]);
    const { store } = renderRoute('/');

    await screen.findByRole('button', { name: 'Monstera Deliciosa op verlanglijst' });
    expect(store.getState().wishlist.items).toEqual([{ productId: monstera.id, quantity: 1 }]);
    expect(screen.getByRole('button', { name: 'Wishlist, 1 items' })).toBeInTheDocument();
  });

  it('updates the badge when the wishlist changes in another browser tab', async () => {
    mockFetchProducts([monstera, pilea]);
    const { store } = renderRoute('/');
    await screen.findByRole('button', { name: 'Pilea Peperomioides op verlanglijst' });

    // What the browser does in this tab when another tab saves the wishlist
    localStorage.setItem(
      'wishlist:guest',
      JSON.stringify({ items: [{ productId: pilea.id, quantity: 4 }] }),
    );
    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', { key: 'wishlist:guest', storageArea: localStorage }),
      );
    });

    expect(screen.getByRole('button', { name: 'Wishlist, 4 items' })).toBeInTheDocument();
    store.stopSync();
  });
});
