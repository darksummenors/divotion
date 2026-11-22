import { vi } from 'vitest'
import type { Product } from '../features/products/product.schema'

export const monstera: Product = {
  id: 'monstera-deliciosa',
  name: 'Monstera Deliciosa',
  description: 'De iconische gatenplant.',
  category: 'Planten',
  price: { amount: 3495, currency: 'EUR' },
  image: { src: '/images/products/monstera-deliciosa.svg', alt: 'Monstera' },
}

export const pilea: Product = {
  id: 'pilea-peperomioides',
  name: 'Pilea Peperomioides',
  description: 'De pannenkoekenplant.',
  category: 'Planten',
  price: { amount: 1495, currency: 'EUR' },
  image: { src: '/images/products/pilea-peperomioides.svg', alt: 'Pilea' },
}

export function mockFetchProducts(products: unknown, status = 200) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(products), {
      status,
      headers: { 'Content-Type': 'application/json' },
    }),
  )
}
