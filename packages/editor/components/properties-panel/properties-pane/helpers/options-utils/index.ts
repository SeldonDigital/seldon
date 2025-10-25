import { ComponentId, ComponentLevel, Theme, Workspace } from "@seldon/core"
import { Board, Instance, Variant } from "@seldon/core/workspace/types"
import { buildDefaultOptions } from "./builders/default-options"
import {
  PropertyOptionsResult,
  buildPropertyOptions,
} from "./builders/option-builder"
import { shouldUsePresetPropertyBehavior } from "../property-types"
import type { PropertyOption } from "./formatters/option-normalizer"
import { getPropertySchemaForProperty } from "./schema/schema-resolver"

export interface FlatProperty {
  key: string
  value: unknown
  allowedValues?: string[]
}

/**
 * Generate property options for a given property
 */
export function generatePropertyOptions(
  property: FlatProperty,
  theme?: Theme,
  componentId?: ComponentId,
  componentLevel?: ComponentLevel,
  _workspace?: Workspace,
  _node?: Variant | Instance | Board,
): PropertyOptionsResult {
  // Handle preset properties: build options from the parent compound schema
  if (shouldUsePresetPropertyBehavior(property.key)) {
    const parentKey = property.key.replace(/\.preset$/, "")
    const schema =
      getPropertySchemaForProperty(parentKey) ||
      getPropertySchemaForProperty(property.key)

    if (!schema) {
      return {
        options: [[{ value: "", name: "Error" }]],
        hasCurrentValue: false,
      }
    }

    const groups = [] as PropertyOption[][]
    groups.push(buildDefaultOptions(schema))

    // Source of truth: active theme section
    const section = theme
      ? (theme as Record<string, unknown>)[parentKey]
      : undefined
    if (!section || typeof section !== "object") {
      console.error(
        `[PropertiesPane] Missing theme section for compound presets: ${parentKey}.` +
          ` Ensure the active theme defines presets under theme.${parentKey}.`,
      )
      return {
        options: groups,
        hasCurrentValue: false,
      }
    }

    const presetGroup: PropertyOption[] = Object.entries(section)
      .filter(
        ([, v]: [string, unknown]) => v && typeof v === "object" && "name" in v,
      )
      .map(([id, v]: [string, unknown]) => ({
        // Value should be the theme token so schema.allowedValues can filter it
        value: `@${parentKey}.${String(id)}`,
        name: String((v as Record<string, unknown>).name),
      }))

    // Apply allowedValues filtering if provided
    const filteredPresets =
      Array.isArray(property.allowedValues) && property.allowedValues.length > 0
        ? presetGroup.filter((opt) =>
            property.allowedValues!.includes(opt.value),
          )
        : presetGroup

    if (filteredPresets.length === 0) {
      console.error(
        `[PropertiesPane] No presets found in theme.${parentKey}.` +
          ` Add presets or update the theme to expose them.`,
      )
      return {
        options: groups,
        hasCurrentValue: false,
      }
    }

    groups.push(filteredPresets)

    return {
      options: groups,
      hasCurrentValue: false,
    }
  }

  // Get the appropriate schema for this property
  const schema = getPropertySchemaForProperty(property.key)
  if (!schema) {
    return {
      options: [
        [{ value: "ERROR", name: `No schema found for ${property.key}` }],
      ],
      hasCurrentValue: false,
    }
  }

  // Build all option groups
  return buildPropertyOptions(property, schema, theme, componentLevel)
}
