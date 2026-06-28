"use client"

import { ButtonHTMLAttributes, HTMLAttributes, Ref } from "react"

type SelectableProps = {
  state?: "default" | "active" | "selected" | "static"
  variant?: "outline" | "ghost"
}

type SelectableButton = ButtonHTMLAttributes<HTMLButtonElement> &
  SelectableProps & {
    as: "button"
    ref?: Ref<HTMLButtonElement>
  }
type SelectableDiv = HTMLAttributes<HTMLDivElement> &
  SelectableProps & {
    as: "div"
    ref?: Ref<HTMLDivElement>
  }

export const Selectable = ({
  as = "button",
  state = "default",
  className,
  variant = "outline",
  ...rest
}: SelectableButton | SelectableDiv) => {
  const sharedProps = {
    "data-state": state,
    "data-variant": variant,
    className: ["selectable", className].filter(Boolean).join(" "),
  }

  if (as === "button") {
    return (
      <button
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
        {...sharedProps}
      />
    )
  }

  return <div {...(rest as HTMLAttributes<HTMLDivElement>)} {...sharedProps} />
}
