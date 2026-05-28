import { Unit } from "../../../properties/constants"
import { PROPERTY_SCHEMAS } from "../../../properties/schemas/data/property-schemas"
import type { PropertySchema } from "../../../properties/types/schema"
import type {
  ThemeTokenCatalogDraft,
  ThemeTokenSchema,
  ThemeTokenSchemaSupport,
  ThemeTokenSchemaUnresolved,
  ThemeTokenSchemaValidation,
} from "../../types/schema"
import {
  buildThemeTokenValidation,
  finalizeThemeTokenSchema,
} from "./finalize-theme-token-schema"

function humanizePropertyName(name: string): string {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim()
}

function isColorLikeProperty(name: string): boolean {
  const exact = new Set([
    "color",
    "accentColor",
    "backgroundColor",
    "borderColor",
    "shadowColor",
    "gradientStartColor",
    "gradientEndColor",
    "gradientStopColor",
  ])
  if (exact.has(name)) return true
  return /Color$/.test(name)
}

function mapUnitToTheme(
  unit: Unit,
  validation: "number" | "percentage" | "both" | undefined,
): ThemeTokenSchema["unit"] {
  const type =
    unit === Unit.PX
      ? "px"
      : unit === Unit.REM
        ? "rem"
        : unit === Unit.PERCENT
          ? "%"
          : unit === Unit.DEGREES
            ? "deg"
            : ("none" as const)

  const base: NonNullable<ThemeTokenSchema["unit"]> = {
    type,
    step: type === "deg" ? 1 : 0.01,
  }

  if (validation === "percentage") {
    return { ...base, type: "%", min: 0, max: 100, step: 1 }
  }

  if (type === "deg") {
    return { ...base, min: -360, max: 360, step: 1 }
  }

  if (type === "px" || type === "rem") {
    return { ...base, min: -9999, max: 9999 }
  }

  return base
}

function hasValidationBody(
  validation: ThemeTokenSchemaValidation | undefined,
): boolean {
  return !!validation && Object.keys(validation).length > 0
}

function deriveFromPropertySchema(
  prop: PropertySchema,
): Pick<
  ThemeTokenSchema,
  "label" | "supports" | "validation" | "controlType" | "unit" | "description"
> {
  const label = humanizePropertyName(prop.name)
  const supportsSet = new Set(prop.supports)

  if (supportsSet.has("themeCategorical") && isColorLikeProperty(prop.name)) {
    const support: ThemeTokenSchemaSupport = "color"
    return {
      label,
      supports: [support],
      validation: buildThemeTokenValidation(support),
      controlType: "color",
      description: prop.description,
    }
  }

  if (
    supportsSet.has("option") &&
    !supportsSet.has("themeCategorical") &&
    !supportsSet.has("exact")
  ) {
    const support: ThemeTokenSchemaSupport = "enum"
    return {
      label,
      supports: [support],
      validation: buildThemeTokenValidation(support),
      controlType: "combo",
      description: prop.description,
    }
  }

  if (prop.units) {
    const validation = prop.units.validation
    const uiUnit = mapUnitToTheme(
      prop.units.allowed[0],
      validation as "number" | "percentage" | "both" | undefined,
    )
    const support: ThemeTokenSchemaSupport =
      validation === "percentage" ? "percentage" : "number"
    return {
      label,
      supports: [support],
      validation: buildThemeTokenValidation(support),
      controlType: "number",
      unit: uiUnit,
      description: prop.description,
    }
  }

  if (prop.name === "fontFamily") {
    const support: ThemeTokenSchemaSupport = "text"
    return {
      label,
      supports: [support],
      validation: buildThemeTokenValidation(support),
      controlType: "text",
      description: prop.description,
    }
  }

  if (supportsSet.has("themeOrdinal") && supportsSet.has("exact")) {
    const support: ThemeTokenSchemaSupport = "number"
    return {
      label,
      supports: [support],
      validation: buildThemeTokenValidation(support),
      controlType: "number",
      description: prop.description,
    }
  }

  if (supportsSet.has("themeOrdinal")) {
    const support: ThemeTokenSchemaSupport = "enum"
    return {
      label,
      supports: [support],
      validation: buildThemeTokenValidation(support),
      controlType: "combo",
      description: prop.description,
    }
  }

  const support: ThemeTokenSchemaSupport = "text"
  return {
    label,
    supports: [support],
    validation: buildThemeTokenValidation(support),
    controlType: "text",
    description: prop.description,
  }
}

/**
 * Fills theme token catalog metadata from `PROPERTY_SCHEMAS` when `propertyKey` is set,
 * or finalizes `valueType` drafts into `supports` + `validation`.
 * Explicit entry values still win over derived defaults.
 */
export function resolveThemeTokenSchema(
  row: ThemeTokenSchemaUnresolved,
): ThemeTokenSchema {
  if (row.propertyKey) {
    const prop = PROPERTY_SCHEMAS[row.propertyKey]
    if (!prop) {
      throw new Error(
        `resolveThemeTokenSchema: unknown propertyKey "${row.propertyKey}" for theme key "${row.key}"`,
      )
    }

    const derived = deriveFromPropertySchema(prop)
    const rowSupports =
      "supports" in row && row.supports && row.supports.length > 0
        ? row.supports
        : undefined
    const rowValidation =
      "validation" in row && hasValidationBody(row.validation)
        ? row.validation
        : undefined

    return {
      ...row,
      label: row.label ?? derived.label,
      supports: rowSupports ?? derived.supports,
      validation: rowValidation ?? derived.validation,
      controlType: row.controlType ?? derived.controlType,
      unit: row.unit ?? derived.unit,
      description: row.description ?? derived.description,
    }
  }

  if ("valueType" in row && row.valueType !== undefined) {
    return finalizeThemeTokenSchema(row as ThemeTokenCatalogDraft)
  }

  return row as ThemeTokenSchema
}
