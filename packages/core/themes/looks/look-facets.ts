/**
 * Single source of truth for the facets every theme look exposes.
 *
 * Each look section lists its facets in display order. A facet either bridges to
 * a property schema via `propertyKey` (label, control, options, and unit derive
 * from `PROPERTY_SCHEMAS`) or carries inline control metadata when no property
 * bridge exists (scrollbar). The descriptor drives schema generation, value
 * reading, and editing so the three stay in sync. Each list is typed against
 * `keyof <Parameters>`, so omitting a facet fails the build.
 */
import type { PropertyName } from "../../properties/schemas/data/property-schemas"
import type {
  ThemeTokenSchema,
  ThemeTokenSchemaSupport,
} from "../types/schema"
import type { BackgroundParameters } from "../values/appearance/background"
import type { BorderParameters } from "../values/appearance/border"
import type { GradientParameters } from "../values/effects/gradient"
import type { ScrollbarParameters } from "../values/effects/scrollbar"
import type { ShadowParameters } from "../values/effects/shadow"
import type { FontParameters } from "../values/typography/font"

export type LookFacetControlType = NonNullable<ThemeTokenSchema["controlType"]>

/** A facet that derives its control and options from a property schema. */
export interface BridgedLookFacet {
  facet: string
  label: string
  propertyKey: PropertyName
}

/** A facet with inline control metadata and no property bridge. */
export interface InlineLookFacet {
  facet: string
  label: string
  valueType: ThemeTokenSchemaSupport
  controlType: LookFacetControlType
}

export type LookFacetEntry = BridgedLookFacet | InlineLookFacet

/** Constrains authored entries so `facet` must be a real key of the parameters type. */
type LookFacetEntryFor<P> =
  | { facet: Extract<keyof P, string>; label: string; propertyKey: PropertyName }
  | {
      facet: Extract<keyof P, string>
      label: string
      valueType: ThemeTokenSchemaSupport
      controlType: LookFacetControlType
    }

const BACKGROUND_LOOK_FACETS = [
  { facet: "image", label: "Image", propertyKey: "backgroundImage" },
  { facet: "position", label: "Position", propertyKey: "backgroundPosition" },
  { facet: "size", label: "Size", propertyKey: "backgroundSize" },
  { facet: "repeat", label: "Repeat", propertyKey: "backgroundRepeat" },
  { facet: "color", label: "Color", propertyKey: "backgroundColor" },
  { facet: "blendMode", label: "Blend Mode", propertyKey: "backgroundBlendMode" },
  { facet: "filter", label: "Filter", propertyKey: "backgroundFilter" },
  { facet: "brightness", label: "Brightness", propertyKey: "backgroundBrightness" },
  { facet: "opacity", label: "Opacity", propertyKey: "backgroundOpacity" },
] as const satisfies readonly LookFacetEntryFor<BackgroundParameters>[]

const GRADIENT_LOOK_FACETS = [
  { facet: "gradientType", label: "Type", propertyKey: "gradientType" },
  { facet: "angle", label: "Angle", propertyKey: "gradientAngle" },
  { facet: "startColor", label: "Start Color", propertyKey: "gradientStartColor" },
  { facet: "startOpacity", label: "Start Opacity", propertyKey: "gradientStartOpacity" },
  { facet: "startBrightness", label: "Start Brightness", propertyKey: "gradientStartBrightness" },
  { facet: "startPosition", label: "Start Position", propertyKey: "gradientStartPosition" },
  { facet: "endColor", label: "End Color", propertyKey: "gradientEndColor" },
  { facet: "endOpacity", label: "End Opacity", propertyKey: "gradientEndOpacity" },
  { facet: "endBrightness", label: "End Brightness", propertyKey: "gradientEndBrightness" },
  { facet: "endPosition", label: "End Position", propertyKey: "gradientEndPosition" },
] as const satisfies readonly LookFacetEntryFor<GradientParameters>[]

const SHADOW_LOOK_FACETS = [
  { facet: "offsetX", label: "Offset X", propertyKey: "shadowOffsetX" },
  { facet: "offsetY", label: "Offset Y", propertyKey: "shadowOffsetY" },
  { facet: "blur", label: "Blur", propertyKey: "shadowBlur" },
  { facet: "spread", label: "Spread", propertyKey: "shadowSpread" },
  { facet: "color", label: "Color", propertyKey: "shadowColor" },
  { facet: "brightness", label: "Brightness", propertyKey: "shadowBrightness" },
  { facet: "opacity", label: "Opacity", propertyKey: "shadowOpacity" },
] as const satisfies readonly LookFacetEntryFor<ShadowParameters>[]

const BORDER_LOOK_FACETS = [
  { facet: "width", label: "Width", propertyKey: "borderWidth" },
  { facet: "style", label: "Style", propertyKey: "borderStyle" },
  { facet: "color", label: "Color", propertyKey: "borderColor" },
  { facet: "brightness", label: "Brightness", propertyKey: "borderBrightness" },
  { facet: "opacity", label: "Opacity", propertyKey: "borderOpacity" },
] as const satisfies readonly LookFacetEntryFor<BorderParameters>[]

const FONT_LOOK_FACETS = [
  { facet: "family", label: "Family", propertyKey: "fontFamily" },
  { facet: "size", label: "Size", propertyKey: "fontSize" },
  { facet: "weight", label: "Weight", propertyKey: "fontWeight" },
  { facet: "lineHeight", label: "Line Height", propertyKey: "fontLineHeight" },
  { facet: "style", label: "Style", propertyKey: "fontStyle" },
  { facet: "textCase", label: "Text Case", propertyKey: "fontTextCase" },
  { facet: "letterSpacing", label: "Letter Spacing", propertyKey: "fontLetterSpacing" },
] as const satisfies readonly LookFacetEntryFor<FontParameters>[]

const SCROLLBAR_LOOK_FACETS = [
  { facet: "trackSize", label: "Track Size", valueType: "text", controlType: "text" },
  { facet: "trackColor", label: "Track Color", valueType: "color", controlType: "color" },
  { facet: "thumbColor", label: "Thumb Color", valueType: "color", controlType: "color" },
  { facet: "thumbHoverColor", label: "Thumb Hover Color", valueType: "color", controlType: "color" },
  { facet: "rounded", label: "Rounded", valueType: "boolean", controlType: "boolean" },
] as const satisfies readonly LookFacetEntryFor<ScrollbarParameters>[]

/** Facet lists keyed by look section. */
export const LOOK_FACETS = {
  shadow: SHADOW_LOOK_FACETS,
  gradient: GRADIENT_LOOK_FACETS,
  background: BACKGROUND_LOOK_FACETS,
  border: BORDER_LOOK_FACETS,
  font: FONT_LOOK_FACETS,
  scrollbar: SCROLLBAR_LOOK_FACETS,
} as const

export type LookSection = keyof typeof LOOK_FACETS

export function isLookSection(section: string): section is LookSection {
  return section in LOOK_FACETS
}

export function isBridgedLookFacet(
  facet: LookFacetEntry,
): facet is BridgedLookFacet {
  return "propertyKey" in facet
}

/**
 * Compile-time guarantee that every facet of each parameters type is described.
 * If a parameters type gains a facet, the matching line resolves to the missing
 * key string instead of `true`, which fails the build.
 */
type MissingFacets<P, Entries extends readonly { facet: string }[]> = Exclude<
  Extract<keyof P, string>,
  Entries[number]["facet"]
>
type AssertComplete<M> = [M] extends [never] ? true : M

const _assertBackground: AssertComplete<
  MissingFacets<BackgroundParameters, typeof BACKGROUND_LOOK_FACETS>
> = true
const _assertGradient: AssertComplete<
  MissingFacets<GradientParameters, typeof GRADIENT_LOOK_FACETS>
> = true
const _assertShadow: AssertComplete<
  MissingFacets<ShadowParameters, typeof SHADOW_LOOK_FACETS>
> = true
const _assertBorder: AssertComplete<
  MissingFacets<BorderParameters, typeof BORDER_LOOK_FACETS>
> = true
const _assertFont: AssertComplete<
  MissingFacets<FontParameters, typeof FONT_LOOK_FACETS>
> = true
const _assertScrollbar: AssertComplete<
  MissingFacets<ScrollbarParameters, typeof SCROLLBAR_LOOK_FACETS>
> = true
void _assertBackground
void _assertGradient
void _assertShadow
void _assertBorder
void _assertFont
void _assertScrollbar
