import type { ReactNode } from 'react'
import styles from './EmptyState.module.css'

export type EmptyStateProps = {
  title: string
  description?: string
  illustration?: ReactNode
  action?: ReactNode
  headingLevel?: 'h1' | 'h2' | 'h3'
}

export function EmptyState({
  title,
  description,
  illustration,
  action,
  headingLevel: Heading = 'h2',
}: EmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      {illustration && <div className={styles.illustration}>{illustration}</div>}
      <Heading className={styles.title}>{title}</Heading>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}
