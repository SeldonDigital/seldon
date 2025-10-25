"use client"

import { cn } from "@lib/utils/cn"
import { ReactNode } from "react"

interface SectionHeaderProps {
  className?: string
  children: string
  disclaimer?: string
  slots?: {
    trailing?: ReactNode
  }
}

export function SectionHeader({
  className,
  children,
  disclaimer,
  slots,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex flex-row gap-2 items-center">
        <h1 className="text-xl font-semibold">{children}</h1>
        {disclaimer && (
          <>
            <span className="text-xl font-semibold">&middot;</span>
            <span className="text-xl font-semibold text-red">{disclaimer}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">{slots?.trailing}</div>
    </div>
  )
}
