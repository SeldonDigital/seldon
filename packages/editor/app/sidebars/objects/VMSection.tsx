import { MouseEvent } from "react"
import { useRowHover } from "./hooks/use-row-hover"
import { useRowSection } from "./hooks/use-row-section"
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
  const { setIsHovered, style: hoverStyle } = useRowHover(false, 25)

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("button")) {
      return
    }
    onToggle()
  }

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => setIsHovered(false)

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
