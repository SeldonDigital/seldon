import type { DedupedPiece, MatchResult, SuggestedSchema } from "./types"

/** A short human label for a piece, such as `nav#navigation (3 children)`. */
function pieceLabel(piece: DedupedPiece): string {
  const { sample } = piece
  const role = sample.role ? `#${sample.role}` : ""
  const childCount = sample.children.length
  const shape = childCount === 0 ? "leaf" : `${childCount} children`
  return `${sample.tag}${role} (${shape})`
}

/** The detail block for one suggested schema. */
function suggestionDetail(suggestion: SuggestedSchema): string[] {
  const lines: string[] = []
  lines.push(`### ${suggestion.name}`)
  lines.push("")
  lines.push(`- File: \`schemas/${suggestion.id}.schema.json\``)
  lines.push(`- Level: ${suggestion.level}`)
  lines.push(`- Named by: ${suggestion.source === "model" ? "model" : "heuristic"}`)
  lines.push(`- Intent: ${suggestion.intent}`)
  const evidence = suggestion.evidence
  if (evidence.classes?.length) {
    lines.push(`- Classes: ${evidence.classes.join(" ")}`)
  }
  if (evidence.text) {
    lines.push(`- Text: "${evidence.text}"`)
  }
  if (evidence.attrs && Object.keys(evidence.attrs).length > 0) {
    lines.push(`- Attributes: ${JSON.stringify(evidence.attrs)}`)
  }
  if (evidence.childOutline.length > 0) {
    lines.push(`- Children: ${evidence.childOutline.join(", ")}`)
  }
  lines.push("")
  return lines
}

/**
 * Builds the markdown report for one import run. It states the source, the
 * counts, a table of matched pieces, a table of unmatched pieces, and a detail
 * block for each drafted schema with its name and evidence.
 */
export function buildReport(input: {
  url: string
  rawNodeCount: number
  pieces: DedupedPiece[]
  results: MatchResult[]
  suggestions: SuggestedSchema[]
}): string {
  const { url, rawNodeCount, pieces, results, suggestions } = input
  const matched = results.filter((result) => result.matched !== null)
  const unmatched = results.filter((result) => result.matched === null)
  const classifiedCount = suggestions.filter(
    (suggestion) => suggestion.source === "model",
  ).length

  const lines: string[] = []
  lines.push("# Components Report")
  lines.push("")
  lines.push(`Source: ${url}`)
  lines.push(`Generated: ${new Date().toISOString()}`)
  lines.push("")

  lines.push("## Summary")
  lines.push("")
  lines.push(`- Raw DOM nodes: ${rawNodeCount}`)
  lines.push(`- Unique pieces after dedupe: ${pieces.length}`)
  lines.push(`- Matched to catalog: ${matched.length}`)
  lines.push(`- Unmatched: ${unmatched.length}`)
  lines.push(`- Suggested schemas: ${suggestions.length}`)
  lines.push(`- Named by model: ${classifiedCount}`)
  lines.push("")

  lines.push("## Matched Pieces")
  lines.push("")
  if (matched.length === 0) {
    lines.push("No pieces matched the catalog.")
  } else {
    lines.push("| Piece | Count | Catalog id | Reason |")
    lines.push("| --- | --- | --- | --- |")
    for (const result of matched) {
      lines.push(
        `| ${pieceLabel(result.piece)} | ${result.piece.count} | ${result.matched} | ${result.reason} |`,
      )
    }
  }
  lines.push("")

  lines.push("## Unmatched Pieces")
  lines.push("")
  if (unmatched.length === 0) {
    lines.push("Every piece matched the catalog. No new schemas are needed.")
  } else {
    lines.push("| Piece | Count | Name | Level | File |")
    lines.push("| --- | --- | --- | --- | --- |")
    unmatched.forEach((result, index) => {
      const suggestion = suggestions[index]
      if (!suggestion) return
      lines.push(
        `| ${pieceLabel(result.piece)} | ${result.piece.count} | ${suggestion.name} | ${suggestion.level} | schemas/${suggestion.id}.schema.json |`,
      )
    })
  }
  lines.push("")

  if (suggestions.length > 0) {
    lines.push("## Suggested Schemas")
    lines.push("")
    lines.push(
      "Each file is a draft proposal. Review the level, properties, and children, then author a real schema before syncing the catalog.",
    )
    lines.push("")
    for (const suggestion of suggestions) {
      lines.push(...suggestionDetail(suggestion))
    }
  }

  return lines.join("\n")
}
