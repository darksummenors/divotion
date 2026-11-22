import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

/**
 * jsdom (the simulated browser Vitest uses) does not implement scrolling.
 * React Router's <ScrollRestoration /> calls window.scrollTo() on every navigation,
 * so we replace it with an empty function to keep test output clean.
 */
Object.defineProperty(window, 'scrollTo', { value: () => {}, writable: true });

/**
 * Every test starts with a clean DOM and empty storage,
 * so persisted wishlist state never leaks between tests.
 */
afterEach(() => {
  cleanup();
  localStorage.clear();
});
