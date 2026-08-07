import { ValueType } from "@seldon/core/properties"

import type { FlatProperty } from "./properties-data"

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
  multiline = false,
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
    multiline,
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
  nameIcon = "material-style",
): FlatProperty[] {
  const rows: FlatProperty[] = [
    createMetadataRow("name", "Name", metadata.name, nameIcon, editable),
    createMetadataRow(
      "description",
      "Description",
      metadata.description,
      "material-article",
      editable,
      true,
    ),
    createMetadataRow("intent", "Intent", metadata.intent, "material-article", editable),
  ]

  if (metadata.author) {
    rows.push(
      createMetadataRow("author", "Author", metadata.author, "material-attribution", editable),
    )
  }

  return rows
}

/** Read-only metadata fields for a single font family. */
export interface FontFamilyMetadataInput {
  name: string
  vendor: string
  category?: string
  designer?: string
  description?: string
  sourceHref?: string
}

/**
 * Builds the metadata rows for a selected font family: the family Name, its
 * Vendor, and whichever of Designer, Category, and Description the vendor
 * provided, followed by a Source link to the family's vendor page. Rows with no
 * value are omitted, so a family missing captured metadata still renders.
 */
export function buildFontFamilyMetadataProperties(
  metadata: FontFamilyMetadataInput,
): FlatProperty[] {
  const rows: FlatProperty[] = [
    createMetadataRow("name", "Name", metadata.name, "material-fontDownload", false),
    createMetadataRow("vendor", "Vendor", metadata.vendor, "material-domain", false),
  ]

  if (metadata.designer) {
    rows.push(
      createMetadataRow("designer", "Designer", metadata.designer, "material-attribution", false),
    )
  }

  if (metadata.category) {
    rows.push(createMetadataRow("category", "Category", metadata.category, "material-tag", false))
  }

  if (metadata.description) {
    rows.push(
      createMetadataRow(
        "description",
        "Description",
        metadata.description,
        "material-article",
        false,
        true,
      ),
    )
  }

  if (metadata.sourceHref) {
    // Show the address without its protocol, e.g. `fonts.google.com/specimen/Roboto`.
    const displayUrl = metadata.sourceHref.replace(/^https?:\/\//, "")

    rows.push({
      // Not `metadata.source`: that path resolves to the image `source`
      // attribute's icon in the shared icon lookup, overriding this row's icon.
      key: "metadata.sourceLink",
      propertyType: "atomic",
      label: "Source",
      icon: "material-codeXml",
      value: { type: ValueType.EXACT, value: displayUrl },
      actualValue: displayUrl,
      valueType: ValueType.EXACT,
      controlType: undefined,
      isCompound: false,
      isShorthand: false,
      isSubProperty: false,
      status: "set",
      isDimmed: true,
      linkHref: metadata.sourceHref,
    })
  }

  return rows
}
