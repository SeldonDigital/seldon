import { HTMLAttributes } from "react"

export const HTMLNav = ({ style, ...props }: HTMLAttributes<HTMLElement>) => {
  return <nav style={{ ...style }} {...props} />
}
