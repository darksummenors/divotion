import { type Product, ProductListSchema } from './product.schema';

const PRODUCTS_URL = '/data/products.json';

/**
 * Load and validate external data at the boundary:
 * the rest of the app can trust the types.
 */
export async function loadProducts(): Promise<Product[]> {
  const response = await fetch(PRODUCTS_URL);

  if (!response.ok) {
    throw new Error(`Producten laden mislukt (${response.status})`);
  }

  return ProductListSchema.parse(await response.json());
}
