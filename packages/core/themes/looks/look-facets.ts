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
import type { ThemeTokenSchema, ThemeTokenSchemaSupport } from "../types/schema"
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
  icon?: string
}

/** A facet with inline control metadata and no property bridge. */
export interface InlineLookFacet {
  facet: string
  label: string
  valueType: ThemeTokenSchemaSupport
  controlType: LookFacetControlType
  icon?: string
}

export type LookFacetEntry = BridgedLookFacet | InlineLookFacet

/** Constrains authored entries so `facet` must be a real key of the parameters type. */
type LookFacetEntryFor<P> =
  | {
      facet: Extract<keyof P, string>
      label: string
      propertyKey: PropertyName
      icon?: string
    }
  | {
      facet: Extract<keyof P, string>
      label: string
      valueType: ThemeTokenSchemaSupport
      controlType: LookFacetControlType
      icon?: string
    }

const GRADIENT_LOOK_FACETS = [
  {
    facet: "gradientType",
    label: "Type",
    propertyKey: "gradientType",
    icon: "seldon-gradient",
  },
  {
    facet: "angle",
    label: "Angle",
    propertyKey: "gradientAngle",
    icon: "seldon-rotation",
  },
  {
    facet: "startPosition",
    label: "Start Position",
    propertyKey: "gradientStartPosition",
    icon: "material-lineStartCircle",
  },
  {
    facet: "startColor",
    label: "Start Color",
    propertyKey: "gradientStartColor",
  },
  {
    facet: "startBrightness",
    label: "Start Brightness",
    propertyKey: "gradientStartBrightness",
    icon: "seldon-brightness",
  },
  {
    facet: "startOpacity",
    label: "Start Opacity",
    propertyKey: "gradientStartOpacity",
    icon: "seldon-opacity",
  },
  {
    facet: "endPosition",
    label: "End Position",
    propertyKey: "gradientEndPosition",
    icon: "material-lineEndCircle",
  },
  { facet: "endColor", label: "End Color", propertyKey: "gradientEndColor" },
  {
    facet: "endBrightness",
    label: "End Brightness",
    propertyKey: "gradientEndBrightness",
    icon: "seldon-brightness",
  },
  {
    facet: "endOpacity",
    label: "End Opacity",
    propertyKey: "gradientEndOpacity",
    icon: "seldon-opacity",
  },
] as const satisfies readonly LookFacetEntryFor<GradientParameters>[]

const SHADOW_LOOK_FACETS = [
  { facet: "color", label: "Color", propertyKey: "shadowColor" },
  {
    facet: "brightness",
    label: "Brightness",
    propertyKey: "shadowBrightness",
    icon: "seldon-brightness",
  },
  {
    facet: "opacity",
    label: "Opacity",
    propertyKey: "shadowOpacity",
    icon: "seldon-opacity",
  },
  {
    facet: "offsetX",
    label: "Offset X",
    propertyKey: "shadowOffsetX",
    icon: "material-width",
  },
  {
    facet: "offsetY",
    label: "Offset Y",
    propertyKey: "shadowOffsetY",
    icon: "material-height",
  },
  {
    facet: "blur",
    label: "Blur",
    propertyKey: "shadowBlur",
    icon: "material-blurOn",
  },
  {
    facet: "spread",
    label: "Spread",
    propertyKey: "shadowSpread",
    icon: "material-deblur",
  },
] as const satisfies readonly LookFacetEntryFor<ShadowParameters>[]

const BORDER_LOOK_FACETS = [
  {
    facet: "width",
    label: "Width",
    propertyKey: "borderWidth",
    icon: "material-lineWeight",
  },
  {
    facet: "style",
    label: "Style",
    propertyKey: "borderStyle",
    icon: "material-style",
  },
  { facet: "color", label: "Color", propertyKey: "borderColor" },
  {
    facet: "brightness",
    label: "Brightness",
    propertyKey: "borderBrightness",
    icon: "seldon-brightness",
  },
  {
    facet: "opacity",
    label: "Opacity",
    propertyKey: "borderOpacity",
    icon: "seldon-opacity",
  },
] as const satisfies readonly LookFacetEntryFor<BorderParameters>[]

const FONT_LOOK_FACETS = [
  {
    facet: "family",
    label: "Family",
    propertyKey: "fontFamily",
    icon: "seldon-fontFamily",
  },
  {
    facet: "style",
    label: "Style",
    propertyKey: "fontStyle",
    icon: "material-style",
  },
  {
    facet: "weight",
    label: "Weight",
    propertyKey: "fontWeight",
    icon: "seldon-fontWeight",
  },
  {
    facet: "size",
    label: "Size",
    propertyKey: "fontSize",
    icon: "seldon-fontSize",
  },
  {
    facet: "lineHeight",
    label: "Line Height",
    propertyKey: "fontLineHeight",
    icon: "seldon-fontLineHeight",
  },
  {
    facet: "textCase",
    label: "Text Case",
    propertyKey: "fontTextCase",
    icon: "material-matchCase",
  },
  {
    facet: "letterSpacing",
    label: "Letter Spacing",
    propertyKey: "fontLetterSpacing",
    icon: "seldon-fontLetterSpacing",
  },
] as const satisfies readonly LookFacetEntryFor<FontParameters>[]

const SCROLLBAR_LOOK_FACETS = [
  {
    facet: "trackSize",
    label: "Track Size",
    valueType: "text",
    controlType: "text",
  },
  {
    facet: "trackColor",
    label: "Track Color",
    valueType: "color",
    controlType: "color",
  },
  {
    facet: "thumbColor",
    label: "Thumb Color",
    valueType: "color",
    controlType: "color",
  },
  {
    facet: "thumbHoverColor",
    label: "Thumb Hover Color",
    valueType: "color",
    controlType: "color",
  },
  {
    facet: "rounded",
    label: "Rounded",
    valueType: "boolean",
    controlType: "boolean",
  },
] as const satisfies readonly LookFacetEntryFor<ScrollbarParameters>[]

/** Facet lists keyed by look section. */
export const LOOK_FACETS = {
  shadow: SHADOW_LOOK_FACETS,
  gradient: GRADIENT_LOOK_FACETS,
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
void _assertGradient
void _assertShadow
void _assertBorder
void _assertFont
void _assertScrollbar
