import { UserMenu } from '../../../features/auth/UserMenu/UserMenu'
import { WishlistButton } from '../../../features/wishlist/WishlistButton/WishlistButton'
import { Logo } from '../Logo/Logo'
import styles from './Header.module.css'

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Logo />
        <div className={styles.actions}>
          <UserMenu />
          <WishlistButton />
        </div>
      </div>
    </header>
  )
}
