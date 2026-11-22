# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

## Why prices are stored in cents

All prices in `public/data/products.json` are whole numbers in cents (`"amount": 3495` means € 34,95).

**The problem with decimals.** JavaScript stores numbers as binary floating point, which cannot represent most decimal fractions exactly. That leads to small rounding errors:

```js
0.1 + 0.2 // 0.30000000000000004
1.1 * 3   // 3.3000000000000003
4.35 * 100 // 434.99999999999994
```

For a single price that is invisible, but as soon as you add up quantities or totals (like a wishlist total), these errors can show up as wrong cents.

**The solution.** Integers are exact in JavaScript up to 2^53, far beyond any realistic price. So all calculations (quantity × price, totals) are done in whole cents, and the amount is divided by 100 only at the very last moment, when it is shown on screen.

**How it is enforced.**

- The zod schema (`src/features/products/product.schema.ts`) only accepts whole, non-negative numbers: a price like `34.95` fails validation instead of silently slipping through.
- Formatting happens in one place, `formatPrice()` in `src/lib/format.ts`, using `Intl.NumberFormat('nl-NL')`, which also takes care of the Dutch notation (`€ 34,95`, `€ 1.234,56`).
- Both are covered by unit tests.

This is the same approach used by payment providers such as Stripe and Adyen, which also expect amounts in the smallest currency unit.
