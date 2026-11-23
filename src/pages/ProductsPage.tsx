import { Button } from '../components/ui/Button/Button';
import { EmptyState } from '../components/ui/EmptyState/EmptyState';
import { ProductGrid, ProductGridSkeleton } from '../features/products/ProductGrid/ProductGrid';
import { useProducts } from '../features/products/useProducts';
import styles from './Page.module.css';

export default function ProductsPage() {
  const products = useProducts();

  return (
    <div className={styles.page}>
      <title>Planten & potten - Gydo's Verdant</title>

      <header className={styles.intro}>
        <p className={styles.eyebrow}>Nieuw binnen</p>
        <h1 className={styles.title}>Planten & potten</h1>
        <p className={styles.lead}>
          Groen voor elke kamer. Bewaar je favorieten op je verlanglijst en beslis later.
        </p>
      </header>

      <section aria-label="Products">
        {products.status === 'loading' && <ProductGridSkeleton />}

        {products.status === 'error' && (
          <EmptyState
            title="De planten konden niet worden geladen"
            description="Controleer je verbinding en probeer het opnieuw."
            action={<Button onClick={products.retry}>Opnieuw proberen</Button>}
          />
        )}

        {products.status === 'success' && <ProductGrid products={products.products} />}
      </section>
    </div>
  );
}
