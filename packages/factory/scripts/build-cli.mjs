import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { build } from "esbuild"

/**
 * Bundles the `seldon-export` CLI into a single self-contained file.
 *
 * The export code imports `@seldon/core` through deep subpaths, some of which
 * are directory indexes. Core's `exports` wildcard cannot resolve those at
 * runtime, so the CLI is bundled with `@seldon/core` aliased to its source,
 * where a bundler resolves directory indexes normally. The result runs under
 * plain Node with no module-resolution surprises. Asset files are still read at
 * runtime from the installed `@seldon/core` by the resolved asset reader.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const factoryRoot = path.dirname(scriptDir)
const coreRoot = path.resolve(factoryRoot, "..", "core")
const entry = path.join(factoryRoot, "export/cli/index.ts")
const outfile = path.join(factoryRoot, "dist/export/cli/index.js")

await build({
  entryPoints: [entry],
  outfile,
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node22",
  logLevel: "info",
  alias: {
    "@seldon/core": coreRoot,
  },
})

fs.chmodSync(outfile, 0o755)

console.log(`Built CLI bundle at ${path.relative(factoryRoot, outfile)}`)
