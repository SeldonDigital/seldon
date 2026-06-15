import {
  BackgroundBlendMode,
  BackgroundKind,
  BackgroundRepeat,
  ImageFit,
  Unit,
  ValueType,
} from "@seldon/core"

/** Default picture used when seeding an image background. */
const DEFAULT_BACKGROUND_IMAGE =
  "https://static.seldon.app/background-default-light.jpg"

/** A single background layer expressed as raw property cells. */
export type BackgroundLayerSeed = Record<string, unknown>

/** Color background: swatch fill, no brightness shift, full opacity. */
export function colorBackgroundSeed(): BackgroundLayerSeed {
  return {
    kind: { type: ValueType.OPTION, value: BackgroundKind.COLOR },
    color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
    brightness: {
      type: ValueType.EXACT,
      value: { value: 0, unit: Unit.PERCENT },
    },
    opacity: {
      type: ValueType.EXACT,
      value: { value: 100, unit: Unit.PERCENT },
    },
  }
}

/** Image background: default picture, cover, no-repeat, normal blend, no filter. */
export function imageBackgroundSeed(): BackgroundLayerSeed {
  return {
    kind: { type: ValueType.OPTION, value: BackgroundKind.IMAGE },
    image: { type: ValueType.EXACT, value: DEFAULT_BACKGROUND_IMAGE },
    blendMode: { type: ValueType.OPTION, value: BackgroundBlendMode.NORMAL },
    position: { type: ValueType.EMPTY, value: null },
    size: { type: ValueType.OPTION, value: ImageFit.COVER },
    repeat: { type: ValueType.OPTION, value: BackgroundRepeat.NO_REPEAT },
    filter: { type: ValueType.EMPTY, value: null },
  }
}

/** None background: paints nothing. */
export function noneBackgroundSeed(): BackgroundLayerSeed {
  return {
    kind: { type: ValueType.OPTION, value: BackgroundKind.NONE },
  }
}

/**
 * Maps a background-kind combo value to the layer it should write. Returns null
 * for the Default value, which the caller resets instead of seeding.
 */
export function backgroundLayerForKindValue(
  value: string,
): BackgroundLayerSeed | null {
  switch (value) {
    case BackgroundKind.COLOR:
      return colorBackgroundSeed()
    case BackgroundKind.IMAGE:
      return imageBackgroundSeed()
    case BackgroundKind.NONE:
      return noneBackgroundSeed()
    case "inherit":
      return { kind: { type: ValueType.INHERIT, value: null } }
    default:
      return null
  }
}
