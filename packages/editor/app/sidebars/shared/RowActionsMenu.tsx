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
  // Always render the same trigger button so the slot keeps its footprint. When
  // there are no actions, hide the icon with opacity and disable interaction,
  // mirroring how the reset button was previously hidden.
  const hasActions = items.length > 0

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
          aria-hidden={hasActions ? undefined : true}
          tabIndex={hasActions ? undefined : -1}
          className={TRIGGER_CLASS}
          style={{
            position: "relative",
            zIndex: 10,
            ...(hasActions ? null : { pointerEvents: "none" }),
          }}
        >
          <Icon
            icon="seldon-more"
            className="sdn-icon sdn-icon--1aaz"
            style={{
              opacity: hasActions ? 1 : 0,
              ...(color ? { color } : {}),
            }}
          />
        </button>
      )}
    />
  )
}
