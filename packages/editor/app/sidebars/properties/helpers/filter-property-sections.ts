import { FlatProperty } from "./properties-data"

/**
 * Keeps only the main property rows whose label or current value matches the
 * query, then drops sections left with no rows. An empty query returns the
 * sections unchanged. Sub-property rows are not matched directly; a matched
 * compound or shorthand parent still renders its children.
 *
 * Generic over the section shape so it covers both component
 * (`PropertySection`) and theme (`ThemePropertySection`) sections, which share
 * a `properties` list.
 */
export function filterPropertySections<T extends { properties: FlatProperty[] }>(
  sections: T[],
  query: string,
): T[] {
  const q = query.trim().toLowerCase()
  if (!q) return sections

  const out: T[] = []
  for (const section of sections) {
    const properties = section.properties.filter(
      (property) =>
        property.label.toLowerCase().includes(q) ||
        property.actualValue.toLowerCase().includes(q),
    )
    if (properties.length > 0) out.push({ ...section, properties })
  }
  return out
}
