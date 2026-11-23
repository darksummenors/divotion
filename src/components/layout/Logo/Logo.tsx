import { Link } from 'react-router';
import logoUrl from '../../../assets/gydos-verdant-logo.svg';
import styles from './Logo.module.css';

export function Logo() {
  return (
    <Link to="/" className={styles.logo}>
      <img src={logoUrl} alt="Gydo's Verdant, naar de homepage" width={156} height={54} />
    </Link>
  );
}
