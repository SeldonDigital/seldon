import { HTMLAttributes } from "react"

export const HTMLTbody = ({
  style,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) => {
  return <tbody style={{ ...style }} {...props} />
}
