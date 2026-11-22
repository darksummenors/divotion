import { ButtonLink } from '../../../components/ui/Button/Button'

/** TODO (login step): show "Hoi, <naam>" and a log-out button when someone is logged in. */
export function UserMenu() {
  return (
    <ButtonLink to="/login" variant="ghost" size="sm" icon="user">
      Inloggen
    </ButtonLink>
  )
}
