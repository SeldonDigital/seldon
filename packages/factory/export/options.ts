import type { ExportOptions } from "./types"

/**
 * The boolean scope toggles an export exposes, keyed the way the editor dialog
 * and the CLI name them. Framework, layout, and folders are separate; these are
 * only the scope flags. One definition every surface reads, so the editor, the
 * CLI, the dev-server handler, and the MCP host cannot drift on which flags
 * exist or what they default to.
 */
export interface ExportScopeFlags {
  fontLinks: boolean
  includeHidden: boolean
  allThemes: boolean
  allFonts: boolean
  allIcons: boolean
  savedWorkspace: boolean
  includeScripts: boolean
}

/** The subset of {@link ExportOptions} the scope flags drive. */
export type ExportScopeOptions = Pick<
  ExportOptions,
  | "enableRemoteFonts"
  | "includeHiddenComponents"
  | "exportAllThemes"
  | "exportAllFontCollections"
  | "exportAllIconSetIcons"
  | "includeWorkspace"
  | "includeScripts"
>

/**
 * One export scope flag, described once for every surface. `storeKey` names it
 * in the dialog store and the CLI config, `optionKey` names the
 * {@link ExportOptions} field it drives, `cliName` is its `--kebab` flag,
 * `label` and `ariaLabel` are the dialog copy, and `description` is the CLI help
 * line.
 */
export interface ExportFlagDescriptor {
  storeKey: keyof ExportScopeFlags
  optionKey: keyof ExportScopeOptions
  cliName: string
  default: boolean
  label: string
  ariaLabel: string
  description: string
}

/**
 * Every export scope flag, in dialog display order. This is the single source
 * for flag names, defaults, dialog copy, and CLI help across every surface.
 */
export const EXPORT_FLAGS = [
  {
    storeKey: "fontLinks",
    optionKey: "enableRemoteFonts",
    cliName: "font-links",
    default: false,
    label: "Generate Google Font API Links",
    ariaLabel: "Generate Google Font API Links",
    description: "Emit remote font host links.",
  },
  {
    storeKey: "includeHidden",
    optionKey: "includeHiddenComponents",
    cliName: "hidden",
    default: false,
    label: "Hidden Components",
    ariaLabel: "Hidden Components",
    description: "Include components hidden in the editor.",
  },
  {
    storeKey: "allThemes",
    optionKey: "exportAllThemes",
    cliName: "all-themes",
    default: false,
    label: "All Themes",
    ariaLabel: "All Themes",
    description: "Export every workspace theme.",
  },
  {
    storeKey: "allFonts",
    optionKey: "exportAllFontCollections",
    cliName: "all-fonts",
    default: false,
    label: "All Fonts",
    ariaLabel: "All Fonts",
    description: "On emits links for every enabled font family; off emits only fonts a node uses.",
  },
  {
    storeKey: "allIcons",
    optionKey: "exportAllIconSetIcons",
    cliName: "all-icons",
    default: true,
    label: "All Icons",
    ariaLabel: "All Icons",
    description: "On exports every enabled icon; off exports only icons a component uses.",
  },
  {
    storeKey: "savedWorkspace",
    optionKey: "includeWorkspace",
    cliName: "saved-workspace",
    default: true,
    label: "Workspace File",
    ariaLabel: "Workspace File",
    description: "Emit a copy of the workspace.",
  },
  {
    storeKey: "includeScripts",
    optionKey: "includeScripts",
    cliName: "scripts",
    default: true,
    label: "CLI Utility Scripts",
    ariaLabel: "CLI Utility Scripts",
    description: "Emit the bindings scanner scripts.",
  },
] as const satisfies readonly ExportFlagDescriptor[]

/** Default value for every scope flag, keyed by `storeKey`. Derived from {@link EXPORT_FLAGS}. */
export const EXPORT_FLAG_DEFAULTS: ExportScopeFlags = EXPORT_FLAGS.reduce(
  (defaults, flag) => ({ ...defaults, [flag.storeKey]: flag.default }),
  {} as ExportScopeFlags,
)

/** Maps `cliName` to its `storeKey`, for CLI and script argument parsing. */
export const EXPORT_FLAG_BY_CLI_NAME: Record<string, keyof ExportScopeFlags> = Object.fromEntries(
  EXPORT_FLAGS.map((flag) => [flag.cliName, flag.storeKey] as const),
)

/**
 * Maps the scope flags to the {@link ExportOptions} fields the factory reads.
 * Missing flags fall back to {@link EXPORT_FLAG_DEFAULTS}, so a caller may pass
 * only the flags it changes.
 */
export function toExportScopeOptions(flags: Partial<ExportScopeFlags>): ExportScopeOptions {
  const resolved = { ...EXPORT_FLAG_DEFAULTS, ...flags }

  return EXPORT_FLAGS.reduce(
    (options, flag) => ({ ...options, [flag.optionKey]: resolved[flag.storeKey] }),
    {} as ExportScopeOptions,
  )
}
