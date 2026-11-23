import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { Provider } from 'react-redux'
import { routes } from './app/routes'
import { createAppStore } from './app/store'

const router = createBrowserRouter(routes)
const store = createAppStore()

/** App-wide providers: the Redux store wraps the router. */
export default function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  )
}
