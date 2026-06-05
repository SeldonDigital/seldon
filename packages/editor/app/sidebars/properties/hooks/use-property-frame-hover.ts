import { useMemo, useState } from "react"
import { COLOR_UNSET } from "../helpers/property-styling"

/**
 * Hook for managing hover state and border styles on Frame components in property rows.
 * Provides a border hover effect that transitions from transparent to the row color.
 *
 * @param borderColor - The color to use for the border on hover. Defaults to COLOR_UNSET.
 * @returns Object containing hover state setter and style object
 */
export function usePropertyFrameHover(borderColor?: string) {
  const [isHovered, setIsHovered] = useState(false)

  // Use provided border color or default to COLOR_UNSET
  const hoverBorderColor = borderColor || COLOR_UNSET

  const style = useMemo(
    () => ({
      border: `var(--hairline) solid ${isHovered ? hoverBorderColor : "transparent"}`,
      borderRadius: "var(--sdn-corners-tight)",
    }),
    [isHovered, hoverBorderColor],
  )

  return {
    isHovered,
    setIsHovered,
    style,
  }
}
