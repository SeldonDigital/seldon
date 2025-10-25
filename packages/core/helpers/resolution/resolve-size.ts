import { ComputeContext } from "../../compute/types"
import {
  ComputedFunction,
  EmptyValue,
  PixelValue,
  RemValue,
  SizeValue,
  Unit,
  ValueType,
  invariant,
} from "../../index"
import { Theme } from "../../themes/types"
import { modulate } from "../math/modulate"
import { getThemeOption } from "../theme/get-theme-option"
import { findInObject } from "../utils/find-in-object"

/**
 * Resolves size values to concrete PixelValue, RemValue, or EmptyValue.
 * Handles EMPTY, EXACT, COMPUTED, and THEME_ORDINAL value types.
 *
 * @param size - The size value to resolve
 * @param parentContext - The parent context for computed value resolution
 * @param theme - The theme object containing size tokens
 * @returns The resolved size value
 */
export function resolveSize({
  size,
  parentContext,
  theme,
}: {
  size: SizeValue | EmptyValue
  parentContext: ComputeContext | null
  theme: Theme
}): PixelValue | RemValue | EmptyValue {
  switch (size.type) {
    case ValueType.EMPTY:
    case ValueType.EXACT:
      return size as PixelValue | RemValue | EmptyValue
    case ValueType.COMPUTED:
      if (!parentContext) {
        throw new Error(
          `resolveSize received a COMPUTED value. This should have been computed in the compute function.`,
        )
      }

      const parentSize = findInObject(
        parentContext.properties,
        (size.value as any).input.basedOn as string,
      ) as SizeValue

      invariant(
        parentSize,
        `Property ${(size.value as any).input.basedOn as string} not found in parent properties`,
      )

      const resolvedParentSize = resolveSize({
        size: parentSize,
        parentContext,
        theme,
      })

      if (resolvedParentSize.type === ValueType.EMPTY) {
        throw new Error(
          `${(size.value as any).input.basedOn as string} is empty`,
        )
      }

      switch ((size.value as any).function) {
        case ComputedFunction.MATCH:
          return resolvedParentSize

        case ComputedFunction.AUTO_FIT:
          return {
            type: ValueType.EXACT,
            value: {
              unit: Unit.REM,
              value:
                resolvedParentSize.value.value *
                (size.value as any).input.factor,
            },
          }

        default:
          throw new Error(
            `Invalid computed value function: ${JSON.stringify(size.value)}`,
          )
      }

    case ValueType.THEME_ORDINAL:
      const themeValue = getThemeOption(size.value as string, theme)

      return {
        type: ValueType.EXACT,
        value: {
          unit: Unit.REM,
          value: modulate({
            ratio: theme.core.ratio,
            size: theme.core.size,
            step: (themeValue as { parameters: { step: number } }).parameters
              .step,
          }),
        },
      }

    default:
      throw new Error(`Invalid size type ${(size as { type: string }).type}`)
  }
}
