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
import {
  EXPORT_FLAGS,
  EXPORT_FLAG_BY_CLI_NAME,
  EXPORT_FLAG_DEFAULTS,
  toExportScopeOptions,
  workspaceExportScopeFlags,
} from "../options"
import { PLATFORMS } from "../platforms/registry"
import { FRAMEWORK_IDS, resolveOutputLayout } from "../presets"
import { createResolvedExportAssetReader } from "../resolved-asset-reader"

import type { ExportManifest } from "../manifest"
import type { ExportScopeFlags } from "../options"
import type { FrameworkId } from "../presets"
import type { FileToExport, PlatformId } from "../types"
import type { Workspace } from "@seldon/core"

const PLATFORM_IDS = Object.keys(PLATFORMS) as PlatformId[]

/**
 * Maps each `--kebab` flag to the {@link CliConfig} key it sets. Every flag
 * accepts `--name` (true) and `--no-name` (false). Derived from the shared
 * export flag descriptors so the CLI cannot drift from the editor and MCP.
 */
const BOOLEAN_FLAGS: Record<string, keyof ExportScopeFlags> = EXPORT_FLAG_BY_CLI_NAME

interface CliConfig extends ExportScopeFlags {
  platform: PlatformId
  framework: FrameworkId
  input: string
  out: string
  overwrite: boolean
  componentsFolder?: string
  assetsFolder?: string
  assetPublicPath?: string
}

/** Defaults match the editor's export dialog defaults, from the shared source. */
const DEFAULT_CONFIG: CliConfig = {
  ...EXPORT_FLAG_DEFAULTS,
  platform: "react",
  framework: "none",
  input: "",
  out: process.cwd(),
  overwrite: false,
}

/** One aligned `--flag  description` help line per scope flag. */
const SCOPE_FLAG_HELP = EXPORT_FLAGS.map(
  (flag) => `      --${flag.cliName.padEnd(17)}${flag.description}`,
).join("\n")

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
${SCOPE_FLAG_HELP}

Overwrite:
  -y, --yes, --force         Overwrite an export another workspace owns in the
                             output folder without prompting.

  -h, --help                 Show this message.`

/**
 * Parses argv into just the values the flags set, leaving everything else
 * unset. Unknown flags and invalid enum values stop the run so a typo cannot
 * silently export the wrong scope or framework. The caller layers these over the
 * defaults and any workspace-saved settings.
 */
export function parseCliOverrides(argv: string[]): Partial<CliConfig> {
  const config: Partial<CliConfig> = {}

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
 * Parses argv over {@link DEFAULT_CONFIG}, without any workspace-saved settings.
 * Kept for callers that only need the resolved flags from argv.
 */
export function parseCliArgs(argv: string[]): CliConfig {
  return { ...DEFAULT_CONFIG, ...parseCliOverrides(argv) }
}

/**
 * Maps a workspace's saved export settings to CLI config fields, so a workspace
 * carries its own target and scope defaults. Only valid target ids pass through.
 * The output root stays a CLI concern, so `outputFolder` is not applied here.
 */
function workspaceConfigOverrides(workspace: Workspace): Partial<CliConfig> {
  const settings = workspace.metadata.exportSettings

  if (!settings) return {}

  const overrides: Partial<CliConfig> = { ...workspaceExportScopeFlags(workspace) }

  if (settings.platform && PLATFORM_IDS.includes(settings.platform as PlatformId)) {
    overrides.platform = settings.platform as PlatformId
  }

  if (settings.framework && FRAMEWORK_IDS.includes(settings.framework as FrameworkId)) {
    overrides.framework = settings.framework as FrameworkId
  }

  return overrides
}

/**
 * Runs the export end to end: read the workspace through core, generate files
 * with the factory, then write them under the output root. Assets resolve from
 * the installed `@seldon/core` through {@link createResolvedExportAssetReader},
 * so the command works from any consumer project.
 */
export async function runExportCli(argv: string[]): Promise<void> {
  const cliOverrides = parseCliOverrides(argv)
  const input = cliOverrides.input ?? DEFAULT_CONFIG.input

  if (!input) {
    throw new Error("Missing required --input <workspace.json>. Run with --help for usage.")
  }

  const workspace = loadWorkspace(fs.readFileSync(path.resolve(input), "utf8"))

  // Precedence: an explicit CLI flag wins over a workspace-saved setting, which
  // wins over the shared default. So a workspace carries its own target and
  // scope, and a flag still overrides it for a one-off export.
  const config: CliConfig = {
    ...DEFAULT_CONFIG,
    ...workspaceConfigOverrides(workspace),
    ...cliOverrides,
  }

  const layout = resolveOutputLayout(config.framework)
  const outRoot = path.resolve(config.out)

  const files = await exportWorkspace(workspace, {
    rootDirectory: outRoot,
    assetReader: createResolvedExportAssetReader(),
    target: { framework: config.platform, styles: "css-properties" },
    output: {
      componentsFolder: config.componentsFolder ?? layout.componentsFolder,
      assetsFolder: config.assetsFolder ?? layout.assetsFolder,
      assetPublicPath: config.assetPublicPath ?? layout.assetPublicPath,
    },
    ...toExportScopeOptions(config),
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
