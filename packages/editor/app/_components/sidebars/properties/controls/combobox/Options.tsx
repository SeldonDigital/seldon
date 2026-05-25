import { cn } from "@lib/utils/cn"
import * as Portal from "@radix-ui/react-portal"
import React from "react"
import { Frame } from "../../../../../seldon/frames/Frame"

interface ComboboxOptionsProps {
  open: boolean
  children: React.ReactNode
  position: { x: number; y: number; w: number; positionAbove?: boolean }
  handleClose: () => void
}

export function ComboboxOptions({
  open,
  children,
  position,
  handleClose,
}: ComboboxOptionsProps) {
  return (
    <Portal.Root>
      <Frame role="listbox" onClick={(e) => e.stopPropagation()}>
        {open && (
          <>
            <div
              onClick={handleClose}
              className="absolute left-0 top-0 z-10 h-full w-full"
            />
            <div
              className={cn(
                "pointer-events-none fixed z-10 max-h-96 min-w-[8rem] overflow-hidden rounded-md border-black/10 bg-gray text-neutral-100 opacity-0 shadow-md outline outline-1 outline-black/15",
                open &&
                  "pointer-events-auto overflow-y-auto opacity-100 scrollbar-thin",
              )}
              style={{
                top: position.y,
                left: position.x,
                width: position.w,
                ...(position.positionAbove && {
                  transform: "translateY(-100%)",
                }),
              }}
            >
              {children}
            </div>
          </>
        )}
      </Frame>
    </Portal.Root>
  )
}
