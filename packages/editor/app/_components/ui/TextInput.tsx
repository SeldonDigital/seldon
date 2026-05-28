import { cn } from "@lib/utils/cn"
import * as React from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  description?: string
}

export function TextInput({
  className,
  label,
  description,
  style,
  ...props
}: InputProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)} style={style}>
      {label && <label className="text-sm text-pearl/80">{label}</label>}
      {description && <p className="text-xs text-pearl/50">{description}</p>}
      <input
        className={cn(
          "ring-1 ring-inset ring-gray",
          "no-spinner relative flex h-7 w-full cursor-text truncate rounded bg-transparent px-2 py-1.5 pr-1.5 text-sm text-inherit text-white transition-colors",
          "hover:ring-white",
          "placeholder:text-pearl/50 focus-visible:outline-none focus-visible:ring-sky-600",
        )}
        {...props}
      />
    </div>
  )
}
