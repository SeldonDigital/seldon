"use client"

import { Placement } from "@lib/types"
import { CSSProperties } from "react"
import { Instance, Variant } from "@seldon/core"
import { typeCheckingService } from "@seldon/core/workspace/services"
import { useTool } from "@lib/hooks/use-tool"
import { useSidebarPlacementTracking } from "../hooks/use-sidebar-placement-tracking"
import {
  OverlayLayer,
  PlacementZoneSurface,
  PositionedPanel,
} from "@seldon/components/custom-components"
import { IndicatorInsert } from "./insert/IndicatorInsert"

interface SidebarPlacementZonesProps {
  node: Variant | Instance
  isExpanded: boolean
  onPlacementClick: (placement: Placement) => void
  onRowClick?: () => void
  onRowDoubleClick?: () => void
  onCanvasTrackingEnter?: () => void
  onCanvasTrackingLeave?: () => void
}

export function SidebarPlacementZones({
  node,
  isExpanded,
  onPlacementClick,
  onRowClick: _onRowClick,
  onRowDoubleClick: _onRowDoubleClick,
  onCanvasTrackingEnter,
  onCanvasTrackingLeave,
}: SidebarPlacementZonesProps) {
  const { activeTool } = useTool()
  const {
    handlePlacementEnter,
    handlePlacementLeave,
    isPlacementHovered,
    isPlacementAllowed,
    canHaveChildren,
  } = useSidebarPlacementTracking(node)

  const handlePlacementMouseEnter = (placement: Placement) => {
    onCanvasTrackingEnter?.()
    handlePlacementEnter(placement)
  }

  const handlePlacementMouseLeave = () => {
    onCanvasTrackingLeave?.()
    handlePlacementLeave()
  }

  const renderComponentToolZones = () => {
    if (typeCheckingService.isInstance(node)) {
      return (
        <>
          <PlacementZone
            placement="before"
            onClick={() => onPlacementClick("before")}
            onMouseEnter={() => handlePlacementMouseEnter("before")}
            onMouseLeave={handlePlacementMouseLeave}
            isHovered={isPlacementHovered("before")}
            isAllowed={isPlacementAllowed("before")}
            tool="component"
          />
          {canHaveChildren && (
            <PlacementZone
              placement="inside"
              onClick={() => onPlacementClick("inside")}
              onMouseEnter={() => handlePlacementMouseEnter("inside")}
              onMouseLeave={handlePlacementMouseLeave}
              isHovered={isPlacementHovered("inside")}
              isAllowed={isPlacementAllowed("inside")}
              tool="component"
            />
          )}
          {!isExpanded && (
            <PlacementZone
              placement="after"
              onClick={() => onPlacementClick("after")}
              onMouseEnter={() => handlePlacementMouseEnter("after")}
              onMouseLeave={handlePlacementMouseLeave}
              isHovered={isPlacementHovered("after")}
              isAllowed={isPlacementAllowed("after")}
              tool="component"
            />
          )}
        </>
      )
    }

    return canHaveChildren ? (
      <PlacementZone
        placement="inside"
        onClick={() => onPlacementClick("inside")}
        onMouseEnter={() => handlePlacementMouseEnter("inside")}
        onMouseLeave={handlePlacementMouseLeave}
        isHovered={isPlacementHovered("inside")}
        isAllowed={isPlacementAllowed("inside")}
        tool="component"
      />
    ) : null
  }

  const renderZones = () => {
    if (activeTool === "component") return renderComponentToolZones()
    return null // Select tool is handled separately with dropzones
  }

  return (
    <OverlayLayer style={overlayStyle}>
      <PositionedPanel style={relativeFillStyle}>
        {renderZones()}
      </PositionedPanel>
    </OverlayLayer>
  )
}

const overlayStyle: CSSProperties = { pointerEvents: "none" }
const relativeFillStyle: CSSProperties = {
  position: "relative",
  width: "100%",
  height: "100%",
}

interface PlacementZoneProps {
  placement: Placement
  onClick?: () => void
  onDoubleClick?: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
  isHovered: boolean
  isAllowed: boolean
  tool: "component"
}

function PlacementZone({
  placement,
  onClick,
  onDoubleClick,
  onMouseEnter,
  onMouseLeave,
  isHovered,
  isAllowed,
  tool,
}: PlacementZoneProps) {
  const Indicator = tool === "component" ? IndicatorInsert : null

  const zoneStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: "auto",
    // Only valid insertion targets get the insert cursor; everything else keeps
    // the default cursor so the affordance is not shown across the whole sidebar.
    cursor: isAllowed ? "copy" : "default",
  }

  const handleClick = (event: { stopPropagation: () => void }) => {
    event.stopPropagation()
    onClick?.()
  }

  const handleDoubleClick = (event: { stopPropagation: () => void }) => {
    event.stopPropagation()
    onDoubleClick?.()
  }

  return (
    <PlacementZoneSurface
      style={zoneStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {isHovered && isAllowed && Indicator && (
        <Indicator placement={placement} />
      )}
    </PlacementZoneSurface>
  )
}
