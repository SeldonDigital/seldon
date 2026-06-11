import { Fragment } from "react"
import { MenuEntry } from "@lib/menus"
import { useRowActionsMenu } from "../shared/use-row-actions-menu"
import { useSectionHeaderRow } from "../shared/use-section-header-row"
import { useRowCategory } from "./hooks/use-row-category"
import { ItemSectionRow } from "@seldon/components/elements/ItemSectionRow"
import { PropertySection } from "./helpers/get-property-sections"
import { ThemePropertySection } from "./helpers/get-theme-property-sections"

interface VMCategoryProps {
  section: PropertySection | ThemePropertySection
  actions?: MenuEntry[]
}

/**
 * View-model for a category header in the properties sidebar (e.g.,
 * "Attributes", "Layout"). Categories don't use the tracking system, so
 * useRowHover is used for hover styling.
 */
export function VMCategory({ section, actions }: VMCategoryProps) {
  const { label, icon, buttonIconic, onToggle } = useRowCategory(section)
  const { hoverStyle, handleClick, handleMouseEnter, handleMouseLeave } =
    useSectionHeaderRow({ onToggle })
  const actionsMenu = useRowActionsMenu(actions ?? [], {
    "aria-label": "Section actions",
  })
  const hasActions = (actions?.length ?? 0) > 0

  return (
    <Fragment>
      <ItemSectionRow
        buttonIconic={buttonIconic}
        icon={{ icon }}
        textLabel={{ children: label }}
        buttonIconic3={hasActions ? actionsMenu.buttonIconic : null}
        icon3={hasActions ? actionsMenu.icon : null}
        style={hoverStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />
      {hasActions ? actionsMenu.menu : null}
    </Fragment>
  )
}
