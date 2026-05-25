import { SelectHTMLAttributes } from "react"

export const HTMLSelect = (props: SelectHTMLAttributes<HTMLSelectElement>) => {
  return <select {...props} />
}
