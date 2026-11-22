import { z } from 'zod'

/**
 * Validating types with zod
 */
export const ProductSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  category: z.string().min(1),
  price: z.object({
    amount: z.number().int().nonnegative(),
    currency: z.literal('EUR'),
  }),
  image: z.object({
    src: z.string().min(1),
    alt: z.string(),
  }),
})

export const ProductListSchema = z.array(ProductSchema)

export type Product = z.infer<typeof ProductSchema>
