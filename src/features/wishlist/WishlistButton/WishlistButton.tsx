import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { wishlistOpened } from '../../../app/uiSlice';
import { Badge } from '../../../components/ui/Badge/Badge';
import { IconButton } from '../../../components/ui/IconButton/IconButton';
import { selectWishlistCount } from '../wishlistSlice';

export function WishlistButton() {
  const dispatch = useAppDispatch();
  const count = useAppSelector(selectWishlistCount);
  const label = count > 0 ? `Wishlist, ${count} items` : 'Wishlist is empty';

  return (
    <IconButton icon="heart" label={label} onClick={() => dispatch(wishlistOpened())}>
      <Badge count={count} />
    </IconButton>
  );
}
