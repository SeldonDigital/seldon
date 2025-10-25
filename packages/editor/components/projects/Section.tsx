import { cn } from "@lib/utils/cn"
import { ComponentProps } from "react"
import { SectionHeader } from "./SectionHeader"

export const Section = ({
  children,
  slots,
  title,
  disclaimer,
  className,
}: {
  children: React.ReactNode
  slots?: {
    header?: ComponentProps<typeof SectionHeader>["slots"]
  }
  title: string
  disclaimer?: string
  className?: string
}) => {
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <SectionHeader slots={slots?.header} disclaimer={disclaimer}>
        {title}
      </SectionHeader>
      {children}
    </div>
  )
}
