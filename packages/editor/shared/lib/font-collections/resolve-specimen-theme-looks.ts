import { getTextStyles } from "@seldon/factory/styles/css-properties/get-text-styles"
import { ValueType } from "@seldon/core"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { getThemeValueAnnotation } from "@seldon/core/helpers/theme/get-theme-value-annotation"

import type { Properties, Theme } from "@seldon/core"
import type { ThemeFont } from "@seldon/core/themes/types"

/**
 * One Type Specimen typographic level: the `*Spec` label ref that states the
 * resolved look, the `*Preview` ref that renders the sample, and the theme font
 * look token the level draws its style, size, weight, and line height from.
 */
interface SpecimenLevel {
  spec: string
  preview: string
  preset: string
}

/**
 * The Specimen's levels in render order, each mapped to the `@font.*` look the
 * matching Text primitive variant uses. Body maps to `@font.body` (Normal), the
 * rest map one-to-one to their heading looks.
 */
const SPECIMEN_LEVELS: SpecimenLevel[] = [
  { spec: "typeSpecimenNormalSpec", preview: "typeSpecimenNormalPreview", preset: "@font.body" },
  { spec: "typeSpecimenLabelSpec", preview: "typeSpecimenLabelPreview", preset: "@font.label" },
  {
    spec: "typeSpecimenTaglineSpec",
    preview: "typeSpecimenTaglinePreview",
    preset: "@font.tagline",
  },
  {
    spec: "typeSpecimenCalloutSpec",
    preview: "typeSpecimenCalloutPreview",
    preset: "@font.callout",
  },
  {
    spec: "typeSpecimenSubtitleSpec",
    preview: "typeSpecimenSubtitlePreview",
    preset: "@font.subtitle",
  },
  { spec: "typeSpecimenTitleSpec", preview: "typeSpecimenTitlePreview", preset: "@font.title" },
  {
    spec: "typeSpecimenSubheadingSpec",
    preview: "typeSpecimenSubheadingPreview",
    preset: "@font.subheading",
  },
  {
    spec: "typeSpecimenHeadingSpec",
    preview: "typeSpecimenHeadingPreview",
    preset: "@font.heading",
  },
  {
    spec: "typeSpecimenDisplaySpec",
    preview: "typeSpecimenDisplayPreview",
    preset: "@font.display",
  },
]

export interface SpecimenThemeLooks {
  specs: Record<string, string>
  previewCss: string
}

/**
 * Builds a font properties bag that carries only a look preset, so the text
 * style resolver reads the style, size, weight, and line height from the theme
 * look rather than from an authored override. The facet keys stay present as
 * empty so the resolver's per-facet guards apply the look values.
 */
function buildFontProperties(preset: string): Properties {
  const font = {
    preset: { type: ValueType.THEME_CATEGORICAL, value: preset },
    family: { type: ValueType.EMPTY, value: null },
    style: { type: ValueType.EMPTY, value: null },
    weight: { type: ValueType.EMPTY, value: null },
    size: { type: ValueType.EMPTY, value: null },
    lineHeight: { type: ValueType.EMPTY, value: null },
    textCase: { type: ValueType.EMPTY, value: null },
    letterSpacing: { type: ValueType.EMPTY, value: null },
  }

  return { font } as unknown as Properties
}

/**
 * Resolves the Type Specimen's per-level look from a theme.
 *
 * For every level it reads the concrete style, size, weight, and line height the
 * theme's `@font.*` look resolves to, then returns the `*Spec` label strings and
 * a scoped CSS block that applies those values to the matching `*Preview`
 * elements. Font family is left untouched, so the caller can scope the selected
 * family onto the previews independently.
 */
export function resolveSpecimenThemeLooks(theme: Theme, scopeClass: string): SpecimenThemeLooks {
  const specs: Record<string, string> = {}
  const rules: string[] = []

  for (const level of SPECIMEN_LEVELS) {
    const styles = getTextStyles({
      properties: buildFontProperties(level.preset),
      parentContext: null,
      theme,
      useThemeVariableReferences: false,
    })

    const fontSize = styles.fontSize
    const fontWeight = styles.fontWeight
    const lineHeight = styles.lineHeight
    const fontStyle = typeof styles.fontStyle === "string" ? styles.fontStyle : "normal"
    const styleLabel = fontStyle === "normal" ? "Normal" : "Italic"

    // The look's size is a `@fontSize.*` token. Read its key so the label reuses
    // the shared value annotation (`px · rem`), matching every other value
    // display in the editor. Fall back to the resolved size if the look does not
    // reference a token.
    const look = getThemeOption(level.preset, theme) as ThemeFont
    const sizeToken = look?.parameters?.size
    const sizeKey =
      sizeToken && sizeToken.type === ValueType.THEME_ORDINAL ? String(sizeToken.value) : null
    const sizeLabel = (sizeKey ? getThemeValueAnnotation(sizeKey, theme) : undefined) ?? fontSize

    specs[level.spec] = `${styleLabel} / ${sizeLabel} / ${fontWeight} / ${lineHeight}`

    rules.push(
      `.${scopeClass} [data-seldon-ref="${level.preview}"] {
  font-size: ${fontSize} !important;
  font-weight: ${fontWeight} !important;
  line-height: ${lineHeight} !important;
  font-style: ${fontStyle} !important;
}`,
    )
  }

  return { specs, previewCss: rules.join("\n") }
}
