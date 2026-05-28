import { HTMLAttributes } from "react"

export const HTMLDiv = ({
  style,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return <div style={style} {...props} />
}
