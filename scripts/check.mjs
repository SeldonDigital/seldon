// Runs the full check suite regardless of the working directory it is invoked
// from, so `npm run check` behaves the same at the root or inside any package.
// Every step runs even when an earlier one fails, and the run always completes
// so the summary reports each step.
//
// A step reads as WARN when it fails but has a fix command, or when it passes
// but the tool still reported warnings (ESLint exits zero on warnings, so the
// output is scanned for them). A failing step with no fix reads as FAIL.
import { spawn } from "node:child_process"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")

// Each step is an npm script, the label the summary prints, and the command that
// fixes it when there is one.
const STEPS = [
  { script: "format:check", label: "Format", fix: "npm run format" },
  { script: "lint:all", label: "Lint", fix: "npm run format" },
  { script: "typecheck:all", label: "Typecheck" },
  { script: "test", label: "Tests" },
  { script: "bindings:check", label: "Bindings", fix: "npm run bindings" },
]

// Colors and the live spinner are dropped when stdout is not a terminal or
// NO_COLOR is set, so piped logs stay plain. Children are told to keep their own
// colors the same way.
const useColor = Boolean(process.stdout.isTTY) && !process.env.NO_COLOR
const COLORS = { PASS: "32", WARN: "38;5;208", FAIL: "31" }

function paint(status) {
  if (!useColor) return status

  return `\x1b[${COLORS[status]}m${status}\x1b[0m`
}

// The spinner frames and the pause after any output before it draws again, so a
// step that is actively streaming keeps the terminal to itself and only a quiet
// step (ESLint, tsc, and the bindings check while they work) shows the spinner.
const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
const SPINNER_INTERVAL = 100
const SPINNER_QUIET = 300
const CLEAR_LINE = "\r\x1b[K"

// Runs one step, streaming its output live while collecting a copy to scan for
// warnings afterwards. On a terminal a spinner tracks the step's elapsed time
// during the stretches when it prints nothing, so every step gives feedback.
function runStep(step) {
  return new Promise((resolve) => {
    const child = spawn("npm", ["run", step.script], {
      cwd: ROOT,
      env: { ...process.env, FORCE_COLOR: useColor ? "1" : "0" },
      shell: process.platform === "win32",
    })

    let output = ""
    const startedAt = Date.now()
    let lastOutputAt = startedAt
    let spinnerDrawn = false
    let frame = 0

    const clearSpinner = () => {
      if (!spinnerDrawn) return
      process.stdout.write(CLEAR_LINE)
      spinnerDrawn = false
    }

    const timer = useColor
      ? setInterval(() => {
          if (Date.now() - lastOutputAt < SPINNER_QUIET) return

          const elapsed = Math.round((Date.now() - startedAt) / 1000)
          const glyph = SPINNER_FRAMES[frame % SPINNER_FRAMES.length]

          process.stdout.write(`${CLEAR_LINE}${glyph} ${step.label}… ${elapsed}s`)
          spinnerDrawn = true
          frame++
        }, SPINNER_INTERVAL)
      : null

    const write = (stream, chunk) => {
      output += chunk
      lastOutputAt = Date.now()
      clearSpinner()
      stream.write(chunk)
    }

    child.stdout.on("data", (chunk) => write(process.stdout, chunk))
    child.stderr.on("data", (chunk) => write(process.stderr, chunk))

    child.on("close", (code) => {
      if (timer) clearInterval(timer)
      clearSpinner()
      resolve({ code, output })
    })
  })
}

// The warnings a tool summary reports, read from its "(… , N warnings)" tallies
// with the color codes stripped. Individual warning lines carry no count, so only
// the summary lines add up.
function countWarnings(output) {
  const plain = output.replace(/\x1b\[[0-9;]*m/g, "")
  const matches = plain.matchAll(/(\d+)\s+warnings?\b/gi)

  let total = 0

  for (const match of matches) {
    total += Number(match[1])
  }

  return total
}

const results = []

for (const step of STEPS) {
  const startedAt = Date.now()
  const { code, output } = await runStep(step)
  const passed = code === 0
  const warnings = countWarnings(output)

  const status = !passed ? (step.fix ? "WARN" : "FAIL") : warnings > 0 ? "WARN" : "PASS"

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
