// Formats the whole repo regardless of the working directory it is invoked
// from, so `npm run format` produces the same result at the root or inside any
// package. Runs the schema readability pass first, then Prettier over every
// supported file type from the repo root.
import { execFileSync } from "node:child_process"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const GLOB = "**/*.{ts,tsx,json,css,js,mjs,md}"

execFileSync("node", [join(ROOT, "scripts/collapse-empty-values.mjs")], {
  cwd: ROOT,
  stdio: "inherit",
})

execFileSync("npx", ["prettier", "--write", GLOB], {
  cwd: ROOT,
  stdio: "inherit",
  shell: process.platform === "win32",
})
