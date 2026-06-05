import { useMemo, useState } from "react"

/**
 * Local hover state and style for non-selectable header rows (sections and
 * property categories). Selectable rows (nodes, boards, themes, font entries)
 * use the shared hover bridge instead; this stays only for rows that have no
 * selection id and only need a self-contained hover background.
 */
export function useRowHover(isSelected: boolean, hoverOpacity: number = 10) {
  const [isHovered, setIsHovered] = useState(false)

  const style = useMemo(
    () => ({
      ...(isSelected
        ? { borderColor: "var(--sdn-seldon-swatch-primary)" }
        : {}),
      ...(isHovered && !isSelected
        ? {
            backgroundColor: `hsl(0 0% 100% / ${hoverOpacity / 100})`,
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
