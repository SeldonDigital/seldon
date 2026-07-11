import { useRowActionsMenu } from "@lib/menus/use-row-actions-menu"
import { mergeStateProps } from "@lib/views/state-props"
import { ChangeEvent, memo, useCallback, useState } from "react"
import { createPortal } from "react-dom"
import { IndentationLevel } from "../hooks/use-indentation"
import { RowPropertyProps, useRowProperty } from "./hooks/use-row-property"
import { ComboboxFieldProps } from "@seldon/components/elements/ComboboxField"
import { ItemProperty } from "@seldon/components/elements/ItemProperty"
import { ToggleSwitch } from "@seldon/components/custom/ToggleSwitch"
import { FramerExpandable } from "@app/sidebars/FramerExpandable"
import { LayerDragRow } from "./LayerDragRow"
import { PropertyOptionsListbox } from "./PropertyOptionsListbox"
import { arePropertyRowPropsEqual } from "./helpers/property-row-memo"
import "./VMProperty.bespoke.css"

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

  // `wrapChildren` and `clip` render as a binary On/Off toggle. The core
  // `ToggleSwitch` is portaled into the (blanked) value cell so the generated
  // row layout and value-cell box stay intact while the toggle owns the value.
  const switchControl = control.kind === "switch" ? control : null
  const [switchFieldEl, setSwitchFieldEl] = useState<HTMLElement | null>(null)
  const setSwitchFieldRef = useCallback((node: HTMLElement | null) => {
    setSwitchFieldEl(node)
  }, [])

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
  const comboboxField = switchControl
    ? ({ ref: setSwitchFieldRef } as ComboboxFieldProps)
    : props.property.isLookParent
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

  // Switch rows blank the value cell's default contents (value glyph, text
  // input, chevron, and options button) so only the empty `ComboboxField` frame
  // remains as a positioned host for the portaled toggle.
  const valueIconProp = switchControl ? null : valueIconSlot
  const valueMenuIconProp = switchControl ? null : listItemProps.icon3
  const valueInputProp = switchControl ? null : undefined
  const valueMenuButtonProp = switchControl ? null : undefined

  const toggleSwitchRef = useCallback(
    (node: HTMLInputElement | null) => {
      if (node) {
        node.indeterminate = switchControl?.mixed ?? false
      }
    },
    [switchControl?.mixed],
  )

  const onToggleSwitchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      switchControl?.onToggle(event.currentTarget.checked)
    },
    [switchControl],
  )

  const toggleAriaChecked = switchControl?.mixed
    ? "mixed"
    : (switchControl?.checked ?? false)

  const toggleSwitch = switchControl ? (
    <ToggleSwitch
      className="sdn-property-switch"
      role="switch"
      checked={switchControl.checked}
      aria-checked={toggleAriaChecked}
      ref={toggleSwitchRef}
      onChange={onToggleSwitchChange}
    />
  ) : null

  const switchPortal =
    switchFieldEl && toggleSwitch
      ? createPortal(toggleSwitch, switchFieldEl)
      : null

  const optionsListbox = switchControl ? null : (
    <PropertyOptionsListbox control={control} onEndEdit={view.endEdit} />
  )

  // Sub-property rows for a compound or shorthand parent. Wrapped in
  // `IndentationLevel` so each nesting depth adds one indent step and shifts the
  // whole row, matching the objects-sidebar tree.
  const childRows = view.hasChildren ? (
    <FramerExpandable isExpanded={view.isExpanded}>
      <IndentationLevel>
        {view.childItems.map((childProps) => (
          <VMProperty key={childProps.property.key} {...childProps} />
        ))}
      </IndentationLevel>
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
          input2={valueInputProp}
          buttonIconic2={valueMenuButtonProp}
          icon2={valueIconProp}
          icon3={valueMenuIconProp}
          seldonRefs={seldonRefs}
          onClick={view.onRowClick}
          onDoubleClick={view.onRowDoubleClick}
        />
      </LayerDragRow>
      {switchPortal}
      {optionsMenu.menu}
      {optionsListbox}
      {childRows}
    </>
  )
}

export const VMProperty = memo(VMPropertyInner, arePropertyRowPropsEqual)
