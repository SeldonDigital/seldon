import { HTMLAttributes } from "react"

export const HTMLDd = ({ style, ...props }: HTMLAttributes<HTMLElement>) => {
  return <dd style={{ ...style }} {...props} />
}
