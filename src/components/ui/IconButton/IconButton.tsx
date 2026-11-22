import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from '../Icon/Icon';
import styles from './IconButton.module.css';

export type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  icon: IconName;
  label: string;
  filled?: boolean;
  variant?: 'plain' | 'outline';
  size?: 'sm' | 'md';
  children?: ReactNode;
};

export function IconButton({
  icon,
  label,
  filled,
  variant = 'plain',
  size = 'md',
  type = 'button',
  className,
  children,
  ...rest
}: IconButtonProps) {
  const classes = [styles.iconButton, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} aria-label={label} {...rest}>
      <Icon name={icon} filled={filled} size={size === 'sm' ? 18 : 24} />
      {children}
    </button>
  );
}
