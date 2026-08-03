"use client"

import { useHasHoverState } from "@app/canvas/hooks/use-canvas-hover-state"
import { useDragStateStore } from "@app/canvas/hooks/use-drag-state"
import { useEditorConfig } from "@app/editor/hooks/use-editor-config"
import { useTool } from "@app/editor/hooks/use-tool"
import { useActiveBoard } from "@app/workspace/hooks/use-active-board"
import { useSelectedNodeId } from "@app/workspace/hooks/use-selection"
import {
  getActiveBoardIsTheme,
  getShowWireframes,
} from "@seldon/editor/lib/canvas/tracking/overlay-visibility"
import { useMemo } from "react"

import { useCanvasRemeasureStore } from "../../canvas/hooks/use-canvas-remeasure-store"
import { useNodeBelongsToActiveBoard } from "../hooks/use-belongs-to-active-board"
import { useStableIds } from "../hooks/use-stable-ids"
import { useTrackNodeRects } from "../hooks/use-track-node-rects"
import { useVisibleNodes } from "../hooks/use-visible-nodes"
import { HighlightConnectors } from "./highlight/HighlightConnectors"
import { InsertOverlay } from "./insert/InsertOverlay"
import { RefConnector } from "./ref-badges/RefConnector"
import { TokenConnector } from "./token-badges/TokenConnector"
import { CanvasDragLayer } from "./select/CanvasDragLayer"
import { HoverOverlay } from "./select/HoverOverlay"
import { NodeWireframe } from "./select/NodeWireframe"
import { SelectionOverlay } from "./select/SelectionOverlay"

export function CanvasOverlays() {
  const selectedNodeId = useSelectedNodeId()
  const { activeTool } = useTool()
  const { visibleNodes } = useVisibleNodes()
  const hasHoverState = useHasHoverState()
  // Held stable, because the tracker re-tracks whenever this list is a new one: a fresh
  // array on every render would mean tearing down and rebuilding an observer per node
  // each time anything here changes, several times over during a single pan.
  // `useStableIds` also holds the array across board-level edits that rebuild the
  // visible-node list without changing the set of ids.
  const rawNodeIds = useMemo(() => visibleNodes.map((node) => node.id), [visibleNodes])
  const nodeIds = useStableIds(rawNodeIds)
  const {
    showSelection,
    wireframeMode,
    showRefBadges,
    isolatedView,
    showLayoutBadges,
    showSpaceBadges,
    showDimensionBadges,
    showAppearanceBadges,
    showTypographyBadges,
    showEffectsBadges,
  } = useEditorConfig()
  const nodeBelongsToActiveBoard = useNodeBelongsToActiveBoard()
  const { activeBoard } = useActiveBoard()
  const isDragging = useDragStateStore((state) => state.isDragging)
  const isTransforming = useCanvasRemeasureStore((state) => state.isTransforming)

  // The insert component tool suppresses auto wireframes so its drop feedback
  // reads cleanly. Explicit wireframe mode still wins, and leaving the tool
  // restores normal auto behavior without touching persisted state.
  const showWireframes = getShowWireframes(wireframeMode)

  // Theme boards are previews, not an editable node tree, so they show no
  // selection or hover outline on the canvas.
  const activeBoardIsTheme = getActiveBoardIsTheme(activeBoard)

  useTrackNodeRects(nodeIds)

  // Badges stay drawn through a pan or zoom, unlike the boxes above, which hide
  // until it settles. Hiding them would take the open card with them, and the badges sit
  // in the gutter rather than over the canvas, so they have somewhere to stay. The
  // connector view-model re-measures its own nodes per frame to keep up.
  // Theme boards have no node tree to reference.
  const drawRefBadges = showRefBadges && !activeBoardIsTheme
  const refBadges = drawRefBadges ? <RefConnector /> : null

  // Token badges draw when any group is enabled. Like reference badges they show in
  // both isolation and normal modes, and never on a theme board's preview.
  const anyTokenGroupEnabled =
    showLayoutBadges ||
    showSpaceBadges ||
    showDimensionBadges ||
    showAppearanceBadges ||
    showTypographyBadges ||
    showEffectsBadges
  const tokenBadges = anyTokenGroupEnabled && !activeBoardIsTheme ? <TokenConnector /> : null

  // Isolation draws the whole gallery at once, which is what makes a line from
  // the selection to the boards it reaches worth drawing. The connectors draw
  // nothing while Show Connectors is off.
  const highlightConnectors = isolatedView ? <HighlightConnectors /> : null

  // Nodes reorder by dragging under the select tool. Theme boards are previews
  // with no node tree to reorder.
  const dragLayer = activeTool === "select" && !activeBoardIsTheme ? <CanvasDragLayer /> : null

  return (
    <>
      {activeTool === "select" &&
        showWireframes &&
        !isTransforming &&
        visibleNodes.map((node) => {
          if (!nodeBelongsToActiveBoard(node.id)) return null

          return (
            <NodeWireframe key={node.id} nodeId={node.id} isSelected={selectedNodeId === node.id} />
          )
        })}
      {showSelection && activeTool === "select" && !isDragging && !activeBoardIsTheme && (
        <SelectionOverlay wireframe={showWireframes} />
      )}
      {showSelection && activeTool === "select" && !isDragging && !activeBoardIsTheme && (
        <HoverOverlay wireframe={showWireframes} />
      )}
      {activeTool === "component" && hasHoverState && <InsertOverlay />}
      {highlightConnectors}
      {refBadges}
      {tokenBadges}
      {dragLayer}
    </>
  )
}
