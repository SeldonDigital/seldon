/*
 * Ensures a local Ollama server is running before the dev server starts, since
 * the AI agent (Pi) talks to Ollama's OpenAI-compatible endpoint.
 *
 * Probe first: if the server already answers, do nothing. This is what keeps a
 * second `ollama serve` from ever launching, so `npm run dev` never stacks up
 * duplicate servers. Only when the probe fails does it spawn one detached.
 *
 * The server we spawn gets performance env applied (see PERF_ENV): flash
 * attention, a quantized KV cache, and a long keep-alive so the model stays
 * resident between turns instead of cold-reloading. These are read by
 * `ollama serve` at startup, so they only take effect on a server this script
 * starts. If Ollama is already running, the script says how to apply them.
 *
 * Best-effort: any failure (Ollama not installed, slow start) logs a warning and
 * exits 0, so a missing model backend never blocks the editor from starting.
 */
import { spawn } from "node:child_process"

const HOST = process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434"
const PROBE_URL = `${HOST}/api/tags`
const READY_TIMEOUT_MS = 20_000
const POLL_INTERVAL_MS = 500

/**
 * Performance settings for the spawned server. Only applied when this script
 * starts Ollama; an explicit value already in the environment always wins.
 *
 * - OLLAMA_FLASH_ATTENTION speeds up attention and lowers memory use.
 * - OLLAMA_KV_CACHE_TYPE shrinks the KV cache (needs flash attention). q8_0 is
 *   the high-quality default; q4_0 saves more memory at some quality cost.
 * - OLLAMA_KEEP_ALIVE keeps the model resident so idle turns skip the cold load.
 */
const PERF_ENV = {
  OLLAMA_FLASH_ATTENTION: "1",
  OLLAMA_KV_CACHE_TYPE: "q8_0",
  OLLAMA_KEEP_ALIVE: "30m",
}

/** True when the Ollama server answers its tags endpoint within the timeout. */
async function isRunning(timeoutMs = 1_000) {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    const response = await fetch(PROBE_URL, { signal: controller.signal })
    clearTimeout(timer)
    return response.ok
  } catch {
    return false
  }
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Spawns `ollama serve` detached so it outlives this short-lived script. The
 * performance env is layered under the current environment, so an explicit
 * value the user already exported takes priority.
 */
function startServer() {
  return new Promise((resolve) => {
    const child = spawn("ollama", ["serve"], {
      detached: true,
      stdio: "ignore",
      env: { ...PERF_ENV, ...process.env },
    })
    child.on("error", (error) => {
      if (error.code === "ENOENT") {
        console.warn(
          "Ollama is not installed or not on PATH. Skipping AI backend startup. See packages/ai/README.md.",
        )
      } else {
        console.warn(`Could not start Ollama: ${error.message}`)
      }
      resolve(false)
    })
    child.on("spawn", () => {
      child.unref()
      resolve(true)
    })
  })
}

/** One-line summary of the performance env applied to a spawned server. */
function perfSummary() {
  return Object.entries(PERF_ENV)
    .map(([key, value]) => `${key}=${process.env[key] ?? value}`)
    .join(" ")
}

async function main() {
  if (await isRunning()) {
    console.log(
      `Ollama already running at ${HOST}. Performance settings apply only to a server this script starts; run "npm run ollama:kill" then "npm run dev" to apply them.`,
    )
    return
  }

  console.log(
    `Ollama not detected at ${HOST}. Starting it with ${perfSummary()}...`,
  )
  const spawned = await startServer()
  if (!spawned) return

  const deadline = Date.now() + READY_TIMEOUT_MS
  while (Date.now() < deadline) {
    if (await isRunning()) {
      console.log(`Ollama is ready at ${HOST}.`)
      return
    }
    await delay(POLL_INTERVAL_MS)
  }
  console.warn(
    `Ollama did not become ready within ${READY_TIMEOUT_MS / 1000}s. The editor will start, but AI turns may fail until it is up.`,
  )
}

main().catch((error) => {
  console.warn(`Ollama startup check failed: ${error.message}`)
})
