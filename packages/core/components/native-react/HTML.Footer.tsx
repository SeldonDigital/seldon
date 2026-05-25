import { HTMLAttributes } from "react"

export const HTMLFooter = ({
  style,
  ...props
}: HTMLAttributes<HTMLElement>) => {
  return <footer style={{ ...style }} {...props} />
}
