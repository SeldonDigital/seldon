import { ShadowSpreadValue } from "@seldon/core"
import { resolveShadowSpread } from "@seldon/core/helpers/resolution/resolve-shadow-spread"
import { Theme } from "@seldon/core/themes/types"
import { getCssValue } from "./get-css-value"

/**
 * Retrieves the CSS spread value based on the provided spread value and theme.
 *
 * @param {ShadowSpreadValue} params.spread - The spread value to convert to CSS spread.
 * @param {Theme} params.theme - The theme object containing spread options.
 *
 * @returns The CSS spread value.
 */
export function getShadowSpreadCSSValue({
  spread,
  theme,
}: {
  spread: ShadowSpreadValue
  theme: Theme
}) {
  const resolvedSpread = resolveShadowSpread({
    spread,
    theme,
  })

  return getCssValue(resolvedSpread)
}
