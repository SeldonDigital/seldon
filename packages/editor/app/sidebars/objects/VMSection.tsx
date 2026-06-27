import { useRowSection } from "./hooks/use-row-section"
import { ItemSection } from "@seldon/components/elements/ItemSection"
import { BoardSection } from "../helpers/get-board-sections"
import { useSectionHeaderRow } from "../shared/use-section-header-row"

interface VMSectionProps {
  section: BoardSection
}

/**
 * View-model for a section header in the objects sidebar (e.g., "Primitives",
 * "Elements"). Sections use useRowHover for hover styling, not the tracking
 * system.
 */
export function VMSection({ section }: VMSectionProps) {
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

  return (
    <ItemSection
      buttonIconic={{}}
      formControlComboboxControl={{}}
      textLabel={{}}
      buttonIconic2={buttonIconic2 ? {} : null}
      buttonIconic3={null}
      seldonRefs={seldonRefs}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    />
  )
}
