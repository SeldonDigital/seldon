import { COLORS } from "@lib/helpers/colors"
import { CSSProperties, ReactNode } from "react"
import { LayeredPaintKey } from "@seldon/core"
import {
  InsertIndicatorLine,
  OverlayLayer,
  PlacementZoneSurface,
  Pointer,
} from "@seldon/components/custom-components"
import { useLayerDraggable } from "./hooks/use-layer-draggable"
import { useLayerDropzone } from "./hooks/use-layer-dropzone"
import type { LayerPlacement } from "./helpers/layer-reorder"

interface LayerDragRowProps {
  property: LayeredPaintKey
  layerIndex: number
  layerCount: number
  label: string
  icon: string
  children: ReactNode
}

const wrapperStyle: CSSProperties = { position: "relative", width: "100%" }
const nonInteractiveOverlayStyle: CSSProperties = { pointerEvents: "none" }

/**
 * Wraps a layered paint parent row to make it a drag source for reordering and
 * to host before/after drop bands with the shared insert indicator.
 */
export function LayerDragRow({
  property,
  layerIndex,
  layerCount,
  label,
  icon,
  children,
}: LayerDragRowProps) {
  const { ref, dragging } = useLayerDraggable({
    property,
    layerIndex,
    label,
    icon,
  })

  return (
    <div ref={ref} style={{ ...wrapperStyle, opacity: dragging ? 0.5 : 1 }}>
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
    </div>
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

  return (
    <>
      <PlacementZoneSurface
        ref={ref}
        style={getBandStyle(placement)}
        dataTestId={`layer-${property}-${layerIndex}-dropzone-${placement}`}
      />
      {isValidDropTarget && (
        <OverlayLayer style={nonInteractiveOverlayStyle}>
          <LayerInsertIndicator placement={placement} />
        </OverlayLayer>
      )}
    </>
  )
}

function getBandStyle(placement: LayerPlacement): CSSProperties {
  const base: CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    pointerEvents: "auto",
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
