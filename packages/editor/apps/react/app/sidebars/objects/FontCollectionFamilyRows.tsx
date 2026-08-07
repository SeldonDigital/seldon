import { useTool } from "@app/editor/hooks/use-tool"
import { FramerExpandable } from "@app/sidebars/FramerExpandable.bespoke"
import { IndentationLevel } from "@app/sidebars/hooks/use-indentation"
import { buildFieldStateProps } from "@app/views/state-props"
import {
  useSelectionActions,
  useStore as useSelectionStore,
} from "@app/workspace/hooks/use-selection"
import { formatResourceItemKey } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { ItemNode } from "@seldon/components/elements/ItemNode"
import { useCallback, useState } from "react"

import { ResourceEntry } from "./ResourceEntry"
import { RowSelectionTarget } from "./RowSelectionTarget"
import { useFontCollectionFamilyRows } from "./hooks/use-font-collection-family-rows"
import { useRowClick } from "./hooks/use-row-click"

import type { FontFamilyRowModel, FontFamilyWeightRow } from "./hooks/use-font-collection-family-rows"
import type { ResourceRowConfig } from "./helpers/resource-row-config"
import type { MouseEvent } from "react"

const RESOURCE_ITEM_SELECTION_KIND = "resourceItem"

const CHECKED_ICON = "material-checkBox"
const UNCHECKED_ICON = "material-checkBoxOutlineBlank"

/**
 * A font collection entry row plus its family rows. The entry row keeps the
 * shared `ResourceEntry` behavior (select, rename, actions) and the families
 * render one indentation level below it, each expandable into weight rows.
 */
export function FontCollectionEntryRows({
  config,
  entryId,
  boardKey,
  show = true,
  parentIsSelected = false,
}: {
  config: ResourceRowConfig
  entryId: string
  boardKey: string
  show?: boolean
  parentIsSelected?: boolean
}) {
  const families = useFontCollectionFamilyRows(entryId)

  if (!show) return null

  return (
    <>
      <ResourceEntry
        config={config}
        entryId={entryId}
        show={show}
        parentIsSelected={parentIsSelected}
      />
      <IndentationLevel>
        {families.map((family) => (
          <FontFamilyRow
            key={family.slot}
            boardKey={boardKey}
            entryId={entryId}
            family={family}
          />
        ))}
      </IndentationLevel>
    </>
  )
}

/**
 * One selectable font family row. Selecting it drives the canvas specimen; its
 * inline toggle flips the family's All/None preset, and its chevron expands the
 * per-weight On/Off rows.
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

  const hasWeights = family.weights.length > 0
  const [weightsExpanded, setWeightsExpanded] = useState(false)

  const onClick = useRowClick({
    activeTool,
    onSelect: () => selectResourceItem(selectionKey),
  })

  const onToggleWeights = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation()
      if (hasWeights) setWeightsExpanded((value) => !value)
    },
    [hasWeights],
  )

  const onTogglePreset = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation()
      dispatch({
        type: "set_font_collection_family_preset",
        payload: {
          fontCollectionId: entryId,
          slot: family.slot,
          preset: family.preset === "all" ? "none" : "all",
        },
      })
    },
    [dispatch, entryId, family.slot, family.preset],
  )

  const presetIcon = family.preset === "none" ? UNCHECKED_ICON : CHECKED_ICON
  const presetIconStyle = family.preset === "custom" ? { opacity: 0.5 } : undefined

  const comboboxField = buildFieldStateProps({ selected: isSelected })

  const seldonRefs = {
    nodeDisclosure: { onClick: onToggleWeights },
    nodeDisclosureIcon: {
      style: {
        transition: "transform 0.2s ease",
        ...(hasWeights ? (weightsExpanded ? { transform: "rotate(90deg)" } : {}) : { opacity: 0 }),
      },
    },
    nodeField: { ...comboboxField, style: { cursor: "pointer" } },
    nodeIcon: { icon: "seldon-text" },
    nodeLabel: { value: family.name, readOnly: true, style: { pointerEvents: "none" } },
    nodeDisplay: { onClick: onTogglePreset, title: `Weights: ${family.preset}` },
    nodeDisplayIcon: { icon: presetIcon, style: presetIconStyle },
  }

  const weightRows = hasWeights ? (
    <FramerExpandable isExpanded={weightsExpanded}>
      <IndentationLevel>
        {family.weights.map((weight) => (
          <FontWeightRow key={weight.variant} entryId={entryId} slot={family.slot} weight={weight} />
        ))}
      </IndentationLevel>
    </FramerExpandable>
  ) : null

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
      {weightRows}
    </>
  )
}

/** One font weight row with an inline On/Off toggle. */
function FontWeightRow({
  entryId,
  slot,
  weight,
}: {
  entryId: string
  slot: string
  weight: FontFamilyWeightRow
}) {
  const { dispatch } = useWorkspace({ usePreview: false })

  const onToggle = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation()
      dispatch({
        type: "set_font_collection_family_variant",
        payload: {
          fontCollectionId: entryId,
          slot,
          variant: weight.variant,
          enabled: !weight.enabled,
        },
      })
    },
    [dispatch, entryId, slot, weight.variant, weight.enabled],
  )

  const seldonRefs = {
    nodeDisclosureIcon: { style: { opacity: 0 } },
    nodeField: { style: { cursor: "pointer" } },
    nodeIcon: { style: { opacity: 0 } },
    nodeLabel: { value: weight.label, readOnly: true, style: { pointerEvents: "none" } },
    nodeDisplay: { onClick: onToggle },
    nodeDisplayIcon: { icon: weight.enabled ? CHECKED_ICON : UNCHECKED_ICON },
  }

  return (
    <ItemNode
      buttonIconic={{}}
      comboboxField={{}}
      buttonIconic2={{}}
      buttonIconic3={null}
      seldonRefs={seldonRefs}
      onClick={onToggle}
      aria-checked={weight.enabled}
      data-testid="objects-sidebar-font-weight"
      data-font-weight={weight.variant}
    />
  )
}
