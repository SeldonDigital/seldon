import type { Properties } from "@seldon/core"

/**
 * Maps the node properties that must render as real HTML attributes (rather than
 * CSS tokens) onto an attribute bag: image `src`/`alt`, input metadata, table
 * spans, and ARIA state. Uses native DOM attribute names (`checked`, `colspan`,
 * `rowspan`) so a DOM canvas binds them directly. The React canvas maps these
 * onto its own React prop names.
 */
export function getPropertyHtmlAttributes(
  properties: Properties,
): Record<string, string | number | boolean> {
  const attributes: Record<string, string | number | boolean> = {}

  if (properties.source?.value) {
    attributes.src = properties.source.value as string
  }
  if (properties.altText?.value) {
    attributes.alt = properties.altText.value as string
  }
  if (properties.placeholder?.value) {
    attributes.placeholder = properties.placeholder.value as string
  }
  if (properties.ariaLabel?.value) {
    attributes["aria-label"] = properties.ariaLabel.value as string
  }

  const ariaAttributeValues: Record<string, unknown> = {
    role: properties.role?.value,
    "aria-hidden": properties.ariaHidden?.value,
    "aria-disabled": properties.ariaDisabled?.value,
    "aria-expanded": properties.ariaExpanded?.value,
    "aria-selected": properties.ariaSelected?.value,
    "aria-checked": properties.ariaChecked?.value,
    "aria-pressed": properties.ariaPressed?.value,
    "aria-current": properties.ariaCurrent?.value,
    "aria-haspopup": properties.ariaHasPopup?.value,
    "aria-invalid": properties.ariaInvalid?.value,
    "aria-required": properties.ariaRequired?.value,
    "aria-readonly": properties.ariaReadonly?.value,
    "aria-live": properties.ariaLive?.value,
  }
  for (const [attribute, value] of Object.entries(ariaAttributeValues)) {
    if (value == null) continue
    attributes[attribute] = typeof value === "boolean" ? value : String(value)
  }

  if (properties.inputType?.value) {
    attributes.type = properties.inputType.value as string
  }
  if (properties.checked?.value) {
    attributes.checked = true
  }

  if (properties.columns?.value) {
    const columnValue =
      typeof properties.columns.value === "number"
        ? properties.columns.value
        : (properties.columns.value as { value: number }).value
    attributes.colspan = columnValue.toString()
  }
  if (properties.rows?.value) {
    const rowValue =
      typeof properties.rows.value === "number"
        ? properties.rows.value
        : (properties.rows.value as { value: number }).value
    attributes.rowspan = rowValue.toString()
  }

  return attributes
}
