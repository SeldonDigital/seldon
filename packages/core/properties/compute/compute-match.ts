import { convertAndApplyBrightness } from "../../helpers/color/apply-brightness"
import { resolveColor } from "../../helpers/resolution/resolve-color"
import { resolveValue } from "../../helpers/resolution/resolve-value"
import { EMPTY_VALUE, ValueType } from "../constants"
import type { ColorValue } from "../values/appearance/color"
import type { Hex, HexValue } from "../values/shared/exact/hex"
import type { HSL } from "../values/shared/exact/hsl"
import type { LCH } from "../values/shared/exact/lch"
import type { RGB } from "../values/shared/exact/rgb"
import type { ComputedMatchValue } from "../values/shared/computed/match"
import {
  applyLayerOpacity,
  readAnchoredLayerPercentage,
} from "./compute-layer-color"
import { getBasedOnValue, resolveBasedOnWithAnchor } from "./get-based-on-value"
import { ComputeContext } from "./types"

/** Editor label for `ComputedFunction.MATCH`. */
export const MATCH_DISPLAY_NAME = "Match"

/**
 * Replaces this computed slot with the primitive value at `basedOn`. Missing `basedOn` becomes
 * `#parent.buttonSize`. Degrades to `EMPTY` when the `basedOn` path cannot be resolved or still
 * resolves to a `COMPUTED` value, so an unresolved match never breaks compute or CSS generation.
 *
 * When `theme.matchColor.parameters.includeBrightness` or `includeOpacity` is on and `basedOn`
 * targets a background layer color, the sibling `brightness`/`opacity` of that layer are baked
 * into the returned color so the match reflects the rendered surface rather than its raw token.
 *
 * @param value - Stored computed match value
 * @param context - Theme and contexts for `getBasedOnValue`
 * @returns The value at the `basedOn` path, or `EMPTY` when it cannot be resolved
 */
export function computeMatch(
  value: ComputedMatchValue,
  context: ComputeContext,
) {
  const basedOn = value.value.input.basedOn || "#parent.buttonSize"

  const valueWithDefaults = {
    ...value,
    value: {
      ...value.value,
      input: { basedOn },
    },
  }

  let basedOnValue
  try {
    basedOnValue = getBasedOnValue(valueWithDefaults, context)
  } catch {
    return EMPTY_VALUE
  }

  if (basedOnValue.type === ValueType.COMPUTED) {
    return EMPTY_VALUE
  }

  const { includeBrightness, includeOpacity } =
    context.theme.matchColor.parameters

  if ((includeBrightness || includeOpacity) && basedOn.endsWith(".color")) {
    const baked = copyLayerFacets(
      basedOnValue as ColorValue,
      basedOn,
      context,
      includeBrightness,
      includeOpacity,
    )
    if (baked) return baked
  }

  return basedOnValue
}

/**
 * Bakes the anchored layer's `brightness` and/or `opacity` into the matched color. Returns an
 * `EXACT` color, or `undefined` when the color cannot be resolved (keep the raw match in that case).
 */
function copyLayerFacets(
  matchedColor: ColorValue,
  basedOn: string,
  context: ComputeContext,
  includeBrightness: boolean,
  includeOpacity: boolean,
): HexValue | { type: ValueType.EXACT; value: unknown } | undefined {
  let facetSource: Omit<ComputeContext, "theme"> | null = null
  try {
    facetSource = resolveBasedOnWithAnchor(basedOn, context).facetSource
  } catch {
    facetSource = null
  }
  if (!facetSource) return undefined

  const resolved = resolveValue(
    resolveColor({ color: matchedColor, theme: context.theme }),
  )
  if (!resolved || resolved.value === "transparent") return undefined

  let color: { type: ValueType.EXACT; value: unknown } = resolved

  if (includeBrightness) {
    const brightness = readAnchoredLayerPercentage(
      facetSource,
      basedOn,
      "brightness",
    )
    if (brightness) {
      color = {
        type: ValueType.EXACT,
        value: convertAndApplyBrightness(
          color.value as Hex,
          brightness.value.value,
        ),
      }
    }
  }

  if (includeOpacity) {
    const opacity = readAnchoredLayerPercentage(facetSource, basedOn, "opacity")
    if (opacity) {
      color = applyLayerOpacity(
        color.value as HSL | LCH | RGB | Hex,
        opacity.value.value,
      )
    }
  }

  return color
}
