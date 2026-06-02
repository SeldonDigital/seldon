"use client"

import { CSSProperties } from "react"
import type { EntryIconSetId } from "@seldon/core/workspace/types"
import { useTool } from "@lib/hooks/use-tool"
import { useRowHighlightStyle } from "@lib/workspace/use-object-hover"
import { useRowClick } from "./hooks/use-row-click"
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

  const hoverStyle = useRowHighlightStyle(iconSetEntryId, false)

  const labelProps: LabelProps = {
    children: label,
  }

  if (!show) return null

  return (
    <div
      style={rowWrapperStyle}
      data-selection-id={iconSetEntryId}
      data-selection-kind="resourceItem"
    >
      <SeldonNode
        icon={{ icon: "seldon-icon" }}
        label={labelProps}
        onClick={onClick}
        data-testid="objects-sidebar-icon-set-entry"
        data-icon-set-entry-id={iconSetEntryId}
        data-active={isActive}
        style={hoverStyle}
      />
    </div>
  )
}
