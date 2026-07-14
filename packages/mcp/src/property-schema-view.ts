import {
  COMPOUND_FACET_DISPLAY_ORDER,
  getCompoundSelectorFacet,
} from "@seldon/core/properties/constants/shared/compound-properties"
import {
  type PropertyCategory,
  getCompoundSubPropertySchema,
  getInspectorRootPropertyKeys,
  getPropertyCategory,
  getPropertySchema,
} from "@seldon/core/properties/schemas/helpers"
import type { PropertySchema } from "@seldon/core/properties/types/schema"
import { THEMES_BY_ID } from "@seldon/core/themes/catalog/index"
import type { Theme } from "@seldon/core/themes/types"

/**
 * Serialized view of one property schema, as served by get_property_schema:
 * everything an agent
 * needs to author a `set_node_properties` cell for that key — allowed storage
 * shapes, option lists, computed functions, unit rules, and which theme token
 * sections its `@refs` draw from. `PropertySchema` itself holds validation
 * closures; this is the JSON-safe projection of it.
 */
export interface AtomicSchemaView {
  name: string
  description: string
  /** Storage shapes this property accepts (the `type` tag of the stored cell). */
  supports: readonly string[]
  /** Picker entries when the property stores `option` cells. */
  options?: unknown[]
  /** Set when `options` was capped: the uncapped count. */
  optionsTotal?: number
  /** Allowed computed-function ids when the property stores `computed` cells. */
  computedFunctions?: string[]
  /** Unit rules when the property stores measured numbers. */
  units?: PropertySchema["units"]
  /** Theme token sections its `@section.token` references draw from. */
  themeSections?: string[]
  /**
   * Example `@` keys resolved against the default stock theme. The token
   * *sections* are theme-independent; exact token ids for a specific theme
   * come from get_computed_theme.
   */
  themeKeys?: { categorical?: string[]; ordinal?: string[] }
}

export interface PropertySchemaView {
  key: string
  category: PropertyCategory
  /** Atomic keys (and each shorthand's shared sub-key schema). */
  schema?: AtomicSchemaView
  /** Compound keys: one entry per facet, in inspector display order. */
  facets?: Record<string, AtomicSchemaView>
  /** Compound keys: the facet whose value selects the compound's shape. */
  selectorFacet?: string
  /** Shorthand keys: the sub-keys the stored object holds. */
  subKeys?: string[]
}

/** Sub-key layout of each shorthand parent (`properties/types/properties.ts`). */
const SHORTHAND_SUB_KEYS: Record<string, string[]> = {
  margin: ["top", "right", "bottom", "left"],
  padding: ["top", "right", "bottom", "left"],
  corners: ["topLeft", "topRight", "bottomRight", "bottomLeft"],
  position: ["top", "right", "bottom", "left"],
}

/** Border sides share the `border` facet list in the display-order table. */
function facetNamesFor(compoundKey: string): readonly string[] {
  const normalized = compoundKey.startsWith("border") ? "border" : compoundKey
  return (
    COMPOUND_FACET_DISPLAY_ORDER[compoundKey] ??
    COMPOUND_FACET_DISPLAY_ORDER[normalized] ??
    []
  )
}

/** `@section.token` → `section`; non-@ keys fall through unchanged. */
function sectionOf(themeKey: string): string {
  const body = themeKey.startsWith("@") ? themeKey.slice(1) : themeKey
  return body.split(".")[0] ?? body
}

function toAtomicView(schema: PropertySchema): AtomicSchemaView {
  // Theme key lists need a resolved theme; the default stock theme is the
  // deterministic choice (sections are identical across stock themes).
  const defaultTheme = THEMES_BY_ID["seldon"] as Theme
  const categorical = schema.themeCategoricalKeys?.(defaultTheme)
  const ordinal = schema.themeOrdinalKeys?.(defaultTheme)

  const view: AtomicSchemaView = {
    name: schema.name,
    description: schema.description,
    supports: schema.supports,
  }
  // Option lists can be catalog-sized (e.g. `symbol` enumerates icon ids);
  // cap them to keep responses small — search_catalog is the way to find icons.
  const OPTIONS_CAP = 100
  const options = schema.presetOptions?.()
  if (options?.length) {
    view.options = options.slice(0, OPTIONS_CAP)
    if (options.length > OPTIONS_CAP) view.optionsTotal = options.length
  }
  const computed = schema.computedFunctions?.()
  if (computed?.length) view.computedFunctions = computed
  if (schema.units) view.units = schema.units
  if (categorical?.length || ordinal?.length) {
    view.themeKeys = {
      ...(categorical?.length ? { categorical } : {}),
      ...(ordinal?.length ? { ordinal } : {}),
    }
    view.themeSections = [
      ...new Set([...(categorical ?? []), ...(ordinal ?? [])].map(sectionOf)),
    ]
  }
  return view
}

/**
 * Builds the serialized schema view for a top-level node property key, or
 * null when the key is not a property. Flattened facet keys (e.g.
 * `borderColor`) also resolve, as plain atomics.
 */
export function buildPropertySchemaView(
  key: string,
): PropertySchemaView | null {
  const category = getPropertyCategory(key)
  if (!category) return null

  if (category === "compound") {
    const facets: Record<string, AtomicSchemaView> = {}
    for (const facet of facetNamesFor(key)) {
      const facetSchema = getCompoundSubPropertySchema(key, facet)
      if (facetSchema) facets[facet] = toAtomicView(facetSchema)
    }
    return {
      key,
      category,
      facets,
      selectorFacet: getCompoundSelectorFacet(key),
    }
  }

  if (category === "shorthand") {
    const schema = getPropertySchema(key)
    return {
      key,
      category,
      subKeys: SHORTHAND_SUB_KEYS[key],
      ...(schema ? { schema: toAtomicView(schema) } : {}),
    }
  }

  const schema = getPropertySchema(key)
  return schema ? { key, category, schema: toAtomicView(schema) } : null
}

/**
 * The universe of top-level keys a `set_node_properties` payload may touch:
 * inspector roots plus the border sides the inspector folds into `border`.
 */
export function validTopLevelPropertyKeys(): string[] {
  return [
    ...new Set([
      ...getInspectorRootPropertyKeys(),
      "borderTop",
      "borderRight",
      "borderBottom",
      "borderLeft",
    ]),
  ]
}
