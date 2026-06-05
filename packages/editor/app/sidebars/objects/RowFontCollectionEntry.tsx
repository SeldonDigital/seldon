"use client"

import { CSSProperties, useCallback } from "react"
import { Variant } from "@seldon/core"
import { isEntryFontCollectionDefault } from "@seldon/core/workspace/model/entry-font-collection"
import { useTool } from "@lib/hooks/use-tool"
import { useSelection } from "@lib/workspace/use-selection"
import { useRowHighlightStyle } from "@lib/workspace/use-object-hover"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { useSidebarRowStyling } from "../../tracking/hooks/use-sidebar-row-styling"
import { useEditState } from "./hooks/use-edit-state"
import { useRowClick } from "./hooks/use-row-click"
import { ListItemTreeNode as SeldonNode } from "../../seldon/elements/ListItemTreeNode"
import { IconProps } from "../../seldon/primitives/Icon"
import { LabelProps } from "../../seldon/primitives/Label"
import { Combobox } from "../properties/controls/combobox/Combobox"
import { relativeFullWidthStyle } from "../helpers/sidebar-styles"

const rowWrapperStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
}

type RowFontCollectionEntryProps = {
  fontCollectionEntryId: string
  show?: boolean
  parentIsSelected?: boolean
}

/**
 * One font collection variant entry inside a font collection board. Renders as a
 * leaf row mirroring the theme entry row: the board shows its default entry and
 * custom variants only. The font families themselves are shown as Type Specimen
 * previews on the canvas, not as nested sidebar rows.
 */
export function RowFontCollectionEntry({
  fontCollectionEntryId,
  show = true,
  parentIsSelected = false,
}: RowFontCollectionEntryProps) {
  const { workspace, dispatch } = useWorkspace({ usePreview: false })
  const { activeTool } = useTool()
  const { selectFontCollectionEntry, selectedFontCollectionEntryId } =
    useSelection()
  const { isEditingName, setEditingName } = useEditState({
    id: fontCollectionEntryId,
  } as unknown as Variant)

  const isSelected = selectedFontCollectionEntryId === fontCollectionEntryId
  const isActive = parentIsSelected || isSelected

  const onClick = useRowClick({
    activeTool,
    onSelect: () => selectFontCollectionEntry(fontCollectionEntryId),
  })

  const entry = workspace["font-collections"][fontCollectionEntryId]

  const onDoubleClick = useCallback(() => {
    if (entry && !isEntryFontCollectionDefault(entry)) {
      setEditingName(true)
    }
  }, [entry, setEditingName])

  const { rowStyle, iconColor, labelColor } = useSidebarRowStyling(
    { id: fontCollectionEntryId } as unknown as Variant,
    { isSelected },
  )
  const hoverStyle = useRowHighlightStyle(fontCollectionEntryId, isSelected)
  const combinedRowStyle = { ...hoverStyle, ...rowStyle }

  if (!show || !entry) return null

  const icon2: IconProps = {
    icon: "seldon-component",
    ...(iconColor ? { style: { color: iconColor } } : {}),
  }

  const label: LabelProps = {
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
  }

  return (
    <div
      style={rowWrapperStyle}
      data-selection-id={fontCollectionEntryId}
      data-selection-kind="fontCollection"
    >
      <div style={relativeFullWidthStyle}>
        <SeldonNode
          buttonIconic={{}}
          icon={{ style: { color: "transparent" } }}
          buttonIconic2={{}}
          icon2={icon2}
          label={label}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          data-testid="objects-sidebar-font-collection-entry"
          data-font-collection-entry-id={fontCollectionEntryId}
          data-active={isActive}
          style={combinedRowStyle}
        />
      </div>
    </div>
  )
}
