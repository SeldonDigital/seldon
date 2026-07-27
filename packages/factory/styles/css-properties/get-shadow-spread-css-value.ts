import { resolveShadowSpread } from "@seldon/core/helpers/resolution/resolve-shadow-spread"

import { getCssValue } from "./get-css-value"

import type { ShadowSpreadValue } from "@seldon/core"
import type { Theme } from "@seldon/core/themes/types"

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
