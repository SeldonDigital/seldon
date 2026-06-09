import React from "react"
import { createPortal } from "react-dom"
import { Frame } from "@seldon/components/frames/Frame"
import {
  comboboxBackdropStyle,
  getOptionsPanelPositionStyle,
} from "./combobox-styles"

interface ComboboxOptionsProps {
  open: boolean
  children: React.ReactNode
  position: { x: number; y: number; w: number; positionAbove?: boolean }
  handleClose: () => void
}

function stopPropagation(event: React.MouseEvent): void {
  event.stopPropagation()
}

export function ComboboxOptions({
  open,
  children,
  position,
  handleClose,
}: ComboboxOptionsProps) {
  const panel = open ? (
    <>
      <div onClick={handleClose} style={comboboxBackdropStyle} />
      <div style={getOptionsPanelPositionStyle(position)}>{children}</div>
    </>
  ) : null

  return createPortal(
    <Frame role="listbox" onClick={stopPropagation}>
      {panel}
    </Frame>,
    document.body,
  )
}
