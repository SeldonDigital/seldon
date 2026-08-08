import fs from "node:fs"
import fsp from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import readline from "node:readline"
import { fileURLToPath, pathToFileURL } from "node:url"
import { build } from "esbuild"

/**
 * Exports an editor's own component library. One script serves both editors,
 * selected by `--platform`, since the React and Vue self-exports differ only by
 * target framework, app folder, and committed snapshot name.
 *
 * The input is the selected editor's workspace. It prefers the live copy in the
 * shared `.seldon` store, matched by the committed snapshot's `metadata.id`, so
 * edits made in the running editor export without a manual save step. When no
 * live copy exists, such as a fresh clone or CI, it falls back to the committed
 * snapshot at `<app>/seldon/seldon-editor.<platform>.json` after a confirm. Pass
 * `--use-committed` (or run non-interactively) to skip the prompt and always use
 * the committed snapshot.
 *
 * It runs the same factory export the editor's Export dialog runs and writes the
 * generated components into the app's `seldon/`. The export re-emits the snapshot
 * as `seldon/seldon-editor.<platform>.json`, so the committed fallback stays
 * current. The React and Vue snapshots share one `metadata.id`, so a single live
 * workspace drives both exports; export both after a change.
 *
 * Scope defaults are built in below and shared by both editors. Any single
 * setting can be changed for one run with a flag. Run with `--help` for every
 * flag.
 *
 * Examples:
 *
 *   # Export the React editor with its saved settings.
 *   node ../../shared/scripts/export-seldon.mjs --platform react
 *
 *   # Export the Vue editor, shipping every theme in the workspace.
 *   node ../../shared/scripts/export-seldon.mjs --platform vue --all-themes
 *
 *   # Force the committed snapshot instead of the live .seldon copy.
 *   node ../../shared/scripts/export-seldon.mjs --platform react --use-committed
 *
 * The export code (`vite/export-handler.ts`) imports `@seldon/core` and
 * `@seldon/factory`, so this script bundles it with esbuild first, the same way
 * the dev server does, then imports and runs it.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const sharedRoot = path.dirname(scriptDir)
const coreRoot = path.join(sharedRoot, "../../core")
const factoryRoot = path.join(sharedRoot, "../../factory")
const repoRoot = path.join(sharedRoot, "../../..")
const handlerEntry = path.join(sharedRoot, "vite/export-handler.ts")
const liveWorkspacesDir = path.join(repoRoot, ".seldon", "workspaces")

/** Output folder that keeps each editor's generated library self-contained. */
const COMPONENTS_FOLDER = "seldon"

/** Editor apps this script can export, each a folder under `apps/`. */
const PLATFORMS = ["react", "vue"]

/** Built-in scope defaults, matching the editor Export dialog defaults. */
const DEFAULT_CONFIG = {
  includeHidden: false,
  allThemes: false,
  allFonts: false,
  fontLinks: false,
  allIcons: true,
  savedWorkspace: true,
  includeScripts: true,
}

/**
 * Maps each boolean flag name to the config key it sets. Each maps to `--name`
 * (true) and `--no-name` (false).
 */
const BOOLEAN_FLAGS = {
  hidden: "includeHidden",
  "all-themes": "allThemes",
  "all-fonts": "allFonts",
  "font-links": "fontLinks",
  "all-icons": "allIcons",
  "saved-workspace": "savedWorkspace",
  scripts: "includeScripts",
}

function printHelp() {
  const lines = [
    "Usage: node ../../shared/scripts/export-seldon.mjs --platform <react|vue> [flags]",
    "",
    "Exports the selected editor's own component library. Scope defaults are built",
    "in and shared by both editors; flags override per run.",
    "",
    `  --platform <${PLATFORMS.join("|")}>   editor to export (required)`,
    ...Object.keys(BOOLEAN_FLAGS).map((name) => `  --${name} / --no-${name}`),
    "  --use-committed                    skip the live .seldon copy, use the committed snapshot",
    "  --help                             show this message",
  ]
  console.log(lines.join("\n"))
}

/** Resolves the editor app paths for a platform, validating the platform. */
function resolveEditor(platform) {
  if (!PLATFORMS.includes(platform)) {
    throw new Error(
      `Unknown platform "${platform ?? ""}". Pass --platform <${PLATFORMS.join("|")}>.`,
    )
  }

  const editorRoot = path.join(sharedRoot, "../apps", platform)

  return {
    editorRoot,
    workspaceFile: path.join(editorRoot, `seldon/seldon-editor.${platform}.json`),
  }
}

/**
 * Layers flag overrides over the built-in defaults. Unknown flags stop the run
 * so a typo cannot silently export the wrong scope. Returns the platform
 * separately from the scope config.
 */
function resolveArgs(argv) {
  let platform
  let useCommitted = false
  const overrides = {}

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === "--help" || arg === "-h") {
      printHelp()
      process.exit(0)
    }

    if (arg === "--platform" || arg.startsWith("--platform=")) {
      platform = arg.includes("=") ? arg.slice(arg.indexOf("=") + 1) : argv[(index += 1)]
      continue
    }

    if (arg === "--use-committed") {
      useCommitted = true
      continue
    }

    const name = arg.replace(/^--(no-)?/, "")
    const key = BOOLEAN_FLAGS[name]

    if (!arg.startsWith("--") || !key) {
      throw new Error(`Unknown flag "${arg}". Run with --help to list flags.`)
    }

    overrides[key] = !arg.startsWith("--no-")
  }

  const editor = resolveEditor(platform)
  const config = { ...DEFAULT_CONFIG, ...overrides }

  return { platform, useCommitted, config, editor }
}

async function loadHandler() {
  const result = await build({
    entryPoints: [handlerEntry],
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node22",
    write: false,
    logLevel: "silent",
    alias: {
      "@seldon/core": coreRoot,
      "@seldon/factory": factoryRoot,
    },
  })

  const outputFile = path.join(os.tmpdir(), `seldon-export-${process.pid}.mjs`)
  await fsp.writeFile(outputFile, result.outputFiles[0].text)
  try {
    return await import(pathToFileURL(outputFile).href)
  } finally {
    await fsp.rm(outputFile, { force: true })
  }
}

/** Reads `metadata.id` from raw snapshot text without migrating it. */
function readSnapshotId(text) {
  try {
    return JSON.parse(text)?.metadata?.id
  } catch {
    return undefined
  }
}

/**
 * Asks whether to export from the committed snapshot when no live copy is found.
 * A non-interactive run, or `--use-committed`, proceeds with a warning so CI and
 * scripted exports keep working. An interactive run prompts and defaults to no.
 */
async function confirmUseCommitted(reason, useCommittedFlag, workspaceFile) {
  const snapshotName = path.basename(workspaceFile)

  if (useCommittedFlag || !process.stdin.isTTY) {
    console.warn(`${reason} Exporting from the committed snapshot ${snapshotName}.`)

    return true
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const answer = await new Promise((resolve) => {
    rl.question(
      `${reason}\nExport from the committed snapshot ${snapshotName} instead? (y/N) `,
      resolve,
    )
  })
  rl.close()

  return /^y(es)?$/i.test(answer.trim())
}

/**
 * Resolves the serialized workspace to export. Prefers the live `.seldon` copy
 * matched by the snapshot's `metadata.id`, so a running editor's edits export
 * directly. Falls back to the committed snapshot after a confirm.
 */
async function resolveInputWorkspaceText(workspaceFile, useCommittedFlag) {
  const committedText = fs.readFileSync(workspaceFile, "utf8")
  const id = readSnapshotId(committedText)

  if (id) {
    const liveFile = path.join(liveWorkspacesDir, `${id}.json`)

    if (fs.existsSync(liveFile)) {
      const record = JSON.parse(fs.readFileSync(liveFile, "utf8"))
      const live = record.workspace ?? record

      console.log(`Using live workspace ${id} from ${path.relative(repoRoot, liveWorkspacesDir)}.`)

      return JSON.stringify(live)
    }
  }

  const reason = id
    ? `No live workspace ${id} found in ${path.relative(repoRoot, liveWorkspacesDir)}.`
    : "The committed snapshot has no live-store id yet."

  if (!(await confirmUseCommitted(reason, useCommittedFlag, workspaceFile))) {
    console.log("Export cancelled.")
    process.exit(0)
  }

  return committedText
}

async function main() {
  const { platform, useCommitted, config, editor } = resolveArgs(process.argv.slice(2))
  const { editorRoot, workspaceFile } = editor
  const { runExport, loadWorkspace } = await loadHandler()
  // Read through Core so the file is migrated and verified before it is exported.
  const workspace = loadWorkspace(await resolveInputWorkspaceText(workspaceFile, useCommitted))

  const { files } = await runExport({
    workspace,
    options: {
      target: { framework: platform, styles: "css-properties" },
      output: {
        // Asset paths default to nest under this folder (`seldon/assets`),
        // keeping the generated library self-contained.
        componentsFolder: COMPONENTS_FOLDER,
      },

      includeHiddenComponents: config.includeHidden,
      exportAllThemes: config.allThemes,
      exportAllFontCollections: config.allFonts,
      enableRemoteFonts: config.fontLinks,
      exportAllIconSetIcons: config.allIcons,
      includeWorkspace: config.savedWorkspace,

      // With `includeScripts` on, this editor keeps the bindings scanner it
      // hands to any other project. `npm run bindings` runs it to write
      // `seldon/refs/bindings.json`, which the connections overlay reads.
      includeScripts: config.includeScripts,
    },
  })

  // Clear the generated icon folder so a pruned or renamed icon leaves no stale
  // file behind. Renaming an icon's casing on a case-insensitive filesystem
  // otherwise keeps the old name and collides with the freshly written one.
  fs.rmSync(path.join(editorRoot, COMPONENTS_FOLDER, "icons"), { recursive: true, force: true })

  for (const file of files) {
    const target = path.join(editorRoot, file.path)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(
      target,
      file.encoding === "base64" ? Buffer.from(file.content, "base64") : file.content,
    )
  }

  console.log(`Exported ${files.length} files into ${path.join(editorRoot, "seldon")}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
