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

  // Drive each slot through its stable workspace ref. Conditional slots keep a
  // positional enabler to render (`{}` to show, `null` to hide); their data
  // flows through `seldonRefs`. The actions slot always renders (its placeholder
  // hides itself when empty), and its trailing icon stays on the generated
  // `seldon-more` default, hidden by that placeholder, so it needs no ref.
  const seldonRefs: Record<string, Record<string, unknown>> = {
    sectionToggle: { ...buttonIconic },
    sectionToggleIcon: { icon },
    sectionLabel: { children: label },
    sectionActions: { ...actionsMenu.buttonIconic },
  }
  if (addButton) seldonRefs.sectionAdd = { ...addButton }

  return (
    <Fragment>
      <ItemSection
        buttonIconic={{}}
        formControlComboboxControl={{}}
        textLabel={{}}
        buttonIconic2={addButton ? {} : null}
        buttonIconic3={{}}
        seldonRefs={seldonRefs}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />
      {actionsMenu.menu}
    </Fragment>
  )
}
