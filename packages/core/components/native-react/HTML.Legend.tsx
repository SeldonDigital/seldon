import { HTMLAttributes } from "react"

export const HTMLLegend = ({
  style,
  ...props
}: HTMLAttributes<HTMLLegendElement>) => {
  return <legend style={{ ...style }} {...props} />
}
