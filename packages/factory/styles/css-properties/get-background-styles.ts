import {
  BackgroundPositionValue,
  BackgroundSizeValue,
  SingleBackgroundSizeValue,
} from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import type { BackgroundLayer } from "@seldon/core/properties/values/appearance/background"
import { BackgroundKind } from "@seldon/core/properties/values/appearance/background/background-kind"
import { Theme } from "@seldon/core/themes/types"

import { StyleGenerationContext } from "../types"
import { getBackgroundPositionStyle } from "./get-background-position-style"
import { getBackgroundSizeStyle } from "./get-background-size-style"
import { getLayeredPaintColor } from "./get-layered-paint-color"
import { getLayeredPaintLayers } from "./get-layered-paint-layer"
import { resolveGradientLayer } from "./resolve-gradient-layer"
import { CSSObject } from "./types"

const DEFAULT_POSITION = "center"
const DEFAULT_SIZE = "cover"
const DEFAULT_REPEAT = "no-repeat"
const DEFAULT_BLEND = "normal"

/** One entry in the CSS `background-image` list, with its parallel facets. */
type PaintEntry = {
  image: string
  position: string
  size: string
  repeat: string
  blend: string
}

/**
 * Composes a node's typed background layer stack into CSS. Each layer is one of
 * four kinds:
 *
 * - `none` paints nothing.
 * - `color` paints a solid fill. The back-most color becomes the single
 *   `background-color`. A color stacked above another layer becomes a flat
 *   `linear-gradient` entry, since CSS allows only one `background-color`.
 * - `image` paints a `url(...)` entry with its own position, size, repeat, and
 *   blend mode.
 * - `gradient` paints a `linear/radial-gradient(...)` entry resolved from its
 *   theme recipe and stop facets.
 *
 * The image `filter` and `opacity` facets are intentionally not emitted. CSS
 * has no per-layer background filter or image opacity, so they apply only on
 * platforms that render layers natively (iOS, Android).
 *
 * When the node has text content and any gradient layer, the gradient clips to
 * the text (`background-clip: text` with transparent color).
 */
export function getBackgroundStyles(
  context: StyleGenerationContext,
): CSSObject {
  const { properties, theme, useThemeVariableReferences, themeSlug } = context
  const layers = getLayeredPaintLayers(properties, "background")

  const paint: PaintEntry[] = []
  let backgroundColor: string | undefined
  let hasGradient = false

  layers.forEach((layer, index) => {
    const kind = resolveBackgroundKind(layer)

    if (kind === BackgroundKind.COLOR) {
      const color = resolveColorLayer(layer, context)
      if (!color) return
      // The back-most paint can use the single `background-color` slot. A color
      // above any other paint must stack as a flat gradient instead.
      if (index === 0 && paint.length === 0 && backgroundColor === undefined) {
        backgroundColor = color
      } else {
        paint.push({
          image: `linear-gradient(${color}, ${color})`,
          position: "0% 0%",
          size: "auto",
          repeat: "repeat",
          blend: DEFAULT_BLEND,
        })
      }
      return
    }

    if (kind === BackgroundKind.IMAGE) {
      const entry = resolveImageLayer(layer, theme)
      if (entry) paint.push(entry)
      return
    }

    if (kind === BackgroundKind.GRADIENT) {
      const gradient = resolveGradientLayer(
        layer,
        theme,
        useThemeVariableReferences,
        themeSlug,
      )
      if (!gradient) return
      hasGradient = true
      paint.push({
        image: gradient,
        position: "0% 0%",
        size: "auto",
        repeat: "no-repeat",
        blend: DEFAULT_BLEND,
      })
    }
  })

  const styles: CSSObject = {}
  if (backgroundColor) styles.backgroundColor = backgroundColor

  if (paint.length > 0) {
    // Index 0 is the bottom layer. CSS paints the first list entry on top, so
    // reverse to keep the bottom layer at the back.
    const ordered = [...paint].reverse()
    styles.backgroundImage = ordered.map((entry) => entry.image).join(", ")
    styles.backgroundPosition = ordered
      .map((entry) => entry.position)
      .join(", ")
    styles.backgroundSize = ordered.map((entry) => entry.size).join(", ")
    styles.backgroundRepeat = ordered.map((entry) => entry.repeat).join(", ")
    if (ordered.some((entry) => entry.blend !== DEFAULT_BLEND)) {
      styles.backgroundBlendMode = ordered
        .map((entry) => entry.blend)
        .join(", ")
    }
  }

  // A gradient over text content clips to the glyphs instead of the box.
  if (hasGradient && properties.content) {
    styles.color = "transparent"
    styles.backgroundClip = "text"
  }

  return styles
}

/** Reads the layer kind, inferring it from facets when the kind is unset. */
function resolveBackgroundKind(layer: BackgroundLayer): BackgroundKind {
  const kind = resolveValue(layer.kind)
  if (kind && typeof kind.value === "string") {
    if (kind.value === BackgroundKind.COLOR) return BackgroundKind.COLOR
    if (kind.value === BackgroundKind.IMAGE) return BackgroundKind.IMAGE
    if (kind.value === BackgroundKind.GRADIENT) return BackgroundKind.GRADIENT
    if (kind.value === BackgroundKind.NONE) return BackgroundKind.NONE
  }
  if (resolveValue(layer.image)) return BackgroundKind.IMAGE
  if (resolveValue(layer.preset) || resolveValue(layer.startColor))
    return BackgroundKind.GRADIENT
  if (resolveValue(layer.color)) return BackgroundKind.COLOR
  return BackgroundKind.NONE
}

/** Resolves a color layer to a CSS color string, or undefined when unset. */
function resolveColorLayer(
  layer: BackgroundLayer,
  { theme, useThemeVariableReferences, themeSlug }: StyleGenerationContext,
): string | undefined {
  const color = resolveValue(layer.color)
  if (!color) return undefined
  return getLayeredPaintColor({
    color,
    brightness: resolveValue(layer.brightness),
    opacity: resolveValue(layer.opacity),
    theme,
    useThemeVariableReferences,
    themeSlug,
  })
}

/** Resolves an image layer to a paint entry, or undefined when it has no image. */
function resolveImageLayer(
  layer: BackgroundLayer,
  _theme: Theme,
): PaintEntry | undefined {
  const image = resolveValue(layer.image)
  if (!image) return undefined

  const repeat = resolveValue(layer.repeat)
  const position = resolveValue(layer.position)
  const size = resolveValue(layer.size)
  const blendMode = resolveValue(layer.blendMode)

  return {
    image: `url(${image.value})`,
    repeat:
      repeat && typeof repeat.value === "string"
        ? repeat.value
        : DEFAULT_REPEAT,
    position: position ? formatPosition(position) : DEFAULT_POSITION,
    size: size ? formatSize(size) : DEFAULT_SIZE,
    blend:
      blendMode && typeof blendMode.value === "string"
        ? blendMode.value
        : DEFAULT_BLEND,
  }
}

function formatPosition(position: BackgroundPositionValue): string {
  return getBackgroundPositionStyle(position) || DEFAULT_POSITION
}

function formatSize(size: BackgroundSizeValue): string {
  if (
    !!size.value &&
    typeof size.value === "object" &&
    "x" in size.value &&
    "y" in size.value
  ) {
    const { x, y } = size.value
    return `${x.value}${x.unit} ${y.value}${y.unit}`
  }
  return (
    getBackgroundSizeStyle(size as SingleBackgroundSizeValue) || DEFAULT_SIZE
  )
}
