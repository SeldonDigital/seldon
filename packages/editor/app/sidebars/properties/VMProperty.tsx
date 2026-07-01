import { memo } from "react"
import { RowPropertyProps, useRowProperty } from "./hooks/use-row-property"
import { FramerExpandable } from "@seldon/components/custom-components"
import { ComboboxFieldProps } from "@seldon/components/elements/ComboboxField"
import { ItemProperty } from "@seldon/components/elements/ItemProperty"
import { mergeStateProps } from "../shared/build-field-state-props"
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

  // The row's status maps to a generated leaf state (activated, invalid, or
  // disabled). The state props tint the row's content leaves (name, value,
  // value icon), replacing inline status colors, the same way the board row
  // drives activated.
  const stateRef = view.stateRef

  // Drive each slot through its stable workspace ref. The value `input` slot is
  // both the read-only display and, in edit mode, the live combobox/text control
  // (see `buildPropertyValueInput`), mirroring the objects-sidebar name slot. The
  // trailing actions icon keeps the generated `seldon-more` default, hidden by
  // the actions button placeholder.
  const seldonRefs: Record<string, Record<string, unknown>> = {
    propertyToggle: { ...listItemProps.buttonIconic },
    propertyToggleIcon: { ...listItemProps.icon },
    propertyLabel: mergeStateProps(view.nameLabelProps, stateRef),
    valueLabel: mergeStateProps(view.valueLabelProps, stateRef),
    valueOptionsMenu: { ...listItemProps.buttonIconic2 },
    propertyActions: { ...optionsMenu.buttonIconic },
  }
  if (listItemProps.icon2) {
    seldonRefs.valueIcon = mergeStateProps(listItemProps.icon2, stateRef)
  }

  // Anchor the floating option list to the value field and enter edit on a single
  // click of the field. `ComboboxField` forwards the ref (React 19 ref-as-prop)
  // to its `Frame` div, which the position hook measures, and forwards `onClick`
  // to the same div. The display input is inert, so the click lands on the field.
  // Hover and selected styling come from the generated `ComboboxField` CSS.
  // Group rows (look-parent: Modulation, Color Harmony, Font Family, swatch
  // groups, etc.) own no value. Keep the frame in place so row layout stays
  // aligned, but disable it: `aria-disabled` marks the state, and
  // `pointerEvents: none` stops both the hover styling and click-into-edit, so
  // the row body's own click still toggles the disclosure.
  const comboboxField = props.property.isLookParent
    ? ({
        "aria-disabled": true,
        style: { pointerEvents: "none" },
      } as ComboboxFieldProps)
    : ({
        ref: view.setValueFieldRef,
        onClick: view.onValueFieldClick,
      } as ComboboxFieldProps)

  // Positional enabler: suppress `icon2` with `null` when the value icon is
  // hidden; otherwise leave it on its slot default so the bound `valueIcon` ref
  // paints the glyph. Dynamic color chips (`icon-custom-color-value`) resolve
  // through the same slot via the generated `Icon`'s runtime registry.
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
  // unwrapped. `input` (the property-name slot) is conditional, so it keeps a
  // positional enabler. `icon3` (the options-menu icon) has no workspace ref
  // yet, so it stays positional; add a `valueOptionsMenuIcon` ref to move it
  // onto `seldonRefs`.
  return (
    <>
      <LayerDragRow
        layerDrag={view.layerDrag}
        label={props.property.label}
        icon={props.property.icon}
      >
        <ItemProperty
          input={{}}
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
