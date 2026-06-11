import { RowPropertyProps, useRowProperty } from "./hooks/use-row-property"
import { InputRow } from "@seldon/components/custom-components"
import { FramerExpandable } from "../shared/FramerExpandable"
import { RowActionsMenu } from "../shared/RowActionsMenu"
import { PropertyValueCell } from "./PropertyValueCell"

export function RowProperty(props: RowPropertyProps) {
  const view = useRowProperty(props)

  // `TextLabelProps.children` is typed as `string`, but the row renders the
  // value cell node here; the cast matches the existing row props convention.
  const valueCell = (
    <PropertyValueCell {...view.valueCellProps} />
  ) as unknown as string
  const listItemProps = {
    ...view.listItemProps,
    textLabel2: {
      ...view.listItemProps.textLabel2,
      children: valueCell,
    },
  }

  return (
    <>
      <InputRow
        {...listItemProps}
        onClick={view.onRowClick}
        actionsSlot={
          <RowActionsMenu
            items={view.resetActions}
            color={view.labelColor as string | undefined}
          />
        }
        formControlIconic={view.frameProps}
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
