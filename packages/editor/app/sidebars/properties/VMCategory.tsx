import { MenuEntry } from "@lib/menus"
import { useRowActionsMenu } from "@lib/menus/use-row-actions-menu"
import { Fragment, type MouseEvent } from "react"
import { useSectionHeaderRow } from "../hooks/use-section-header-row"
import { useRowCategory } from "./hooks/use-row-category"
import { ItemSection } from "@seldon/components/elements/ItemSection"
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
  }
  if (actionsMenu.hasActions)
    seldonRefs.sectionActions = { ...actionsMenu.buttonIconic }
  if (addButton) seldonRefs.sectionAdd = { ...addButton }

  // Positional enablers: render each trailing slot only when it has content, so
  // the add "+" sits flush right when a category has no actions (mirrors the
  // objects sidebar's `VMSection`). An empty actions placeholder would otherwise
  // reserve width and push the "+" off the edge.
  const addSlot = addButton ? {} : null
  const actionsSlot = actionsMenu.hasActions ? {} : null

  return (
    <Fragment>
      <ItemSection
        buttonIconic={{}}
        formControlCombobox={{}}
        textLabel={{}}
        buttonIconic2={addSlot}
        buttonIconic3={actionsSlot}
        seldonRefs={seldonRefs}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />
      {actionsMenu.menu}
    </Fragment>
  )
}
