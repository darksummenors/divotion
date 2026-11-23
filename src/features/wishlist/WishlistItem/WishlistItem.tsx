import { Link } from 'react-router';
import { Price } from '../../../components/ui/Price/Price';
import { QuantityStepper } from '../../../components/ui/QuantityStepper/QuantityStepper';
import type { Product } from '../../products/product.schema';
import { MAX_QUANTITY } from '../wishlistSlice';
import styles from './WishlistItem.module.css';

export type WishlistItemProps = {
  product: Product;
  quantity: number;
  lineTotal: number;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
  onNavigate?: () => void;
};

export function WishlistItem({
  product,
  quantity,
  lineTotal,
  onQuantityChange,
  onRemove,
  onNavigate,
}: WishlistItemProps) {
  return (
    <article className={styles.item}>
      <img src={product.image.src} alt="" width={80} height={80} className={styles.image} />

      <div className={styles.info}>
        <h3 className={styles.name}>
          <Link to={`/products/${product.id}`} onClick={onNavigate}>
            {product.name}
          </Link>
        </h3>
        <p className={styles.unitPrice}>
          <Price amount={product.price.amount} currency={product.price.currency} /> per stuk
        </p>

        <div className={styles.controls}>
          <QuantityStepper
            value={quantity}
            max={MAX_QUANTITY}
            onChange={onQuantityChange}
            onRemove={onRemove}
            itemLabel={product.name}
          />
          <Price
            amount={lineTotal}
            currency={product.price.currency}
            className={styles.lineTotal}
          />
        </div>

        <button type="button" className={styles.remove} onClick={onRemove}>
          Verwijderen
        </button>
      </div>
    </article>
  );
}
