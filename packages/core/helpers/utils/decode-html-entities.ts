/** Named HTML entities that pasted rich text commonly carries in plain copy. */
const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: "\u00a0",
  hellip: "\u2026",
  mdash: "\u2014",
  ndash: "\u2013",
  copy: "\u00a9",
  reg: "\u00ae",
  trade: "\u2122",
}

const ENTITY_PATTERN = /&(#x[0-9a-fA-F]+|#[0-9]+|[a-zA-Z][a-zA-Z0-9]*);/g

function decodeEntityToken(entity: string): string | null {
  if (entity[0] === "#") {
    const codePoint =
      entity[1] === "x" || entity[1] === "X"
        ? Number.parseInt(entity.slice(2), 16)
        : Number.parseInt(entity.slice(1), 10)

    if (!Number.isFinite(codePoint) || codePoint < 0 || codePoint > 0x10ffff) return null

    try {
      return String.fromCodePoint(codePoint)
    } catch {
      return null
    }
  }

  return NAMED_ENTITIES[entity] ?? null
}

function decodeOnce(text: string): string {
  return text.replace(ENTITY_PATTERN, (match, entity: string) => decodeEntityToken(entity) ?? match)
}

/**
 * Decodes HTML entities in plain-text copy, such as `&#039;` and `&amp;` that a
 * paste from rich text leaves behind. Runs to a stable result so a double-encoded
 * ampersand (`&amp;#039;`) resolves fully. A no-op on text with no entities.
 */
export function decodeHtmlEntities(text: string): string {
  if (!text.includes("&")) return text

  let current = text

  for (let pass = 0; pass < 5; pass += 1) {
    const next = decodeOnce(current)

    if (next === current) break
    current = next
  }

  return current
}
