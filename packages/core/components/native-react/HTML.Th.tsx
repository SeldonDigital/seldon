import { ThHTMLAttributes } from "react"

export const HTMLTh = ({
  style,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) => {
  return <th style={{ ...style }} {...props} />
}
