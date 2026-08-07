import { ComboboxOptions } from "@app/menus"
import { useTool } from "@app/editor/hooks/use-tool"
import { buildFieldStateProps } from "@app/views/state-props"
import {
  useSelectionActions,
  useStore as useSelectionStore,
} from "@app/workspace/hooks/use-selection"
import { formatResourceItemKey } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { ItemNode } from "@seldon/components/elements/ItemNode"
import { useCallback } from "react"

import { PROPERTY_OPTION_ICONS } from "@seldon/core/properties/schemas/data/property-icons"

import { RowSelectionTarget } from "./RowSelectionTarget"
import { useFontCollectionFamilyRows } from "./hooks/use-font-collection-family-rows"
import { useRowClick } from "./hooks/use-row-click"
import { useRowDisplayPicker } from "./hooks/use-row-display-picker"

import type { FontFamilyRowModel } from "./hooks/use-font-collection-family-rows"
import type { OptionIconRender } from "@app/menus"

const RESOURCE_ITEM_SELECTION_KIND = "resourceItem"

const SHOW_ICON = PROPERTY_OPTION_ICONS.display.show
const HIDE_ICON = PROPERTY_OPTION_ICONS.display.hide

// The family's enabled state reuses the node Show/Hide picker: Show enables
// every weight (`all`), Hide disables them (`none`). A `custom` family (some
// weights on) reads as Show, dimmed.
const SHOW_HIDE_OPTIONS = [
  [
    { value: "show", name: "Show" },
    { value: "hide", name: "Hide" },
  ],
]

function resolveShowHideIcon(option?: { value: string; name: string }): OptionIconRender {
  return { kind: "iconId", icon: option?.value === "hide" ? HIDE_ICON : SHOW_ICON }
}

/**
 * The font collection's family rows. Font collections have a single default
 * entry and no variants, so the entry row is not shown. The families render
 * directly under the board row as leaf rows; their installed weights are edited
 * in the Properties sidebar when a family is selected.
 */
export function FontCollectionEntryRows({
  entryId,
  boardKey,
  show = true,
}: {
  entryId: string
  boardKey: string
  show?: boolean
}) {
  const families = useFontCollectionFamilyRows(entryId)

  if (!show) return null

  return (
    <>
      {families.map((family) => (
        <FontFamilyRow key={family.slot} boardKey={boardKey} entryId={entryId} family={family} />
      ))}
    </>
  )
}

/**
 * One selectable font family leaf row. Selecting it drives the canvas specimen
 * and opens its installed font sizes in the Properties sidebar. Its Show/Hide
 * picker flips the family's All/None preset with the same control nodes use.
 */
function FontFamilyRow({
  boardKey,
  entryId,
  family,
}: {
  boardKey: string
  entryId: string
  family: FontFamilyRowModel
}) {
  const { activeTool } = useTool()
  const { dispatch } = useWorkspace({ usePreview: false })
  const { selectResourceItem } = useSelectionActions()

  const selectionKey = formatResourceItemKey({
    resource: "font-collection",
    boardKey,
    entryId,
    slot: family.slot,
  })
  const isSelected = useSelectionStore((state) => state.selectedResourceItemKey === selectionKey)

  const onClick = useRowClick({
    activeTool,
    onSelect: () => selectResourceItem(selectionKey),
  })

  const selectDisplay = useCallback(
    (value: string) => {
      dispatch({
        type: "set_font_collection_family_preset",
        payload: {
          fontCollectionId: entryId,
          slot: family.slot,
          preset: value === "hide" ? "none" : "all",
        },
      })
    },
    [dispatch, entryId, family.slot],
  )

  const displayValue = family.preset === "none" ? "hide" : "show"

  const displayPicker = useRowDisplayPicker({
    optionGroups: SHOW_HIDE_OPTIONS,
    value: displayValue,
    onSelect: selectDisplay,
    resolveIcon: resolveShowHideIcon,
  })

  const displayIcon = {
    icon: family.preset === "none" ? HIDE_ICON : SHOW_ICON,
    style: family.preset === "custom" ? { opacity: 0.5 } : undefined,
  }

  const comboboxField = buildFieldStateProps({ selected: isSelected })

  const seldonRefs = {
    nodeDisclosureIcon: { style: { opacity: 0 } },
    nodeField: { ...comboboxField, style: { cursor: "pointer" } },
    nodeIcon: { icon: "seldon-text" },
    nodeLabel: { value: family.name, readOnly: true, style: { pointerEvents: "none" } },
    nodeDisplay: { ...displayPicker.buttonProps },
    nodeDisplayIcon: displayIcon,
  }

  return (
    <>
      <RowSelectionTarget selectionId={selectionKey} selectionKind={RESOURCE_ITEM_SELECTION_KIND}>
        <ItemNode
          buttonIconic={{}}
          comboboxField={{}}
          buttonIconic2={{}}
          buttonIconic3={null}
          seldonRefs={seldonRefs}
          onClick={onClick}
          aria-selected={isSelected || undefined}
          data-testid="objects-sidebar-font-family"
          data-resource-item-key={selectionKey}
        />
      </RowSelectionTarget>
      <ComboboxOptions {...displayPicker.options} />
    </>
  )
}
