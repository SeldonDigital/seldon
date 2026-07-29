"use client"

import { OutlineBox } from "@app/overlays/primitives"

import { useCanvasOverlayStore } from "../../../canvas/hooks/use-canvas-overlays"
import { outlineBoxStyle } from "./outline-box-style"

/** Dashed border around the selected object (any kind). */
export function SelectionOverlay({ wireframe = false }: { wireframe?: boolean }) {
  const rect = useCanvasOverlayStore((state) => state.selectionRect)
  const outlineColors = useCanvasOverlayStore((state) => state.selectionOutlineColors)

  if (!rect) return null

  return (
    <OutlineBox style={outlineBoxStyle(rect, "selection", wireframe, outlineColors?.selection)} />
  )
}
