import { spawnSync } from "node:child_process"
import fs from "node:fs"
import fsp from "node:fs/promises"
import path from "node:path"
import readline from "node:readline"
import { fileURLToPath, pathToFileURL } from "node:url"
import { build } from "esbuild"

/**
 * Exports an editor's own component library. One script serves both editors,
 * selected by `--platform`, since the React and Vue self-exports differ only by
 * target framework, app folder, and committed snapshot name.
 *
 * The input is the selected editor's workspace. It prefers the live source at
 * `<app>/.seldon/seldon-editor.<platform>.json`. A hashed backup under
 * `.seldon/workspaces` is used only when its label still matches `seldon-editor`.
 * Matching by id alone is not enough. A store record can keep an old id after
 * another project overwrites it. When no live source exists, such as a fresh
 * clone or CI, it falls back to the committed snapshot at
 * `<app>/sdn/seldon-editor.<platform>.json` after a confirm. Pass
 * `--use-committed` to skip the live source and always use the committed
 * snapshot.
 *
 * It runs the same factory export the editor's Export dialog runs and writes the
 * generated components into the app's `sdn/`. The export re-emits the snapshot
 * as `sdn/seldon-editor.<platform>.json`, so the committed fallback stays
 * current. After the write, this script formats `sdn/` with the monorepo
 * Prettier config so `format:check` stays clean.
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
const prettierBin = path.join(repoRoot, "node_modules/prettier/bin/prettier.cjs")

/** Label the editor self-export must keep. A store id can point at another file. */
const EDITOR_WORKSPACE_LABEL = "seldon-editor"

/** Output folder that keeps each editor's generated library self-contained. */
const COMPONENTS_FOLDER = "sdn"

/** Editor apps this script can export, each a folder under `apps/`. */
const PLATFORMS = ["react", "vue"]

function printHelp(booleanFlags) {
  const lines = [
    "Usage: node ../../shared/scripts/export-seldon.mjs --platform <react|vue> [flags]",
    "",
    "Exports the selected editor's own component library. Scope defaults are shared",
    "with the editor dialog, the CLI, and the MCP host; flags override per run.",
    "",
    `  --platform <${PLATFORMS.join("|")}>   editor to export (required)`,
    ...Object.keys(booleanFlags).map((name) => `  --${name} / --no-${name}`),
    "  --use-committed                    skip the live workspace source, use the committed snapshot",
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
    workspaceFile: path.join(editorRoot, `${COMPONENTS_FOLDER}/seldon-editor.${platform}.json`),
  }
}

/**
 * Layers flag overrides over the shared defaults. Unknown flags stop the run so
 * a typo cannot silently export the wrong scope. Returns the platform separately
 * from the scope config. `defaults` and `booleanFlags` come from the shared
 * export flag descriptors the handler re-exports.
 */
function resolveArgs(argv, defaults, booleanFlags) {
  let platform
  let useCommitted = false
  const overrides = {}

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === "--help" || arg === "-h") {
      printHelp(booleanFlags)
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
    const key = booleanFlags[name]

    if (!arg.startsWith("--") || !key) {
      throw new Error(`Unknown flag "${arg}". Run with --help to list flags.`)
    }

    overrides[key] = !arg.startsWith("--no-")
  }

  const editor = resolveEditor(platform)
  const config = { ...defaults, ...overrides }

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
    // The bindings scanner and best-effort formatter reach these through the
    // export graph, but the handler never runs them. They resolve from the
    // consumer's own node_modules at runtime, so leaving them external keeps
    // esbuild from bundling `@vue/compiler-sfc`'s optional template engines.
    external: [
      "@vue/compiler-sfc",
      "typescript",
      "prettier",
      "@ianvs/prettier-plugin-sort-imports",
    ],
  })

  // Write next to the factory so `import("prettier")` in the bundle walks up
  // to the repo `node_modules`. A file under os.tmpdir() cannot resolve it.
  const outputFile = path.join(factoryRoot, `.seldon-export-${process.pid}.mjs`)
  await fsp.writeFile(outputFile, result.outputFiles[0].text)
  try {
    return await import(pathToFileURL(outputFile).href)
  } finally {
    await fsp.rm(outputFile, { force: true })
  }
}

/** Reads `metadata.id` and `metadata.label` from raw workspace JSON. */
function readSnapshotMeta(text) {
  try {
    const metadata = JSON.parse(text)?.metadata

    return {
      id: typeof metadata?.id === "string" ? metadata.id : undefined,
      label: typeof metadata?.label === "string" ? metadata.label : undefined,
    }
  } catch {
    return { id: undefined, label: undefined }
  }
}

/** True when a workspace or store record is still the editor library. */
function isEditorWorkspace(label) {
  return label === EDITOR_WORKSPACE_LABEL
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
 * Reads a hashed store record and returns the inner workspace JSON when the
 * record is still the editor library. A matching id is not enough.
 */
function readEditorStoreWorkspace(filePath) {
  if (!fs.existsSync(filePath)) return undefined

  try {
    const record = JSON.parse(fs.readFileSync(filePath, "utf8"))
    const live = record.workspace ?? record
    const label = live?.metadata?.label

    if (!isEditorWorkspace(label)) {
      console.warn(
        `Ignoring ${path.relative(repoRoot, filePath)}. Its label is "${label}", not ${EDITOR_WORKSPACE_LABEL}.`,
      )

      return undefined
    }

    return JSON.stringify(live)
  } catch {
    return undefined
  }
}

/**
 * Resolves the serialized workspace to export. Prefers the live source under
 * the editor app. A hashed backup is used only when its label is still
 * `seldon-editor`. Falls back to the committed snapshot after a confirm.
 */
async function resolveInputWorkspaceText(workspaceFile, editorRoot, platform, useCommittedFlag) {
  const committedText = fs.readFileSync(workspaceFile, "utf8")
  const committed = readSnapshotMeta(committedText)

  if (useCommittedFlag) {
    console.log(`Using committed snapshot ${path.basename(workspaceFile)}.`)

    return committedText
  }

  const liveSource = path.join(editorRoot, ".seldon", `seldon-editor.${platform}.json`)

  if (fs.existsSync(liveSource)) {
    const text = fs.readFileSync(liveSource, "utf8")
    const live = readSnapshotMeta(text)

    if (isEditorWorkspace(live.label)) {
      console.log(`Using live workspace source ${path.relative(repoRoot, liveSource)}.`)

      return text
    }

    console.warn(
      `Ignoring ${path.relative(repoRoot, liveSource)}. Its label is "${live.label}", not ${EDITOR_WORKSPACE_LABEL}.`,
    )
  }

  const pointerFile = path.join(editorRoot, ".seldon", "project.json")

  if (fs.existsSync(pointerFile)) {
    try {
      const pointer = JSON.parse(fs.readFileSync(pointerFile, "utf8"))
      const fileName = pointer.workspace
      const pointed = typeof fileName === "string" ? path.join(editorRoot, ".seldon", fileName) : ""

      if (pointed && fs.existsSync(pointed)) {
        const text = fs.readFileSync(pointed, "utf8")
        const live = readSnapshotMeta(text)

        if (isEditorWorkspace(live.label)) {
          console.log(`Using live workspace source ${path.relative(repoRoot, pointed)}.`)

          return text
        }
      }
    } catch {
      // A malformed pointer is not fatal. Try the hashed backup next.
    }
  }

  const liveIds = [committed.id].filter(Boolean)

  if (fs.existsSync(liveSource)) {
    const liveId = readSnapshotMeta(fs.readFileSync(liveSource, "utf8")).id

    if (liveId && !liveIds.includes(liveId)) liveIds.unshift(liveId)
  }

  for (const id of liveIds) {
    const candidates = [
      path.join(editorRoot, ".seldon", "workspaces", `${id}.json`),
      path.join(liveWorkspacesDir, `${id}.json`),
    ]

    for (const liveFile of candidates) {
      const workspace = readEditorStoreWorkspace(liveFile)

      if (workspace) {
        console.log(`Using live workspace backup ${path.relative(repoRoot, liveFile)}.`)

        return workspace
      }
    }
  }

  const reason = committed.id
    ? `No live ${EDITOR_WORKSPACE_LABEL} workspace found for ${committed.id}.`
    : "The committed snapshot has no live-store id yet."

  if (!(await confirmUseCommitted(reason, useCommittedFlag, workspaceFile))) {
    console.log("Export cancelled.")
    process.exit(0)
  }

  return committedText
}

/** Formats the exported folder with this repo's Prettier config. */
function formatExportedFolder(folder) {
  if (!fs.existsSync(prettierBin)) {
    console.warn("Repo Prettier is not installed. Skipping the format pass.")

    return
  }

  const result = spawnSync(process.execPath, [prettierBin, "--write", folder], {
    cwd: repoRoot,
    stdio: "inherit",
  })

  if (result.status !== 0) {
    throw new Error("Prettier failed on the exported folder.")
  }
}

async function main() {
  // Load the handler first so the shared export flag descriptors it re-exports
  // drive argument parsing, keeping this script in step with the editor, CLI,
  // and MCP host.
  const {
    runExport,
    loadWorkspace,
    EXPORT_FLAG_DEFAULTS,
    EXPORT_FLAG_BY_CLI_NAME,
    toExportScopeOptions,
  } = await loadHandler()
  const { platform, useCommitted, config, editor } = resolveArgs(
    process.argv.slice(2),
    EXPORT_FLAG_DEFAULTS,
    EXPORT_FLAG_BY_CLI_NAME,
  )
  const { editorRoot, workspaceFile } = editor
  // Read through Core so the file is migrated and verified before it is exported.
  const workspace = loadWorkspace(
    await resolveInputWorkspaceText(workspaceFile, editorRoot, platform, useCommitted),
  )

  const exportRequest = {
    workspace,
    options: {
      target: { framework: platform, styles: "css-properties" },
      output: {
        // Asset paths default to nest under this folder (`sdn/assets`), keeping
        // the generated library self-contained.
        componentsFolder: COMPONENTS_FOLDER,
      },

      // With `includeScripts` on, this editor keeps the bindings scanner it
      // hands to any other project. `npm run bindings` runs it to write
      // `sdn/refs/bindings.json`, which the connections overlay reads.
      ...toExportScopeOptions(config),
    },
  }

  // Pass the repo root explicitly so the handler reads live monorepo source
  // regardless of the working directory this script runs from.
  const { files } = await runExport(exportRequest, { root: repoRoot })

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

  const exportedFolder = path.join(editorRoot, COMPONENTS_FOLDER)

  formatExportedFolder(exportedFolder)

  console.log(`Exported ${files.length} files into ${exportedFolder}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
