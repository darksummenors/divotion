import styles from './Badge.module.css';

export type BadgeProps = {
  count: number;
  max?: number;
  className?: string;
};

export function Badge({ count, max = 99, className }: BadgeProps) {
  if (count <= 0) return null;

  return (
    <span className={[styles.badge, className].filter(Boolean).join(' ')}>
      {count > max ? `${max}+` : count}
    </span>
  );
}
