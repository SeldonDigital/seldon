import { ValueType } from "@seldon/core/properties"
import { FlatProperty } from "./properties-data"

/** Read-only metadata fields shared by themes and font collections. */
export interface MetadataInput {
  name: string
  description: string
  intent: string
  author?: string
}

/**
 * Builds one atomic metadata row. Read-only and dimmed by default; an editable
 * row renders a plain text control so the value can be edited in place.
 */
function createMetadataRow(
  key: string,
  label: string,
  value: string,
  icon: string,
  editable: boolean,
): FlatProperty {
  return {
    key: `metadata.${key}`,
    propertyType: "atomic",
    label,
    icon,
    value: { type: ValueType.EXACT, value },
    actualValue: value,
    valueType: ValueType.EXACT,
    controlType: editable ? "text" : undefined,
    isCompound: false,
    isShorthand: false,
    isSubProperty: false,
    status: "set",
    isDimmed: !editable,
  }
}

/**
 * Builds the Metadata section rows for a theme or font collection.
 *
 * Author is emitted only when provided, so themes show it and font collections
 * do not. Rows are read-only unless `editable` is set, which authored themes use
 * to let the user edit their own name, description, intent, and author.
 */
export function buildMetadataProperties(
  metadata: MetadataInput,
  editable = false,
): FlatProperty[] {
  const rows: FlatProperty[] = [
    createMetadataRow(
      "name",
      "Name",
      metadata.name,
      "material-style",
      editable,
    ),
    createMetadataRow(
      "description",
      "Description",
      metadata.description,
      "material-article",
      editable,
    ),
    createMetadataRow(
      "intent",
      "Intent",
      metadata.intent,
      "material-article",
      editable,
    ),
  ]

  if (metadata.author) {
    rows.push(
      createMetadataRow(
        "author",
        "Author",
        metadata.author,
        "material-attribution",
        editable,
      ),
    )
  }

  return rows
}
