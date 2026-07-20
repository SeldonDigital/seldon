import { ItemSection } from "@seldon/components/elements/ItemSection"

import { BoardSection } from "../helpers/get-board-sections"
import { useSectionHeaderRow } from "../hooks/use-section-header-row"
import { useRowSection } from "./hooks/use-row-section"

interface SectionProps {
  section: BoardSection
}

/**
 * View-model for a section header in the objects sidebar (e.g., "Primitives",
 * "Elements"). Sections drive hover styling through `useSectionHeaderRow`, not
 * the canvas tracking system.
 */
export function Section({ section }: SectionProps) {
  const { label, icon, buttonIconic, buttonIconic2, onToggle } =
    useRowSection(section)
  const { handleClick, handleMouseEnter, handleMouseLeave } =
    useSectionHeaderRow({ onToggle })

  // Drive each slot through its stable workspace ref. Conditional slots still
  // need a positional enabler to render (`{}` to show, `null` to hide); their
  // data flows through `seldonRefs`. The add control is hidden when absent.
  const seldonRefs: Record<string, Record<string, unknown>> = {
    sectionToggle: { ...buttonIconic },
    sectionToggleIcon: { icon },
    sectionLabel: { children: label },
  }
  if (buttonIconic2) seldonRefs.sectionAdd = { ...buttonIconic2 }

  // Positional enabler: render the add slot only when the section exposes one.
  const addSlot = buttonIconic2 ? {} : null

  return (
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
  )
}
