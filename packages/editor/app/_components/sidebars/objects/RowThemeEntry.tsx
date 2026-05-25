"use client"

import { CSSProperties, useCallback } from "react"
import { getThemeById } from "@seldon/core/workspace/helpers/themes/get-theme-by-id"
import type { EntryThemeId } from "@seldon/core/workspace/types"
import { useTool } from "@lib/hooks/use-tool"
import { useSelection } from "@lib/workspace/use-selection"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { useRowClick } from "./hooks/use-row-click"
import { useRowHover } from "./hooks/use-row-hover"
import { ListItemTreeNode as SeldonNode } from "../../../seldon/elements/ListItemTreeNode"
import { LabelProps } from "../../../seldon/primitives/Label"

const rowWrapperStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
}

type RowThemeEntryProps = {
  themeEntryId: EntryThemeId
  show?: boolean
  parentIsSelected?: boolean
}

export function RowThemeEntry({
  themeEntryId,
  show = true,
  parentIsSelected = false,
}: RowThemeEntryProps) {
  const { workspace } = useWorkspace({ usePreview: false })
  const { activeTool } = useTool()
  const { selectThemeEntry, selectedThemeEntryId } = useSelection()

  const entry = workspace.themes[themeEntryId]
  if (!entry) return null

  const isSelected = selectedThemeEntryId === themeEntryId
  const isActive = parentIsSelected || isSelected

  const onClick = useRowClick({
    activeTool,
    onSelect: () => selectThemeEntry(themeEntryId),
  })

  const { setIsHovered, style: hoverStyle } = useRowHover(isSelected)

  const handleMouseEnter = useCallback(() => {
    if (!isActive) setIsHovered(true)
  }, [isActive, setIsHovered])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [setIsHovered])

  const label: LabelProps = {
    children: getThemeById(themeEntryId, workspace).label,
  }

  if (!show) return null

  return (
    <div style={rowWrapperStyle}>
      <SeldonNode
        icon={{ icon: "seldon-theme" }}
        label={label}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-testid="objects-sidebar-theme-entry"
        data-theme-entry-id={themeEntryId}
        data-active={isActive}
        style={hoverStyle}
      />
    </div>
  )
}
