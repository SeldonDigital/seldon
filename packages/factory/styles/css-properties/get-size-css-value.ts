import { ValueType } from "@seldon/core"
import { resolveSize } from "@seldon/core/helpers/resolution/resolve-size"

import { getCssValue } from "./get-css-value"
import { getThemeTokenVarReference } from "./get-theme-token-reference"

import type { StyleGenerationContext } from "../types"
import type { SizeValue } from "@seldon/core"
import type { Theme } from "@seldon/core/themes/types"

/**
 * Retrieves the CSS size value based on the provided size value and theme.
 *
 * @param {SizeValue} params.size - The size value to convert to CSS size.
 * @param {Theme} params.theme - The theme object containing size options.
 * @param {Properties} params.parentProperties - The parent properties object.
 *
 * @returns The CSS size value.
 */
export function getSizeCSSValue({
  size,
  parentContext,
  theme,
  useThemeVariableReferences,
}: {
  size: SizeValue
  parentContext: StyleGenerationContext | null
  theme: Theme
  useThemeVariableReferences?: boolean
}) {
  if (useThemeVariableReferences && size.type === ValueType.THEME_ORDINAL) {
    const reference = getThemeTokenVarReference(size.value)

    if (reference) return reference
  }

  const resolvedSize = resolveSize({
    size,
    parentContext,
    theme,
  })

  const cssValue = getCssValue(resolvedSize)

  if (typeof cssValue === "number" && cssValue !== 0) {
    throw new Error("In CSS, size can only be 0 or a string. Size is " + cssValue)
  }

  return cssValue
}
