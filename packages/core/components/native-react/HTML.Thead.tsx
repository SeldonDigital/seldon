import { HTMLAttributes } from "react"

export const HTMLThead = ({
  style,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) => {
  return <thead style={{ ...style }} {...props} />
}
