import fs from "node:fs"
import path from "node:path"
import readline from "node:readline"

import { loadWorkspace } from "@seldon/core/workspace/reducers/load-workspace"

import { exportWorkspace } from "../export-workspace"
import {
  EXPORT_MANIFEST_FILENAME,
  describeExportCollisions,
  detectExportCollisions,
  hasExportCollisions,
  parseExportManifest,
} from "../manifest"
import { PLATFORMS } from "../platforms/registry"
import { FRAMEWORK_IDS, resolveOutputLayout } from "../presets"
import { createResolvedExportAssetReader } from "../resolved-asset-reader"

import type { ExportManifest } from "../manifest"
import type { FrameworkId } from "../presets"
import type { FileToExport, PlatformId } from "../types"

const PLATFORM_IDS = Object.keys(PLATFORMS) as PlatformId[]

/**
 * Maps each boolean flag to the {@link CliConfig} key it sets and the option it
 * feeds. Every flag accepts `--name` (true) and `--no-name` (false).
 */
const BOOLEAN_FLAGS: Record<string, keyof CliConfig> = {
  hidden: "includeHidden",
  "all-themes": "allThemes",
  "all-fonts": "allFonts",
  "font-links": "fontLinks",
  "all-icons": "allIcons",
  "saved-workspace": "savedWorkspace",
  scripts: "includeScripts",
}

interface CliConfig {
  platform: PlatformId
  framework: FrameworkId
  input: string
  out: string
  includeHidden: boolean
  allThemes: boolean
  allFonts: boolean
  fontLinks: boolean
  allIcons: boolean
  savedWorkspace: boolean
  includeScripts: boolean
  overwrite: boolean
  componentsFolder?: string
  assetsFolder?: string
  assetPublicPath?: string
}

/** Defaults match the editor's export dialog defaults. */
const DEFAULT_CONFIG: CliConfig = {
  platform: "react",
  framework: "none",
  input: "",
  out: process.cwd(),
  includeHidden: false,
  allThemes: false,
  allFonts: false,
  fontLinks: false,
  allIcons: true,
  savedWorkspace: true,
  includeScripts: true,
  overwrite: false,
}

const HELP = `seldon-export - export a Seldon workspace to framework components

Usage:
  seldon-export --input <workspace.json> [--platform <id>] [--framework <id>] [--out <dir>] [flags]

Required:
  -i, --input <path>         Workspace JSON saved from the Seldon editor.

Targets:
  -p, --platform <${PLATFORM_IDS.join("|")}>
                             Framework to generate (default: react).
  -f, --framework <${FRAMEWORK_IDS.join("|")}>
                             Project layout (default: none).
  -o, --out <dir>            Output root directory (default: current directory).

Layout overrides (advanced, override the framework layout):
      --components-folder <path>
      --assets-folder <path>
      --asset-public-path <url>

Scope flags (each also has a --no- form):
      --hidden               Include components hidden in the editor.
      --all-themes           Export every workspace theme.
      --all-fonts            Emit links for every enabled font family.
      --font-links           Emit remote font host links.
      --all-icons            Export every enabled icon (default on).
      --saved-workspace      Emit a copy of the workspace (default on).
      --scripts              Emit the bindings scanner scripts (default on).

Overwrite:
  -y, --yes, --force         Overwrite an export another workspace owns in the
                             output folder without prompting.

  -h, --help                 Show this message.`

/**
 * Parses argv over {@link DEFAULT_CONFIG}. Unknown flags and invalid enum values
 * stop the run so a typo cannot silently export the wrong scope or framework.
 */
export function parseCliArgs(argv: string[]): CliConfig {
  const config: CliConfig = { ...DEFAULT_CONFIG }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    const readValue = (): string => {
      if (arg.includes("=")) {
        return arg.slice(arg.indexOf("=") + 1)
      }

      index += 1

      return argv[index]
    }

    if (arg === "--help" || arg === "-h") {
      console.log(HELP)
      process.exit(0)
    }

    if (arg === "-i" || arg === "--input" || arg.startsWith("--input=")) {
      config.input = readValue()
      continue
    }

    if (arg === "-o" || arg === "--out" || arg.startsWith("--out=")) {
      config.out = readValue()
      continue
    }

    if (arg === "-p" || arg === "--platform" || arg.startsWith("--platform=")) {
      const value = readValue()

      if (!PLATFORM_IDS.includes(value as PlatformId)) {
        throw new Error(`Unknown platform "${value}". Expected one of: ${PLATFORM_IDS.join(", ")}.`)
      }

      config.platform = value as PlatformId
      continue
    }

    if (arg === "-f" || arg === "--framework" || arg.startsWith("--framework=")) {
      const value = readValue()

      if (!FRAMEWORK_IDS.includes(value as FrameworkId)) {
        throw new Error(
          `Unknown framework "${value}". Expected one of: ${FRAMEWORK_IDS.join(", ")}.`,
        )
      }

      config.framework = value as FrameworkId
      continue
    }

    if (arg === "--components-folder" || arg.startsWith("--components-folder=")) {
      config.componentsFolder = readValue()
      continue
    }

    if (arg === "--assets-folder" || arg.startsWith("--assets-folder=")) {
      config.assetsFolder = readValue()
      continue
    }

    if (arg === "--asset-public-path" || arg.startsWith("--asset-public-path=")) {
      config.assetPublicPath = readValue()
      continue
    }

    if (arg === "-y" || arg === "--yes" || arg === "--force") {
      config.overwrite = true
      continue
    }

    const name = arg.replace(/^--(no-)?/, "")
    const key = BOOLEAN_FLAGS[name]

    if (!arg.startsWith("--") || !key) {
      throw new Error(`Unknown flag "${arg}". Run with --help to list flags.`)
    }

    ;(config[key] as boolean) = !arg.startsWith("--no-")
  }

  return config
}

/**
 * Runs the export end to end: read the workspace through core, generate files
 * with the factory, then write them under the output root. Assets resolve from
 * the installed `@seldon/core` through {@link createResolvedExportAssetReader},
 * so the command works from any consumer project.
 */
export async function runExportCli(argv: string[]): Promise<void> {
  const config = parseCliArgs(argv)

  if (!config.input) {
    throw new Error("Missing required --input <workspace.json>. Run with --help for usage.")
  }

  const layout = resolveOutputLayout(config.framework)
  const outRoot = path.resolve(config.out)
  const workspace = loadWorkspace(fs.readFileSync(path.resolve(config.input), "utf8"))

  const files = await exportWorkspace(workspace, {
    rootDirectory: outRoot,
    assetReader: createResolvedExportAssetReader(),
    target: { framework: config.platform, styles: "css-properties" },
    output: {
      componentsFolder: config.componentsFolder ?? layout.componentsFolder,
      assetsFolder: config.assetsFolder ?? layout.assetsFolder,
      assetPublicPath: config.assetPublicPath ?? layout.assetPublicPath,
    },
    includeHiddenComponents: config.includeHidden,
    exportAllThemes: config.allThemes,
    exportAllFontCollections: config.allFonts,
    enableRemoteFonts: config.fontLinks,
    exportAllIconSetIcons: config.allIcons,
    includeWorkspace: config.savedWorkspace,
    includeScripts: config.includeScripts,
  })

  await guardExportCollisions(files, outRoot, config.overwrite)

  for (const file of files) {
    const target = path.join(outRoot, file.path)

    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(
      target,
      typeof file.content === "string" ? file.content : Buffer.from(file.content),
    )
  }

  console.log(
    `Exported ${files.length} files (${config.platform}, ${config.framework} layout) into ${outRoot}`,
  )

  printRepeatableExportTip(config)
}

/**
 * Stops before writing when this export would overwrite files or refs another
 * workspace owns in the output folder. Reads the folder's existing manifest,
 * compares it to the one this export emitted, and on a real collision either
 * prompts on a TTY or aborts. `overwrite` (from `--yes`/`--force`) skips the
 * check. Writing nothing on decline keeps the folder as the other workspace
 * left it.
 */
async function guardExportCollisions(
  files: FileToExport[],
  outRoot: string,
  overwrite: boolean,
): Promise<void> {
  if (overwrite) return

  const emitted = files.find((file) => file.path.split("/").pop() === EXPORT_MANIFEST_FILENAME)

  if (!emitted || typeof emitted.content !== "string") return

  const next = parseExportManifest(emitted.content)

  if (!next) return

  const existing = readManifestFromDisk(path.join(outRoot, emitted.path))
  const collisions = detectExportCollisions(existing, next)

  if (!hasExportCollisions(collisions)) return

  const message = describeExportCollisions(existing, collisions)

  if (!process.stdin.isTTY) {
    throw new Error(`${message} Re-run with --yes to overwrite.`)
  }

  const proceed = await promptYesNo(`${message}\nOverwrite? (y/N) `)

  if (!proceed) {
    throw new Error("Export cancelled. Nothing was written.")
  }
}

function readManifestFromDisk(manifestPath: string): ExportManifest | null {
  try {
    return parseExportManifest(fs.readFileSync(manifestPath, "utf8"))
  } catch {
    return null
  }
}

function promptYesNo(question: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

  return new Promise<boolean>((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(/^y(es)?$/i.test(answer.trim()))
    })
  })
}

/**
 * Prints a one-time setup hint for a repeatable export. It only reads back the
 * flags this run used, so a user can copy a `package.json` script that reruns the
 * same export. It writes nothing outside the export output, since the CLI must
 * not touch a consumer's files beyond the components folder.
 */
function printRepeatableExportTip(config: CliConfig): void {
  const command = `seldon-export --input ${config.input} --platform ${config.platform} --framework ${config.framework}`

  console.log(
    `\nTo make this repeatable, add a script to package.json:\n  "seldon:export": "${command}"\nThen rerun with: npm run seldon:export`,
  )
}
