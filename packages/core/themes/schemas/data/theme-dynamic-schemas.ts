/**
 * Dynamic theme token catalog entries for token tables that depend on the loaded theme
 * (swatches, shadow recipes, font presets, …). Entries may use `propertyKey` → `PROPERTY_SCHEMAS`;
 * see `helpers/resolve-theme-token-schema.ts`. Static entries live in `theme-static-schemas.ts`.
 */
import { getDynamicSwatchName } from "../../compute/get-dynamic-swatch-names"
import { SCALE_STEP_SECTIONS } from "../../constants/scale-sections"
import { getReservedTokenKeys } from "../../helpers/reserved-token-names"
import { LOOK_FACETS, isBridgedLookFacet } from "../../looks/look-facets"
import type { LookFacetEntry, LookSection } from "../../looks/look-facets"
import type { ThemeTokenSchemaUnresolved } from "../../types/schema"
import type { ComputedTheme, StockTheme } from "../../types/theme"
import type { StockThemeSwatch, ThemeSwatch } from "../../values"
import {
  THEME_INTERFACE_SLOTS,
  THEME_PALETTE_SLOTS,
  isDynamicSwatchToken,
} from "../../values"
import { finalizeThemeTokenSchema } from "../helpers/finalize-theme-token-schema"
import { COMPUTED_GROUPS } from "./theme-computed"
import type { ComputedGroupFacet } from "./theme-computed"
import { SCALE_STEP_ROW_CONTROL } from "./theme-static-schemas"

export type ThemeOrStock = StockTheme | ComputedTheme

/** Sections whose custom rows render as a bare unitless number (no `.step` suffix). */
const SCALE_BARE_SECTIONS = ["fontWeight"] as const

type ScaleSchemaSection =
  | (typeof SCALE_STEP_SECTIONS)[number]
  | (typeof SCALE_BARE_SECTIONS)[number]

/** Custom rows sort after the reserved static rows. */
const CUSTOM_SCALE_ORDER_BASE = 1000

/**
 * Tells whether a section gets dynamic scale rows for its custom tokens.
 */
export function isScaleSchemaSection(
  section: string,
): section is ScaleSchemaSection {
  return (
    (SCALE_STEP_SECTIONS as readonly string[]).includes(section) ||
    (SCALE_BARE_SECTIONS as readonly string[]).includes(section)
  )
}

/**
 * Generate rows for the custom (`customN`) tokens in a scale section. Reserved
 * step slots are covered by the static schemas, so only non-reserved keys are
 * emitted here. The row label comes from the cell `name`, falling back to the
 * key, so a renamed token updates its row after recompute.
 */
export function generateScaleSchemas(
  theme: ThemeOrStock,
  section: ScaleSchemaSection,
): ThemeTokenSchemaUnresolved[] {
  const table = (theme as unknown as Record<string, unknown>)[section]
  if (!table || typeof table !== "object") return []

  const reserved = new Set(getReservedTokenKeys(section))
  const isBare = (SCALE_BARE_SECTIONS as readonly string[]).includes(section)

  const schemas: ThemeTokenSchemaUnresolved[] = []
  let order = CUSTOM_SCALE_ORDER_BASE
  for (const [key, cell] of Object.entries(
    table as Record<string, { name?: string }>,
  )) {
    if (reserved.has(key)) continue
    const label = cell?.name?.trim() || key
    schemas.push(
      finalizeThemeTokenSchema({
        key: isBare ? `${section}.${key}` : `${section}.${key}.step`,
        label,
        valueType: "number",
        controlType: "number",
        unit: SCALE_STEP_ROW_CONTROL.unit,
        section,
        order: order++,
        icon: "seldon-step",
      }),
    )
  }
  return schemas
}

/**
 * Generate schemas for the Computed section.
 *
 * Each group emits a parent disclosure row followed by one row per facet from
 * {@link COMPUTED_GROUPS}. Every facet carries inline `valueType` / `controlType`
 * and is finalized here. The parent label comes from the group cell `name`,
 * falling back to the group's default label.
 */
export function generateComputedSchemas(
  theme: ThemeOrStock,
): ThemeTokenSchemaUnresolved[] {
  const schemas: ThemeTokenSchemaUnresolved[] = []
  const themeObj = theme as unknown as Record<string, { name?: string }>

  let order = 0
  for (const group of COMPUTED_GROUPS) {
    const cell = themeObj[group.key]
    schemas.push({
      key: group.key,
      label: cell?.name?.trim() || group.label,
      section: "computed",
      order: order++,
      supports: [],
      validation: {},
      isLookParent: true,
    })

    for (const facet of group.facets as readonly ComputedGroupFacet[]) {
      schemas.push(
        finalizeThemeTokenSchema({
          key: `${group.key}.${facet.facet}`,
          label: facet.label,
          valueType: facet.valueType,
          controlType: facet.controlType,
          ...(facet.options ? { options: [...facet.options] } : {}),
          ...(facet.unit ? { unit: facet.unit } : {}),
          ...(facet.icon ? { icon: facet.icon } : {}),
          section: "computed",
          order: order++,
          isSubProperty: true,
        }),
      )
    }
  }

  return schemas
}

function swatchSchemaLabel(
  swatch: StockThemeSwatch | ThemeSwatch,
  theme: ThemeOrStock,
): string {
  if (isDynamicSwatchToken(swatch)) {
    return getDynamicSwatchName(swatch.role, theme)
  }
  return (swatch as ThemeSwatch).name ?? ""
}

/**
 * Generate schemas for swatch properties.
 *
 * Slots are emitted in three groups, in order:
 *   1. Dynamic palette slots (`white`, `gray`, …, `swatch4`) — labels generated by
 *      {@link getDynamicSwatchName} from the theme's harmony.
 *   2. Reserved fixed slots (`background`).
 *   3. Free-named user swatches — any other key in the swatch table. The cell's
 *      `name` is the source of truth; an empty string falls back here.
 */
/**
 * Generate schemas for the Swatches section.
 *
 * Swatches render in three collapsible groups - Harmony, Interface, Custom -
 * mirroring how Computed groups nest. Each group emits an `isLookParent`
 * disclosure parent (`swatch.harmony`, `swatch.interface`, `swatch.custom`)
 * followed by its swatch rows keyed under the group (`swatch.harmony.white`,
 * `swatch.interface.active`, `swatch.custom.custom1`). The three-segment key
 * drives the editor's parent/child nesting; the trailing segment is the swatch
 * id read from `theme.swatch`.
 */
export function generateSwatchSchemas(
  theme: ThemeOrStock,
): ThemeTokenSchemaUnresolved[] {
  const schemas: ThemeTokenSchemaUnresolved[] = []
  let order = 0
  const swatchTable = theme.swatch as Record<
    string,
    StockThemeSwatch | ThemeSwatch
  >

  const harmonySlots = THEME_PALETTE_SLOTS as readonly string[]
  const interfaceSlots = THEME_INTERFACE_SLOTS as readonly string[]
  const reservedSlots = new Set([...harmonySlots, ...interfaceSlots])

  const pushGroup = (group: string, label: string) => {
    schemas.push({
      key: `swatch.${group}`,
      label,
      section: "swatch",
      order: order++,
      supports: [],
      validation: {},
      isLookParent: true,
    })
  }

  const pushSwatchRow = (group: string, swatchId: string) => {
    const swatch = swatchTable[swatchId]
    if (!swatch) return
    schemas.push({
      key: `swatch.${group}.${swatchId}`,
      propertyKey: "color",
      label: swatchSchemaLabel(swatch, theme),
      section: "swatch",
      order: order++,
      isSubProperty: true,
    })
  }

  pushGroup("harmony", "Harmony")
  for (const swatchId of harmonySlots) {
    pushSwatchRow("harmony", swatchId)
  }

  pushGroup("interface", "Interface")
  for (const swatchId of interfaceSlots) {
    pushSwatchRow("interface", swatchId)
  }

  pushGroup("custom", "Custom")
  for (const key of Object.keys(swatchTable)) {
    if (reservedSlots.has(key)) continue
    pushSwatchRow("custom", key)
  }

  return schemas
}

/**
 * Generate schemas for one look section.
 *
 * Each look emits a parent row (the disclosure group) followed by one row per
 * facet from {@link LOOK_FACETS}. Bridged facets carry a `propertyKey` so their
 * control and options resolve from the property schema. Inline facets carry
 * explicit `valueType` / `controlType` and are finalized here.
 */
export function generateLookSchemas(
  theme: ThemeOrStock,
  section: LookSection,
): ThemeTokenSchemaUnresolved[] {
  const schemas: ThemeTokenSchemaUnresolved[] = []
  const facets = LOOK_FACETS[section] as readonly LookFacetEntry[]
  const stride = facets.length + 1
  const lookTable = (
    theme as unknown as Record<string, Record<string, { name?: string }>>
  )[section]
  if (!lookTable) return schemas

  let index = 0
  for (const [lookId, look] of Object.entries(lookTable)) {
    if (!look) continue
    const baseOrder = index * stride

    schemas.push({
      key: `${section}.${lookId}`,
      label: look.name ?? lookId,
      section,
      order: baseOrder,
      supports: [],
      validation: {},
      isLookParent: true,
    })

    facets.forEach((facet, facetIndex) => {
      const base = {
        key: `${section}.${lookId}.${facet.facet}`,
        label: facet.label,
        section,
        order: baseOrder + facetIndex + 1,
        isSubProperty: true,
        ...(facet.icon ? { icon: facet.icon } : {}),
      }
      if (isBridgedLookFacet(facet)) {
        schemas.push({ ...base, propertyKey: facet.propertyKey })
      } else {
        schemas.push(
          finalizeThemeTokenSchema({
            ...base,
            valueType: facet.valueType,
            controlType: facet.controlType,
          }),
        )
      }
    })

    index++
  }

  return schemas
}
