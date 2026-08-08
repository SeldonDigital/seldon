import path from "node:path"
import { fileURLToPath } from "node:url"

import { build } from "esbuild"

/**
 * Bundles a package's main entry into a single self-contained ESM file for the
 * `node` runtime condition.
 *
 * The engine packages are authored bundler-first: they use extensionless,
 * directory-style imports (`export * from "./components/constants"`). `tsc`
 * keeps those as-is, so the emitted `dist/index.js` cannot run under native
 * Node ESM. Bundling the entry from source inlines those relative imports into
 * one file. Dependencies are inlined too, so the result runs under plain Node
 * with no further module resolution. This also sidesteps CJS subpath specifiers
 * such as `lodash/merge` that native Node ESM cannot resolve. The `.d.ts` files
 * from `tsc` are left untouched.
 *
 * Usage:
 *   node scripts/bundle-package-entry.mjs [--inline-core] [--external <pkg>]... <entry> <outfile>
 *
 * `--inline-core` aliases `@seldon/core` to its source so its deep, directory
 * subpath imports resolve at bundle time. Use it for packages that import core
 * through subpaths that core's `exports` wildcard cannot resolve at runtime.
 *
 * `--external <pkg>` keeps a dependency out of the bundle so it resolves from
 * the consumer's `node_modules` at runtime. Use it for packages that cannot be
 * bundled into ESM, such as ones that call `require()` on Node builtins.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.dirname(scriptDir)
const coreSrc = path.join(repoRoot, "packages/core")

const args = process.argv.slice(2)
const externals = []
const positional = []
let inlineCore = false

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index]

  if (arg === "--inline-core") {
    inlineCore = true
  } else if (arg === "--external") {
    index += 1
    externals.push(args[index])
  } else {
    positional.push(arg)
  }
}

const [entry, outfile] = positional

if (!entry || !outfile) {
  console.error(
    "Usage: bundle-package-entry.mjs [--inline-core] [--external <pkg>]... <entry> <outfile>",
  )
  process.exit(1)
}

const cwd = process.cwd()

await build({
  entryPoints: [path.resolve(cwd, entry)],
  outfile: path.resolve(cwd, outfile),
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node22",
  logLevel: "info",
  external: externals,
  alias: inlineCore ? { "@seldon/core": coreSrc } : {},
})

console.log(`Bundled ${entry} -> ${outfile}${inlineCore ? " (core inlined)" : ""}`)
