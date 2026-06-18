import { MenuEntry } from "@lib/menus"
import { Fragment, type MouseEvent } from "react"
import { useRowCategory } from "./hooks/use-row-category"
import { ItemSectionRow } from "@seldon/components/elements/ItemSectionRow"
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
  const { hoverStyle, handleClick, handleMouseEnter, handleMouseLeave } =
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

  // Keep the "+" in the far-right slot. When it shows, the actions menu moves to
  // the middle slot, but only when the section actually has actions.
  const showActionsInMiddle = !!addButton && actionsMenu.hasActions

  return (
    <Fragment>
      <ItemSectionRow
        buttonIconic={buttonIconic}
        icon={{ icon }}
        textLabel={{ children: label }}
        buttonIconic2={
          showActionsInMiddle ? actionsMenu.buttonIconic : undefined
        }
        icon2={showActionsInMiddle ? actionsMenu.icon : undefined}
        buttonIconic3={addButton ?? actionsMenu.buttonIconic}
        icon3={addButton ? { icon: "material-add" } : actionsMenu.icon}
        style={hoverStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />
      {actionsMenu.menu}
    </Fragment>
  )
}
