import { HTMLAttributes } from "react"

export const HTMLDl = ({
  style,
  ...props
}: HTMLAttributes<HTMLDListElement>) => {
  return <dl style={{ ...style }} {...props} />
}
