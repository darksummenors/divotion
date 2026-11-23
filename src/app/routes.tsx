import type { RouteObject } from 'react-router';
import { AppLayout } from '../components/layout/AppLayout/AppLayout';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import ProductsPage from '../pages/ProductsPage';
import RouteErrorPage from '../pages/RouteErrorPage';

/**
 * All routes share one layout (header + element + footer).
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <ProductsPage /> },
      { path: 'products/:productId', element: <ProductDetailPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
