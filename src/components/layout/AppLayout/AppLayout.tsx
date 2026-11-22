import { Outlet, ScrollRestoration } from 'react-router'
import { Footer } from '../Footer/Footer'
import { Header } from '../Header/Header'
import styles from './AppLayout.module.css'

export function AppLayout() {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main} tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  )
}
