import { Placement } from "@lib/types"
import { CSSProperties, MouseEvent, ReactNode, useCallback } from "react"
import { Instance, Variant } from "@seldon/core"
import {
  nodeRelationshipService,
  typeCheckingService,
} from "@seldon/core/workspace/services"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { useDragStateStore } from "@lib/hooks/use-drag-state"
import { usePanel } from "@lib/hooks/use-panel"
import { useTool } from "@lib/hooks/use-tool"
import { useDropzone } from "../sidebars/objects/hooks/use-dropzone"
import { useSidebarPlacementTracking } from "./hooks/use-sidebar-placement-tracking"
import { OverlayLayer, PlacementZoneSurface } from "@app/overlays"
import { SidebarPlacementZones } from "./sidebar-indicators/SidebarPlacementZones"
import { IndicatorSelect } from "./sidebar-indicators/select/IndicatorSelect"

interface SidebarTrackingProps {
  node: Variant | Instance
  isExpanded: boolean
  children: ReactNode
  onRowClick?: (event: MouseEvent<HTMLElement>) => void
  onRowDoubleClick?: (event: MouseEvent<HTMLElement>) => void
  onCanvasTrackingEnter?: () => void
  onCanvasTrackingLeave?: () => void
}

/**
 * Checks if a mouse event target is within a button element.
 * Used to prevent tracking interactions when clicking buttons.
 * Checks both the event target and the element at the click coordinates,
 * since overlay divs may be positioned above buttons.
 */
function isButtonTarget(event: MouseEvent<HTMLElement>): boolean {
  const target = event.target as HTMLElement
  // Check if target or any ancestor is a button
  if (target.closest("button")) return true
  // Also check element at click coordinates (in case overlay is above button)
  const elementAtPoint = document.elementFromPoint(event.clientX, event.clientY)
  return elementAtPoint?.closest("button") !== null
}

/**
 * Sidebar tracking component that handles placement zone indicators and drag-drop zones
 * for sidebar rows. Manages hover states, placement clicks, and canvas tracking integration.
 *
 * @param node - The variant or instance node being tracked
 * @param isExpanded - Whether the node is expanded in the sidebar
 * @param children - The row content to render
 * @param onRowClick - Optional callback for row click events
 * @param onRowDoubleClick - Optional callback for row double-click events
 * @param onCanvasTrackingEnter - Optional callback when entering canvas tracking area
 * @param onCanvasTrackingLeave - Optional callback when leaving canvas tracking area
 */
export function SidebarTracking({
  node,
  isExpanded,
  children,
  onRowClick,
  onRowDoubleClick,
  onCanvasTrackingEnter,
  onCanvasTrackingLeave,
}: SidebarTrackingProps) {
  const { workspace } = useWorkspace({ usePreview: false })
  const { openPanel } = usePanel()
  const { activeTool } = useTool()
  const isDragging = useDragStateStore((state) => state.isDragging)
  const { isPlacementAllowed, parentNode, canHaveChildren } =
    useSidebarPlacementTracking(node)

  const handlePlacementClick = useCallback(
    (placement: Placement) => {
      if (!isPlacementAllowed(placement)) return

      const dialog = "component" as const

      if (placement === "inside") {
        openPanel(dialog, {
          nodeId: node.id,
          index: 0,
        })
        return
      }

      if (!parentNode) return

      // Check if node exists in workspace (additional safety check)
      const nodeExistsInWorkspace = workspace.nodes[node.id] !== undefined
      if (!nodeExistsInWorkspace) {
        // Node doesn't exist in workspace, skip insertion
        return
      }

      try {
        const currentIndex = typeCheckingService.isInstance(node)
          ? nodeRelationshipService.getInstanceIndex(node, workspace)
          : nodeRelationshipService.getVariantIndex(node, workspace)

        openPanel(dialog, {
          nodeId: parentNode.id,
          index: placement === "before" ? currentIndex : currentIndex + 1,
        })
      } catch (error) {
        // Node doesn't exist in workspace, skip insertion
        return
      }
    },
    [isPlacementAllowed, activeTool, node, parentNode, workspace, openPanel],
  )

  const handleRowClickWrapper = useCallback(
    (event?: MouseEvent<HTMLElement>) => {
      if (event && isButtonTarget(event)) return
      onRowClick?.(event as MouseEvent<HTMLElement>)
    },
    [onRowClick],
  )

  const handleRowDoubleClickWrapper = useCallback(
    (event?: MouseEvent<HTMLElement>) => {
      if (event && isButtonTarget(event)) return
      onRowDoubleClick?.(event as MouseEvent<HTMLElement>)
    },
    [onRowDoubleClick],
  )

  const renderSelectDropzones = () => {
    if (activeTool !== "select") return null

    return (
      <>
        <DragDropZone
          target={node}
          placement="before"
          bandStyle={getZoneBandStyle(
            "before",
            canHaveChildren,
            isExpanded,
            isDragging,
          )}
          onClick={handleRowClickWrapper}
          onDoubleClick={handleRowDoubleClickWrapper}
          onCanvasTrackingEnter={onCanvasTrackingEnter}
          onCanvasTrackingLeave={onCanvasTrackingLeave}
        />
        {canHaveChildren && (
          <DragDropZone
            target={node}
            placement="inside"
            bandStyle={getZoneBandStyle(
              "inside",
              canHaveChildren,
              isExpanded,
              isDragging,
            )}
            onClick={handleRowClickWrapper}
            onDoubleClick={handleRowDoubleClickWrapper}
            onCanvasTrackingEnter={onCanvasTrackingEnter}
            onCanvasTrackingLeave={onCanvasTrackingLeave}
          />
        )}
        {!isExpanded && (
          <DragDropZone
            target={node}
            placement="after"
            bandStyle={getZoneBandStyle(
              "after",
              canHaveChildren,
              isExpanded,
              isDragging,
            )}
            onClick={handleRowClickWrapper}
            onDoubleClick={handleRowDoubleClickWrapper}
            onCanvasTrackingEnter={onCanvasTrackingEnter}
            onCanvasTrackingLeave={onCanvasTrackingLeave}
          />
        )}
      </>
    )
  }

  // Component rows and other targets without a node id skip placement tracking
  if (!node.id) {
    return <div style={rowWrapperStyle}>{children}</div>
  }

  return (
    <div style={rowWrapperStyle}>
      {children}
      {activeTool === "select" ? (
        renderSelectDropzones()
      ) : (
        <SidebarPlacementZones
          node={node}
          isExpanded={isExpanded}
          onPlacementClick={handlePlacementClick}
          onRowClick={handleRowClickWrapper}
          onRowDoubleClick={handleRowDoubleClickWrapper}
          onCanvasTrackingEnter={onCanvasTrackingEnter}
          onCanvasTrackingLeave={onCanvasTrackingLeave}
        />
      )}
    </div>
  )
}

const rowWrapperStyle: CSSProperties = { position: "relative", width: "100%" }

/**
 * Computes the vertical band a select drop zone occupies within a row so that
 * pointer position chooses the placement. Without distinct bands the zones fully
 * overlap and only the topmost one is ever reachable.
 *
 * - Container, collapsed: before (top 30%), inside (middle 40%), after (bottom 30%).
 * - Container, expanded: before (top 50%), inside (bottom 50%); the after-sibling
 *   position stays reachable through the next sibling's before band.
 * - Leaf: before (top 50%), after (bottom 50%); no inside band is rendered.
 *
 * The band only captures pointer events while a drag is active, so its native
 * drop targets receive the drag. When idle it is non-interactive, letting the
 * row beneath own `:hover` and click while ItemNode still wires those handlers.
 */
function getZoneBandStyle(
  placement: Placement,
  canHaveChildren: boolean,
  isExpanded: boolean,
  isDragging: boolean,
): CSSProperties {
  const base: CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    pointerEvents: isDragging ? "auto" : "none",
  }

  if (canHaveChildren && !isExpanded) {
    if (placement === "before") return { ...base, top: 0, height: "30%" }
    if (placement === "inside") return { ...base, top: "30%", height: "40%" }
    return { ...base, bottom: 0, height: "30%" }
  }

  if (canHaveChildren && isExpanded) {
    if (placement === "before") return { ...base, top: 0, height: "50%" }
    return { ...base, bottom: 0, height: "50%" }
  }

  if (placement === "before") return { ...base, top: 0, height: "50%" }
  return { ...base, bottom: 0, height: "50%" }
}

interface DragDropZoneProps {
  target: Variant | Instance
  placement: Placement
  bandStyle: CSSProperties
  onClick?: (event?: MouseEvent<HTMLElement>) => void
  onDoubleClick?: (event?: MouseEvent<HTMLElement>) => void
  onCanvasTrackingEnter?: () => void
  onCanvasTrackingLeave?: () => void
}

/**
 * Drag-drop zone component for sidebar rows in select tool mode.
 * Renders drop indicators when a valid drop target is hovered.
 */
function DragDropZone({
  target,
  placement,
  bandStyle,
  onClick,
  onDoubleClick,
  onCanvasTrackingEnter,
  onCanvasTrackingLeave,
}: DragDropZoneProps) {
  const { isValidDropTarget, ref } = useDropzone({
    target,
    placement,
  })

  const handleMouseEnter = () => {
    onCanvasTrackingEnter?.()
  }

  const handleMouseLeave = () => {
    onCanvasTrackingLeave?.()
  }

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (isButtonTarget(event)) return
    onClick?.(event)
  }

  const handleDoubleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (isButtonTarget(event)) return
    onDoubleClick?.(event)
  }

  return (
    <>
      <PlacementZoneSurface
        ref={ref}
        style={bandStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        dataTestId={`node-${target.id}-dropzone-${placement}`}
      />
      {/* The hit area is only a band of the row, but the indicator line must sit
          on the row edge, so render it in a full-row, non-interactive overlay. */}
      {isValidDropTarget && (
        <OverlayLayer style={nonInteractiveOverlayStyle}>
          <IndicatorSelect placement={placement} />
        </OverlayLayer>
      )}
    </>
  )
}

const nonInteractiveOverlayStyle: CSSProperties = { pointerEvents: "none" }
