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
import { ItemInputRow } from "@seldon/components/elements/ItemInputRow"
import { IconProps } from "@seldon/components/primitives/Icon"
import { useRowActionsMenu } from "../shared/use-row-actions-menu"
import { LayerDragRow } from "./LayerDragRow"
import { PropertyValueCell } from "./PropertyValueCell"
import { FlatProperty } from "./helpers/properties-data"

/**
 * View-model for a property row, bound to the generated `ItemInputRow`. The
 * trailing actions slot always binds hook props so row footprint stays stable.
 */
function VMPropertyInner(props: RowPropertyProps) {
  const view = useRowProperty(props)
  const actionsMenu = useRowActionsMenu(view.resetActions, {
    color: view.labelColor as string | undefined,
    focusTargetRef: view.focusTargetRef,
  })

  // `TextLabelProps.children` is typed as `string`, but the row renders the
  // value cell node here; the cast matches the existing row props convention.
  const valueCell = (
    <PropertyValueCell {...view.valueCellProps} />
  ) as unknown as string

  const { listItemProps } = view
  const layerDrag = getLayerDragContext(props)

  const row = (
    <ItemInputRow
      buttonIconic={listItemProps.buttonIconic}
      icon={listItemProps.icon as IconProps}
      textLabel={listItemProps.textLabel}
      formControlIconic={view.frameProps}
      icon2={listItemProps.icon2}
      input={null}
      textLabel2={{ ...listItemProps.textLabel2, children: valueCell }}
      buttonIconic2={listItemProps.buttonIconic2}
      icon3={listItemProps.icon3}
      buttonIconic3={actionsMenu.buttonIconic}
      icon4={actionsMenu.icon}
      onClick={view.onRowClick}
      onDoubleClick={view.onRowDoubleClick}
      style={view.rowStyleProp}
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
