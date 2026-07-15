import type { FileToExport } from "../../export/types"
import { countNodes, deconstruct } from "./deconstruct"
import { dedupe } from "./dedupe"
import { fetchDom } from "./fetch-dom"
import { matchPieces } from "./match-catalog"
import { buildReport } from "./report"
import { suggestSchemas } from "./suggest-schema"
import type { ImportWebResult } from "./types"

/**
 * Runs the deterministic web import pipeline for one URL: fetch and parse the
 * DOM, deconstruct it into functional pieces, dedupe to the smallest unique
 * set, test each piece against the component catalog, and draft a schema
 * proposal for every piece the catalog cannot build. Returns the files to write
 * (one JSON per suggested schema plus a markdown report) and a run summary.
 */
export async function runImportWeb(url: string): Promise<ImportWebResult> {
  const document = await fetchDom(url)
  const root = deconstruct(document)
  if (!root) {
    throw new Error(`No <body> content found at ${url}.`)
  }

  const rawNodeCount = countNodes(root)
  const pieces = dedupe(root)
  const results = matchPieces(pieces)
  const suggestions = suggestSchemas(results)
  const matchedCount = results.filter((result) => result.matched !== null).length

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
      suggestions: suggestions.map((suggestion) => suggestion.id),
    },
  }
}
