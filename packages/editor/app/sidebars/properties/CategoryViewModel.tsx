import { MouseEvent } from "react"
import { useRowHover } from "../objects/hooks/use-row-hover"
import { useRowCategory } from "./hooks/use-row-category"
import { ItemSectionRow } from "@seldon/components/elements/ItemSectionRow"
import { PropertySection } from "./helpers/get-property-sections"
import { ThemePropertySection } from "./helpers/get-theme-property-sections"

interface CategoryViewModelProps {
  section: PropertySection | ThemePropertySection
}

/**
 * View-model for a category header in the properties sidebar (e.g.,
 * "Attributes", "Layout"). Categories don't use the tracking system, so
 * useRowHover is used for hover styling.
 */
export function CategoryViewModel({ section }: CategoryViewModelProps) {
  // Core category data: label, icon, button, toggle handler
  const { label, icon, buttonIconic, onToggle } = useRowCategory(section)

  // Styling: hover effects (categories use higher opacity for visibility)
  const { setIsHovered, style: hoverStyle } = useRowHover(false, 25)

  // Event handlers: prevent button clicks from toggling category
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("button")) {
      return
    }
    onToggle(event)
  }

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => setIsHovered(false)

  return (
    <ItemSectionRow
      buttonIconic={buttonIconic}
      icon={{ icon }}
      textLabel={{ children: label }}
      style={hoverStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    />
  )
}
