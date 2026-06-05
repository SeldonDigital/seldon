/*
 * Appends the locally hosted IBM Plex Sans as the trailing fallback to every
 * font-family declaration in the editor's generated seldon stylesheets.
 *
 * The seldon component stylesheets declare single-name fonts (for example
 * `font-family: Inter;`). When that font is inaccessible the browser drops to its
 * own default instead of the editor font. Appending `"IBM Plex Sans"` (registered
 * as a self-hosted @font-face in globals.css) keeps the editor chrome on IBM Plex
 * Sans when a declared font cannot load.
 *
 * The transform is idempotent: it skips `inherit` and any value that already
 * contains `IBM Plex Sans`, so it is safe to run on every dev/build and after the
 * stylesheets are regenerated.
 */
import { readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const FALLBACK = '"IBM Plex Sans"'

const editorRoot = join(dirname(fileURLToPath(import.meta.url)), "..")

const targets = [
  "app/seldon/styles.css",
  "app/seldon/chrome/styles.css",
]

let changedFiles = 0

for (const relativePath of targets) {
  const filePath = join(editorRoot, relativePath)
  const css = readFileSync(filePath, "utf8")

  const next = css.replace(/font-family:\s*([^;{}]+);/g, (match, value) => {
    const trimmed = value.trim()
    if (trimmed === "inherit" || trimmed.includes("IBM Plex Sans")) {
      return match
    }
    return `font-family: ${trimmed}, ${FALLBACK};`
  })

  if (next !== css) {
    writeFileSync(filePath, next)
    changedFiles += 1
    console.log(`Appended IBM Plex Sans fallback in ${relativePath}`)
  }
}

if (changedFiles === 0) {
  console.log("Chrome font fallback already applied; no changes.")
}
