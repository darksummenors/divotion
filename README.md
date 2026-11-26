# Gydo's Verdant wishlist

A product listing page for a fictional plant shop, with a wishlist in a side panel. Built with React, TypeScript and Vite.
<img width="1917" height="941" alt="image" src="https://github.com/user-attachments/assets/604c0fc6-40f0-47e5-aac6-11afa68a6dc1" />

## Getting started

Requires **Node.js 22.22 or newer**.

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Type-checks, then builds to `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run typecheck` | TypeScript check without building |
| `npm run lint` | ESLint |
| `npm run format` / `format:check` | Prettier |
| `npm test` / `npm run test:run` | Vitest in watch mode / once |

## Project structure

Code is grouped **by feature**: everything about the wishlist lives in one folder.

```
src/
  app/            store, typed Redux hooks, UI slice, routes
  components/
    ui/           reusable building blocks without business logic (Button, Drawer, Badge, ...)
    layout/       AppLayout, Header, Footer, Logo
  features/
    products/     product schema, data loading, ProductCard, ProductGrid, ProductDetail
    wishlist/     slice, storage, side panel, heart toggle, items
    auth/         user menu (mock login is planned)
  pages/          one component per route; they only combine feature components
  lib/            small helpers (price formatting)
  styles/         design tokens and global styles
  test/           test setup, helpers and fixtures
public/
  data/           products.json
  images/         product illustrations (SVG)
```

Three layers keep components simple:

1. **UI components** get data through props and report actions through callbacks.
2. **Feature components** connect UI components to the store through typed hooks.
3. **Pages** only arrange feature components.

## Decisions and trade-offs

For every important choice I note the options I considered, what I chose and why.

### TypeScript

My background is mainly PHP, JavaScript and React, so I deliberately chose TypeScript for this project to challenge myself and add it to my skill set.

### React Router

I started with a single page, but I wanted a page per product, a login page and a proper "page not found" that made you smile.
React Router gives every page its own URL, so the browser's back button works as expected, and all pages share one layout with the header and footer.

### Redux Toolkit for state

The wishlist is used in many places at once: the hearts on the cards, the badge in the header, the button on the product page and the side panel.
That's why I chose Redux Toolkit, its middleware is a clean place to save to localStorage without any component having to know about it.
Also, Redux pays off as soon as the app grows, for example with a login or an undo history (both were planned).

### Persisting the wishlist and Syncing between browser tabs

The data has to be written to browser storage because a state library only keeps data **in memory**.
So localStorage was for now the best fit: it survives closing the browser, syncs between tabs, works offline and needs no server or login.
Still, I built it the way I would with a real backend such as Firebase: the store only talks to a small interface with `load`, `save` and `subscribe`, so switching to a backend later means writing one new implementation instead of changing the app.
I also looked at Redis, but that is a server-side database, so it can't run in the browser.

How it is built:

- **Saving happens in Redux middleware** (`app/store.ts`).
- **Loaded before the first render**.
- **Only `{ productId, quantity }` is stored**, names and prices always come from `products.json`.
- **Validated:** data is stored under `wishlist:guest` and checked with zod when it loads.
- **Cleans itself up:** a product that disappears from `products.json` is removed from the wishlist.

### Styling: CSS Modules and design tokens

I prefer CSS Modules so every component is now a mini-module, and it can be reused anywhere, in this project or another one.
Implemented design tokens in `styles/tokens.css`, where the colours come from the logo.

### Products: fetched and validated

- `products.json` is **fetched** just like with a real API.
- The data is **validated with zod** when it arrives.
- Loading state is a **discriminated union** (`loading`, `error` with retry, `success`), so the UI has to handle every state.

### Badge shows the total quantity

Two of product A and one of product B show **3**, not 2, the same way most webshops count items in a cart.


## Neat little extras

- Syncing between browser tabs
- Side panel with `<dialog>` element and focus trap, Esc
- Wishlist data that is validated, self-cleaning and robust against blocked storage
- The store depends on an interface, not on localStorage, so moving to a backend is one new implementation.
- Product detail pages, a 404 page and an error page, each with its own page title.
- Typed quantity input, with a trash icon at quantity 1.
- Total price in the side panel.
- Added testing.

## Accessibility

- Tried to use as much as possible native elements, for example: `<button>` and `<a>`.
- Every button with only an icon has an accessible label.
- One link per product card instead of two identical ones.
- The side panel is a real modal dialog.

## Testing

```bash
npm run test:run
```

jsdom has no `<dialog>` methods, so `src/test/dialog-polyfill.ts` provides a minimal stand-in; real dialog behaviour belongs in end-to-end tests.

## Next steps

What I would add with more time, roughly in this order:

1. **Undo:** with Ctrl/Cmd+Z and Ctrl+Shift+Z.
2. **Mock login:** one wishlist per user, and merging the guest wishlist into user.
3. **End-to-end tests:** with Playwright.
4. **CI with GitHub Actions:** lint, typecheck, tests and build on every push.
5. **A backend repository** (e.g. Firebase) for syncing across devices.

## How I used AI

I used AI at several stages of this project. At the start, I used it to plan the project: weighing the pros and cons of different approaches and deciding which tooling to use.
I also used it to create the illustrations on the website, such as the product images, the logo and the icons.
Because I wanted reusable components, I asked AI to set up the basic structure of the design, so new features and functionality would be easier to add later.
Finally, we added tests to verify that everything works, and I had AI review the entire project for flaws I might have missed.

## Why prices are stored in cents

Searched online for [best practice with using currency](https://www.honeybadger.io/blog/currency-money-calculations-in-javascript/).
So all prices are whole numbers in cents (`"amount": 3495` means € 34,95).

**The problem with decimals.** JavaScript stores numbers as binary floating points.
For a single price that is invisible, but as soon as you add up quantities or totals (like a wishlist total), these errors can show up as wrong cents.
