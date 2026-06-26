import { HTMLAttributes } from "react"
import { HTMLDiv } from "../native-react/HTML.Div"

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
  columns?: number
  gap?: number | string
}

export function Grid({ columns = 12, gap = 8, style, ...props }: GridProps) {
  return (
    <HTMLDiv
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
        ...style,
      }}
      {...props}
    />
  )
}
