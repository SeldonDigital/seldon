import { DropIndicator, OverlayLayer, PlacementZoneSurface } from "@app/overlays/primitives"
import { calculateIndicatorPosition } from "@app/overlays/sidebar/helpers/calculate-indicator-position"
import { Frame } from "@seldon/components/frames/Frame"

import { useLayerDragStateStore } from "./hooks/use-layer-drag-state"
import { useLayerDraggable } from "./hooks/use-layer-draggable"
import { useLayerDropzone } from "./hooks/use-layer-dropzone"

import type { LayeredPaintKey } from "@seldon/core"
import type { LayerPlacement } from "@seldon/editor/lib/properties/layer-reorder"
import type { CSSProperties, ReactNode } from "react"

/** A row's layer-reorder context: which paint stack it belongs to and where. */
export interface LayerDragContext {
  property: LayeredPaintKey
  layerIndex: number
  layerCount: number
}

interface LayerDragRowProps {
  layerDrag: LayerDragContext | null
  children: ReactNode
}

const wrapperStyle: CSSProperties = { position: "relative", width: "100%" }
const nonInteractiveOverlayStyle: CSSProperties = { pointerEvents: "none" }

/**
 * Renders a property row, making it a layer-reorder drag source when it is a
 * multi-layer paint parent. Rows without a layer context render their children
 * unwrapped, so the caller can always mount this without branching.
 */
export function LayerDragRow({ layerDrag, children }: LayerDragRowProps) {
  if (!layerDrag) return <>{children}</>

  return (
    <LayerDragSource
      property={layerDrag.property}
      layerIndex={layerDrag.layerIndex}
      layerCount={layerDrag.layerCount}
    >
      {children}
    </LayerDragSource>
  )
}

interface LayerDragSourceProps extends LayerDragContext {
  children: ReactNode
}

/**
 * Drag-source wrapper for a layered paint parent row. Hosts before/after drop
 * bands with the shared insert indicator.
 */
function LayerDragSource({ property, layerIndex, layerCount, children }: LayerDragSourceProps) {
  const { ref } = useLayerDraggable({
    property,
    layerIndex,
  })

  return (
    <Frame wrapperElement="div" ref={ref} style={wrapperStyle}>
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
    </Frame>
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
  const isLayerDragging = useLayerDragStateStore((state) => state.isLayerDragging)

  const bandStyle = getBandStyle(placement, isLayerDragging)
  const dropzoneTestId = `layer-${property}-${layerIndex}-dropzone-${placement}`
  const overlay = isValidDropTarget ? (
    <OverlayLayer style={nonInteractiveOverlayStyle}>
      <LayerInsertIndicator placement={placement} />
    </OverlayLayer>
  ) : null

  return (
    <>
      <PlacementZoneSurface ref={ref} style={bandStyle} dataTestId={dropzoneTestId} />
      {overlay}
    </>
  )
}

// The bands cover the whole row, so they only become hit-testable while a layer
// drag is active. Otherwise the row's combo, disclosure, and menu stay clickable.
function getBandStyle(placement: LayerPlacement, isLayerDragging: boolean): CSSProperties {
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
  const position = calculateIndicatorPosition(placement)

  return <DropIndicator color="var(--sdn-swatch-primary)" position={position} dotOffset={0} />
}
