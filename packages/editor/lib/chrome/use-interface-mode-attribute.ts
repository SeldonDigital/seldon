import { RefObject, useLayoutEffect } from "react"
import { useResolvedInterfaceMode } from "@lib/hooks/use-system-color-scheme"

/**
 * Applies the active interface mode to a chrome host element by setting its
 * `data-mode` attribute. Exported theme stylesheets ship an opposite-mode
 * swatch block behind `[data-mode]`, so the attribute selects between the
 * theme's authored colors and its derived mode colors. Setting the authored
 * mode matches nothing and falls back to the base block.
 *
 * Only call this for chrome surfaces; the canvas is pinned to the default
 * theme and must not switch modes.
 */
export function useInterfaceModeAttribute(
  ref: RefObject<HTMLElement | null>,
): void {
  const resolvedMode = useResolvedInterfaceMode()

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    element.setAttribute("data-mode", resolvedMode)
  }, [ref, resolvedMode])
}
