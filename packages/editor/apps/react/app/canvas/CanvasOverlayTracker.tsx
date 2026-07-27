"use client"

import { useTool } from "@app/editor/hooks/use-tool"
import { useActiveBoard } from "@app/workspace/hooks/use-active-board"
import {
  useHoveredId,
  useHoveredKind,
  useHoveredRootId,
} from "@app/workspace/hooks/use-object-hover"
import { useSelectedNodeId, useSelectedNodeRootId } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { useSelectedId } from "@app/workspace/selection-target"
import { createOverlayTracker } from "@seldon/editor/lib/canvas/overlay/overlay-tracker"
import { useEffect, useRef } from "react"
import { useTransformContext } from "react-zoom-pan-pinch"

import { useCanvasRemeasureStore } from "./hooks/use-canvas-remeasure-store"

import type { OverlayTracker } from "@seldon/editor/lib/canvas/overlay/overlay-tracker"

/**
 * Wires the current hover, selection, workspace, and pan/zoom transform into the
 * shared overlay tracker, which measures the hover and selection rects and
 * resolves their colors. Mounted inside the pan/zoom transform so the tracker
 * can re-measure on every transform frame, keeping the outlines glued during
 * pan and zoom.
 */
export function CanvasOverlayTracker() {
  const transformContext = useTransformContext()
  const hoveredId = useHoveredId()
  const hoveredKind = useHoveredKind()
  const hoveredRootId = useHoveredRootId()
  const selectedId = useSelectedId()
  const selectedNodeId = useSelectedNodeId()
  const selectedNodeRootId = useSelectedNodeRootId()
  const remeasureVersion = useCanvasRemeasureStore((state) => state.version)
  const isTransforming = useCanvasRemeasureStore((state) => state.isTransforming)
  const { workspace } = useWorkspace({ usePreview: false })
  const { activeBoard } = useActiveBoard()
  const { activeTool } = useTool()

  const transformContextRef = useRef(transformContext)

  transformContextRef.current = transformContext

  // Latest reactive values, read by the tracker's accessors so the persistent
  // scroll/transform listeners always measure against fresh state.
  const stateRef = useRef({
    hoveredId,
    hoveredKind,
    hoveredRootId,
    selectedId,
    selectedNodeId,
    selectedNodeRootId,
    workspace,
    activeBoard,
    activeTool,
  })

  stateRef.current = {
    hoveredId,
    hoveredKind,
    hoveredRootId,
    selectedId,
    selectedNodeId,
    selectedNodeRootId,
    workspace,
    activeBoard,
    activeTool,
  }

  const trackerRef = useRef<OverlayTracker | null>(null)

  useEffect(() => {
    const tracker = createOverlayTracker({
      getHovered: () => ({
        id: stateRef.current.hoveredId,
        kind: stateRef.current.hoveredKind,
        rootId: stateRef.current.hoveredRootId,
      }),
      getSelected: () => ({
        id: stateRef.current.selectedId,
        nodeId: stateRef.current.selectedNodeId,
        rootId: stateRef.current.selectedNodeRootId,
      }),
      getWorkspace: () => stateRef.current.workspace,
      getActiveBoard: () => stateRef.current.activeBoard,
      getActiveTool: () => stateRef.current.activeTool,
      subscribeTransform: (listener) => transformContextRef.current.onChange(listener),
    })

    trackerRef.current = tracker

    return () => {
      tracker.destroy()
      trackerRef.current = null
    }
  }, [])

  useEffect(() => {
    trackerRef.current?.updateColors()
  }, [
    hoveredId,
    hoveredKind,
    selectedId,
    selectedNodeId,
    remeasureVersion,
    workspace,
    activeBoard,
    activeTool,
  ])

  useEffect(() => {
    trackerRef.current?.refresh()
  }, [
    hoveredId,
    hoveredKind,
    hoveredRootId,
    selectedId,
    selectedNodeId,
    selectedNodeRootId,
    remeasureVersion,
    isTransforming,
  ])

  return null
}
