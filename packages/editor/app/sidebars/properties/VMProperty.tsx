import { RowPropertyProps, useRowProperty } from "./hooks/use-row-property"
import { ItemInputRow } from "@seldon/components/elements/ItemInputRow"
import { IconProps } from "@seldon/components/primitives/Icon"
import { FramerExpandable } from "@seldon/components/custom-components"
import { useRowActionsMenu } from "../shared/use-row-actions-menu"
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

  return (
    <>
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
        style={view.rowStyleProp}
      />
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
