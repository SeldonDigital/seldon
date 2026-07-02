import { RefObject, useLayoutEffect } from "react"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { useResolvedInterfaceMode } from "@lib/hooks/use-system-color-scheme"

/**
 * Variable pairs exchanged in light mode. The chrome reads color through these
 * scoped variables, so swapping them flips a dark-baseline theme to light
 * without touching the generated stylesheets. Only the three neutral surface
 * pairs flip: `white`/`black`, `foreground`/`background`, and
 * `offWhite`/`offBlack`. Everything else, including accent swatches and the
 * high-contrast inks, is left alone.
 */
const SWAP_PAIRS: readonly [string, string][] = [
  ["--sdn-swatch-white", "--sdn-swatch-black"],
  ["--sdn-swatch-foreground", "--sdn-swatch-background"],
  ["--sdn-swatch-offWhite", "--sdn-swatch-offBlack"],
]

/**
 * Applies the active interface mode to a chrome host element by overriding the
 * swap pairs as inline custom properties. Dark mode clears the overrides so the
 * element falls back to its theme stylesheet. Light mode reads the theme's
 * resolved values and writes them swapped, which avoids the custom-property
 * cycle a same-name CSS swap would hit.
 *
 * Re-runs when the chrome theme or resolved mode changes. Only call this for
 * chrome surfaces; the canvas is pinned to the default theme and must not swap.
 */
export function useInterfaceModeVars(ref: RefObject<HTMLElement | null>): void {
  const { chromeTheme } = useEditorConfig()
  const resolvedMode = useResolvedInterfaceMode()

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return

    // Clear first so reads reflect the theme stylesheet, and so dark mode
    // reverts cleanly after switching away from light.
    for (const [first, second] of SWAP_PAIRS) {
      element.style.removeProperty(first)
      element.style.removeProperty(second)
    }

    if (resolvedMode !== "light") return

    const computed = getComputedStyle(element)
    for (const [first, second] of SWAP_PAIRS) {
      const firstValue = computed.getPropertyValue(first).trim()
      const secondValue = computed.getPropertyValue(second).trim()
      if (firstValue) element.style.setProperty(second, firstValue)
      if (secondValue) element.style.setProperty(first, secondValue)
    }
  }, [ref, chromeTheme, resolvedMode])
}
