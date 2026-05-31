"use client"

import { COLORS } from "@lib/utils/colors"
import { useEffect, useState } from "react"
import { CSSProperties } from "react"
import { useNodeRect } from "../../hooks/use-node-rect"
import { getHtmlElementByNodeId } from "../../../canvas/helpers/get-html-element-by-node-id"
import { calculateSelectionOutline } from "../../utils/calculate-selection-outline"
import {
  getSelectionMode,
  getWireframeMode,
} from "../../utils/canvas-outline-modes"
import { calculateClippingBox } from "../../utils/calculate-clipping-box"

export type SelectTrackingProps = {
  nodeId: string
  isSelected?: boolean
  isHovered?: boolean
  showWireframe?: boolean
}

/**
 * Canvas tracking for select mode: primary wireframes and charcoal hover outlines.
 * Selection border is rendered by IndicatorSelect.
 */
export function SelectTracking({
  nodeId,
  isSelected = false,
  isHovered = false,
  showWireframe = false,
}: SelectTrackingProps) {
  const trackedRect = useNodeRect(nodeId)
  const [directRect, setDirectRect] = useState<{
    top: number
    left: number
    width: number
    height: number
  } | null>(null)

  const isWireframe = showWireframe && !isSelected
  const isHoverHighlight = isHovered && !isSelected && !showWireframe
  const showOutline = isWireframe || isHoverHighlight

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

  let box
  if (isWireframe) {
    const clippedRect = calculateClippingBox({ nodeId, rect })
    if (!clippedRect) return null
    box = getWireframeMode(clippedRect)
  } else {
    box = getSelectionMode(rect)
  }

  const style: CSSProperties = {
    top: `${box.top}px`,
    left: `${box.left}px`,
    width: `${box.width}px`,
    height: `${box.height}px`,
    position: "absolute",
    pointerEvents: "none",
    boxSizing: box.boxSizing,
    borderStyle: "dashed",
    borderColor: isWireframe ? COLORS.primary[500] : COLORS.charcoal[400],
    borderWidth: box.borderWidth,
    zIndex: 1,
  }

  return <div style={style} />
}
