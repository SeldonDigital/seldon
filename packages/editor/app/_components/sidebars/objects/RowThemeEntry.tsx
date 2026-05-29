"use client"

import { CSSProperties, useCallback } from "react"
import { Variant } from "@seldon/core"
import { getThemeById } from "@seldon/core/workspace/helpers/themes/get-theme-by-id"
import type { EntryThemeId } from "@seldon/core/workspace/types"
import { useTool } from "@lib/hooks/use-tool"
import { useSelection } from "@lib/workspace/use-selection"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { useSidebarRowStyling } from "../../tracking/hooks/use-sidebar-row-styling"
import { useRowClick } from "./hooks/use-row-click"
import { useRowHover } from "./hooks/use-row-hover"
import { ListItemTreeNode as SeldonNode } from "../../../seldon/elements/ListItemTreeNode"
import { IconProps } from "../../../seldon/primitives/Icon"
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

  const isSelected = selectedThemeEntryId === themeEntryId
  const isActive = parentIsSelected || isSelected

  const onClick = useRowClick({
    activeTool,
    onSelect: () => selectThemeEntry(themeEntryId),
  })

  const { rowStyle, iconColor, labelColor } = useSidebarRowStyling(
    { id: themeEntryId } as unknown as Variant,
    { isSelected },
  )
  const { setIsHovered, style: hoverStyle } = useRowHover(isSelected)
  const combinedRowStyle = { ...hoverStyle, ...rowStyle }

  const handleMouseEnter = useCallback(() => {
    if (!isActive) setIsHovered(true)
  }, [isActive, setIsHovered])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [setIsHovered])

  const entry = workspace.themes[themeEntryId]
  if (!show || !entry) return null

  const icon2: IconProps = {
    icon: "seldon-theme",
    ...(iconColor ? { style: { color: iconColor } } : {}),
  }

  const label: LabelProps = {
    children: getThemeById(themeEntryId, workspace).label,
    ...(labelColor ? { style: { color: labelColor } } : {}),
  }

  return (
    <div style={rowWrapperStyle}>
      <SeldonNode
        buttonIconic={{}}
        icon={{ style: { color: "transparent" } }}
        buttonIconic2={{}}
        icon2={icon2}
        label={label}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-testid="objects-sidebar-theme-entry"
        data-theme-entry-id={themeEntryId}
        data-active={isActive}
        style={combinedRowStyle}
      />
    </div>
  )
}
