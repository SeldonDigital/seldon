import { CSSProperties, MouseEvent, ReactNode } from "react"

interface IconButtonProps {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  tabIndex?: number
  ariaLabel?: string
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

/** General icon-only button. A neutral placeholder for a real button View. */
export function IconButton({
  onClick,
  tabIndex,
  ariaLabel,
  className,
  style,
  children,
}: IconButtonProps) {
  return (
    <button
      type="button"
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      className={className}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  )
}
