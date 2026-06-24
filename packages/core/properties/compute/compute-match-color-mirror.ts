import { resolveValue } from "../../helpers/resolution/resolve-value"
import { isMatchColorValue } from "../../helpers/type-guards/value/is-computed-value"
import { findInObject } from "../../helpers/utils/find-in-object"
import { COLOR_SIBLING_KEYS, EMPTY_VALUE, ValueType } from "../constants"
import type { Value } from "../types/value"
import { normalizeLayerFacetPath } from "./compute-layer-color"
import { resolveBasedOnWithAnchor } from "./get-based-on-value"
import { resolveMatchColorSource } from "./resolve-match-color-source"
import type { ComputeContext } from "./types"

/** Rewrites a resolved color lookup path to its sibling brightness/opacity path, or null. */
function siblingSourcePath(
  colorLookupPath: string,
  facet: "brightness" | "opacity",
): string | null {
  if (colorLookupPath.endsWith("startColor")) {
    return colorLookupPath.replace(
      /startColor$/,
      facet === "brightness" ? "startBrightness" : "startOpacity",
    )
  }
  if (colorLookupPath.endsWith("endColor")) {
    return colorLookupPath.replace(
      /endColor$/,
      facet === "brightness" ? "endBrightness" : "endOpacity",
    )
  }
  if (colorLookupPath.endsWith(".color")) {
    return colorLookupPath.replace(/\.color$/, `.${facet}`)
  }
  return null
}

/** Reads the matched source's sibling `brightness`/`opacity`, or undefined when it contributes none. */
function readSourceSiblingFacet(
  basedOn: string,
  facet: "brightness" | "opacity",
  context: ComputeContext,
): Value | undefined {
  let facetSource: Omit<ComputeContext, "theme"> | null = null
  try {
    facetSource = resolveBasedOnWithAnchor(basedOn, context).facetSource
  } catch {
    facetSource = null
  }
  if (!facetSource) return undefined

  const colorLookupPath = normalizeLayerFacetPath(
    basedOn.replace(/^#(parent\.|self\.)?/, ""),
  )
  const facetPath = siblingSourcePath(colorLookupPath, facet)
  if (!facetPath) return undefined

  const raw = findInObject(facetSource.properties, facetPath)
  if (!raw || typeof raw !== "object" || !("type" in raw)) return undefined

  const type = (raw as { type: ValueType }).type
  if (type === ValueType.EMPTY || type === ValueType.INHERIT) return undefined

  return resolveValue(raw as Value)
}

/**
 * Overrides the sibling `brightness`/`opacity` of any color facet that resolves to Match Color,
 * mirroring the matched source layer's values. Gated by `theme.matchColor.parameters.includeBrightness`
 * and `includeOpacity`: a toggle that is off leaves that facet untouched. Mutates `resolvedFacets`.
 *
 * `inputFacets` is the pre-resolution compound/layer (it still holds the Match Color marker on the
 * color facet); `resolvedFacets` is the resolved compound/layer to override. The mirrored source is
 * the Match Color surface from {@link resolveMatchColorSource}.
 */
export function applyMatchColorMirror(
  inputFacets: Record<string, unknown>,
  resolvedFacets: Record<string, Value>,
  context: ComputeContext,
): void {
  const { includeBrightness, includeOpacity } =
    context.theme.matchColor.parameters
  if (!includeBrightness && !includeOpacity) return

  for (const [colorKey, siblingKeys] of Object.entries(COLOR_SIBLING_KEYS)) {
    const colorValue = inputFacets[colorKey]
    if (!isMatchColorValue(colorValue)) continue

    const basedOn = resolveMatchColorSource()

    // Only mirror a sibling that the container actually exposes. A component that
    // omits `brightness`/`opacity` has no facet slot to write, so this is a no-op
    // rather than injecting a property the schema never declared.
    if (includeBrightness && siblingKeys.brightness in inputFacets) {
      resolvedFacets[siblingKeys.brightness] =
        readSourceSiblingFacet(basedOn, "brightness", context) ?? EMPTY_VALUE
    }
    if (includeOpacity && siblingKeys.opacity in inputFacets) {
      resolvedFacets[siblingKeys.opacity] =
        readSourceSiblingFacet(basedOn, "opacity", context) ?? EMPTY_VALUE
    }
  }
}
