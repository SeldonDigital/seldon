import { ValueType } from "@seldon/core/properties"
import { FlatProperty } from "./properties-data"

/** All/None/Custom preset options for a resource parent row. */
export const RESOURCE_PRESET_OPTIONS = [
  { name: "All", value: "All" },
  { name: "None", value: "None" },
  { name: "Custom", value: "Custom" },
]

/** On/Off options for a resource child toggle row. */
export const RESOURCE_TOGGLE_OPTIONS = [
  { name: "On", value: "On" },
  { name: "Off", value: "Off" },
]

/** Display value for a derived All/None/Custom preset. */
export function resourcePresetDisplayValue(
  preset: "all" | "none" | "custom",
): string {
  return preset === "all" ? "All" : preset === "none" ? "None" : "Custom"
}

/**
 * Builds an editable menu row for a resource list: a preset on a parent row
 * (font family or icon subcategory) or an On/Off toggle on a child row.
 */
export function createResourceMenuRow(
  key: string,
  label: string,
  value: string,
  options: Array<{ name: string; value: string }>,
  isSubProperty: boolean,
  isCompound: boolean,
  status: FlatProperty["status"],
): FlatProperty {
  return {
    key,
    propertyType: isCompound ? "compound" : "atomic",
    label,
    icon: "seldon-text",
    value: { type: ValueType.EXACT, value },
    actualValue: value,
    valueType: ValueType.EXACT,
    controlType: "menu",
    isCompound,
    isShorthand: false,
    isSubProperty,
    status,
    options,
  }
}
