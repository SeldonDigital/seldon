import { CSSProperties, MouseEvent } from "react"

interface BackdropProps {
  onClick?: (event: MouseEvent<HTMLDivElement>) => void
  style?: CSSProperties
}

/** Full-area click catcher that closes the overlay it sits behind. */
export function Backdrop({ onClick, style }: BackdropProps) {
  return <div onClick={onClick} style={style} />
}
