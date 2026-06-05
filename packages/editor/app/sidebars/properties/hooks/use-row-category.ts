import { MouseEvent } from "react"
import { IconProps } from "../../../seldon/primitives/Icon"
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
  // Expansion state: category-level and property-level expansion
  const { isCategoryExpanded, toggleCategory, toggleProperty } =
    usePropertyExpansion()

  // Category expansion state
  const isExpanded = isCategoryExpanded(section.category)

  // Toggle handler, matching the objects sidebar. A plain click toggles the
  // section only. An Alt/Option click also cascades to every nested disclosure
  // inside the section. Compound, shorthand, and look-parent rows carry
  // disclosures; other rows have none. This reads from the section's rows, not
  // section names.
  function onToggle(event?: MouseEvent<HTMLElement>) {
    if (!event?.altKey) {
      toggleCategory(section.category)
      return
    }

    const shouldExpand = !isExpanded
    toggleCategory(section.category, shouldExpand)
    for (const property of section.properties) {
      if (property.isCompound || property.isShorthand) {
        toggleProperty(property.key, shouldExpand)
      }
    }
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
