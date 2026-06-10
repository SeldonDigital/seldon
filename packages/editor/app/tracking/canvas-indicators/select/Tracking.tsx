"use client"

import { COLORS } from "@lib/helpers/colors"
import { useEffect, useState } from "react"
import { CSSProperties } from "react"
import { useNodeRect } from "../../hooks/use-node-rect"
import { CanvasOutline } from "@seldon/components/custom-components"
import { getHtmlElementByNodeId } from "../../../canvas/helpers/get-html-element-by-node-id"
import { calculateClippingBox } from "../../helpers/calculate-clipping-box"
import { calculateSelectionOutline } from "../../helpers/calculate-selection-outline"
import { getWireframeMode } from "../../helpers/canvas-outline-modes"

export type SelectTrackingProps = {
  nodeId: string
  isSelected?: boolean
}

/**
 * Wireframe outline for one node in wireframe mode. Hover and selection borders
 * are drawn by the single canvas overlays, so this is wireframe-only and the
 * selected node is skipped (its selection outline covers it).
 */
export function SelectTracking({
  nodeId,
  isSelected = false,
}: SelectTrackingProps) {
  const trackedRect = useNodeRect(nodeId)
  const [directRect, setDirectRect] = useState<{
    top: number
    left: number
    width: number
    height: number
  } | null>(null)

  const showOutline = !isSelected

  useEffect(() => {
    if (!showOutline) {
      setDirectRect(null)
      return
    }

    if (trackedRect) {
      setDirectRect(null)
      return
    }

    const updateRect = () => {
      const nodeEl = getHtmlElementByNodeId(nodeId)
      if (nodeEl) {
        try {
          const rect = calculateSelectionOutline({ nodeEl: nodeEl })
          setDirectRect(rect)
        } catch {
          setDirectRect(null)
        }
      } else {
        setDirectRect(null)
      }
    }

    updateRect()

    const handleUpdate = () => {
      if (!trackedRect) {
        updateRect()
      }
    }

    window.addEventListener("scroll", handleUpdate, true)
    window.addEventListener("resize", handleUpdate)

    return () => {
      window.removeEventListener("scroll", handleUpdate, true)
      window.removeEventListener("resize", handleUpdate)
    }
  }, [nodeId, trackedRect, showOutline])

  if (!showOutline) return null

  const rect = trackedRect || directRect

  if (!rect) return null

  const clippedRect = calculateClippingBox({ nodeId, rect })
  if (!clippedRect) return null
  const box = getWireframeMode(clippedRect)

  const style: CSSProperties = {
    top: `${box.top}px`,
    left: `${box.left}px`,
    width: `${box.width}px`,
    height: `${box.height}px`,
    position: "absolute",
    pointerEvents: "none",
    boxSizing: box.boxSizing,
    borderStyle: "dashed",
    borderColor: COLORS.primary[500],
    borderWidth: box.borderWidth,
    zIndex: 1,
  }

  return <CanvasOutline style={style} />
}
