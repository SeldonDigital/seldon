import { FieldsetHTMLAttributes } from "react"

export const HTMLFieldset = (
  props: FieldsetHTMLAttributes<HTMLFieldSetElement>,
) => {
  return <fieldset {...props} />
}
