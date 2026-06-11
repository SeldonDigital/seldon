import { useRowSection } from "./hooks/use-row-section"
import { useSectionHeaderRow } from "../shared/use-section-header-row"
import { ItemSectionRow } from "@seldon/components/elements/ItemSectionRow"
import { BoardSection } from "../helpers/get-board-sections"

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
  const { hoverStyle, handleClick, handleMouseEnter, handleMouseLeave } =
    useSectionHeaderRow({ onToggle })

  return (
    <ItemSectionRow
      buttonIconic={buttonIconic}
      icon={{ icon }}
      textLabel={{ children: label }}
      buttonIconic2={buttonIconic2}
      style={hoverStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    />
  )
}
