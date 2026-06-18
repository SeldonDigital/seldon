import { LayeredPaintKey, PropertyKey } from "@seldon/core"
import { isLayeredPaintProperty } from "@seldon/core/properties/types/property-keys"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { RowPropertyProps, useRowProperty } from "./hooks/use-row-property"
import { FramerExpandable } from "@seldon/components/custom-components"
import { ItemInputRow } from "@seldon/components/elements/ItemInputRow"
import { IconProps } from "@seldon/components/primitives/Icon"
import { useRowActionsMenu } from "../shared/use-row-actions-menu"
import { LayerDragRow } from "./LayerDragRow"
import { PropertyValueCell } from "./PropertyValueCell"

/**
 * View-model for a property row, bound to the generated `ItemInputRow`. The
 * trailing actions slot always binds hook props so row footprint stays stable.
 */
export function VMProperty(props: RowPropertyProps) {
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
