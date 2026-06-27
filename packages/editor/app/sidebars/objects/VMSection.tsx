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

  return (
    <ItemSection
      buttonIconic={buttonIconic}
      icon={{ icon }}
      formControlComboboxControl={{}}
      textLabel={{ children: label }}
      buttonIconic2={buttonIconic2 ?? null}
      buttonIconic3={null}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    />
  )
}
