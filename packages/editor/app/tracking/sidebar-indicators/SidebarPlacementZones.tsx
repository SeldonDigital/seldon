"use client"

import { Placement } from "@lib/types"
import { Instance, Variant } from "@seldon/core"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { useTool } from "@lib/hooks/use-tool"
import { useSidebarPlacementTracking } from "../hooks/use-sidebar-placement-tracking"
import { IndicatorInsert } from "./insert/IndicatorInsert"

interface SidebarPlacementZonesProps {
  node: Variant | Instance
  isExpanded: boolean
  onPlacementClick: (placement: Placement) => void
  onRowClick?: () => void
  onRowDoubleClick?: () => void
  onHoverChange?: (isHovered: boolean) => void
}

export function SidebarPlacementZones({
  node,
  isExpanded,
  onPlacementClick,
  onRowClick: _onRowClick,
  onRowDoubleClick: _onRowDoubleClick,
  onHoverChange,
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
    onHoverChange?.(true)
    handlePlacementEnter(placement)
  }

  const handlePlacementMouseLeave = () => {
    onHoverChange?.(false)
    handlePlacementLeave()
  }

  const renderComponentToolZones = () => {
    if (workspaceService.isInstance(node)) {
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
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {renderZones()}
      </div>
    </div>
  )
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

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "auto",
        cursor: !isAllowed ? "not-allowed" : "copy",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={(event) => {
        event.stopPropagation()
        onClick?.()
      }}
      onDoubleClick={(event) => {
        event.stopPropagation()
        onDoubleClick?.()
      }}
    >
      {isHovered && isAllowed && Indicator && (
        <Indicator placement={placement} />
      )}
    </div>
  )
}
