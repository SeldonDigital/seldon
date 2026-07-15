import { camelCase } from "change-case"

import { findComponentSchema } from "@seldon/core/components/catalog"

import type { FunctionalNode, MatchResult, SuggestedSchema } from "./types"

/** A base id for a suggestion, from its role when present, else its tag. */
function baseId(node: FunctionalNode): string {
  const source = node.role ?? node.tag
  const name = camelCase(source)
  return name === "" ? "component" : name
}

/** The recognized catalog children a suggested schema can compose. */
function resolvableChildren(node: FunctionalNode): Array<{ component: string }> {
  const children: Array<{ component: string }> = []
  for (const child of node.children) {
    if (child.seededComponent && findComponentSchema(child.seededComponent)) {
      children.push({ component: child.seededComponent })
    }
  }
  return children
}

/** Builds one draft schema proposal from an unmatched piece. */
function toSuggestion(result: MatchResult, id: string): SuggestedSchema {
  const { sample } = result.piece
  const roleText = sample.role ? ` with role "${sample.role}"` : ""
  const tags = [sample.tag, sample.role ?? "", "imported", "web"].filter(
    (tag) => tag !== "",
  )
  return {
    id,
    level: sample.level,
    intent: `Imported ${sample.level} from a <${sample.tag}> element${roleText}. Review and refine before adding to the catalog.`,
    tags,
    properties: {},
    default: {
      children: resolvableChildren(sample),
    },
  }
}

/**
 * Drafts a schema proposal for every unmatched piece. Ids are derived from the
 * piece role or tag and disambiguated with a numeric suffix when they collide,
 * so each suggestion can be written to its own file.
 */
export function suggestSchemas(results: MatchResult[]): SuggestedSchema[] {
  const unmatched = results.filter((result) => result.matched === null)
  const used = new Map<string, number>()
  const suggestions: SuggestedSchema[] = []

  for (const result of unmatched) {
    const base = baseId(result.piece.sample)
    const seen = used.get(base) ?? 0
    used.set(base, seen + 1)
    const id = seen === 0 ? base : `${base}${seen + 1}`
    suggestions.push(toSuggestion(result, id))
  }

  return suggestions
}
