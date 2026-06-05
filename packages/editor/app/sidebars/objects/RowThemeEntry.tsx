"use client"

import { CSSProperties, useCallback } from "react"
import { Variant } from "@seldon/core"
import { getThemeById } from "@seldon/core/workspace/helpers/themes/get-theme-by-id"
import { isEntryThemeDefault } from "@seldon/core/workspace/model/entry-theme"
import type { EntryThemeId } from "@seldon/core/workspace/types"
import { useTool } from "@lib/hooks/use-tool"
import { useSelection } from "@lib/workspace/hooks/use-selection"
import { useRowHighlightStyle } from "@lib/workspace/hooks/use-object-hover"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { useSidebarRowStyling } from "../../tracking/hooks/use-sidebar-row-styling"
import { useEditState } from "./hooks/use-edit-state"
import { useRowClick } from "./hooks/use-row-click"
import { ListItemTreeNode as SeldonNode } from "../../seldon/elements/ListItemTreeNode"
import { IconProps } from "../../seldon/primitives/Icon"
import { LabelProps } from "../../seldon/primitives/Label"
import { Combobox } from "../properties/controls/combobox/Combobox"

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
  const { workspace, dispatch } = useWorkspace({ usePreview: false })
  const { activeTool } = useTool()
  const { selectThemeEntry, selectedThemeEntryId } = useSelection()
  const { isEditingName, setEditingName } = useEditState({
    id: themeEntryId,
  } as unknown as Variant)

  const isSelected = selectedThemeEntryId === themeEntryId
  const isActive = parentIsSelected || isSelected

  const onClick = useRowClick({
    activeTool,
    onSelect: () => selectThemeEntry(themeEntryId),
  })

  const entry = workspace.themes[themeEntryId]

  const onDoubleClick = useCallback(() => {
    if (entry && !isEntryThemeDefault(entry)) {
      setEditingName(true)
    }
  }, [entry, setEditingName])

  const { rowStyle, iconColor, labelColor } = useSidebarRowStyling(
    { id: themeEntryId } as unknown as Variant,
    { isSelected },
  )
  const hoverStyle = useRowHighlightStyle(themeEntryId, isSelected)
  const combinedRowStyle = { ...hoverStyle, ...rowStyle }

  if (!show || !entry) return null

  const icon2: IconProps = {
    icon: "seldon-theme",
    ...(iconColor ? { style: { color: iconColor } } : {}),
  }

  const label: LabelProps = {
    children: isEditingName ? (
      <Combobox
        mode="standalone"
        initialValue={entry.label}
        onSubmit={(newLabel) => {
          dispatch({
            type: "set_theme_label",
            payload: {
              themeId: themeEntryId,
              label: newLabel.trim(),
            },
          })
          setEditingName(false)
        }}
      />
    ) : (
      getThemeById(themeEntryId, workspace).label
    ),
    ...(labelColor ? { style: { color: labelColor } } : {}),
  }

  return (
    <div
      style={rowWrapperStyle}
      data-selection-id={themeEntryId}
      data-selection-kind="theme"
    >
      <SeldonNode
        buttonIconic={{}}
        icon={{ style: { color: "transparent" } }}
        buttonIconic2={{}}
        icon2={icon2}
        label={label}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        data-testid="objects-sidebar-theme-entry"
        data-theme-entry-id={themeEntryId}
        data-active={isActive}
        style={combinedRowStyle}
      />
    </div>
  )
}
