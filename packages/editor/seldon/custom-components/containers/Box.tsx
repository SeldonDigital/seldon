import { CSSProperties, MouseEvent, ReactNode, Ref } from "react"

interface BoxProps {
  style?: CSSProperties
  className?: string
  onClick?: (event: MouseEvent<HTMLDivElement>) => void
  ref?: Ref<HTMLDivElement>
  children?: ReactNode
}

/** General styled container. A neutral placeholder for a real layout View. */
export function Box({ style, className, onClick, ref, children }: BoxProps) {
  return (
    <div ref={ref} className={className} onClick={onClick} style={style}>
      {children}
    </div>
  )
}
