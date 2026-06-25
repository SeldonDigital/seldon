import { ValueType } from "@seldon/core/properties"
import { FlatProperty } from "./properties-data"

/** Read-only metadata fields shared by themes and font collections. */
export interface MetadataInput {
  name: string
  description: string
  intent: string
  author?: string
}

/** Builds one read-only, dimmed atomic row with no control. */
function createMetadataRow(
  key: string,
  label: string,
  value: string,
  icon: string,
): FlatProperty {
  return {
    key: `metadata.${key}`,
    propertyType: "atomic",
    label,
    icon,
    value: { type: ValueType.EXACT, value },
    actualValue: value,
    valueType: ValueType.EXACT,
    controlType: undefined,
    isCompound: false,
    isShorthand: false,
    isSubProperty: false,
    status: "set",
    isDimmed: true,
  }
}

/**
 * Builds the read-only Metadata section rows for a theme or font collection.
 *
 * Author is emitted only when provided, so themes show it and font collections
 * do not.
 */
export function buildMetadataProperties(
  metadata: MetadataInput,
): FlatProperty[] {
  const rows: FlatProperty[] = [
    createMetadataRow("name", "Name", metadata.name, "material-style"),
    createMetadataRow(
      "description",
      "Description",
      metadata.description,
      "material-article",
    ),
    createMetadataRow("intent", "Intent", metadata.intent, "material-article"),
  ]

  if (metadata.author) {
    rows.push(
      createMetadataRow(
        "author",
        "Author",
        metadata.author,
        "material-attribution",
      ),
    )
  }

  return rows
}
