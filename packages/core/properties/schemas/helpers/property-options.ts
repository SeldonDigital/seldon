import type { Theme } from "../../../themes/types"
import type { Workspace } from "../../../workspace/types"
import { getPropertySchema } from "./get-property-schema"

/**
 * Returns picker choices for `option`, `themeCategorical`, or `themeOrdinal`.
 *
 * @param valueType {@link PropertyValueType} spelling; use `option`, `themeCategorical`, or `themeOrdinal`.
 * @param theme Required for theme key lists when the schema defines `themeCategoricalKeys` or `themeOrdinalKeys`.
 * @param workspace Forwarded to `presetOptions` when the schema builds workspace-dependent option lists.
 */
export function getPropertyOptions(
  propertyName: string,
  valueType: string,
  theme?: Theme,
  workspace?: Workspace,
): unknown[] {
  const schema = getPropertySchema(propertyName)
  if (!schema) return []

  if (valueType === "option" && schema.presetOptions) {
    return schema.presetOptions(workspace)
  }

  if (
    valueType === "themeCategorical" &&
    schema.themeCategoricalKeys &&
    theme
  ) {
    return schema.themeCategoricalKeys(theme)
  }

  if (valueType === "themeOrdinal" && schema.themeOrdinalKeys && theme) {
    return schema.themeOrdinalKeys(theme)
  }

  return []
}

/**
 * Returns `presetOptions` for the property as bare values, or an empty array when the schema omits it.
 * Schemas may return entries either as raw values (`true`, `"left"`, …) or as `{ value, name }`
 * label/value pairs; this helper unwraps the `{ value, name }` form so callers always receive
 * primitive option values they can store on a property.
 */
export function getPresetOptions(
  propertyName: string,
  workspace?: Workspace,
): unknown[] {
  const schema = getPropertySchema(propertyName)
  const raw = schema?.presetOptions?.(workspace) || []
  return raw.map((entry) => (isLabeledOption(entry) ? entry.value : entry))
}

/**
 * Maps each preset option to `{ label, value }`. When the schema returns `{ value, name }` entries,
 * the provided `name` is used as the label as-is; otherwise the label is derived from the raw value.
 */
export function getPresetOptionsAsLabelValue(
  propertyName: string,
  workspace?: Workspace,
): Array<{ label: string; value: unknown }> {
  const schema = getPropertySchema(propertyName)
  const raw = schema?.presetOptions?.(workspace) || []
  return raw.map((entry) => {
    if (isLabeledOption(entry)) {
      return { label: entry.name, value: entry.value }
    }
    return { label: formatLabel(entry), value: entry }
  })
}

/** True for `{ value, name }` schema entries that already carry their own display label. */
function isLabeledOption(
  entry: unknown,
): entry is { value: unknown; name: string } {
  return (
    typeof entry === "object" &&
    entry !== null &&
    "value" in entry &&
    "name" in entry &&
    typeof (entry as { name: unknown }).name === "string"
  )
}

/** Title-cases hyphenated strings; otherwise stringifies the value. */
function formatLabel(value: unknown): string {
  if (typeof value === "boolean") {
    return value ? "On" : "Off"
  }
  if (typeof value === "string") {
    return value
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }
  return String(value)
}
