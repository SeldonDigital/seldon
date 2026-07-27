import { resolveShadowBlur } from "@seldon/core/helpers/resolution/resolve-shadow-blur"

import { getCssValue } from "./get-css-value"

import type { ShadowBlurValue } from "@seldon/core"
import type { Theme } from "@seldon/core/themes/types"

/**
 * Retrieves the CSS blur value based on the provided blur value and theme.
 *
 * @param {ShadowBlurValue} params.blur - The blur value to convert to CSS blur.
 * @param {Theme} params.theme - The theme object containing blur options.
 *
 * @returns The CSS blur value.
 */
export function getShadowBlurCSSValue({ blur, theme }: { blur: ShadowBlurValue; theme: Theme }) {
  const resolvedBlur = resolveShadowBlur({
    blur,
    theme,
  })

  return getCssValue(resolvedBlur)
}
