"use client"

import { CSSProperties, useCallback } from "react"
import type { EntryIconSetId } from "@seldon/core/workspace/types"
import { useTool } from "@lib/hooks/use-tool"
import { useRowClick } from "./hooks/use-row-click"
import { useRowHover } from "./hooks/use-row-hover"
import { ListItemTreeNode as SeldonNode } from "../../../seldon/elements/ListItemTreeNode"
import { LabelProps } from "../../../seldon/primitives/Label"

const rowWrapperStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
}

type RowIconSetEntryProps = {
  iconSetEntryId: EntryIconSetId
  label: string
  show?: boolean
  parentIsSelected?: boolean
}

/**
 * Read-only icon set variant row until icon-set editing is implemented on v0 workspaces.
 */
export function RowIconSetEntry({
  iconSetEntryId,
  label,
  show = true,
  parentIsSelected = false,
}: RowIconSetEntryProps) {
  const { activeTool } = useTool()

  const isActive = parentIsSelected

  const onClick = useRowClick({
    activeTool,
    onSelect: () => {},
  })

  const { setIsHovered, style: hoverStyle } = useRowHover(false)

  const handleMouseEnter = useCallback(() => {
    if (!isActive) setIsHovered(true)
  }, [isActive, setIsHovered])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [setIsHovered])

  const labelProps: LabelProps = {
    children: label,
  }

  if (!show) return null

  return (
    <div style={rowWrapperStyle}>
      <SeldonNode
        icon={{ icon: "seldon-icon" }}
        label={labelProps}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-testid="objects-sidebar-icon-set-entry"
        data-icon-set-entry-id={iconSetEntryId}
        data-active={isActive}
        style={hoverStyle}
      />
    </div>
  )
}
