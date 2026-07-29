import { useRowActionsMenu } from "@app/menus/hooks/use-row-actions-menu"
import { ItemSection } from "@seldon/components/elements/ItemSection"

import { useSectionHeaderRow } from "../hooks/use-section-header-row"
import { useRowSection } from "./hooks/use-row-section"

import type { BoardSection } from "../helpers/get-board-sections"

interface SectionProps {
  section: BoardSection
}

/**
 * View-model for a section header in the objects sidebar (e.g., "Primitives",
 * "Elements"). Sections drive hover styling through `useSectionHeaderRow`, not
 * the canvas tracking system.
 */
export function Section({ section }: SectionProps) {
  const { label, icon, buttonIconic, buttonIconic2, sectionMenuItems, onToggle } =
    useRowSection(section)
  const { handleClick, handleMouseEnter, handleMouseLeave } = useSectionHeaderRow({ onToggle })

  // Sections with menu items (THEME) drive the add slot as a menu trigger; the
  // rest keep their single add button. The hook runs unconditionally with an
  // empty list for non-menu sections, so its placeholder output stays unused.
  const sectionMenu = useRowActionsMenu(sectionMenuItems, {
    "aria-label": "Add",
  })
  const useMenu = sectionMenuItems.length > 0
  const addProps = useMenu ? sectionMenu.buttonIconic : buttonIconic2

  // Drive each slot through its stable workspace ref. Conditional slots still
  // need a positional enabler to render (`{}` to show, `null` to hide); their
  // data flows through `seldonRefs`. The add control is hidden when absent.
  const seldonRefs: Record<string, Record<string, unknown>> = {
    sectionDisclosure: { ...buttonIconic },
    sectionDisclosureIcon: { icon },
    sectionLabel: { children: label },
  }

  if (addProps) seldonRefs.sectionAdd = { ...addProps }

  // Positional enabler: render the add slot only when the section exposes one.
  const addSlot = addProps ? {} : null

  return (
    <>
      <ItemSection
        buttonIconic={{}}
        formControlCombobox={{}}
        textLabel={{}}
        buttonIconic2={addSlot}
        buttonIconic3={null}
        seldonRefs={seldonRefs}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />
      {sectionMenu.menu}
    </>
  )
}
