import { ListItemTreeInput } from "@seldon/components/elements/ListItemTreeInput"
import { FramerExpandable } from "../shared/FramerExpandable"
import { RowActionsMenu } from "../shared/RowActionsMenu"
import { PropertyValueCell } from "./PropertyValueCell"
import { RowPropertyProps, useRowProperty } from "./hooks/use-row-property"

export function RowProperty(props: RowPropertyProps) {
  const view = useRowProperty(props)

  // `LabelProps.children` is typed as `string`, but the row renders the value
  // cell node here; the cast matches the existing row props convention.
  const valueCell = (
    <PropertyValueCell {...view.valueCellProps} />
  ) as unknown as string
  const listItemProps = {
    ...view.listItemProps,
    label2: {
      ...view.listItemProps.label2,
      children: valueCell,
    },
  }

  return (
    <>
      <ListItemTreeInput
        {...listItemProps}
        onClick={view.onRowClick}
        actionsSlot={
          <RowActionsMenu
            items={view.resetActions}
            color={view.labelColor as string | undefined}
          />
        }
        frame={view.frameProps}
        style={view.rowStyleProp}
      />
      {view.hasChildren ? (
        <FramerExpandable isExpanded={view.isExpanded}>
          {view.childItems.map((childProps) => (
            <RowProperty key={childProps.property.key} {...childProps} />
          ))}
        </FramerExpandable>
      ) : null}
    </>
  )
}
