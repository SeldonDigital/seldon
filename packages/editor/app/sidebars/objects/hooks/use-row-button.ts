import { MouseEvent } from "react"
import { IconProps } from "@seldon/components/primitives/Icon"

interface UseRowButtonOptions {
  isExpanded: boolean
  isSelected: boolean
  hasChildren?: boolean
  onToggle: (event?: MouseEvent<HTMLButtonElement>) => void
}

/**
 * Shared hook for creating consistent button and icon props across RowBoard and RowNode.
 * Extracts common button/icon creation patterns to reduce duplication.
 */
export function useRowButton({
  isExpanded,
  isSelected,
  hasChildren = true,
  onToggle,
}: UseRowButtonOptions) {
  const createToggleButton = () => ({
    onClick: (event: MouseEvent<HTMLButtonElement>) => {
      onToggle(event)
    },
    "aria-expanded": isExpanded,
    "aria-label": isExpanded ? "Collapse" : "Expand",
    style: {
      position: "relative" as const,
      zIndex: 10,
    },
  })

  const createToggleIcon = () => {
    const style: React.CSSProperties = {
      transition: "transform 0.2s ease",
    }
    if (isExpanded && hasChildren) {
      style.transform = "rotate(90deg)"
    }
    if (!hasChildren) {
      style.color = "transparent"
    } else if (isSelected) {
      style.color = "var(--sdn-seldon-swatch-primary)"
    }
    return {
      icon: "material-chevronRight" as const,
      style,
    }
  }

  const createIcon2 = (iconId: IconProps["icon"]) => ({
    icon: iconId,
    ...(isSelected
      ? { style: { color: "var(--sdn-seldon-swatch-primary)" } }
      : {}),
  })

  return {
    createToggleButton,
    createToggleIcon,
    createIcon2,
  }
}
