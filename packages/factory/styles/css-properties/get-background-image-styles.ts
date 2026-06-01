import {
  BackgroundPositionValue,
  BackgroundSizeValue,
  Properties,
  SingleBackgroundSizeValue,
} from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { Theme } from "@seldon/core/themes/types"
import type { BackgroundLayer } from "@seldon/core/properties/values/appearance/background"
import { getBackgroundPositionStyle } from "./get-background-position-style"
import { getBackgroundSizeStyle } from "./get-background-size-style"
import { getLayeredPaintLayers } from "./get-layered-paint-layer"
import { CSSObject } from "./types"

const DEFAULT_POSITION = "center"
const DEFAULT_SIZE = "cover"
const DEFAULT_REPEAT = "no-repeat"

type ResolvedImageLayer = {
  image: string
  position: string
  size: string
  repeat: string
}

export function getBackgroundImageStyles({
  properties,
  theme,
}: {
  properties: Properties
  theme: Theme
}): CSSObject {
  const styles: CSSObject = {}
  const layers = getLayeredPaintLayers(properties, "background")

  const resolved = layers
    .map((layer) => resolveImageLayer(layer, theme))
    .filter((layer): layer is ResolvedImageLayer => layer !== undefined)

  if (resolved.length === 0) return styles

  styles.backgroundImage = resolved.map((layer) => layer.image).join(", ")
  styles.backgroundPosition = resolved.map((layer) => layer.position).join(", ")
  styles.backgroundSize = resolved.map((layer) => layer.size).join(", ")
  styles.backgroundRepeat = resolved.map((layer) => layer.repeat).join(", ")

  return styles
}

/**
 * Resolves a single background layer's image and its image-friendly position,
 * size, and repeat, falling back to theme preset values. Layers without an
 * image are skipped so the bottom color layer never adds a phantom entry.
 */
function resolveImageLayer(
  layer: BackgroundLayer,
  theme: Theme,
): ResolvedImageLayer | undefined {
  const preset = resolveValue(layer.preset)
  const themeBackground = preset
    ? getThemeOption(preset.value, theme)
    : undefined

  const image =
    resolveValue(layer.image) ?? resolveValue(themeBackground?.parameters.image)
  if (!image) return undefined

  const repeat =
    resolveValue(layer.repeat) ??
    resolveValue(themeBackground?.parameters.repeat)
  const position =
    resolveValue(layer.position) ??
    resolveValue(themeBackground?.parameters.position)
  const size =
    resolveValue(layer.size) ?? resolveValue(themeBackground?.parameters.size)

  return {
    image: `url(${image.value})`,
    repeat: repeat ? repeat.value : DEFAULT_REPEAT,
    position: position ? formatPosition(position) : DEFAULT_POSITION,
    size: size ? formatSize(size) : DEFAULT_SIZE,
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
  return getBackgroundSizeStyle(size as SingleBackgroundSizeValue) || DEFAULT_SIZE
}
