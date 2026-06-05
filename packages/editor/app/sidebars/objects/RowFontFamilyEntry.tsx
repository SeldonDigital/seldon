"use client"

import { CSSProperties } from "react"
import { Variant } from "@seldon/core"
import type { FontFamilyEntry } from "@seldon/core/font-collections/types"
import { useFontAvailable } from "@lib/hooks/use-font-available"
import { useTool } from "@lib/hooks/use-tool"
import { COLORS } from "@lib/helpers/colors"
import {
  formatResourceItemKey,
  useIsResourceItemSelected,
  useSelection,
} from "@lib/workspace/hooks/use-selection"
import { useRowHighlightStyle } from "@lib/workspace/hooks/use-object-hover"
import { useSidebarRowStyling } from "../../tracking/hooks/use-sidebar-row-styling"
import { useRowClick } from "./hooks/use-row-click"
import { ListItemTreeNode as SeldonNode } from "../../seldon/elements/ListItemTreeNode"
import { IconProps } from "../../seldon/primitives/Icon"
import { LabelProps } from "../../seldon/primitives/Label"

const rowWrapperStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
}

type RowFontFamilyEntryProps = {
  componentKey: string
  fontCollectionId: string
  slot: string
  family: FontFamilyEntry
  show?: boolean
  parentIsSelected?: boolean
}

/**
 * One font family row inside a font collection board. Selecting it highlights and
 * scrolls to that family's Type Specimen preview on the canvas. This is the same
 * resource-item row model that icon sets and media will adopt later.
 */
export function RowFontFamilyEntry({
  componentKey,
  fontCollectionId,
  slot,
  family,
  show = true,
  parentIsSelected = false,
}: RowFontFamilyEntryProps) {
  const { activeTool } = useTool()
  const { selectResourceItem } = useSelection()

  const selectionKey = formatResourceItemKey({
    resource: "font-collection",
    componentKey,
    entryId: fontCollectionId,
    slot,
  })
  const isSelected = useIsResourceItemSelected(selectionKey)

  const isAvailable = useFontAvailable(family.stack)

  const onClick = useRowClick({
    activeTool,
    onSelect: () => selectResourceItem(selectionKey),
  })

  const { rowStyle, iconColor, labelColor } = useSidebarRowStyling(
    { id: selectionKey } as unknown as Variant,
    { isSelected },
  )
  const hoverStyle = useRowHighlightStyle(selectionKey, isSelected)
  const combinedRowStyle = { ...hoverStyle, ...rowStyle }

  if (!show) return null

  // A family not installed on this machine is flagged red on both the icon and
  // the label, and red wins over the selection/hover color so the warning stays
  // visible even when the row is selected.
  const resolvedIconColor = isAvailable ? iconColor : COLORS.negative[500]
  const resolvedLabelColor = isAvailable ? labelColor : COLORS.negative[500]

  const icon2: IconProps = {
    icon: "seldon-text",
    ...(resolvedIconColor ? { style: { color: resolvedIconColor } } : {}),
  }

  const label = {
    children: family.name,
    title: isAvailable ? undefined : `${family.name} is not installed on this device`,
    ...(resolvedLabelColor ? { style: { color: resolvedLabelColor } } : {}),
  } as unknown as LabelProps

  return (
    <div
      style={rowWrapperStyle}
      data-selection-id={selectionKey}
      data-selection-kind="resourceItem"
    >
      <SeldonNode
        buttonIconic={{}}
        icon={{ style: { color: "transparent" } }}
        buttonIconic2={{}}
        icon2={icon2}
        label={label}
        onClick={onClick}
        data-testid="objects-sidebar-font-family-entry"
        data-font-family-key={selectionKey}
        data-active={isSelected || parentIsSelected}
        style={combinedRowStyle}
      />
    </div>
  )
}
