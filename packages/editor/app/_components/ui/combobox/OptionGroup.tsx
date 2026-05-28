import { cn } from "@lib/utils/cn"
import React from "react"

type ComboboxOptionGroupProps = {
  isLast: boolean
  children: React.ReactNode
}

export function ComboboxOptionGroup({
  isLast,
  children,
}: ComboboxOptionGroupProps) {
  return (
    <div
      className={cn(
        "border-b border-solid border-white/10",
        isLast && "border-none",
      )}
    >
      {children}
    </div>
  )
}
