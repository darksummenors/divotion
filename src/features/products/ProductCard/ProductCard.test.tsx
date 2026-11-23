import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { monstera } from '../../../test/fixtures';
import { renderWithRouter } from '../../../test/test-utils';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  it('shows the name as a link to the product page', async () => {
    renderWithRouter(<ProductCard product={monstera} />);
    const link = await screen.findByRole('link', { name: 'Monstera Deliciosa' });
    expect(link).toHaveAttribute('href', '/products/monstera-deliciosa');
  });

  it('has exactly one link for keyboard and screen reader users', async () => {
    renderWithRouter(<ProductCard product={monstera} />);
    await screen.findByRole('heading', { name: 'Monstera Deliciosa' });
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });

  it('shows the formatted price', async () => {
    renderWithRouter(<ProductCard product={monstera} />);
    expect(await screen.findByText(/34,95/)).toBeInTheDocument();
  });

  it('renders the optional action slot', async () => {
    renderWithRouter(<ProductCard product={monstera} action={<button>Bewaar</button>} />);
    expect(await screen.findByRole('button', { name: 'Bewaar' })).toBeInTheDocument();
  });
});
