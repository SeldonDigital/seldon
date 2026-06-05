import { MouseEvent } from "react"
import { useRowHover } from "./hooks/use-row-hover"
import { useRowSection } from "./hooks/use-row-section"
import { ListItemTreeSection as SeldonSection } from "../../seldon/elements/ListItemTreeSection"
import { BoardSection } from "../helpers/get-board-sections"

interface RowSectionProps {
  section: BoardSection
}

/**
 * Renders a section header in the objects sidebar (e.g., "Primitives", "Elements").
 * Sections use useRowHover for hover styling (not the tracking system).
 */
export function RowSection({ section }: RowSectionProps) {
  const { label, icon, buttonIconic1, buttonIconic2, onToggle } =
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
    <SeldonSection
      label={{ children: label }}
      icon={{ icon }}
      buttonIconic1={buttonIconic1}
      buttonIconic2={buttonIconic2}
      style={hoverStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    />
  )
}
