/**
 * Property values are tagged unions and can be verbose. A node view is a reading
 * aid, not a wire format, so this collapses a value to a short `type:value` and
 * caps raw JSON length. The model rewrites values from the shapes section, not by
 * copying this string, so fidelity here is not the goal.
 */
export function summarizeValue(value: unknown): string {
  if (value && typeof value === "object" && "type" in value) {
    const tagged = value as { type?: unknown; value?: unknown }
    return `${String(tagged.type)}:${JSON.stringify(tagged.value)}`
  }
  const json = JSON.stringify(value)
  return json.length > 80 ? `${json.slice(0, 80)}…` : json
}
