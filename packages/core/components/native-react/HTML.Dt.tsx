import { HTMLAttributes } from "react"

export const HTMLDt = ({ style, ...props }: HTMLAttributes<HTMLElement>) => {
  return <dt style={{ ...style }} {...props} />
}
