import * as Portal from "@radix-ui/react-portal"
import React from "react"
import { Frame } from "../../../../../seldon/frames/Frame"
import { comboboxBackdropStyle, getOptionsPanelStyle } from "./combobox-styles"

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
            <div onClick={handleClose} style={comboboxBackdropStyle} />
            <div
              style={{
                ...getOptionsPanelStyle(true),
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
