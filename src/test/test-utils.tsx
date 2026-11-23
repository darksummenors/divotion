import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { routes } from '../app/routes';
import { type AppStore, createAppStore } from '../app/store';
import './dialog-polyfill';

type Options = {
  path?: string;
  /** A fresh store per test by default, so state never leaks between tests. */
  store?: AppStore;
};

/** Renders a single component inside a router and the Redux store, so <Link> and hooks work. */
export function renderWithRouter(
  ui: ReactElement,
  { path = '/', store = createAppStore() }: Options = {},
) {
  const router = createMemoryRouter([{ path: '*', element: ui }], { initialEntries: [path] });
  return {
    store,
    ...render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>,
    ),
  };
}

/** Renders the real app routes at a given URL, for page-level tests. */
export function renderRoute(
  path: string,
  { store = createAppStore() }: Omit<Options, 'path'> = {},
) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return {
    store,
    router,
    ...render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>,
    ),
  };
}
