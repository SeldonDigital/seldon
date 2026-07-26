import { useMemo, useState } from "react"

/**
 * Local hover state and style for non-selectable header rows (sections and
 * property categories). Selectable rows use the shared hover bridge instead.
 */
export function useRowHover(isSelected: boolean, hoverOpacity: number = 10) {
  const [isHovered, setIsHovered] = useState(false)

  const style = useMemo(
    () => ({
      ...(isSelected ? { borderColor: "var(--sdn-swatch-primary)" } : {}),
      ...(isHovered && !isSelected
        ? {
            backgroundColor: `color-mix(in srgb, var(--sdn-swatch-active) ${hoverOpacity}%, transparent)`,
          }
        : {}),
    }),
    [isSelected, isHovered, hoverOpacity],
  )

  return {
    isHovered,
    setIsHovered,
    style,
  }
}
