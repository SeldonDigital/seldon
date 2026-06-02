"use client"

import { CSSProperties, useCallback, useMemo } from "react"
import { Variant } from "@seldon/core"
import { isEntryFontCollectionDefault } from "@seldon/core/workspace/model/entry-font-collection"
import { workspaceFontCollectionService } from "@seldon/core/workspace/services/font-collection/font-collection.service"
import { useTool } from "@lib/hooks/use-tool"
import { useSelection } from "@lib/workspace/use-selection"
import { useRowHighlightStyle } from "@lib/workspace/use-object-hover"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { useSidebarRowStyling } from "../../tracking/hooks/use-sidebar-row-styling"
import { useEditState } from "./hooks/use-edit-state"
import { useExpansion, useIsExpanded } from "./hooks/use-expansion"
import { useRowButton } from "./hooks/use-row-button"
import { useRowClick } from "./hooks/use-row-click"
import { useRowToggle } from "./hooks/use-row-toggle"
import { ListItemTreeNode as SeldonNode } from "../../../seldon/elements/ListItemTreeNode"
import { LabelProps } from "../../../seldon/primitives/Label"
import { Combobox } from "../properties/controls/combobox/Combobox"
import { relativeFullWidthStyle } from "../helpers/sidebar-styles"
import { IndentationLevel } from "../helpers/use-indentation"
import { FramerExpandable } from "../shared/FramerExpandable"
import { RowFontFamilyEntry } from "./RowFontFamilyEntry"

const rowWrapperStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
}

type RowFontCollectionEntryProps = {
  componentKey: string
  fontCollectionEntryId: string
  show?: boolean
  parentIsSelected?: boolean
}

/**
 * One font collection variant entry inside a font collection board. Expands to
 * list the families resolved for that entry. Mirrors the theme entry row, with
 * board-style expansion since the entry nests family rows beneath it.
 */
export function RowFontCollectionEntry({
  componentKey,
  fontCollectionEntryId,
  show = true,
  parentIsSelected = false,
}: RowFontCollectionEntryProps) {
  const { workspace, dispatch } = useWorkspace({ usePreview: false })
  const { activeTool } = useTool()
  const { selectFontCollectionEntry, selectedFontCollectionEntryId } =
    useSelection()
  const { toggle, expandObjects, collapseObjects } = useExpansion()
  const isExpanded = useIsExpanded(fontCollectionEntryId)
  const { isEditingName, setEditingName } = useEditState({
    id: fontCollectionEntryId,
  } as unknown as Variant)

  const isSelected = selectedFontCollectionEntryId === fontCollectionEntryId
  const isActive = parentIsSelected || isSelected

  const families = useMemo(() => {
    const collection = workspaceFontCollectionService.getFontCollection(
      fontCollectionEntryId,
      workspace,
    )
    return collection ? Object.entries(collection.families) : []
  }, [fontCollectionEntryId, workspace])

  const hasChildren = families.length > 0

  const onToggle = useRowToggle({
    expandedId: fontCollectionEntryId,
    isExpanded,
    toggle,
    expandObjects,
    collapseObjects,
    getAllIdsForAltClick: () => [fontCollectionEntryId],
    hasChildren,
  })

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

  const { createToggleButton, createToggleIcon, createStaticButton2, createIcon2 } =
    useRowButton({
      isExpanded,
      isSelected,
      hasChildren,
      onToggle,
    })

  if (!show || !entry) return null

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

  const icon2 = createIcon2("seldon-component")
  if (iconColor && !isSelected) {
    icon2.style = { ...(icon2.style ?? {}), color: iconColor }
  }

  return (
    <>
      <div
        style={rowWrapperStyle}
        data-selection-id={fontCollectionEntryId}
        data-selection-kind="fontCollection"
      >
        <div style={relativeFullWidthStyle}>
          <SeldonNode
            buttonIconic={createToggleButton()}
            icon={createToggleIcon()}
            buttonIconic2={createStaticButton2()}
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

      <FramerExpandable isExpanded={isExpanded}>
        <IndentationLevel>
          {families.map(([slot, family]) => (
            <RowFontFamilyEntry
              key={slot}
              componentKey={componentKey}
              fontCollectionId={fontCollectionEntryId}
              slot={slot}
              family={family}
              show={show}
              parentIsSelected={isActive}
            />
          ))}
        </IndentationLevel>
      </FramerExpandable>
    </>
  )
}
