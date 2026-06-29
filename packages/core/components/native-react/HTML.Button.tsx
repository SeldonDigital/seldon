import { ButtonHTMLAttributes, forwardRef } from "react"

export const HTMLButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => {
  return <button ref={ref} {...props} />
})

HTMLButton.displayName = "HTMLButton"
