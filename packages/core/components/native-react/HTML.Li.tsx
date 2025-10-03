import { HTMLAttributes } from "react"

export const HTMLLi = ({ style, ...props }: HTMLAttributes<HTMLLIElement>) => {
  return <li style={{ ...style }} {...props} />
}
