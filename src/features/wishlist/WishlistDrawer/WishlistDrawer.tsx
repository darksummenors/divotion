import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectIsWishlistOpen, wishlistClosed } from '../../../app/uiSlice';
import { Button, ButtonLink } from '../../../components/ui/Button/Button';
import { Drawer } from '../../../components/ui/Drawer/Drawer';
import { EmptyState } from '../../../components/ui/EmptyState/EmptyState';
import { Price } from '../../../components/ui/Price/Price';
import { Skeleton } from '../../../components/ui/Skeleton/Skeleton';
import { useProducts } from '../../products/useProducts';
import { WishlistItem } from '../WishlistItem/WishlistItem';
import { buildWishlistSummary } from '../wishlistLines';
import {
  itemRemoved,
  quantityChanged,
  selectWishlistItems,
  unknownProductsPruned,
  wishlistCleared,
} from '../wishlistSlice';
import styles from './WishlistDrawer.module.css';

export function WishlistDrawer() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsWishlistOpen);
  const items = useAppSelector(selectWishlistItems);
  const products = useProducts();

  const productList = products.status === 'success' ? products.products : null;

  // Clean up items whose product no longer exists in products.json
  useEffect(() => {
    if (productList) dispatch(unknownProductsPruned(productList.map((product) => product.id)));
  }, [dispatch, productList, items]);

  const close = () => dispatch(wishlistClosed());
  const summary = productList ? buildWishlistSummary(items, productList) : null;
  const hasLines = summary !== null && summary.lines.length > 0;

  const footer = hasLines ? (
    <div className={styles.summary}>
      <p className={styles.total}>
        <span>
          {summary.totalQuantity} {summary.totalQuantity > 1 ? 'stuks' : 'stuk'}
        </span>
        <span aria-hidden="true"> / </span>
        <Price amount={summary.totalAmount} className={styles.amount} />
      </p>
      <Button variant="ghost" size="sm" onClick={() => dispatch(wishlistCleared())}>
        Lijst leegmaken
      </Button>
    </div>
  ) : undefined;

  return (
    <Drawer isOpen={isOpen} onClose={close} title="Verlanglijst" footer={footer}>
      {items.length === 0 ? (
        <EmptyState
          title="Je verlanglijst is nog leeg"
          description="Klik op het hartje bij een plant om hem hier te bewaren."
          illustration={
            <img src="/images/products/terracotta-pot-bloom.svg" alt="" width={128} height={128} />
          }
          action={
            <ButtonLink to="/" onClick={close}>
              Bekijk de planten
            </ButtonLink>
          }
          headingLevel="h3"
        />
      ) : products.status === 'loading' ? (
        <div className={styles.loading}>
          {items.map((item) => (
            <Skeleton key={item.productId} height="5rem" radius="var(--radius-md)" />
          ))}
        </div>
      ) : products.status === 'error' ? (
        <EmptyState
          title="Je verlanglijst kon niet worden geladen"
          description="Controleer je verbinding en probeer het opnieuw."
          action={<Button onClick={products.retry}>Opnieuw proberen</Button>}
          headingLevel="h3"
        />
      ) : (
        <ul className={styles.list}>
          {summary?.lines.map((line) => (
            <li key={line.product.id}>
              <WishlistItem
                product={line.product}
                quantity={line.quantity}
                lineTotal={line.lineTotal}
                onQuantityChange={(quantity) =>
                  dispatch(quantityChanged({ productId: line.product.id, quantity }))
                }
                onRemove={() => dispatch(itemRemoved(line.product.id))}
                onNavigate={close}
              />
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}
