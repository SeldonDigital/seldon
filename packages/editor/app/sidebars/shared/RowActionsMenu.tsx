import { DropdownMenu, MenuAlign, MenuEntry } from "@lib/menus"
import { Icon } from "../../seldon/primitives/Icon"

const TRIGGER_CLASS = "sdn-button-iconic sdn-button-iconic--0urv"

interface RowActionsMenuProps {
  items: MenuEntry[]
  align?: MenuAlign
  /** Tints the trigger icon to match the row contents (e.g. blue when selected). */
  color?: string
  "aria-label"?: string
}

/**
 * The shared row "..." menu used by every resettable row in the objects and
 * properties sidebars. The trigger matches the existing iconic row buttons; the
 * menu items run actions (reducer dispatches) supplied by each row.
 */
export function RowActionsMenu({
  items,
  align = "end",
  color,
  "aria-label": ariaLabel = "Row actions",
}: RowActionsMenuProps) {
  return (
    <DropdownMenu
      items={items}
      align={align}
      renderTrigger={({ ref, triggerProps }) => (
        <button
          ref={ref}
          {...triggerProps}
          type="button"
          aria-label={ariaLabel}
          className={TRIGGER_CLASS}
          style={{ position: "relative", zIndex: 10 }}
        >
          <Icon
            icon="seldon-more"
            className="sdn-icon sdn-icon--1aaz"
            style={color ? { color } : undefined}
          />
        </button>
      )}
    />
  )
}
