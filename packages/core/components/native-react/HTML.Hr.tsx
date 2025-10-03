import { HTMLAttributes } from "react"

export const HTMLHr = ({ style, ...props }: HTMLAttributes<HTMLHRElement>) => {
  return <hr style={{ ...style }} {...props} />
}
