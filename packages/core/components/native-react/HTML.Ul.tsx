import { HTMLAttributes } from "react"

export const HTMLUl = ({
  style,
  ...props
}: HTMLAttributes<HTMLUListElement>) => {
  return <ul style={{ ...style }} {...props} />
}
