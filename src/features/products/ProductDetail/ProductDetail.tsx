import type { ReactNode } from 'react';
import { Price } from '../../../components/ui/Price/Price';
import type { Product } from '../product.schema';
import styles from './ProductDetail.module.css';

/** Slot for the main action, e.g. "Op mijn verlanglijst". */
export type ProductDetailProps = {
  product: Product;
  action?: ReactNode;
};

export function ProductDetail({ product, action }: ProductDetailProps) {
  return (
    <article className={styles.detail}>
      <div className={styles.media}>
        <img
          src={product.image.src}
          alt={product.image.alt}
          width={400}
          height={400}
          className={styles.image}
        />
      </div>

      <div className={styles.info}>
        <p className={styles.category}>{product.category}</p>
        <h1 className={styles.name}>{product.name}</h1>
        <Price
          amount={product.price.amount}
          currency={product.price.currency}
          className={styles.price}
        />
        <p className={styles.description}>{product.description}</p>
        {action && <div className={styles.action}>{action}</div>}
      </div>
    </article>
  );
}
