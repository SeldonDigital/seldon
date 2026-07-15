import { camelCase, capitalCase } from "change-case"

import { findComponentSchema } from "@seldon/core/components/catalog"

import { childOutline } from "./structure"
import type {
  FunctionalNode,
  MatchResult,
  PieceClassification,
  SuggestedSchema,
} from "./types"

/** A fallback base id for a suggestion, from its role when present, else tag. */
function heuristicId(node: FunctionalNode): string {
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

/** Builds the evidence block carried on every suggestion for review. */
function toEvidence(
  result: MatchResult,
): SuggestedSchema["evidence"] {
  const { sample } = result.piece
  return {
    tag: sample.tag,
    role: sample.role,
    count: result.piece.count,
    text: sample.evidence.text,
    classes: sample.evidence.classes,
    attrs: sample.evidence.attrs,
    childOutline: childOutline(sample),
  }
}

/**
 * Builds one draft schema proposal from an unmatched piece. When the model
 * classified the piece, its name, level, intent, tags, and property hints are
 * used and the source is `model`. Otherwise a heuristic description is derived
 * from the tag and role.
 */
function toSuggestion(
  result: MatchResult,
  id: string,
  classification: PieceClassification | null,
): SuggestedSchema {
  const { sample } = result.piece
  const evidence = toEvidence(result)

  if (classification) {
    return {
      id,
      name: classification.name,
      level: classification.level,
      intent: classification.intent,
      tags: classification.tags,
      properties: classification.properties ?? {},
      default: { children: resolvableChildren(sample) },
      source: "model",
      evidence,
    }
  }

  const roleText = sample.role ? ` with role "${sample.role}"` : ""
  const tags = [sample.tag, sample.role ?? "", "imported", "web"].filter(
    (tag) => tag !== "",
  )
  return {
    id,
    name: capitalCase(sample.role ?? sample.tag),
    level: sample.level,
    intent: `Imported ${sample.level} from a <${sample.tag}> element${roleText}. Review and refine before adding to the catalog.`,
    tags,
    properties: {},
    default: { children: resolvableChildren(sample) },
    source: "heuristic",
    evidence,
  }
}

/**
 * Drafts a schema proposal for every unmatched piece. `classifications` aligns
 * with `unmatched` by index and may hold null where the model could not name a
 * piece. Ids prefer the model's id, fall back to the tag or role, and are
 * disambiguated with a numeric suffix on collision so each suggestion gets its
 * own file.
 */
export function suggestSchemas(
  unmatched: MatchResult[],
  classifications: Array<PieceClassification | null> = [],
): SuggestedSchema[] {
  const used = new Map<string, number>()
  const suggestions: SuggestedSchema[] = []

  unmatched.forEach((result, index) => {
    const classification = classifications[index] ?? null
    const base =
      classification && classification.id !== ""
        ? classification.id
        : heuristicId(result.piece.sample)
    const seen = used.get(base) ?? 0
    used.set(base, seen + 1)
    const id = seen === 0 ? base : `${base}${seen + 1}`
    suggestions.push(toSuggestion(result, id, classification))
  })

  return suggestions
}
