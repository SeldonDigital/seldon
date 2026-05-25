"use client"

import { COLORS } from "@lib/ui/colors"
import { useEffect, useState } from "react"
import { CSSProperties } from "react"
import { useNodeRect } from "../../hooks/use-node-rect"
import { getHtmlElementByNodeId } from "../../../canvas/helpers/get-html-element-by-node-id"
import { calculateNodeRect } from "../../utils/calculate-node-rect"

/**
 * Canvas tracking component for select mode.
 * Shows a dashed wireframe outline around the hovered node on the canvas.
 * Falls back to direct DOM measurement if the node isn't tracked in the store.
 *
 * @param nodeId - The ID of the node to show tracking for
 */
export function SelectTracking({ nodeId }: { nodeId: string }) {
  const trackedRect = useNodeRect(nodeId)
  const [directRect, setDirectRect] = useState<{
    top: number
    left: number
    width: number
    height: number
  } | null>(null)

  useEffect(() => {
    if (trackedRect) {
      setDirectRect(null)
      return
    }

    const updateRect = () => {
      const nodeEl = getHtmlElementByNodeId(nodeId)
      if (nodeEl) {
        try {
          const rect = calculateNodeRect({ nodeEl: nodeEl })
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
  }, [nodeId, trackedRect])

  const rect = trackedRect || directRect

  if (!rect) return null

  const style: CSSProperties = {
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    position: "absolute",
    pointerEvents: "none",
    outlineStyle: "dashed",
    outlineColor: COLORS.primary[500],
    outlineWidth: 1,
    zIndex: 1,
  }

  return <div style={style} />
}
