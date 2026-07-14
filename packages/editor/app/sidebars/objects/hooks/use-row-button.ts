import { MouseEvent } from "react"
import { IconProps } from "@seldon/components/primitives/Icon"

interface UseRowButtonOptions {
  isExpanded: boolean
  hasChildren?: boolean
  onToggle: (event?: MouseEvent<HTMLButtonElement>) => void
}

/**
 * Shared toggle button/icon props for BoardController and NodeController. Returns behavior and
 * accessibility only. Appearance (color, selection tint, leaf hiding, rotation)
 * is owned by the generated component CSS and by explicit VM-level state, not by
 * inline styles here.
 */
export function useRowButton({
  isExpanded,
  hasChildren = true,
  onToggle,
}: UseRowButtonOptions) {
  // Leaf rows keep the toggle slot for layout but mark it inert to stay out of
  // focus and tab order. Rows with children stay interactive.
  const createToggleButton = () => ({
    onClick: (event: MouseEvent<HTMLButtonElement>) => {
      onToggle(event)
    },
    style: {
      position: "relative" as const,
      zIndex: 10,
    },
    ...(hasChildren
      ? {
          "aria-expanded": isExpanded,
          "aria-label": isExpanded ? "Collapse" : "Expand",
        }
      : { tabIndex: -1, inert: true }),
  })

  const createToggleIcon = () => ({
    icon: "material-chevronRight" as const,
  })

  const createIcon2 = (iconId: IconProps["icon"]) => ({
    icon: iconId,
  })

  return {
    createToggleButton,
    createToggleIcon,
    createIcon2,
  }
}
