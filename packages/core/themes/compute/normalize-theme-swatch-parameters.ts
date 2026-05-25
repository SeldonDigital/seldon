import chroma from "chroma-js"
import { isHSLObject } from "../../helpers/type-guards/color/is-hsl-object"
import { isLCHObject } from "../../helpers/type-guards/color/is-lch-object"
import { isRGBObject } from "../../helpers/type-guards/color/is-rgb-object"
import { Colorspace } from "../constants/colorspace"
import type { ThemeSwatchParameters } from "../values/shared/palette/theme-swatch-parameters"

const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i

function asRecord(value: unknown): Record<string, unknown> {
  if (value === null || typeof value !== "object") {
    throw new Error(
      `Theme swatch parameters must be an object, got ${typeof value}`,
    )
  }
  return value as Record<string, unknown>
}

/**
 * Validates and returns canonical `{ colorspace, value }` parameters for a `TokenType.SWATCH`
 * cell. Throws on missing or mismatched payloads. Mirrors the EXACT-token validator pattern.
 */
export function normalizeThemeSwatchParameters(
  value: unknown,
): ThemeSwatchParameters {
  const record = asRecord(value)
  const colorspace = record.colorspace
  const inner = record.value

  switch (colorspace) {
    case Colorspace.HSL: {
      if (!isHSLObject(inner)) {
        throw new Error(
          `Swatch colorspace "hsl" requires { hue, saturation, lightness }`,
        )
      }
      return {
        colorspace: Colorspace.HSL,
        value: {
          hue: inner.hue,
          saturation: inner.saturation,
          lightness: inner.lightness,
        },
      }
    }
    case Colorspace.RGB: {
      if (!isRGBObject(inner)) {
        throw new Error(
          `Swatch colorspace "rgb" requires { red, green, blue }`,
        )
      }
      return {
        colorspace: Colorspace.RGB,
        value: {
          red: inner.red,
          green: inner.green,
          blue: inner.blue,
        },
      }
    }
    case Colorspace.LCH: {
      if (!isLCHObject(inner)) {
        throw new Error(
          `Swatch colorspace "lch" requires { lightness, chroma, hue }`,
        )
      }
      return {
        colorspace: Colorspace.LCH,
        value: {
          lightness: inner.lightness,
          chroma: inner.chroma,
          hue: inner.hue,
        },
      }
    }
    case Colorspace.HEX: {
      if (typeof inner !== "string" || !HEX_RE.test(inner)) {
        throw new Error(
          `Swatch colorspace "hex" requires a string like "#aabbcc"`,
        )
      }
      if (!chroma.valid(inner)) {
        throw new Error(`Invalid hex color: ${inner}`)
      }
      return { colorspace: Colorspace.HEX, value: inner }
    }
    case Colorspace.NAME: {
      if (typeof inner !== "string" || inner.length === 0) {
        throw new Error(
          `Swatch colorspace "name" requires a non-empty CSS color name`,
        )
      }
      if (inner.startsWith("#")) {
        throw new Error(
          `Swatch colorspace "name" must not be a hex string; use colorspace "hex" instead`,
        )
      }
      if (!chroma.valid(inner)) {
        throw new Error(`Unknown CSS color name: ${inner}`)
      }
      return { colorspace: Colorspace.NAME, value: inner }
    }
    default:
      throw new Error(
        `Unknown swatch colorspace: ${JSON.stringify(colorspace)}`,
      )
  }
}
