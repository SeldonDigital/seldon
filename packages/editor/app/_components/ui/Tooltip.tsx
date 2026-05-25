import { cn } from "@lib/utils/cn"
import * as React from "react"

interface TooltipProps {
  children: React.ReactNode
  content: string
  className?: string
}

export function Tooltip({ children, content, className }: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false)

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2",
            "px-3 py-2 text-xs text-white bg-neutral-800 rounded-md shadow-lg",
            "w-[350px] max-w-[350px] whitespace-normal z-50",
            "before:content-[''] before:absolute before:top-full before:left-1/2 before:transform before:-translate-x-1/2",
            "before:border-4 before:border-transparent before:border-t-neutral-800",
            className,
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}
