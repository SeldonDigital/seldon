/*****
 *
 * This code was generated using Seldon (https://github.com/SeldonDigital/seldon)
 *
 * License: https://github.com/SeldonDigital/seldon/blob/main/LICENSE.md
 * Do not redistribute or sublicense without permission.
 *
 * You may not use this software, or any derivative works of it, in whole or in part,
 * for the purposes of training, fine-tuning, or otherwise improving (directly or indirectly)
 * any machine learning or artificial intelligence system without written permission.
 *
 *****/

/**
 * Generates the Seldon binding manifest for this project.
 *
 * What it does
 *   Walks this project's source files and records which code drives which ref
 *   and which slot on the generated Seldon components. Read it alongside the
 *   `views` in `seldon/refs/index.ts` to follow a ref end to end, from the
 *   workspace node that declares it to the code that sets it.
 *
 * What it reads
 *   Source files under the project root, skipping the generated components
 *   folder and the usual dependency and build folders. It reads nothing outside
 *   the project root.
 *
 * What it writes
 *   One file, `seldon/refs/bindings.json`. It creates and changes nothing else.
 *
 * What it needs
 *   `typescript` for the full scan, resolved
 *   from this project's own `node_modules`. When a parser is missing, the scan
 *   falls back to a shallow mode that reports ref and prop keys with their file
 *   and line, and reports that it did so.
 *
 * It makes no network requests and runs offline.
 *
 * Before you run it
 *   The Seldon factory generated this file. Do not run a copy that was edited by
 *   hand. See `seldon/scripts/README.md` for how to check it.
 *
 * Usage
 *   node seldon/scripts/generate-bindings.mjs [options]
 *
 *   --root <path>        Project root to scan. Defaults to the folder holding
 *                        `seldon`.
 *   --components <path>  Generated components folder, relative to the root.
 *   --out <path>         Manifest path, relative to the root.
 *   --check              Compare against the manifest on disk and exit 1 on any
 *                        difference, writing nothing. For continuous integration.
 */
import fs from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

const FRAMEWORK = "react"
const COMPONENTS_FOLDER = "seldon"

/**
 * Parsers the full scan needs. This export emitted the react front ends only,
 * so the framework is fixed and the list with it.
 */
const REQUIRED_PARSERS = ["typescript"]

/** Never walked, however the config is set, so a scan cannot stall on a dependency tree. */
const PRUNED_DIRECTORIES = new Set([
  "node_modules",
  "dist",
  "build",
  ".next",
  ".nuxt",
  ".git",
  "coverage",
])

const args = process.argv.slice(2)

const componentsFolder = readFlag("components") ?? COMPONENTS_FOLDER
const root = path.resolve(readFlag("root") ?? getDefaultRoot())
const outRelative = readFlag("out") ?? componentsFolder + "/refs/bindings.json"
const check = args.includes("--check")

const { resolveBindingsConfig } = await import("./lib/config.mjs")
const { serializeBindings } = await import("./lib/serialize.mjs")

const config = resolveBindingsConfig({ framework: FRAMEWORK, componentsFolder })
const source = createNodeFileSource(root, config)
const missing = await findMissingParsers()

const manifest =
  missing.length === 0
    ? await (await import("./lib/scan.mjs")).scanBindings(source, config)
    : await (await import("./lib/shallow.mjs")).scanBindingsShallow(source, config)

const text = serializeBindings(manifest)
const outPath = path.resolve(root, outRelative)

if (check) {
  const existing = await readText(outPath)

  if (existing === text) {
    console.log("Binding manifest is up to date.")
    process.exit(0)
  }

  console.error(
    "Binding manifest is out of date. Run without --check to update " + outRelative + ".",
  )
  process.exit(1)
}

await fs.mkdir(path.dirname(outPath), { recursive: true })
await fs.writeFile(outPath, text, "utf8")

report()

/**
 * Reads this project from disk. An excluded or pruned folder is never entered,
 * so the walk costs no more than the source tree it reports.
 */
function createNodeFileSource(projectRoot, bindingsConfig) {
  return {
    async list() {
      const paths = []

      async function walk(relative) {
        const entries = await fs.readdir(path.join(projectRoot, relative), { withFileTypes: true })

        for (const entry of entries) {
          const next = relative ? relative + "/" + entry.name : entry.name

          if (entry.isDirectory()) {
            if (isPruned(next, entry.name, bindingsConfig)) continue

            await walk(next)
          } else if (entry.isFile()) {
            paths.push(next)
          }
        }
      }

      await walk("")

      return paths
    },

    read(relative) {
      return fs.readFile(path.join(projectRoot, relative), "utf8")
    },
  }
}

function isPruned(relative, name, bindingsConfig) {
  if (PRUNED_DIRECTORIES.has(name)) return true

  return bindingsConfig.exclude.some(
    (folder) => relative === folder || relative.startsWith(folder + "/"),
  )
}

/** Parsers this project does not provide. An empty list means the full scan runs. */
async function findMissingParsers() {
  const absent = []

  for (const specifier of REQUIRED_PARSERS) {
    try {
      await import(specifier)
    } catch {
      absent.push(specifier)
    }
  }

  return absent
}

/** The folder holding the generated components folder. */
function getDefaultRoot() {
  const scriptsDirectory = path.dirname(fileURLToPath(import.meta.url))
  const steps = COMPONENTS_FOLDER.split("/").length + 1

  return path.resolve(scriptsDirectory, ...Array(steps).fill(".."))
}

function readFlag(name) {
  const index = args.indexOf("--" + name)

  return index === -1 ? undefined : args[index + 1]
}

async function readText(filePath) {
  try {
    return await fs.readFile(filePath, "utf8")
  } catch {
    return null
  }
}

function report() {
  const refCount = Object.keys(manifest.refs).length
  const slotCount = Object.values(manifest.slots).reduce(
    (total, bySlot) => total + Object.keys(bySlot).length,
    0,
  )

  if (missing.length > 0) {
    console.warn(
      "Ran a shallow scan, because this project has no " +
        missing.join(" or ") +
        ". Ref and prop keys were recorded without the expressions or declarations behind them, " +
        "and positional slot props were skipped. Install " +
        missing.join(" and ") +
        " for the full scan.",
    )
  }

  const relative = path.relative(root, outPath)

  console.log("Mode:           " + manifest.mode)
  console.log("Framework:      " + manifest.framework)
  console.log("Files scanned:  " + manifest.scannedFiles)
  console.log("Refs bound:     " + refCount)
  console.log("Slots bound:    " + slotCount)
  console.log("Wrote " + (relative.startsWith("..") ? outPath : relative))
}
