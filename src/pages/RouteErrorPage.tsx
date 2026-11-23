import { isRouteErrorResponse, useRouteError } from 'react-router'
import { Button } from '../components/ui/Button/Button'
import { EmptyState } from '../components/ui/EmptyState/EmptyState'
import styles from './Page.module.css'

export default function RouteErrorPage() {
  const error = useRouteError()
  const detail = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Unknown error'

  return (
    <div className={styles.page}>
      <title>Something went wrong - Gydo's Verdant</title>
      <EmptyState
        headingLevel="h1"
        title="Something went wrong"
        description={`Error: ${detail}`}
        action={<Button onClick={() => window.location.reload()}>Reload page</Button>}
      />
    </div>
  )
}
