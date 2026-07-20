import type { Properties } from "@seldon/core"

import type { CanvasHtmlAttributes } from "./ComponentRenderer"

/**
 * Maps the node properties that must render as real HTML attributes (rather than
 * CSS tokens) onto an attribute bag: image `src`/`alt`, input metadata, table
 * spans, and ARIA state. Shared by the live canvas node and the non-persisted
 * board previews so both surfaces emit the same attributes.
 */
export function getPropertyHtmlAttributes(
  properties: Properties,
): CanvasHtmlAttributes {
  const htmlAttributes: CanvasHtmlAttributes = {}

  if (properties.source?.value) {
    htmlAttributes.src = properties.source.value
  }

  if (properties.altText?.value) {
    htmlAttributes.alt = properties.altText.value
  }

  if (properties.placeholder?.value) {
    htmlAttributes.placeholder = properties.placeholder.value
  }

  if (properties.ariaLabel?.value) {
    htmlAttributes["aria-label"] = properties.ariaLabel.value
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
    htmlAttributes[attribute] =
      typeof value === "boolean" ? value : String(value)
  }

  if (properties.inputType?.value) {
    htmlAttributes.type = properties.inputType.value
  }

  if (properties.checked?.value) {
    htmlAttributes.defaultChecked = true
  }

  if (properties.columns?.value) {
    const columnValue =
      typeof properties.columns.value === "number"
        ? properties.columns.value
        : properties.columns.value.value
    htmlAttributes.colSpan = columnValue.toString()
  }

  if (properties.rows?.value) {
    const rowValue =
      typeof properties.rows.value === "number"
        ? properties.rows.value
        : properties.rows.value.value
    htmlAttributes.rowSpan = rowValue.toString()
  }

  return htmlAttributes
}
