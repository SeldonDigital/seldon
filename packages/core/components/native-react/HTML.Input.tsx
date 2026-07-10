import { InputHTMLAttributes, Ref } from "react"

export const HTMLInput = ({
  ref,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { ref?: Ref<HTMLInputElement> }) => {
  return <input ref={ref} {...props} />
}
