import { ComboboxOptions } from "@app/menus"

import type { PropertyControlView } from "./hooks/use-property-control"

interface PropertyComboboxOptionsProps {
  control: PropertyControlView
  onEndEdit: () => void
}

/**
 * Floating combobox option list for a property row. Renders only while the row
 * edits through a combobox control; every other control kind renders nothing.
 * Closing the list both dismisses it and ends the row's edit session.
 */
export function PropertyComboboxOptions({ control, onEndEdit }: PropertyComboboxOptionsProps) {
  if (control.kind !== "combobox") return null

  const { options, optionList } = control
  const { open, position, onPointerLeave } = options

  const handleClose = () => {
    options.handleClose()
    onEndEdit()
  }

  return (
    <ComboboxOptions
      open={open}
      position={position}
      handleClose={handleClose}
      onPointerLeave={onPointerLeave}
      {...optionList}
    />
  )
}
