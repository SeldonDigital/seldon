import React from "react"
import { createPortal } from "react-dom"
import { Frame } from "@seldon/components/frames/Frame"
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
  return createPortal(
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
    </Frame>,
    document.body,
  )
}
