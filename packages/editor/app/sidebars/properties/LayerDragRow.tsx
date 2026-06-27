import { COLORS } from "@lib/helpers/colors"
import { CSSProperties, ReactNode } from "react"
import { LayeredPaintKey } from "@seldon/core"
import { useLayerDragStateStore } from "./hooks/use-layer-drag-state"
import { useLayerDraggable } from "./hooks/use-layer-draggable"
import { useLayerDropzone } from "./hooks/use-layer-dropzone"
import {
  Box,
  InsertIndicatorLine,
  OverlayLayer,
  PlacementZoneSurface,
  Pointer,
} from "@seldon/components/custom-components"
import type { LayerPlacement } from "./helpers/layer-reorder"

/** A row's layer-reorder context: which paint stack it belongs to and where. */
export interface LayerDragContext {
  property: LayeredPaintKey
  layerIndex: number
  layerCount: number
}

interface LayerDragRowProps {
  layerDrag: LayerDragContext | null
  label: string
  icon: string
  children: ReactNode
}

const wrapperStyle: CSSProperties = { position: "relative", width: "100%" }
const nonInteractiveOverlayStyle: CSSProperties = { pointerEvents: "none" }

/**
 * Renders a property row, making it a layer-reorder drag source when it is a
 * multi-layer paint parent. Rows without a layer context render their children
 * unwrapped, so the caller can always mount this without branching.
 */
export function LayerDragRow({
  layerDrag,
  label,
  icon,
  children,
}: LayerDragRowProps) {
  if (!layerDrag) return <>{children}</>
  return (
    <LayerDragSource
      property={layerDrag.property}
      layerIndex={layerDrag.layerIndex}
      layerCount={layerDrag.layerCount}
      label={label}
      icon={icon}
    >
      {children}
    </LayerDragSource>
  )
}

interface LayerDragSourceProps extends LayerDragContext {
  label: string
  icon: string
  children: ReactNode
}

/**
 * Drag-source wrapper for a layered paint parent row. Hosts before/after drop
 * bands with the shared insert indicator.
 */
function LayerDragSource({
  property,
  layerIndex,
  layerCount,
  label,
  icon,
  children,
}: LayerDragSourceProps) {
  const { ref, dragging } = useLayerDraggable({
    property,
    layerIndex,
    label,
    icon,
  })

  const boxStyle: CSSProperties = {
    ...wrapperStyle,
    opacity: dragging ? 0.5 : 1,
  }

  return (
    <Box ref={ref} style={boxStyle}>
      {children}
      <LayerDropBand
        property={property}
        layerIndex={layerIndex}
        layerCount={layerCount}
        placement="before"
      />
      <LayerDropBand
        property={property}
        layerIndex={layerIndex}
        layerCount={layerCount}
        placement="after"
      />
    </Box>
  )
}

function LayerDropBand({
  property,
  layerIndex,
  layerCount,
  placement,
}: {
  property: LayeredPaintKey
  layerIndex: number
  layerCount: number
  placement: LayerPlacement
}) {
  const { ref, isValidDropTarget } = useLayerDropzone({
    property,
    layerIndex,
    layerCount,
    placement,
  })
  const isLayerDragging = useLayerDragStateStore(
    (state) => state.isLayerDragging,
  )

  const bandStyle = getBandStyle(placement, isLayerDragging)
  const dropzoneTestId = `layer-${property}-${layerIndex}-dropzone-${placement}`
  const overlay = isValidDropTarget ? (
    <OverlayLayer style={nonInteractiveOverlayStyle}>
      <LayerInsertIndicator placement={placement} />
    </OverlayLayer>
  ) : null

  return (
    <>
      <PlacementZoneSurface
        ref={ref}
        style={bandStyle}
        dataTestId={dropzoneTestId}
      />
      {overlay}
    </>
  )
}

// The bands cover the whole row, so they only become hit-testable while a layer
// drag is active. Otherwise the row's combo, disclosure, and menu stay clickable.
function getBandStyle(
  placement: LayerPlacement,
  isLayerDragging: boolean,
): CSSProperties {
  const base: CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    pointerEvents: isLayerDragging ? "auto" : "none",
  }
  if (placement === "before") return { ...base, top: 0, height: "50%" }
  return { ...base, bottom: 0, height: "50%" }
}

function LayerInsertIndicator({ placement }: { placement: LayerPlacement }) {
  const lineStyle: CSSProperties = {
    position: "absolute",
    zIndex: 20,
    pointerEvents: "none",
    backgroundColor: COLORS.primary[600],
    left: 12,
    right: 0,
    height: 1,
    ...(placement === "before" ? { top: -0.5 } : { bottom: -0.5 }),
  }

  const dotStyle: CSSProperties = {
    position: "absolute",
    left: "-8px",
    top: "0.5px",
    transform: "translateY(-50%)",
    height: "var(--sdn-size-xsmall)",
    width: "var(--sdn-size-xsmall)",
    borderRadius: "9999px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: COLORS.primary[600],
    backgroundColor: COLORS.charcoal[500],
  }

  return (
    <InsertIndicatorLine style={lineStyle}>
      <Pointer style={dotStyle} />
    </InsertIndicatorLine>
  )
}
