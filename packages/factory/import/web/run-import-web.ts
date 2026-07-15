import type { FileToExport } from "../../export/types"
import { classifyPieces } from "./classify"
import { countNodes, deconstruct } from "./deconstruct"
import { dedupe } from "./dedupe"
import { fetchDom } from "./fetch-dom"
import { matchPieces } from "./match-catalog"
import { buildReport } from "./report"
import { suggestSchemas } from "./suggest-schema"
import type {
  ImportWebResult,
  PieceClassification,
  RunImportWebOptions,
} from "./types"

/**
 * Runs the web import pipeline for one URL: fetch and parse the DOM,
 * deconstruct it into functional pieces, dedupe to the smallest unique set,
 * test each piece against the component catalog, and draft a schema proposal
 * for every piece the catalog cannot build. When classification is enabled, the
 * local model names each unmatched piece; otherwise a heuristic description is
 * used. Returns the files to write (one JSON per suggestion plus a markdown
 * report) and a run summary.
 */
export async function runImportWeb(
  url: string,
  options: RunImportWebOptions = {},
): Promise<ImportWebResult> {
  const document = await fetchDom(url)
  const root = deconstruct(document)
  if (!root) {
    throw new Error(`No <body> content found at ${url}.`)
  }

  const rawNodeCount = countNodes(root)
  const pieces = dedupe(root)
  const results = matchPieces(pieces)
  const matchedCount = results.filter((result) => result.matched !== null).length
  const unmatched = results.filter((result) => result.matched === null)

  let classifications: Array<PieceClassification | null> = []
  if (options.classify !== false) {
    const classifyOptions = options.classify === undefined ? {} : options.classify
    classifications = await classifyPieces(
      unmatched.map((result) => result.piece),
      classifyOptions,
    )
  }

  const suggestions = suggestSchemas(unmatched, classifications)
  const classifiedCount = suggestions.filter(
    (suggestion) => suggestion.source === "model",
  ).length

  const report = buildReport({
    url,
    rawNodeCount,
    pieces,
    results,
    suggestions,
  })

  const files: FileToExport[] = [{ path: "report.md", content: report }]
  for (const suggestion of suggestions) {
    files.push({
      path: `schemas/${suggestion.id}.schema.json`,
      content: JSON.stringify(suggestion, null, 2),
    })
  }

  return {
    files,
    summary: {
      url,
      rawNodeCount,
      dedupedCount: pieces.length,
      matchedCount,
      unmatchedCount: suggestions.length,
      classifiedCount,
      suggestions: suggestions.map((suggestion) => suggestion.id),
    },
  }
}
