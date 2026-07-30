import fs from "node:fs/promises"
import path from "node:path"

import { resolveBindingsConfig } from "./config"
import { scanBindings } from "./scan"
import { serializeBindings } from "./serialize"

import type { BindingWarning, BindingsFramework, FileSource } from "./types"

const USAGE =
  "Usage: bun packages/factory/bindings/cli.ts <projectRoot> [--framework react|vue] [--components seldon] [--out bindings.json]"

/**
 * Reads a project from disk. Node file access stays here rather than in the
 * library, so the scan itself keeps working in a browser host where `node:fs`
 * does not exist.
 */
function createNodeFileSource(root: string): FileSource {
  return {
    async list() {
      const paths: string[] = []

      async function walk(relative: string) {
        const entries = await fs.readdir(path.join(root, relative), { withFileTypes: true })

        for (const entry of entries) {
          const next = relative ? `${relative}/${entry.name}` : entry.name

          if (entry.isDirectory()) {
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
      return fs.readFile(path.join(root, relative), "utf8")
    },
  }
}

function getFlag(args: string[], name: string): string | undefined {
  const index = args.indexOf(`--${name}`)

  return index === -1 ? undefined : args[index + 1]
}

/**
 * Standalone entry for the bindings scan. Walks a project, reports which code
 * drives which ref and slot on the generated components, and writes the manifest.
 *
 * The generated components folder is excluded from the scan, so a project never
 * reports itself as a consumer of its own refs.
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const [root] = args.filter((arg) => !arg.startsWith("--") && !isFlagValue(args, arg))

  if (!root) {
    console.error(USAGE)
    process.exit(1)
  }

  const framework = (getFlag(args, "framework") ?? "react") as BindingsFramework

  if (framework !== "react" && framework !== "vue") {
    console.error(`Unknown framework "${framework}". Use "react" or "vue".`)
    process.exit(1)
  }

  const config = resolveBindingsConfig({
    framework,
    componentsFolder: getFlag(args, "components"),
  })

  const projectRoot = path.resolve(root)
  const manifest = await scanBindings(createNodeFileSource(projectRoot), config)

  const outPath = path.resolve(projectRoot, getFlag(args, "out") ?? "bindings.json")

  await fs.writeFile(outPath, serializeBindings(manifest), "utf8")

  const refCount = Object.keys(manifest.refs).length
  const slotCount = Object.values(manifest.slots).reduce(
    (total, bySlot) => total + Object.keys(bySlot).length,
    0,
  )

  console.log(`Framework:      ${manifest.framework}`)
  console.log(`Files scanned:  ${manifest.scannedFiles}`)
  console.log(`Refs bound:     ${refCount}`)
  console.log(`Slots bound:    ${slotCount}`)
  console.log(`Wrote ${outPath}`)

  reportWarnings(manifest.warnings)
}

/**
 * Reports every refs map whose name its file declares more than once. The manifest
 * is still written, because the rest of it is sound and the fix is a rename.
 */
function reportWarnings(warnings: BindingWarning[]): void {
  if (warnings.length === 0) return

  console.warn(
    `\n${warnings.length} refs map${warnings.length === 1 ? "" : "s"} resolved by an ambiguous name. ` +
      "The first declaration wins, so the entries reported may belong to another one. " +
      "Rename each map after what it drives.",
  )

  for (const warning of warnings) {
    console.warn(`  ${warning.file}:${warning.line} "${warning.name}" x${warning.declarations}`)
  }
}

/** Reports whether a bare argument is the value of a preceding flag. */
function isFlagValue(args: string[], arg: string): boolean {
  const index = args.indexOf(arg)

  return index > 0 && args[index - 1].startsWith("--")
}

void main()
