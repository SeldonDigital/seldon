/**
 * Facets for every group in the theme "Computed" section.
 *
 * Each group renders a parent disclosure row followed by one facet sub-row,
 * mirroring how look sections render in {@link LOOK_FACETS}. Every facet carries
 * inline control metadata (no property-schema bridge) and optional `options`,
 * `unit`, and `icon`. The descriptor drives schema generation and value reading
 * so the two stay in sync. Each list is typed against `keyof <Parameters>`, so
 * omitting a facet fails the build.
 */
import { Harmony, Ratio } from "../../constants"
import type {
  ThemeTokenSchema,
  ThemeTokenSchemaSupport,
} from "../../types/schema"
import type {
  AutoFitParameters,
  ColorHarmonyParameters,
  ComputedModulationParameters,
  FontFamilyGroupParameters,
  HighContrastParameters,
  MatchColorParameters,
  OpticalPaddingParameters,
} from "../../values"

type ComputedFacetControlType = NonNullable<ThemeTokenSchema["controlType"]>

/** Inline-controlled facet on a computed group. */
export interface ComputedGroupFacet {
  facet: string
  label: string
  valueType: ThemeTokenSchemaSupport
  controlType: ComputedFacetControlType
  options?: Array<{ label: string; value: string | number }>
  unit?: ThemeTokenSchema["unit"]
  /** Icon id authored on the facet; read by the icon registry and theme sidebar. */
  icon?: string
}

/** Constrains authored entries so `facet` must be a real key of the parameters type. */
type ComputedGroupFacetFor<P> = ComputedGroupFacet & {
  facet: Extract<keyof P, string>
}

const RATIO_OPTIONS = Object.entries(Ratio)
  .filter(([key]) => !key.match(/^\d/))
  .map(([name, value]) => ({
    label: name.replace(/([A-Z])/g, " $1").trim(),
    value: String(value),
  }))
  .filter(
    (opt, index, arr) => arr.findIndex((o) => o.value === opt.value) === index,
  )

const HARMONY_OPTIONS = [
  { label: "Monochromatic", value: String(Harmony.Monochromatic) },
  { label: "Complementary", value: String(Harmony.Complementary) },
  { label: "Split Complementary", value: String(Harmony.SplitComplementary) },
  { label: "Triadic", value: String(Harmony.Triadic) },
  { label: "Analogous", value: String(Harmony.Analogous) },
  { label: "Square", value: String(Harmony.Square) },
]

const MODULATION_FACETS = [
  {
    facet: "ratio",
    label: "Ratio",
    valueType: "enum",
    controlType: "combo",
    options: RATIO_OPTIONS,
    icon: "material-piano",
  },
  {
    facet: "baseFontSize",
    label: "Base Font Size",
    valueType: "number",
    controlType: "number",
    unit: { type: "px", min: 8, max: 32, step: 1 },
    icon: "material-textFormat",
  },
  {
    facet: "baseSize",
    label: "Base Size",
    valueType: "number",
    controlType: "number",
    unit: { type: "none", min: 0.5, max: 10, step: 0.1 },
    icon: "material-resize",
  },
] as const satisfies readonly ComputedGroupFacetFor<ComputedModulationParameters>[]

const COLOR_HARMONY_FACETS = [
  {
    facet: "baseColor",
    label: "Base Color",
    valueType: "color",
    controlType: "color",
  },
  {
    facet: "harmony",
    label: "Harmony",
    valueType: "enum",
    controlType: "combo",
    options: HARMONY_OPTIONS,
    icon: "material-palette",
  },
  {
    facet: "angle",
    label: "Angle",
    valueType: "number",
    controlType: "number",
    unit: { type: "deg", min: 0, max: 360, step: 1 },
    icon: "seldon-rotation",
  },
  {
    facet: "step",
    label: "Step",
    valueType: "number",
    controlType: "number",
    unit: { type: "none", min: -50, max: 50, step: 1 },
    icon: "seldon-step",
  },
  {
    facet: "whitePoint",
    label: "White Point",
    valueType: "percentage",
    controlType: "number",
    unit: { type: "%", min: 0, max: 100, step: 1 },
  },
  {
    facet: "grayPoint",
    label: "Gray Point",
    valueType: "percentage",
    controlType: "number",
    unit: { type: "%", min: 0, max: 100, step: 1 },
  },
  {
    facet: "blackPoint",
    label: "Black Point",
    valueType: "percentage",
    controlType: "number",
    unit: { type: "%", min: 0, max: 100, step: 1 },
  },
  {
    facet: "bleed",
    label: "Bleed",
    valueType: "number",
    controlType: "number",
    unit: { type: "none", min: 0, max: 1, step: 0.01 },
    icon: "material-blurOn",
  },
] as const satisfies readonly ComputedGroupFacetFor<ColorHarmonyParameters>[]

const FONT_FAMILY_FACETS = [
  {
    facet: "primary",
    label: "Primary Font",
    valueType: "text",
    controlType: "menu",
    icon: "material-matchCase",
  },
  {
    facet: "secondary",
    label: "Secondary Font",
    valueType: "text",
    controlType: "menu",
    icon: "material-titlecase",
  },
] as const satisfies readonly ComputedGroupFacetFor<FontFamilyGroupParameters>[]

const MATCH_COLOR_FACETS = [
  {
    facet: "includeBrightness",
    label: "Include Brightness",
    valueType: "boolean",
    controlType: "boolean",
    icon: "seldon-brightness",
  },
  {
    facet: "includeOpacity",
    label: "Include Opacity",
    valueType: "boolean",
    controlType: "boolean",
    icon: "seldon-opacity",
  },
] as const satisfies readonly ComputedGroupFacetFor<MatchColorParameters>[]

const HIGH_CONTRAST_FACETS = [
  {
    facet: "contrastRatio",
    label: "Contrast Ratio",
    valueType: "number",
    controlType: "number",
    unit: { type: "none", min: 1, max: 21, step: 0.1 },
    icon: "material-contrast",
  },
  {
    facet: "fallbackColor",
    label: "Fallback Color",
    valueType: "color",
    controlType: "color",
    icon: "material-colors",
  },
  {
    facet: "includeBleed",
    label: "Include Bleed",
    valueType: "boolean",
    controlType: "boolean",
    icon: "material-blurOn",
  },
] as const satisfies readonly ComputedGroupFacetFor<HighContrastParameters>[]

const OPTICAL_PADDING_FACETS = [
  {
    facet: "leftRhythm",
    label: "Left Rhythm",
    valueType: "number",
    controlType: "number",
    unit: { type: "none", min: 0, max: 4, step: 0.01 },
    icon: "material-alignJustifyFlexStart",
  },
  {
    facet: "verticalRhythm",
    label: "Vertical Rhythm",
    valueType: "number",
    controlType: "number",
    unit: { type: "none", min: 0, max: 4, step: 0.01 },
    icon: "material-alignSpaceAround",
  },
  {
    facet: "rightRhythm",
    label: "Right Rhythm",
    valueType: "number",
    controlType: "number",
    unit: { type: "none", min: 0, max: 4, step: 0.01 },
    icon: "material-alignJustifyFlexEnd",
  },
] as const satisfies readonly ComputedGroupFacetFor<OpticalPaddingParameters>[]

const AUTO_FIT_FACETS = [
  {
    facet: "factor",
    label: "Factor",
    valueType: "number",
    controlType: "number",
    unit: { type: "none", min: 0, max: 4, step: 0.01 },
    icon: "material-asterisk",
  },
] as const satisfies readonly ComputedGroupFacetFor<AutoFitParameters>[]

/** Ordered groups in the Computed section, each with a label and its facets. */
export const COMPUTED_GROUPS = [
  { key: "modulation", label: "Modulation", facets: MODULATION_FACETS },
  { key: "colorHarmony", label: "Color Harmony", facets: COLOR_HARMONY_FACETS },
  { key: "fontFamily", label: "Font Family", facets: FONT_FAMILY_FACETS },
  { key: "matchColor", label: "Match Color", facets: MATCH_COLOR_FACETS },
  { key: "highContrast", label: "High Contrast", facets: HIGH_CONTRAST_FACETS },
  {
    key: "opticalPadding",
    label: "Optical Padding",
    facets: OPTICAL_PADDING_FACETS,
  },
  { key: "autoFit", label: "Auto Fit", facets: AUTO_FIT_FACETS },
] as const

export type ComputedGroupKey = (typeof COMPUTED_GROUPS)[number]["key"]

/** Facets the editor reads as a plain color HSL object rather than a tagged value. */
export const COMPUTED_COLOR_FACET_KEYS = new Set<string>([
  "colorHarmony.baseColor",
])
