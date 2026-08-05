import fs from "node:fs"
import fsp from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

import { build } from "esbuild"

/**
 * Exports this editor's own component library.
 *
 * It reads the workspace file at `seldon/seldon-editor.json`, runs the same
 * factory export the editor's Export dialog runs, and writes the generated
 * components into `seldon/`. The workspace file is the copy the dialog saves
 * when "Save Workspace with Components" is on. Renaming the workspace in the
 * editor renames that file, so this path has to match.
 *
 * Settings live in `export-config.json` next to this script. A plain run uses
 * those settings, so the output is the same every time. Any single setting can
 * be changed for one run with a flag, without editing the file. Run with
 * `--help` to see every flag.
 *
 * Examples:
 *
 *   # Normal run: use the settings in export-config.json.
 *   node scripts/export-seldon.mjs
 *
 *   # Ship every theme in the workspace, not just the ones components use.
 *   node scripts/export-seldon.mjs --all-themes
 *
 *   # Skip the CLI helper scripts for a quick components-only export.
 *   node scripts/export-seldon.mjs --no-scripts
 *
 *   # Include components hidden in the editor and emit Google font links.
 *   node scripts/export-seldon.mjs --hidden --font-links
 *
 *   # Export for a different framework.
 *   node scripts/export-seldon.mjs --platform vue
 *
 * The export code (`vite/export-handler.ts`) imports `@seldon/core` and
 * `@seldon/factory`, so this script bundles it with esbuild first, the same way
 * the dev server does, then imports and runs it.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const editorRoot = path.dirname(scriptDir)
const coreRoot = path.join(editorRoot, "../../../core")
const factoryRoot = path.join(editorRoot, "../../../factory")
const handlerEntry = path.join(editorRoot, "../../shared/vite/export-handler.ts")
const workspaceFile = path.join(editorRoot, "seldon/seldon-editor.json")
const configFile = path.join(scriptDir, "export-config.json")

/** Output folder that keeps this editor's generated library self-contained. */
const COMPONENTS_FOLDER = "seldon"

/** Platforms the factory registers, used to validate `--platform`. */
const PLATFORMS = ["react", "swift", "vue", "svelte"]

/**
 * Maps each boolean flag name to the `export-config.json` key it sets. Each maps
 * to `--name` (true) and `--no-name` (false).
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
    "Usage: node scripts/export-seldon.mjs [flags]",
    "",
    "Defaults come from scripts/export-config.json. Flags override per run.",
    "",
    `  --platform <${PLATFORMS.join("|")}>   target framework`,
    ...Object.keys(BOOLEAN_FLAGS).map((name) => `  --${name} / --no-${name}`),
    "  --help                             show this message",
  ]
  console.log(lines.join("\n"))
}

/**
 * Reads `export-config.json` as the baseline, then layers flag overrides on top.
 * Unknown flags and an invalid platform stop the run so a typo cannot silently
 * export the wrong scope.
 */
function resolveConfig(argv) {
  const config = JSON.parse(fs.readFileSync(configFile, "utf8"))

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === "--help" || arg === "-h") {
      printHelp()
      process.exit(0)
    }

    if (arg === "--platform" || arg.startsWith("--platform=")) {
      const value = arg.includes("=") ? arg.slice(arg.indexOf("=") + 1) : argv[(index += 1)]
      if (!PLATFORMS.includes(value)) {
        throw new Error(`Unknown platform "${value}". Expected one of: ${PLATFORMS.join(", ")}.`)
      }
      config.platform = value
      continue
    }

    const name = arg.replace(/^--(no-)?/, "")
    const key = BOOLEAN_FLAGS[name]
    if (!arg.startsWith("--") || !key) {
      throw new Error(`Unknown flag "${arg}". Run with --help to list flags.`)
    }
    config[key] = !arg.startsWith("--no-")
  }

  return config
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

async function main() {
  const config = resolveConfig(process.argv.slice(2))
  const { runExport, loadWorkspace } = await loadHandler()
  // Read through Core so the file is migrated and verified before it is exported.
  const workspace = loadWorkspace(fs.readFileSync(workspaceFile, "utf8"))

  const { files } = await runExport({
    workspace,
    options: {
      target: { framework: config.platform, styles: "css-properties" },
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
