import { ButtonLink } from '../components/ui/Button/Button';
import { EmptyState } from '../components/ui/EmptyState/EmptyState';
import styles from './Page.module.css';

export default function NotFoundPage() {
  return (
    <div className={styles.page}>
      <title>Pagina niet gevonden - Gydo's Verdant</title>
      <EmptyState
        title="Hier groeit nog niets"
        description="Deze pagina bestaat niet. Misschien is de link verouderd of zat er een typfout in."
        illustration={
          <img src="/images/products/terracotta-pot-bloom.svg" alt="" width={128} height={128} />
        }
        action={<ButtonLink to="/">Terug naar de planten</ButtonLink>}
        headingLevel="h1"
      />
    </div>
  );
}
