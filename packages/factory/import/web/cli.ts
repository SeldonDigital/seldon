import fs from "node:fs/promises"
import path from "node:path"

import type { FileToExport } from "../../export/types"
import { runImportWeb } from "./run-import-web"

const REPORT_FOLDER = "Components Report"

/** Writes one file, creating parent directories as needed. */
async function writeFile(baseDir: string, file: FileToExport): Promise<void> {
  const target = path.join(baseDir, file.path)
  await fs.mkdir(path.dirname(target), { recursive: true })
  const content =
    typeof file.content === "string"
      ? file.content
      : Buffer.from(file.content)
  await fs.writeFile(target, content)
}

/**
 * Standalone entry for the web import pipeline. Fetches the given URL, runs the
 * deterministic deconstruction and matching, then writes the report and every
 * suggested schema JSON into a "Components Report" folder under the output
 * directory.
 *
 * Run with: bun packages/factory/import/web/cli.ts <url> [outDir]
 */
async function main(): Promise<void> {
  const [url, outDir = process.cwd()] = process.argv.slice(2)
  if (!url) {
    console.error("Usage: bun packages/factory/import/web/cli.ts <url> [outDir]")
    process.exit(1)
  }

  console.log(`Importing ${url} ...`)
  const result = await runImportWeb(url)

  const baseDir = path.join(path.resolve(outDir), REPORT_FOLDER)
  for (const file of result.files) {
    await writeFile(baseDir, file)
  }

  const { summary } = result
  console.log(`Raw DOM nodes:      ${summary.rawNodeCount}`)
  console.log(`Unique pieces:      ${summary.dedupedCount}`)
  console.log(`Matched to catalog: ${summary.matchedCount}`)
  console.log(`Unmatched:          ${summary.unmatchedCount}`)
  console.log(`Wrote ${result.files.length} files to ${baseDir}`)
}

void main()
