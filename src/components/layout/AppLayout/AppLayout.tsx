import { Outlet, ScrollRestoration } from 'react-router'
import { WishlistDrawer } from '../../../features/wishlist/WishlistDrawer/WishlistDrawer'
import { Footer } from '../Footer/Footer'
import { Header } from '../Header/Header'
import styles from './AppLayout.module.css'

export function AppLayout() {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
      <WishlistDrawer />
      <ScrollRestoration />
    </div>
  )
}
