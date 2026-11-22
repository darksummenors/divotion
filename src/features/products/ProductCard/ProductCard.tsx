import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { Price } from '../../../components/ui/Price/Price';
import type { Product } from '../product.schema';
import styles from './ProductCard.module.css';

/**
 * Slot for an action on the card, e.g. the wishlist heart.
 */
export type ProductCardProps = {
  product: Product;
  action?: ReactNode;
};

export function ProductCard({ product, action }: ProductCardProps) {
  const href = `/products/${product.id}`;

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <Link to={href} tabIndex={-1} aria-hidden="true">
          <img
            src={product.image.src}
            alt={product.image.alt}
            width={400}
            height={400}
            loading="lazy"
            className={styles.image}
          />
        </Link>
        {action && <div className={styles.action}>{action}</div>}
      </div>

      <div className={styles.body}>
        <p className={styles.category}>{product.category}</p>
        <h3 className={styles.name}>
          <Link to={href}>{product.name}</Link>
        </h3>
        <Price
          amount={product.price.amount}
          currency={product.price.currency}
          className={styles.price}
        />
      </div>
    </article>
  );
}
