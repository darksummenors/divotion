import type { Product } from '../products/product.schema';
import type { WishlistItem } from './wishlistSlice';

export type WishlistLine = {
  product: Product;
  quantity: number;
  lineTotal: number;
};

export type WishlistSummary = {
  lines: WishlistLine[];
  totalQuantity: number;
  totalAmount: number;
};

export function buildWishlistSummary(items: WishlistItem[], products: Product[]): WishlistSummary {
  const productsById = new Map(products.map((product) => [product.id, product]));
  const lines: WishlistLine[] = [];

  for (const item of items) {
    const product = productsById.get(item.productId);
    if (!product) continue;

    lines.push({
      product,
      quantity: item.quantity,
      lineTotal: product.price.amount * item.quantity,
    });
  }

  return {
    lines,
    totalQuantity: lines.reduce((total, line) => total + line.quantity, 0),
    totalAmount: lines.reduce((total, line) => total + line.lineTotal, 0),
  };
}
