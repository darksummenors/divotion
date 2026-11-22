import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { routes } from './app/routes'

const router = createBrowserRouter(routes)

/** TODO: The Redux store Provider is added here in the wishlist step. */
export default function App() {
  return <RouterProvider router={router} />
}
