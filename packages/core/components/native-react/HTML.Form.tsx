import type { FormHTMLAttributes } from "react"

export const HTMLForm = (props: FormHTMLAttributes<HTMLFormElement>) => {
  return <form {...props} />
}
