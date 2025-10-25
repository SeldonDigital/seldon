import { cn } from "@lib/utils/cn"
import * as Collapsible from "@radix-ui/react-collapsible"
import React, { useState } from "react"
import { SectionHeader } from "@components/ui/SectionHeader"

type Props = {
  title: string
  children: React.ReactNode
  isInitiallyOpen?: boolean
}

export function ThemeSection({
  title,
  children,
  isInitiallyOpen = false,
}: Props) {
  const [open, setIsOpen] = useState(isInitiallyOpen)

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setIsOpen}
      className={cn("relative flex flex-col")}
      key={title}
    >
      <Collapsible.Trigger asChild>
        <SectionHeader isExpanded={open} onClick={() => setIsOpen(!open)}>
          {title}
        </SectionHeader>
      </Collapsible.Trigger>
      <Collapsible.Content style={{ padding: 4 }}>
        {children}
      </Collapsible.Content>
    </Collapsible.Root>
  )
}
