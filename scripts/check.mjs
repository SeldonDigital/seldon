// Runs the full check suite regardless of the working directory it is invoked
// from, so `npm run check` behaves the same at the root or inside any package.
// Every step runs even when an earlier one fails, and the run always completes
// so the summary reports each step. A failing step that has a fix command reads
// as WARN, and one with no fix reads as FAIL.
import { spawnSync } from "node:child_process"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")

// Each step is an npm script, the label the summary prints, and the command that
// fixes it when there is one. A failing step with a `fix` reads as WARN, one
// without as FAIL.
const STEPS = [
  { script: "format:check", label: "Format", fix: "npm run format" },
  { script: "lint:all", label: "Lint", fix: "npm run format" },
  { script: "typecheck:all", label: "Typecheck" },
  { script: "test", label: "Tests" },
  { script: "bindings:check", label: "Bindings", fix: "npm run bindings" },
]

// Colors are dropped when stdout is not a terminal or NO_COLOR is set, so piped
// logs stay plain.
const useColor = Boolean(process.stdout.isTTY) && !process.env.NO_COLOR
const COLORS = { PASS: "32", WARN: "38;5;208", FAIL: "31" }

function paint(status) {
  if (!useColor) return status

  return `\x1b[${COLORS[status]}m${status}\x1b[0m`
}

const results = []

for (const step of STEPS) {
  const startedAt = Date.now()
  const outcome = spawnSync("npm", ["run", step.script], {
    cwd: ROOT,
    stdio: "inherit",
    shell: process.platform === "win32",
  })

  const passed = outcome.status === 0
  const status = passed ? "PASS" : step.fix ? "WARN" : "FAIL"

  results.push({ ...step, status, seconds: (Date.now() - startedAt) / 1000 })
}

const labelWidth = Math.max(...results.map((result) => result.label.length))

console.log("\nCheck summary:")

for (const result of results) {
  const label = result.label.padEnd(labelWidth)
  const seconds = `${result.seconds.toFixed(1)}s`.padStart(6)
  const fix = result.status === "WARN" && result.fix ? `  fix: ${result.fix}` : ""

  console.log(`  ${paint(result.status)}  ${label}  ${seconds}${fix}`)
}

// A trailing blank line spaces the summary off the next shell prompt.
console.log("")
