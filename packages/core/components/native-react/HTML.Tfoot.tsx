import { HTMLAttributes } from "react"

export const HTMLTfoot = ({
  style,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) => {
  return <tfoot style={{ ...style }} {...props} />
}
