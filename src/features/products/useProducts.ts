import { useCallback, useEffect, useState } from 'react'
import type { Product } from './product.schema'
import { loadProducts } from './productsApi'

export type ProductsState =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; products: Product[] }

export function useProducts(): ProductsState & { retry: () => void } {
  const [state, setState] = useState<ProductsState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let isCurrent = true

    loadProducts()
      .then((products) => {
        if (isCurrent) setState({ status: 'success', products })
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setState({
            status: 'error',
            error: error instanceof Error ? error : new Error(String(error)),
          })
        }
      })
    return () => {
      isCurrent = false
    }
  }, [attempt])

  const retry = useCallback(() => {
    setState({ status: 'loading' })
    setAttempt((count) => count + 1)
  }, [])

  return { ...state, retry }
}

export type ProductState =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'not-found' }
  | { status: 'success'; product: Product }

export function useProduct(productId: string | undefined): ProductState & { retry: () => void } {
  const products = useProducts()
  const { retry } = products

  if (products.status !== 'success') return products

  const product = products.products.find((item) => item.id === productId)

  return product ? { status: 'success', product, retry } : { status: 'not-found', retry }
}
