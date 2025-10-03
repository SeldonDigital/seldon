import { HTMLAttributes } from "react"

export const HTMLOptgroup = ({
  style,
  ...props
}: HTMLAttributes<HTMLOptGroupElement>) => {
  return <optgroup style={{ ...style }} {...props} />
}
