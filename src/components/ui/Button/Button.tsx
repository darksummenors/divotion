import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { Icon, type IconName } from '../Icon/Icon'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

type SharedProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Optional icon shown before the label. */
  icon?: IconName
  children: ReactNode
}

export type ButtonProps = SharedProps & ButtonHTMLAttributes<HTMLButtonElement>
export type ButtonLinkProps = SharedProps & LinkProps

function classNames(variant: ButtonVariant, size: ButtonSize, extra?: string): string {
  return [styles.button, styles[variant], styles[size], extra].filter(Boolean).join(' ')
}

/** The one button of the app. Variants and sizes instead of separate button components. */
export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={classNames(variant, size, className)} {...rest}>
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  )
}

/** A link that looks like a Button, for navigation (e.g. "Bekijk alle planten"). */
export function ButtonLink({
  variant = 'primary',
  size = 'md',
  icon,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link className={classNames(variant, size, className)} {...rest}>
      {icon && <Icon name={icon} size={18} />}
      {children}
    </Link>
  )
}
