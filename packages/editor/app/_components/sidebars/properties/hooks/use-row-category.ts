import { IconProps } from "../../../../seldon/primitives/Icon"
import { PropertySection } from "../helpers/get-property-sections"
import { ThemePropertySection } from "../helpers/get-theme-property-sections"
import { usePropertyExpansion } from "../helpers/use-property-expansion"

/**
 * Hook that provides state and handlers for rendering a category header in the properties sidebar.
 * Handles category expansion/collapse.
 *
 * @param section - The property section to render (e.g., "Attributes", "Layout")
 * @returns Object containing label, icon, button props, and toggle handler
 */
export function useRowCategory(section: PropertySection | ThemePropertySection) {
  // Expansion state: category-level expansion
  const { isCategoryExpanded, toggleCategory } = usePropertyExpansion()

  // Category expansion state
  const isExpanded = isCategoryExpanded(section.category)

  // Toggle handler
  function onToggle() {
    toggleCategory(section.category)
  }

  // Icon: changes based on expansion state
  const iconId: IconProps["icon"] = isExpanded
    ? "material-unfoldLess"
    : "material-unfoldMore"

  // Button: toggle button with accessibility attributes
  const buttonIconic2 = {
    onClick: onToggle,
    "aria-expanded": isExpanded,
    "aria-label": isExpanded ? "Collapse" : "Expand",
  }

  return {
    label: section.label,
    icon: iconId,
    buttonIconic2,
    onToggle,
  }
}
