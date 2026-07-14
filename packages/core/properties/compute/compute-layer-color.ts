import chroma from "chroma-js"

import { HSLObjectToString } from "../../helpers/color/hsl-object-to-string"
import { LCHObjectToString } from "../../helpers/color/lch-object-to-string"
import { RGBObjectToString } from "../../helpers/color/rgb-object-to-string"
import { resolveValue } from "../../helpers/resolution/resolve-value"
import { isHSLObject } from "../../helpers/type-guards/color/is-hsl-object"
import { isLCHObject } from "../../helpers/type-guards/color/is-lch-object"
import { isRGBObject } from "../../helpers/type-guards/color/is-rgb-object"
import { findInObject } from "../../helpers/utils/find-in-object"
import { isHex, isHexWithoutHash } from "../../helpers/validation"
import { ValueType } from "../constants"
import type { EmptyValue } from "../values/shared/empty/empty"
import type { Hex, HexValue } from "../values/shared/exact/hex"
import type { HSL } from "../values/shared/exact/hsl"
import type { LCH } from "../values/shared/exact/lch"
import type { PercentageValue } from "../values/shared/exact/percentage"
import type { RGB } from "../values/shared/exact/rgb"
import { parseBasedOnPath } from "./parse-based-on-path"
import type { ComputeContext } from "./types"

/** Neutral white used as the opacity backdrop when no deeper surface exists. */
const NEUTRAL_WHITE: HexValue = {
  type: ValueType.EXACT,
  value: "#FFFFFF",
}

function isNonContributingLayerPercentage(value: unknown): boolean {
  if (!value || typeof value !== "object" || !("type" in value)) {
    return true
  }

  const tagged = value as { type: ValueType }
  return tagged.type === ValueType.EMPTY || tagged.type === ValueType.INHERIT
}

/** Reads a sibling `brightness`/`opacity` percentage on the anchored layer, or undefined. */
export function readAnchoredLayerPercentage(
  facetSource: Omit<ComputeContext, "theme">,
  colorBasedOn: string,
  facet: "brightness" | "opacity",
): PercentageValue | undefined {
  const layerPath = parseBasedOnPath(colorBasedOn).lookupPath
  const facetPath = layerPath.replace(/\.color$/, `.${facet}`)
  const raw = findInObject(facetSource.properties, facetPath)

  if (isNonContributingLayerPercentage(raw)) {
    return undefined
  }

  return resolveValue(raw as PercentageValue | EmptyValue)
}

/** Composites a translucent color over a backdrop, returning an opaque hex. */
export function applyLayerOpacity(
  color: HSL | LCH | RGB | Hex,
  opacityPercent: number,
  backdrop: HSL | LCH | RGB | Hex = NEUTRAL_WHITE.value,
): HexValue {
  const colorString = exactColorToChromaInput(color)
  const backdropString = exactColorToChromaInput(backdrop)
  return {
    type: ValueType.EXACT,
    value: chroma
      .mix(backdropString, colorString, opacityPercent / 100, "rgb")
      .hex() as Hex,
  }
}

function exactColorToChromaInput(color: HSL | LCH | RGB | Hex): string {
  if (typeof color === "string") {
    if (isHex(color)) return color
    if (isHexWithoutHash(color)) return `#${color}`
    return color
  }

  if (isRGBObject(color)) {
    return RGBObjectToString(color)
  }

  if (isHSLObject(color)) {
    return HSLObjectToString(color)
  }

  if (isLCHObject(color)) {
    return LCHObjectToString(color)
  }

  throw new Error("Unable to parse color for opacity")
}
