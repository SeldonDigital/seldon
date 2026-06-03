/**
 * Theme token schema: one catalog entry per theme key. Entries with `propertyKey` bridge to `PROPERTY_SCHEMAS`.
 * See `themes/schemas/THEME-SCHEMAS.md` and `themes/schemas/data/theme-token-schemas.ts` (`THEME_TOKEN_SCHEMAS`).
 */
import type { PropertyName } from "../../properties/schemas/data/property-schemas"

export type ThemeTokenSectionId =
  | "core"
  | "swatch"
  | "size"
  | "dimension"
  | "margin"
  | "padding"
  | "gap"
  | "borderWidth"
  | "corners"
  | "font"
  | "fontSize"
  | "fontWeight"
  | "lineHeight"
  | "shadow"
  | "border"
  | "gradient"
  | "background"
  | "blur"
  | "spread"
  | "scrollbar"

/** Allowed raw token storage shapes (parallel to {@link PropertySchema.supports}). */
export type ThemeTokenSchemaSupport =
  | "number"
  | "length"
  | "color"
  | "text"
  | "enum"
  | "boolean"
  | "percentage"

/** Per-shape validators (parallel to {@link PropertySchema.validation}). */
export type ThemeTokenSchemaValidation = {
  [K in ThemeTokenSchemaSupport]?: (value: unknown) => boolean
}

export interface ThemeTokenSchema {
  key: string
  /**
   * When set, label / supports / validation / controlType / unit are derived from
   * `PROPERTY_SCHEMAS[propertyKey]` unless overridden on this entry.
   */
  propertyKey?: PropertyName
  label?: string
  supports: readonly ThemeTokenSchemaSupport[]
  validation: ThemeTokenSchemaValidation
  controlType?: "number" | "color" | "text" | "combo" | "menu" | "boolean"
  options?: Array<{ label: string; value: string | number }>
  unit?: {
    type: "px" | "rem" | "%" | "deg" | "none"
    min?: number
    max?: number
    step?: number
  }
  section: ThemeTokenSectionId
  order: number
  icon?: string
  description?: string
  /** Marks a look row that groups its facet sub-rows under a disclosure arrow. */
  isLookParent?: boolean
  /** Marks a facet row nested under a look parent row. */
  isSubProperty?: boolean
}

/** Authoring shape for static data: single `valueType` is expanded to `supports` + `validation`. */
export type ThemeTokenCatalogDraft = Omit<
  ThemeTokenSchema,
  "supports" | "validation"
> & {
  valueType: ThemeTokenSchemaSupport
}

/** Dynamic entry bridged to a property schema before merge (no `supports` until resolved). */
export type ThemeTokenBridgedCatalogDraft = Omit<
  ThemeTokenSchema,
  "supports" | "validation"
> &
  Partial<Pick<ThemeTokenSchema, "supports" | "validation">> & {
    propertyKey: PropertyName
  }

export type ThemeTokenSchemaUnresolved =
  | ThemeTokenSchema
  | ThemeTokenCatalogDraft
  | ThemeTokenBridgedCatalogDraft

export interface ThemeTokenSectionSchema {
  id: ThemeTokenSectionId
  label: string
  order: number
  icon?: string
}
