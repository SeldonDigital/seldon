// Formats the whole repo regardless of the working directory it is invoked
// from, so `npm run format` produces the same result at the root or inside any
// package. Runs the schema readability pass, then ESLint --fix per package, then
// Prettier over every supported file type. ESLint makes the structural fixes
// (splitting type imports, adding braces) and Prettier is the final normalizer
// that sorts imports and settles width, so ESLint must run first.
import { execFileSync } from "node:child_process"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const GLOB = "**/*.{ts,tsx,json,css,js,mjs}"

// Packages that own an eslint.config.mjs, linted in place with their own config.
const ESLINT_PACKAGES = [
  "packages/core",
  "packages/factory",
  "packages/ai",
  "packages/editor/shared",
  "packages/editor/apps/react",
  "packages/editor/apps/vue",
]

execFileSync("node", [join(ROOT, "scripts/collapse-empty-values.mjs")], {
  cwd: ROOT,
  stdio: "inherit",
})

for (const pkg of ESLINT_PACKAGES) {
  // ESLint exits non-zero when unfixable problems remain. Apply what it can and
  // keep going, so remaining warnings or errors do not abort the format pass.
  try {
    execFileSync("npx", ["eslint", ".", "--fix"], {
      cwd: join(ROOT, pkg),
      stdio: "inherit",
      shell: process.platform === "win32",
    })
  } catch {
    // Intentionally ignored: fixes are already written to disk.
  }
}

execFileSync("npx", ["prettier", "--write", GLOB], {
  cwd: ROOT,
  stdio: "inherit",
  shell: process.platform === "win32",
})
