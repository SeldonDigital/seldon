import { TdHTMLAttributes } from "react"

export const HTMLTd = ({
  style,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) => {
  return <td style={{ ...style }} {...props} />
}
