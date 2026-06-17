import { SourceHTMLAttributes } from "react"

export const HTMLSource = ({
  ...props
}: SourceHTMLAttributes<HTMLSourceElement>) => {
  return <source {...props} />
}
