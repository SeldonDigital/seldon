"use client"

import { CSSProperties, useCallback } from "react"
import { Variant } from "@seldon/core"
import { isEntryFontCollectionDefault } from "@seldon/core/workspace/model/entry-font-collection"
import type { EntryFontCollectionId } from "@seldon/core/workspace/types"
import { useTool } from "@lib/hooks/use-tool"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { useSidebarRowStyling } from "../../tracking/hooks/use-sidebar-row-styling"
import { useEditState } from "./hooks/use-edit-state"
import { useRowClick } from "./hooks/use-row-click"
import { useRowHover } from "./hooks/use-row-hover"
import { ListItemTreeNode as SeldonNode } from "../../../seldon/elements/ListItemTreeNode"
import { IconProps } from "../../../seldon/primitives/Icon"
import { LabelProps } from "../../../seldon/primitives/Label"
import { Combobox } from "../properties/controls/combobox/Combobox"

const rowWrapperStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
}

type RowFontCollectionEntryProps = {
  fontCollectionEntryId: EntryFontCollectionId
  show?: boolean
  parentIsSelected?: boolean
}

export function RowFontCollectionEntry({
  fontCollectionEntryId,
  show = true,
  parentIsSelected = false,
}: RowFontCollectionEntryProps) {
  const { workspace, dispatch } = useWorkspace({ usePreview: false })
  const { activeTool } = useTool()
  const { isEditingName, setEditingName } = useEditState({
    id: fontCollectionEntryId,
  } as unknown as Variant)

  const entry = workspace["font-collections"][fontCollectionEntryId]

  const onClick = useRowClick({
    activeTool,
    onSelect: () => {},
  })

  const onDoubleClick = useCallback(() => {
    if (entry && !isEntryFontCollectionDefault(entry)) {
      setEditingName(true)
    }
  }, [entry, setEditingName])

  const { rowStyle, iconColor, labelColor } = useSidebarRowStyling(
    { id: fontCollectionEntryId } as unknown as Variant,
    { isSelected: false },
  )
  const { setIsHovered, style: hoverStyle } = useRowHover(false)
  const combinedRowStyle = { ...hoverStyle, ...rowStyle }

  const handleMouseEnter = useCallback(() => {
    if (!parentIsSelected) setIsHovered(true)
  }, [parentIsSelected, setIsHovered])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [setIsHovered])

  if (!show || !entry) return null

  const icon2: IconProps = {
    icon: "seldon-text",
    ...(iconColor ? { style: { color: iconColor } } : {}),
  }

  const label = {
    children: isEditingName ? (
      <Combobox
        mode="standalone"
        initialValue={entry.label}
        onSubmit={(newLabel) => {
          dispatch({
            type: "set_font_collection_label",
            payload: {
              fontCollectionId: fontCollectionEntryId,
              label: newLabel.trim(),
            },
          })
          setEditingName(false)
        }}
      />
    ) : (
      entry.label
    ),
    ...(labelColor ? { style: { color: labelColor } } : {}),
  } as unknown as LabelProps

  return (
    <div style={rowWrapperStyle}>
      <SeldonNode
        buttonIconic={{}}
        icon={{ style: { color: "transparent" } }}
        buttonIconic2={{}}
        icon2={icon2}
        label={label}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-testid="objects-sidebar-font-collection-entry"
        data-font-collection-entry-id={fontCollectionEntryId}
        data-active={parentIsSelected}
        style={combinedRowStyle}
      />
    </div>
  )
}
