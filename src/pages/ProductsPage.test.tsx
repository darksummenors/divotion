import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { mockFetchProducts, monstera, pilea } from '../test/fixtures';
import { renderRoute } from '../test/test-utils';

describe('ProductsPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('shows a product card for every product', async () => {
    mockFetchProducts([monstera, pilea]);
    renderRoute('/');

    expect(await screen.findByRole('heading', { name: 'Monstera Deliciosa' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Pilea Peperomioides' })).toBeInTheDocument();
  });

  it('shows an error with a retry button when loading fails, and recovers', async () => {
    const fetchSpy = mockFetchProducts({}, 500);
    renderRoute('/');

    const retry = await screen.findByRole('button', { name: 'Opnieuw proberen' });

    fetchSpy.mockImplementation(() =>
      Promise.resolve(new Response(JSON.stringify([monstera]), { status: 200 })),
    );
    await userEvent.click(retry);

    expect(await screen.findByRole('heading', { name: 'Monstera Deliciosa' })).toBeInTheDocument();
  });

  it('treats invalid product data as an error instead of crashing', async () => {
    mockFetchProducts([{ id: 'broken' }]);
    renderRoute('/');
    expect(await screen.findByRole('button', { name: 'Opnieuw proberen' })).toBeInTheDocument();
  });
});

describe('routing', () => {
  afterEach(() => vi.restoreAllMocks());

  it('shows the product detail page for a product url', async () => {
    mockFetchProducts([monstera]);
    renderRoute('/products/monstera-deliciosa');
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Monstera Deliciosa' }),
    ).toBeInTheDocument();
  });

  it('shows a not-found message for an unknown product', async () => {
    mockFetchProducts([monstera]);
    renderRoute('/products/does-not-exist');
    expect(
      await screen.findByRole('heading', { name: 'Deze plant bestaat niet (meer)' }),
    ).toBeInTheDocument();
  });

  it('shows the 404 page for an unknown url', async () => {
    renderRoute('/this/does/not/exist');
    expect(
      await screen.findByRole('heading', { name: 'Hier groeit nog niets' }),
    ).toBeInTheDocument();
  });
});
