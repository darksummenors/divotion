import { Badge } from '../../../components/ui/Badge/Badge'
import { IconButton } from '../../../components/ui/IconButton/IconButton'

/**
 * The favorites icon in the header, with a badge for the total quantity.
 * TODO (wishlist step): read the count from the store and open the side panel on click.
 */
export function WishlistButton() {
  const count = 0
  const label = count > 0 ? `Wishlist, ${count} items` : 'Wishlist is empty'

  return (
    <IconButton icon="heart" label={label}>
      <Badge count={count} />
    </IconButton>
  )
}
