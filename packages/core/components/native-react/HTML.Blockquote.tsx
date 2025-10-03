import { HTMLAttributes } from "react"

export const HTMLBlockquote = ({
  style,
  ...props
}: HTMLAttributes<HTMLQuoteElement>) => {
  return <blockquote style={{ ...style }} {...props} />
}
