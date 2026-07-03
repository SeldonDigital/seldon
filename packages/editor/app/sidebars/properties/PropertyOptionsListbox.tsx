import { VMComboboxListbox } from "@lib/menus"
import { PropertyControlView } from "./hooks/use-property-control"

interface PropertyOptionsListboxProps {
  control: PropertyControlView
  onEndEdit: () => void
}

/**
 * Floating combobox option list for a property row. Renders only while the row
 * edits through a combobox control; every other control kind renders nothing.
 * Closing the list both dismisses it and ends the row's edit session.
 */
export function PropertyOptionsListbox({
  control,
  onEndEdit,
}: PropertyOptionsListboxProps) {
  if (control.kind !== "combobox") return null

  const { options, optionList } = control
  const { open, position, onPointerLeave } = options
  const handleClose = () => {
    options.handleClose()
    onEndEdit()
  }

  return (
    <VMComboboxListbox
      open={open}
      position={position}
      handleClose={handleClose}
      onPointerLeave={onPointerLeave}
      {...optionList}
    />
  )
}
