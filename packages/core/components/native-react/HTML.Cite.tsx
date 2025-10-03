import { HTMLAttributes } from "react"

export const HTMLCite = ({ style, ...props }: HTMLAttributes<HTMLElement>) => {
  return <cite style={{ ...style }} {...props} />
}
