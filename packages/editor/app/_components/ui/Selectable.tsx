"use client"

import { cnMerge } from "@lib/utils/cn"
import { ButtonHTMLAttributes, HTMLAttributes, Ref } from "react"

type SelectableProps = {
  state?: "default" | "active" | "selected" | "static"
  variant?: "outline" | "ghost"
}

export type SelectableButton = ButtonHTMLAttributes<HTMLButtonElement> &
  SelectableProps & {
    as: "button"
    ref?: Ref<HTMLButtonElement>
  }
export type SelectableDiv = HTMLAttributes<HTMLDivElement> &
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
  const finalClassName = cnMerge(
    variant === "outline" &&
      "text-sm rounded-md focus-visible:outline focus-visible:outline-1 focus-visible:outline-blue/25",
    variant === "ghost" && "text-xs font-medium",
    // Activate hover when component is not active, selected or static
    state === "default" && variant === "outline" && "hover:bg-white/10",
    state === "default" &&
      variant === "ghost" &&
      "bg-white/10 hover:bg-white/20",
    // Active state, component is activated but not selected
    // Example: this group item is active, but another item in the group is selected
    state === "active" &&
      variant === "outline" &&
      "text-blue hover:bg-white/10",
    // Selected state, component is selected
    // Example: this group item is active and selected
    state === "selected" &&
      variant === "outline" &&
      "text-blue outline outline-1 outline-blue",
    className,
  )
  if (as === "button") {
    return (
      <button
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
        data-state={state}
        className={finalClassName}
      />
    )
  }

  return (
    <div
      {...(rest as HTMLAttributes<HTMLDivElement>)}
      data-state={state}
      className={finalClassName}
    />
  )
}
