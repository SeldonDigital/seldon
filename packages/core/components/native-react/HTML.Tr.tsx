import { HTMLAttributes } from "react"

export const HTMLTr = ({
  style,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) => {
  return <tr style={{ ...style }} {...props} />
}
