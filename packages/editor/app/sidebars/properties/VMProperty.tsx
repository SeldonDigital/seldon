import { memo } from "react"
import { RowPropertyProps, useRowProperty } from "./hooks/use-row-property"
import { FramerExpandable } from "@seldon/components/custom-components"
import { ComboboxFieldProps } from "@seldon/components/elements/ComboboxField"
import { ItemProperty } from "@seldon/components/elements/ItemProperty"
import { useRowActionsMenu } from "../shared/use-row-actions-menu"
import { LayerDragRow } from "./LayerDragRow"
import { PropertyOptionsListbox } from "./PropertyOptionsListbox"
import { arePropertyRowPropsEqual } from "./helpers/property-row-memo"

/**
 * View-model for a property row, bound to the generated `ItemProperty`. The
 * trailing actions slot always binds hook props so row footprint stays stable.
 */
function VMPropertyInner(props: RowPropertyProps) {
  const view = useRowProperty(props)
  const optionsMenu = useRowActionsMenu(view.resetActions, {
    focusTargetRef: view.focusTargetRef,
  })

  const { listItemProps, control } = view

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
    propertyActions: { ...optionsMenu.buttonIconic },
  }
  if (listItemProps.icon2) seldonRefs.valueIcon = { ...listItemProps.icon2 }

  // Anchor the floating option list to the value field and enter edit on a single
  // click of the field. `ComboboxField` forwards the ref (React 19 ref-as-prop)
  // to its `Frame` div, which the position hook measures, and forwards `onClick`
  // to the same div. The display input is inert, so the click lands on the field.
  // Hover and selected styling come from the generated `ComboboxField` CSS.
  const comboboxField = {
    ref: view.setValueFieldRef,
    onClick: view.onValueFieldClick,
  } as unknown as ComboboxFieldProps

  // Positional enabler: suppress `icon2` with `null` when the value icon is
  // hidden or drawn as a dynamic chip; otherwise leave it on its slot default.
  const valueIconSlot = listItemProps.icon2 ? undefined : null

  // Sub-property rows for a compound or shorthand parent.
  const childRows = view.hasChildren ? (
    <FramerExpandable isExpanded={view.isExpanded}>
      {view.childItems.map((childProps) => (
        <VMProperty key={childProps.property.key} {...childProps} />
      ))}
    </FramerExpandable>
  ) : null

  // Render the exported `ItemProperty` through its slots. `LayerDragRow` wraps a
  // multi-layer paint parent as a drag source and passes other rows through
  // unwrapped. `textLabel` is a conditional slot, so it keeps a positional
  // enabler. `icon3` (the options-menu icon) has no workspace ref yet, so it
  // stays positional; add a `valueOptionsMenuIcon` ref to move it onto
  // `seldonRefs`.
  return (
    <>
      <LayerDragRow
        layerDrag={view.layerDrag}
        label={props.property.label}
        icon={props.property.icon}
      >
        <ItemProperty
          textLabel={{}}
          comboboxField={comboboxField}
          icon2={valueIconSlot}
          icon3={listItemProps.icon3}
          seldonRefs={seldonRefs}
          onClick={view.onRowClick}
          onDoubleClick={view.onRowDoubleClick}
        />
      </LayerDragRow>
      {optionsMenu.menu}
      <PropertyOptionsListbox control={control} onEndEdit={view.endEdit} />
      {childRows}
    </>
  )
}

export const VMProperty = memo(VMPropertyInner, arePropertyRowPropsEqual)
