import { describe, expect, it } from 'vitest';
import products from '../../../public/data/products.json';
import { monstera } from '../../test/fixtures';
import { ProductListSchema, ProductSchema } from './product.schema';

describe('products.json', () => {
  it('matches the product schema', () => {
    expect(() => ProductListSchema.parse(products)).not.toThrow();
  });

  it('contains 8 products with unique ids', () => {
    const ids = products.map((product) => product.id);
    expect(ids).toHaveLength(8);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('ProductSchema', () => {
  it('rejects a price with decimals (prices are in cents)', () => {
    const result = ProductSchema.safeParse({
      ...monstera,
      price: { amount: 34.95, currency: 'EUR' },
    });
    expect(result.success).toBe(false);
  });

  it('rejects a negative price', () => {
    const result = ProductSchema.safeParse({ ...monstera, price: { amount: -1, currency: 'EUR' } });
    expect(result.success).toBe(false);
  });

  it('rejects a product without a name', () => {
    const result = ProductSchema.safeParse({ ...monstera, name: '' });
    expect(result.success).toBe(false);
  });
});
