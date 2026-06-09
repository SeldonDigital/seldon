// Collapses ValueType.EMPTY value objects in component schemas onto a single
// line. Runs before Prettier in the format pipeline; Prettier's default
// objectWrap ("preserve") then keeps the single-line form.
//
// Targets only the exact shape `{ type: <ns?>ValueType.EMPTY, value: null }`,
// so it cannot swallow neighboring objects, and re-running is a no-op.
import { readFile, readdir, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const CATALOG_DIR = join(ROOT, "packages/core/components/catalog")

const EMPTY_VALUE_PATTERN =
  /\{\s*type:\s*([A-Za-z_$][\w$]*\.)?ValueType\.EMPTY,\s*value:\s*null,?\s*\}/g

async function collectSchemaFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name)
      if (entry.isDirectory()) return collectSchemaFiles(path)
      if (entry.isFile() && entry.name.endsWith(".schema.ts")) return [path]
      return []
    }),
  )
  return files.flat()
}

async function run() {
  const files = await collectSchemaFiles(CATALOG_DIR)
  let changed = 0

  await Promise.all(
    files.map(async (file) => {
      const source = await readFile(file, "utf8")
      const next = source.replace(
        EMPTY_VALUE_PATTERN,
        (_match, ns = "") => `{ type: ${ns}ValueType.EMPTY, value: null }`,
      )
      if (next !== source) {
        await writeFile(file, next)
        changed += 1
      }
    }),
  )

  console.info(
    `collapse-empty-values: scanned ${files.length} schema file(s), updated ${changed}.`,
  )
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
