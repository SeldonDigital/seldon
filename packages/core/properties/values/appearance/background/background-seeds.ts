import { Unit, ValueType } from "../../../constants"
import { GradientType } from "../../effects/gradients/gradient-type"
import { ImageFit } from "../../shared/utilities/image-fit"
import { BackgroundBlendMode } from "./background-blend-mode"
import { BackgroundKind } from "./background-kind"
import { BackgroundRepeat } from "./background-repeat"
import type { BackgroundLayer } from "./index"

/** Default picture used when seeding an image background. */
const DEFAULT_BACKGROUND_IMAGE =
  "https://static.seldon.app/background-default-light.jpg"

/** None background: paints nothing. */
function noneSeed(): BackgroundLayer {
  return { kind: { type: ValueType.OPTION, value: BackgroundKind.NONE } }
}

/** Color background: swatch fill, no brightness shift, full opacity. */
function colorSeed(): BackgroundLayer {
  return {
    kind: { type: ValueType.OPTION, value: BackgroundKind.COLOR },
    color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
    brightness: { type: ValueType.EXACT, value: { value: 0, unit: Unit.PERCENT } },
    opacity: { type: ValueType.EXACT, value: { value: 100, unit: Unit.PERCENT } },
  }
}

/** Image background: default picture, cover, no-repeat, normal blend, no filter. */
function imageSeed(): BackgroundLayer {
  return {
    kind: { type: ValueType.OPTION, value: BackgroundKind.IMAGE },
    image: { type: ValueType.EXACT, value: DEFAULT_BACKGROUND_IMAGE },
    blendMode: { type: ValueType.OPTION, value: BackgroundBlendMode.NORMAL },
    opacity: { type: ValueType.EXACT, value: { value: 100, unit: Unit.PERCENT } },
    position: { type: ValueType.EMPTY, value: null },
    size: { type: ValueType.OPTION, value: ImageFit.COVER },
    repeat: { type: ValueType.OPTION, value: BackgroundRepeat.NO_REPEAT },
    filter: { type: ValueType.EMPTY, value: null },
  }
}

/**
 * Gradient background: the theme's primary gradient recipe. Every stop facet is
 * seeded (as EMPTY when it has no explicit default) so each one renders as an
 * editable row; the preset supplies the effective colors. This mirrors how the
 * color and image seeds populate all of their kind's facets.
 */
function gradientSeed(): BackgroundLayer {
  const empty = { type: ValueType.EMPTY, value: null } as const
  return {
    kind: { type: ValueType.OPTION, value: BackgroundKind.GRADIENT },
    preset: { type: ValueType.THEME_CATEGORICAL, value: "@gradient.primary" },
    gradientType: { type: ValueType.OPTION, value: GradientType.LINEAR },
    angle: empty,
    startColor: empty,
    startPosition: empty,
    startBrightness: empty,
    startOpacity: empty,
    endColor: empty,
    endPosition: empty,
    endBrightness: empty,
    endOpacity: empty,
  }
}

/** The starting facets each background kind seeds when a layer is retyped. */
export const BACKGROUND_KIND_SEEDS: Record<BackgroundKind, BackgroundLayer> = {
  [BackgroundKind.NONE]: noneSeed(),
  [BackgroundKind.COLOR]: colorSeed(),
  [BackgroundKind.IMAGE]: imageSeed(),
  [BackgroundKind.GRADIENT]: gradientSeed(),
}

/**
 * Maps a background-kind selector value to the layer it should write. Returns
 * `null` for the Default value, which the caller resets instead of seeding.
 */
export function backgroundLayerForKind(value: string): BackgroundLayer | null {
  if (value === "inherit") {
    return { kind: { type: ValueType.INHERIT, value: null } }
  }
  if ((Object.values(BackgroundKind) as string[]).includes(value)) {
    return { ...BACKGROUND_KIND_SEEDS[value as BackgroundKind] }
  }
  return null
}
