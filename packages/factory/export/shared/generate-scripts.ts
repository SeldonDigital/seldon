import { createRequire } from "node:module"
import path from "node:path"

import { format } from "../react/format"
import { insertLicense } from "../react/generation/inserts/insert-license"

import type { BindingsFramework } from "../../bindings/types"
import type { ExportOptions, FileToExport } from "../types"
import type * as TypeScriptModule from "typescript"

/**
 * The library entry the emitted script replaces. The scan reads a project
 * through a file source, and supplying that source is the host's job, so the
 * emitted entry carries its own rather than shipping the repo's CLI.
 */
const REPLACED_BY_ENTRY = "cli.ts"

/**
 * Sources that belong to one framework, so the other never emits them. Only the
 * Vue front end qualifies: a React scan reads no `.vue` file and can never reach
 * it, while a Vue scan routes its `.ts` and `.tsx` files through the TypeScript
 * front end, which therefore ships in both.
 */
const FRAMEWORK_ONLY_SOURCES: Record<string, BindingsFramework> = {
  "scan-vue.ts": "vue",
}

/**
 * Each generated script lives in its own folder under `scripts/`, holding its
 * entry and the `lib/` it imports, so the tree reads as one folder per script and
 * a second script drops in beside this one without disturbing it. The shared
 * `README.md` and `INTEGRITY.json` stay at the `scripts/` root and cover them all.
 */
const BINDINGS_SCRIPT_DIR = "bindings"

/**
 * Emits the bindings scanner into `<components>/scripts/` as source the user can
 * read before running.
 *
 * The library is transpiled from `packages/factory/bindings` rather than written
 * out as templates, so the emitted `lib/` tracks the factory automatically and
 * the scanner has one implementation. That folder is flat, so `lib/` mirrors it
 * without rewriting an import. Transpiling only strips types, so each emitted
 * module stays one-to-one with its source, comments included.
 *
 * This means the bindings library must avoid TypeScript-only runtime features.
 * See `packages/factory/bindings/README.md`.
 */
export async function generateScripts(options: ExportOptions): Promise<FileToExport[]> {
  const reader = options.assetReader
  const sources = reader?.listBindingsSources?.() ?? []

  if (sources.length === 0 || !reader?.readBindingsSource) {
    return []
  }

  const ts = loadTypeScript(options.rootDirectory)

  if (!ts) {
    console.warn("Skipped the scripts export: no TypeScript found to transpile the scanner with.")

    return []
  }

  const scriptsFolder = `${options.output.componentsFolder}/scripts`
  const bindingsFolder = `${scriptsFolder}/${BINDINGS_SCRIPT_DIR}`
  const framework = getFramework(options)
  const files: FileToExport[] = []

  for (const source of sources) {
    if (source === REPLACED_BY_ENTRY) continue

    const frameworkOnly = FRAMEWORK_ONLY_SOURCES[source]

    if (frameworkOnly && frameworkOnly !== framework) continue

    const text = reader.readBindingsSource(source)

    if (!text) continue

    const code = transpile(ts, text)

    // A types-only module leaves nothing behind, so it is not emitted. Nothing
    // imports one for a value, which is what makes dropping it safe.
    if (!hasRuntimeCode(code)) continue

    files.push({
      path: `${bindingsFolder}/lib/${source.replace(/\.ts$/, ".mjs")}`,
      content: code,
    })
  }

  files.push({
    path: `${bindingsFolder}/generate-bindings.mjs`,
    content: getEntryScript(options),
  })

  await Promise.all(
    files.map(async (file) => {
      file.content = insertLicense(file.content as string)

      if (!options.skipFormat) file.content = await format(file.content as string)
    }),
  )

  files.push({
    path: `${scriptsFolder}/README.md`,
    content: getScriptsReadme(options),
  })

  return files
}

/** The bindings framework this export targets. Anything but Vue scans as React. */
function getFramework(options: ExportOptions): BindingsFramework {
  return options.target.framework === "vue" ? "vue" : "react"
}

/** Parsers the full scan needs, in the prose the emitted docs quote them as. */
function getParsers(framework: BindingsFramework): string[] {
  return framework === "vue" ? ["typescript", "@vue/compiler-sfc"] : ["typescript"]
}

function getParserList(framework: BindingsFramework): string {
  return getParsers(framework)
    .map((parser) => "`" + parser + "`")
    .join(" and ")
}

type TypeScript = typeof TypeScriptModule

/**
 * Resolves the repo's own TypeScript instead of importing it. The export is
 * bundled by its hosts, and TypeScript is a large CommonJS package that breaks
 * an ESM bundle, so it is loaded at runtime. Reading the bindings sources
 * already requires the repo on disk, so this asks for nothing new.
 */
function loadTypeScript(rootDirectory: string): TypeScript | null {
  try {
    const resolve = createRequire(path.join(rootDirectory, "package.json"))

    return resolve("typescript") as TypeScript
  } catch {
    return null
  }
}

/**
 * Strips types and rewrites relative specifiers for the module resolution the
 * emitted files run under. `ESNext` output keeps the source readable, since
 * nothing is downleveled.
 */
function transpile(ts: TypeScript, source: string): string {
  const output = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      removeComments: false,
      newLine: ts.NewLineKind.LineFeed,
    },
  }).outputText

  return addExtensions(output)
}

/** `from "./config"` and `import("./scan-vue")` both need the extension. */
function addExtensions(code: string): string {
  return code.replace(
    /((?:from|import)\s*\(?\s*)(["'])(\.\.?\/[^"']+)\2/g,
    (match, prefix, quote, specifier) => {
      if (specifier.endsWith(".mjs")) return match

      return `${prefix}${quote}${specifier}.mjs${quote}`
    },
  )
}

function hasRuntimeCode(code: string): boolean {
  const stripped = code
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "")
    .replace(/export\s*\{\s*\}\s*;?/g, "")
    .trim()

  return stripped.length > 0
}

/**
 * The entry the user runs. It owns everything the library deliberately leaves to
 * a host: reading the filesystem, parsing flags, choosing between the full and
 * shallow scan, and writing the manifest.
 *
 * The framework and components folder are baked from this export, so the common
 * case takes no arguments, and flags stay available for a project that moved the
 * folder. The framework takes no flag, because this export emitted only the front
 * ends that framework reaches.
 */
function getEntryScript(options: ExportOptions): string {
  const framework = getFramework(options)
  const componentsFolder = options.output.componentsFolder
  const parserList = getParserList(framework)

  return `/**
 * Generates the Seldon binding manifest for this project.
 *
 * What it does
 *   Walks this project's source files and records which code drives which ref
 *   and which slot on the generated Seldon components. Read it alongside the
 *   \`views\` in \`${componentsFolder}/refs/index.ts\` to follow a ref end to end, from the
 *   workspace node that declares it to the code that sets it.
 *
 * What it reads
 *   Source files under the project root, skipping the generated components
 *   folder and the usual dependency and build folders. It reads nothing outside
 *   the project root.
 *
 * What it writes
 *   One file, \`${componentsFolder}/refs/bindings.json\`. It creates and changes nothing else.
 *
 * What it needs
 *   ${parserList} for the full scan, resolved
 *   from this project's own \`node_modules\`. When a parser is missing, the scan
 *   falls back to a shallow mode that reports ref and prop keys with their file
 *   and line, and reports that it did so.
 *
 * It makes no network requests and runs offline.
 *
 * Before you run it
 *   The Seldon factory generated this file. Do not run a copy that was edited by
 *   hand. See \`${componentsFolder}/scripts/README.md\` for how to check it.
 *
 * Usage
 *   node ${componentsFolder}/scripts/bindings/generate-bindings.mjs [options]
 *
 *   --root <path>        Project root to scan. Defaults to the folder holding
 *                        \`${componentsFolder}\`.
 *   --components <path>  Generated components folder, relative to the root.
 *   --out <path>         Manifest path, relative to the root.
 *   --check              Compare against the manifest on disk and exit 1 on any
 *                        difference, writing nothing. For continuous integration.
 */
import fs from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

const FRAMEWORK = "${framework}"
const COMPONENTS_FOLDER = "${componentsFolder}"

/**
 * Parsers the full scan needs. This export emitted the ${framework} front ends only,
 * so the framework is fixed and the list with it.
 */
const REQUIRED_PARSERS = ${JSON.stringify(getParsers(framework))}

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

  console.error("Binding manifest is out of date. Run without --check to update " + outRelative + ".")
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
  // This entry sits at \`<components>/scripts/bindings/\`, so the root is the
  // components folder's own depth plus the \`scripts\` and \`bindings\` folders.
  const steps = COMPONENTS_FOLDER.split("/").length + 2

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

  reportWarnings(manifest.warnings ?? [])
}

/**
 * Reports every refs map whose name its file declares more than once. The manifest
 * is still written, because the rest of it is sound and the fix is a rename.
 */
function reportWarnings(warnings) {
  if (warnings.length === 0) return

  console.warn(
    "\\n" +
      warnings.length +
      " refs map" +
      (warnings.length === 1 ? "" : "s") +
      " resolved by an ambiguous name. The first declaration wins, so the entries " +
      "reported may belong to another one. Rename each map after what it drives.",
  )

  for (const warning of warnings) {
    console.warn(
      "  " + warning.file + ":" + warning.line + ' "' + warning.name + '" x' + warning.declarations,
    )
  }
}
`
}

/** Explains what the scripts do, how to run them, and what integrity does not cover. */
function getScriptsReadme(options: ExportOptions): string {
  const componentsFolder = options.output.componentsFolder
  const framework = getFramework(options)
  const parserList = getParserList(framework)

  return `# Seldon Scripts

The Seldon factory generated these scripts alongside the components in
\`${componentsFolder}\`. They are for you to run in your own project. Seldon never runs them.

Each script lives in its own folder, holding its entry and the \`lib/\` it imports.
The shared \`README.md\` and \`INTEGRITY.json\` at the \`scripts/\` root cover them all.

## bindings/generate-bindings.mjs

Records which code in this project drives which ref and slot on the generated
components, and writes \`${componentsFolder}/refs/bindings.json\`.

\`\`\`sh
node ${componentsFolder}/scripts/bindings/generate-bindings.mjs
\`\`\`

The script reads source files under the project root and writes that one file. It
skips \`${componentsFolder}\` itself, so the generated tree never reports itself as a consumer of
its own refs. It makes no network requests.

Run \`--check\` in continuous integration to fail on a stale manifest:

\`\`\`sh
node ${componentsFolder}/scripts/bindings/generate-bindings.mjs --check
\`\`\`

Use \`--root\`, \`--components\`, and \`--out\` when your project moved any of those.
This export baked in \`${framework}\` and \`${componentsFolder}\`. The framework takes no flag, because
this export emitted only the front ends a ${framework} project reaches. Re-export to
change it.

## What the manifest holds

\`refs\` is keyed by ref name and \`slots\` by component name then slot name. Each
consumer records the file, the line, the enclosing component, the expression
behind the value, and where the identifiers in that expression were declared.
Join it to the \`views\` in \`${componentsFolder}/refs/index.ts\` to see a ref from the workspace
node that declares it through to the code that sets it.

## Dependencies

The full scan needs ${parserList},
resolved from this project's own \`node_modules\` rather than bundled here.

When a parser is missing the script still runs, in a shallow mode that records
ref and prop keys with their file and line. Shallow mode reports no expressions,
no declaration sites, and no positional slot props. The manifest records
\`"mode": "shallow"\` so a reader can tell the difference, and the script says so
in its output.

## Integrity

\`INTEGRITY.json\` lists a sha256 for each file under \`scripts/\`, keyed by its path
relative to that folder.

A check the script runs on itself proves nothing, because a modified script can
report whatever hash it likes. Treat the check as external:

- Re-export from Seldon and confirm nothing under \`scripts/\` changed. The factory
  is deterministic, so the same workspace emits the same bytes. A difference is
  either a factory update or an edit made here.
- Or hash the files yourself and compare against \`INTEGRITY.json\`:

\`\`\`sh
shasum -a 256 ${componentsFolder}/scripts/bindings/generate-bindings.mjs
\`\`\`

Do not run a script that was edited by hand. Change the factory and re-export
instead, so the change survives the next export.

## Editing

Every file here is generated. The next export overwrites them.
`
}
