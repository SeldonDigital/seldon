"use client"

import { useSharedStore } from "@app/canvas/hooks/use-shared-store"
import { OutlineBox } from "@app/overlays/primitives"
import { anchoredNodesStore } from "@seldon/editor/lib/canvas/connectors/anchored-nodes-store"
import { getHtmlElementByNodeId } from "@seldon/editor/lib/canvas/dom/canvas-elements"
import { getWireframeMode } from "@seldon/editor/lib/canvas/overlay/geometry"
import {
  calculateClippingBox,
  calculateSelectionOutline,
} from "@seldon/editor/lib/canvas/overlay/measure"
import { useEffect, useState } from "react"

import { useNodeRect } from "../../hooks/use-node-rects"
import { nodeWireframeAnchoredStyle, nodeWireframeStyle } from "./node-wireframe-style"

export type NodeWireframeProps = {
  nodeId: string
  isSelected?: boolean
}

/**
 * Wireframe outline for one node in wireframe mode. Hover and selection borders
 * are drawn by the single canvas overlays, so this is wireframe-only and the
 * selected node is skipped (its selection outline covers it).
 */
export function NodeWireframe({ nodeId, isSelected = false }: NodeWireframeProps) {
  const trackedRect = useNodeRect(nodeId)
  // Read as one boolean, so a box only draws again when a connector starts or stops
  // meeting its own node rather than whenever any of them move.
  const isAnchored = useSharedStore(anchoredNodesStore, (state) => state.nodeIds.has(nodeId))
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
  const style = isAnchored ? nodeWireframeAnchoredStyle(box) : nodeWireframeStyle(box)

  return <OutlineBox style={style} />
}
