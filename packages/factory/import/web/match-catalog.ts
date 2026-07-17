import { catalog, findComponentSchema } from "@seldon/core/components/catalog"
import { ComponentId } from "@seldon/core/components/constants"
import {
  type ComponentSchema,
  isComplexSchema,
} from "@seldon/core/components/types"

import type { DedupedPiece, FunctionalNode, MatchResult } from "./types"

/** Minimum overlap between a piece and a schema's children to count as a match. */
const MATCH_THRESHOLD = 0.5

/** The complex schemas a container piece can structurally match against. */
const COMPLEX_SCHEMAS: ComponentSchema[] = [
  ...catalog.elements,
  ...catalog.parts,
  ...catalog.modules,
  ...catalog.screens,
].filter(isComplexSchema)

/** The catalog ids a piece's direct children seed from, ignoring unknowns. */
function childSeeds(node: FunctionalNode): ComponentId[] {
  return node.children
    .map((child) => child.seededComponent)
    .filter((id): id is ComponentId => id !== null)
}

/** Top-level component ids a complex schema composes in its default tree. */
function schemaChildIds(schema: ComponentSchema): ComponentId[] {
  if (!isComplexSchema(schema)) return []
  return (schema.default.children ?? []).map((child) => child.component)
}

/** Jaccard overlap of two id lists treated as sets. */
function overlap(a: ComponentId[], b: ComponentId[]): number {
  const setA = new Set(a)
  const setB = new Set(b)
  if (setA.size === 0 || setB.size === 0) return 0
  let shared = 0
  for (const id of setA) if (setB.has(id)) shared += 1
  const unionSize = new Set([...setA, ...setB]).size
  return unionSize === 0 ? 0 : shared / unionSize
}

/** Finds the complex schema whose child composition best overlaps the piece. */
function bestStructuralMatch(
  seeds: ComponentId[],
): { id: ComponentId; score: number } | null {
  let best: { id: ComponentId; score: number } | null = null
  for (const schema of COMPLEX_SCHEMAS) {
    const score = overlap(seeds, schemaChildIds(schema))
    if (score > 0 && (!best || score > best.score)) {
      best = { id: schema.id, score }
    }
  }
  return best
}

/** Tests one deduped piece against the catalog and explains the outcome. */
export function matchPiece(piece: DedupedPiece): MatchResult {
  const { sample } = piece
  const isLeaf = sample.children.length === 0

  // A leaf whose tag maps to a catalog component is a direct match.
  if (isLeaf) {
    if (sample.seededComponent && findComponentSchema(sample.seededComponent)) {
      return {
        piece,
        matched: sample.seededComponent,
        reason: `Leaf <${sample.tag}> maps to catalog "${sample.seededComponent}".`,
      }
    }
    return {
      piece,
      matched: null,
      reason: `Leaf <${sample.tag}> has no catalog primitive.`,
    }
  }

  const seeds = childSeeds(sample)

  // A seeded container whose children line up with the seed schema wins outright.
  if (sample.seededComponent) {
    const schema = findComponentSchema(sample.seededComponent)
    if (schema) {
      const score = overlap(seeds, schemaChildIds(schema))
      if (score >= MATCH_THRESHOLD || seeds.length === 0) {
        return {
          piece,
          matched: sample.seededComponent,
          reason: `<${sample.tag}> maps to catalog "${sample.seededComponent}" (child overlap ${score.toFixed(2)}).`,
        }
      }
    }
  }

  // Otherwise search for the closest structural fit across complex schemas.
  const best = bestStructuralMatch(seeds)
  if (best && best.score >= MATCH_THRESHOLD) {
    return {
      piece,
      matched: best.id,
      reason: `Children match catalog "${best.id}" (overlap ${best.score.toFixed(2)}).`,
    }
  }

  const seedList = seeds.length ? seeds.join(", ") : "no recognized children"
  return {
    piece,
    matched: null,
    reason: `No catalog component composes <${sample.tag}> with ${seedList}.`,
  }
}

/** Tests every deduped piece against the catalog. */
export function matchPieces(pieces: DedupedPiece[]): MatchResult[] {
  return pieces.map(matchPiece)
}
