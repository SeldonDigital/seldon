import fs from "node:fs"
import path from "node:path"

import { loadWorkspace } from "@seldon/core/workspace/reducers/load-workspace"

import { exportWorkspace } from "../export-workspace"
import { PLATFORMS } from "../platforms/registry"
import { createResolvedExportAssetReader } from "../resolved-asset-reader"
import { EXPORT_PRESETS, EXPORT_PRESET_IDS } from "./presets"

import type { PlatformId } from "../types"
import type { ExportPresetId } from "./presets"

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
  preset: ExportPresetId
  input: string
  out: string
  includeHidden: boolean
  allThemes: boolean
  allFonts: boolean
  fontLinks: boolean
  allIcons: boolean
  savedWorkspace: boolean
  includeScripts: boolean
  componentsFolder?: string
  assetsFolder?: string
  assetPublicPath?: string
}

/** Defaults match the editor's export dialog defaults. */
const DEFAULT_CONFIG: CliConfig = {
  platform: "react",
  preset: "plain",
  input: "",
  out: process.cwd(),
  includeHidden: false,
  allThemes: false,
  allFonts: false,
  fontLinks: false,
  allIcons: true,
  savedWorkspace: true,
  includeScripts: true,
}

const HELP = `seldon-export - export a Seldon workspace to framework components

Usage:
  seldon-export --input <workspace.json> [--platform <id>] [--preset <id>] [--out <dir>] [flags]

Required:
  -i, --input <path>         Workspace JSON saved from the Seldon editor.

Targets:
  -p, --platform <${PLATFORM_IDS.join("|")}>
                             Framework to generate (default: react).
      --preset <${EXPORT_PRESET_IDS.join("|")}>
                             Project layout (default: plain).
  -o, --out <dir>            Output root directory (default: current directory).

Layout overrides (advanced, override the preset):
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

    if (arg === "--preset" || arg.startsWith("--preset=")) {
      const value = readValue()

      if (!EXPORT_PRESET_IDS.includes(value as ExportPresetId)) {
        throw new Error(
          `Unknown preset "${value}". Expected one of: ${EXPORT_PRESET_IDS.join(", ")}.`,
        )
      }

      config.preset = value as ExportPresetId
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

  const preset = EXPORT_PRESETS[config.preset]
  const outRoot = path.resolve(config.out)
  const workspace = loadWorkspace(fs.readFileSync(path.resolve(config.input), "utf8"))

  const files = await exportWorkspace(workspace, {
    rootDirectory: outRoot,
    assetReader: createResolvedExportAssetReader(),
    target: { framework: config.platform, styles: "css-properties" },
    output: {
      componentsFolder: config.componentsFolder ?? preset.componentsFolder,
      assetsFolder: config.assetsFolder ?? preset.assetsFolder,
      assetPublicPath: config.assetPublicPath ?? preset.assetPublicPath,
    },
    includeHiddenComponents: config.includeHidden,
    exportAllThemes: config.allThemes,
    exportAllFontCollections: config.allFonts,
    enableRemoteFonts: config.fontLinks,
    exportAllIconSetIcons: config.allIcons,
    includeWorkspace: config.savedWorkspace,
    includeScripts: config.includeScripts,
  })

  for (const file of files) {
    const target = path.join(outRoot, file.path)

    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(
      target,
      typeof file.content === "string" ? file.content : Buffer.from(file.content),
    )
  }

  console.log(
    `Exported ${files.length} files (${config.platform}, ${config.preset} preset) into ${outRoot}`,
  )
}
