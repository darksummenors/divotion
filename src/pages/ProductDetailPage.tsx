import { useParams } from 'react-router';
import { Button, ButtonLink } from '../components/ui/Button/Button';
import { EmptyState } from '../components/ui/EmptyState/EmptyState';
import { Skeleton } from '../components/ui/Skeleton/Skeleton';
import { ProductDetail } from '../features/products/ProductDetail/ProductDetail';
import { useProduct } from '../features/products/useProducts';
import { WishlistToggle } from '../features/wishlist/WishlistToggle/WishlistToggle';
import styles from './Page.module.css';

export default function ProductDetailPage() {
  const { productId } = useParams();
  const result = useProduct(productId);

  return (
    <div className={styles.page}>
      <ButtonLink to="/" variant="ghost" size="sm" icon="arrowLeft" className={styles.backLink}>
        Alle producten
      </ButtonLink>

      {result.status === 'loading' && <Skeleton height="24rem" radius="var(--radius-lg)" />}

      {result.status === 'error' && (
        <EmptyState
          title="Dit product kon niet worden geladen"
          description="Controleer je verbinding en probeer het opnieuw."
          action={<Button onClick={result.retry}>Opnieuw proberen</Button>}
          headingLevel="h1"
        />
      )}

      {result.status === 'not-found' && (
        <>
          <title>Product niet gevonden - Gydo's Verdant</title>
          <EmptyState
            title="Deze plant bestaat niet (meer)"
            description="Misschien is hij uitverkocht of klopt de link niet."
            illustration={
              <img
                src="/images/products/terracotta-pot-bloom.svg"
                alt=""
                width={128}
                height={128}
              />
            }
            action={<ButtonLink to="/">Bekijk alle planten</ButtonLink>}
            headingLevel="h1"
          />
        </>
      )}

      {result.status === 'success' && (
        <>
          <title>{`${result.product.name} - Gydo's Verdant`}</title>
          <ProductDetail
            product={result.product}
            action={<WishlistToggle product={result.product} appearance="button" />}
          />
        </>
      )}
    </div>
  );
}
