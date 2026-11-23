import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Button } from '../../../components/ui/Button/Button';
import { Icon } from '../../../components/ui/Icon/Icon';
import { IconButton } from '../../../components/ui/IconButton/IconButton';
import type { Product } from '../../products/product.schema';
import { itemAdded, itemRemoved, selectIsInWishlist } from '../wishlistSlice';
import styles from './WishlistToggle.module.css';

export type WishlistToggleProps = {
  product: Product;
  appearance?: 'icon' | 'button';
};

export function WishlistToggle({ product, appearance = 'icon' }: WishlistToggleProps) {
  const dispatch = useAppDispatch();
  const isInWishlist = useAppSelector((state) => selectIsInWishlist(state, product.id));

  const toggle = () => dispatch(isInWishlist ? itemRemoved(product.id) : itemAdded(product.id));

  if (appearance === 'button') {
    return (
      <Button variant={isInWishlist ? 'secondary' : 'primary'} size="lg" onClick={toggle}>
        <Icon
          name="heart"
          filled={isInWishlist}
          size={20}
          className={isInWishlist ? styles.filled : undefined}
        />
        {isInWishlist ? 'Op je verlanglijst' : 'Op mijn verlanglijst'}
      </Button>
    );
  }

  return (
    <IconButton
      icon="heart"
      filled={isInWishlist}
      variant="outline"
      label={`${product.name} op verlanglijst`}
      onClick={toggle}
      className={isInWishlist ? styles.filled : undefined}
    />
  );
}
