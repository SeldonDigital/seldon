import { HTMLAttributes } from "react"

export const HTMLTable = ({
  style,
  ...props
}: HTMLAttributes<HTMLTableElement>) => {
  return <table style={{ ...style }} {...props} />
}
