import { Skeleton } from '../../../components/ui/Skeleton/Skeleton';
import { ProductCard } from '../ProductCard/ProductCard';
import type { Product } from '../product.schema';
import styles from './ProductGrid.module.css';
import { WishlistToggle } from '../../wishlist/WishlistToggle/WishlistToggle';

export type ProductGridProps = {
  products: Product[];
};

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <ul className={styles.grid}>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} action={<WishlistToggle product={product} />} />
        </li>
      ))}
    </ul>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <ul className={styles.grid} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className={styles.skeletonCard}>
          <Skeleton height="auto" radius="0" className={styles.skeletonImage} />
          <div className={styles.skeletonBody}>
            <Skeleton width="30%" height="0.75rem" />
            <Skeleton width="80%" height="1.5rem" />
            <Skeleton width="25%" height="1rem" />
          </div>
        </li>
      ))}
    </ul>
  );
}
