import { MenuEntry } from "@lib/menus"
import { Fragment, type MouseEvent } from "react"
import { useRowCategory } from "./hooks/use-row-category"
import { ItemSection } from "@seldon/components/elements/ItemSection"
import { useRowActionsMenu } from "../shared/use-row-actions-menu"
import { useSectionHeaderRow } from "../shared/use-section-header-row"
import { PropertySection } from "./helpers/get-property-sections"
import { ThemePropertySection } from "./helpers/get-theme-property-sections"

interface VMCategoryProps {
  section: PropertySection | ThemePropertySection
  actions?: MenuEntry[]
  /** When set, renders a trailing "+" button that adds a custom token. */
  onAddCustom?: () => void
}

/**
 * View-model for a category header in the properties sidebar (e.g.,
 * "Attributes", "Layout"). Categories don't use the tracking system, so
 * useRowHover is used for hover styling.
 */
export function VMCategory({ section, actions, onAddCustom }: VMCategoryProps) {
  const { label, icon, buttonIconic, onToggle } = useRowCategory(section)
  const { handleClick, handleMouseEnter, handleMouseLeave } =
    useSectionHeaderRow({ onToggle })
  const actionsMenu = useRowActionsMenu(actions ?? [], {
    "aria-label": "Section actions",
  })

  const addButton = onAddCustom
    ? {
        onClick: (event: MouseEvent<HTMLButtonElement>) => {
          event.stopPropagation()
          onAddCustom()
        },
        "aria-label": "Add custom token",
      }
    : undefined

  // The new section row keeps the "+" add control in its own slot (buttonIconic2)
  // ahead of the trailing "…" actions menu (buttonIconic3). The actions slot
  // always binds the hook props so the row footprint stays stable.
  return (
    <Fragment>
      <ItemSection
        buttonIconic={buttonIconic}
        icon={{ icon }}
        formControlComboboxControl={{}}
        textLabel={{ children: label }}
        buttonIconic2={addButton ?? null}
        buttonIconic3={actionsMenu.buttonIconic}
        icon3={actionsMenu.icon}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />
      {actionsMenu.menu}
    </Fragment>
  )
}
