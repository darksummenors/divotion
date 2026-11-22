import type { ReactNode } from 'react'

/** icon set (24×24, stroke-based). */
const paths = {
  heart: (
    <path d="M12 20.5s-6.6-4.2-8.9-8C1.4 9.6 2.6 6 6 5.4c2.1-.4 3.9.6 6 2.8 2.1-2.2 3.9-3.2 6-2.8 3.4.6 4.6 4.2 2.9 7.1-2.3 3.8-8.9 8-8.9 8z" />
  ),
  close: <path d="M6 6l12 12M18 6 6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  trash: <path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 12.5h9l1-12.5M10 11v5M14 11v5" />,
  arrowLeft: <path d="M19 12H5M11 6l-6 6 6 6" />,
  external: (
    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
} satisfies Record<string, ReactNode>

export type IconName = keyof typeof paths

export type IconProps = {
  name: IconName
  size?: number
  filled?: boolean
  className?: string
}

export function Icon({ name, size = 24, filled = false, className }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  )
}
