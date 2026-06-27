import { childPathsUnderCompoundParent } from "@lib/properties/property-paths"
import { memo } from "react"
import {
  Board,
  Instance,
  LayeredPaintKey,
  PropertyKey,
  Variant,
} from "@seldon/core"
import { isLayeredPaintProperty } from "@seldon/core/properties/types/property-keys"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { RowPropertyProps, useRowProperty } from "./hooks/use-row-property"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { FramerExpandable } from "@seldon/components/custom-components"
import { ComboboxFieldProps } from "@seldon/components/elements/ComboboxField"
import { ItemProperty } from "@seldon/components/elements/ItemProperty"
import { useRowActionsMenu } from "../shared/use-row-actions-menu"
import { LayerDragRow } from "./LayerDragRow"
import { PropertyListbox } from "./PropertyListbox"
import { FlatProperty } from "./helpers/properties-data"

/**
 * View-model for a property row, bound to the generated `ItemInputRow`. The
 * trailing actions slot always binds hook props so row footprint stays stable.
 */
function VMPropertyInner(props: RowPropertyProps) {
  const view = useRowProperty(props)
  const actionsMenu = useRowActionsMenu(view.resetActions, {
    focusTargetRef: view.focusTargetRef,
  })

  const { listItemProps, control } = view
  const layerDrag = getLayerDragContext(props)

  // Drive each slot through its stable workspace ref. The value `input` slot is
  // both the read-only display and, in edit mode, the live combobox/text control
  // (see `buildPropertyValueInput`), mirroring the objects-sidebar name slot. The
  // trailing actions icon keeps the generated `seldon-more` default, hidden by
  // the actions button placeholder.
  const seldonRefs: Record<string, Record<string, unknown>> = {
    propertyToggle: { ...listItemProps.buttonIconic },
    propertyToggleIcon: { ...listItemProps.icon },
    propertyLabel: { ...listItemProps.textLabel },
    valueLabel: { ...view.valueLabelProps },
    valueOptionsMenu: { ...listItemProps.buttonIconic2 },
    propertyActions: { ...actionsMenu.buttonIconic },
  }
  if (listItemProps.icon2) seldonRefs.valueIcon = { ...listItemProps.icon2 }

  // Anchor the floating option list to the value field. `ComboboxField` forwards
  // this ref (React 19 ref-as-prop) to its `Frame` div, which the position hook
  // measures.
  const comboboxField = {
    ref: view.setValueFieldRef,
  } as unknown as ComboboxFieldProps

  // Render the exported `ItemProperty` through its slots. `textLabel` is a
  // conditional slot, so it keeps a positional enabler. `icon2` is suppressed
  // with a positional `null` when the value icon is hidden or drawn as a dynamic
  // chip. `icon3` (the options-menu icon) has no workspace ref yet, so it stays
  // positional; add a `valueOptionsMenuIcon` ref to move it onto `seldonRefs`.
  const row = (
    <ItemProperty
      textLabel={{}}
      comboboxField={comboboxField}
      icon2={listItemProps.icon2 ? undefined : null}
      icon3={listItemProps.icon3}
      seldonRefs={seldonRefs}
      onClick={view.onRowClick}
      onDoubleClick={view.onRowDoubleClick}
    />
  )

  return (
    <>
      {layerDrag ? (
        <LayerDragRow
          property={layerDrag.property}
          layerIndex={layerDrag.layerIndex}
          layerCount={layerDrag.layerCount}
          label={props.property.label}
          icon={props.property.icon}
        >
          {row}
        </LayerDragRow>
      ) : (
        row
      )}
      {actionsMenu.menu}
      {control.kind === "combobox" && (
        <PropertyListbox
          open={control.options.open}
          position={control.options.position}
          handleClose={() => {
            control.options.handleClose()
            view.endEdit()
          }}
          onPointerLeave={control.options.onPointerLeave}
          {...control.optionList}
        />
      )}
      {view.hasChildren ? (
        <FramerExpandable isExpanded={view.isExpanded}>
          {view.childItems.map((childProps) => (
            <VMProperty key={childProps.property.key} {...childProps} />
          ))}
        </FramerExpandable>
      ) : null}
    </>
  )
}

/** The subject id a row renders against: the board key, or the node id. */
function rowSubjectId(node: Variant | Instance | Board): string {
  return isBoard(node) ? getComponentKey(node) : node.id
}

/** Structural equality for plain JSON-like values (FlatProperty fields). */
function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (typeof a !== typeof b) return false
  if (a === null || b === null) return a === b
  if (typeof a !== "object") return false

  const arrayA = Array.isArray(a)
  if (arrayA !== Array.isArray(b)) return false
  if (arrayA) {
    const listA = a as unknown[]
    const listB = b as unknown[]
    if (listA.length !== listB.length) return false
    return listA.every((item, index) => deepEqual(item, listB[index]))
  }

  const objA = a as Record<string, unknown>
  const objB = b as Record<string, unknown>
  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)
  if (keysA.length !== keysB.length) return false
  return keysA.every((key) => deepEqual(objA[key], objB[key]))
}

/** The sub-property rows a compound or shorthand parent recurses into. */
function rowChildren(props: RowPropertyProps): FlatProperty[] {
  if (!props.property.isCompound && !props.property.isShorthand) return []
  return props.allProperties.filter(
    (candidate) =>
      candidate.isSubProperty &&
      childPathsUnderCompoundParent(props.property.key, candidate.key),
  )
}

/**
 * A property row's output is a function of its `FlatProperty` (value, status,
 * formatted display), its compound child rows, the subject, the theme, and the
 * editing contexts. The `workspace` prop gets a new reference on every edit but
 * does not change a row's rendered output unless one of those inputs changed, so
 * it is intentionally excluded. Skipping unchanged rows is what cuts the
 * properties-sidebar re-render storm on each edit and keystroke.
 */
function arePropsEqual(
  prev: RowPropertyProps,
  next: RowPropertyProps,
): boolean {
  if (prev.theme !== next.theme) return false
  if (prev.themeEditingContext !== next.themeEditingContext) return false
  if (prev.fontCollectionEditingContext !== next.fontCollectionEditingContext) {
    return false
  }
  if (prev.iconSetEditingContext !== next.iconSetEditingContext) return false
  if (rowSubjectId(prev.node) !== rowSubjectId(next.node)) return false
  if (!deepEqual(prev.property, next.property)) return false
  if (prev.property.isCompound || prev.property.isShorthand) {
    if (!deepEqual(rowChildren(prev), rowChildren(next))) return false
  }
  return true
}

export const VMProperty = memo(VMPropertyInner, arePropsEqual)

/**
 * Returns the layer-reorder context for a row when it is a draggable layered
 * paint parent (`background`/`shadow`) on a node with more than one layer.
 * Returns null for boards, non-layer rows, facet rows, and single-layer stacks.
 */
function getLayerDragContext(props: RowPropertyProps): {
  property: LayeredPaintKey
  layerIndex: number
  layerCount: number
} | null {
  const { property, node, allProperties } = props
  if (isBoard(node)) return null
  if (property.isSubProperty) return null
  if (property.layerIndex === undefined) return null

  const root = property.key.split(".")[0]
  if (!isLayeredPaintProperty(root as PropertyKey)) return null

  const layerCount = allProperties.filter(
    (candidate) =>
      candidate.layerIndex !== undefined &&
      !candidate.isSubProperty &&
      candidate.key.split(".")[0] === root,
  ).length
  if (layerCount < 2) return null

  return {
    property: root as LayeredPaintKey,
    layerIndex: property.layerIndex,
    layerCount,
  }
}
