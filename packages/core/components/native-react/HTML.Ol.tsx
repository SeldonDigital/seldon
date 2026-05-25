import { HTMLAttributes } from "react"

export const HTMLOl = ({
  style,
  ...props
}: HTMLAttributes<HTMLOListElement>) => {
  return <ol style={{ ...style }} {...props} />
}
