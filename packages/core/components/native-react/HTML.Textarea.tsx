import { TextareaHTMLAttributes } from "react"

export const HTMLTextarea = (
  props: TextareaHTMLAttributes<HTMLTextAreaElement>,
) => {
  return <textarea {...props} />
}
