/**
 * Export target and scope choices saved with a workspace, so the editor, the
 * CLI, and the MCP host export a workspace the same way. A new workspace gets
 * {@link DEFAULT_WORKSPACE_EXPORT_SETTINGS}. Load fills any missing field from
 * those defaults. A flag change on the CLI or MCP writes back through
 * `set_workspace_export_settings`.
 *
 * `platform`, `framework`, and `outputFolder` are opaque strings at the
 * workspace boundary, matching how the factory names its export target
 * framework, output layout, and destination folder. The editor, the CLI, and
 * the MCP host nest generated files under `outputFolder` and keep `.seldon` at
 * the project root. Empty `outputFolder` means the project root. The boolean
 * keys mirror the factory's export scope flags one to one.
 */
export interface WorkspaceExportSettings {
  platform?: string
  framework?: string
  outputFolder?: string
  fontLinks?: boolean
  allFonts?: boolean
  allIcons?: boolean
  allThemes?: boolean
  includeHidden?: boolean
  savedWorkspace?: boolean
  includeScripts?: boolean
}

/** Every key {@link completeExportSettings} fills. */
const EXPORT_SETTING_KEYS = [
  "platform",
  "framework",
  "outputFolder",
  "fontLinks",
  "allFonts",
  "allIcons",
  "allThemes",
  "includeHidden",
  "savedWorkspace",
  "includeScripts",
] as const satisfies readonly (keyof WorkspaceExportSettings)[]

/**
 * Default export settings stamped on a new workspace and used to fill a loaded
 * file that is missing fields. Matches the editor dialog and the CLI.
 */
export const DEFAULT_WORKSPACE_EXPORT_SETTINGS: Required<WorkspaceExportSettings> = {
  platform: "react",
  framework: "none",
  outputFolder: "",
  fontLinks: false,
  allFonts: false,
  allIcons: true,
  allThemes: false,
  includeHidden: false,
  savedWorkspace: true,
  includeScripts: true,
}

/**
 * Normalizes a project-relative output folder. Empty means the project root.
 * Rejects a path that climbs out of the root, so a typed value cannot write
 * outside the folder the user picked.
 */
export function normalizeOutputFolder(value: string | undefined): string {
  if (!value) return ""

  const segments = value
    .replaceAll("\\", "/")
    .split("/")
    .filter((segment) => segment && segment !== ".")

  if (segments.some((segment) => segment === "..")) return ""

  return segments.join("/")
}

/**
 * Fills missing export-setting fields from {@link DEFAULT_WORKSPACE_EXPORT_SETTINGS}.
 * Present values stay. `outputFolder` is normalized.
 */
export function completeExportSettings(
  settings?: WorkspaceExportSettings,
): Required<WorkspaceExportSettings> {
  return {
    platform: settings?.platform ?? DEFAULT_WORKSPACE_EXPORT_SETTINGS.platform,
    framework: settings?.framework ?? DEFAULT_WORKSPACE_EXPORT_SETTINGS.framework,
    outputFolder: normalizeOutputFolder(
      settings?.outputFolder ?? DEFAULT_WORKSPACE_EXPORT_SETTINGS.outputFolder,
    ),
    fontLinks: settings?.fontLinks ?? DEFAULT_WORKSPACE_EXPORT_SETTINGS.fontLinks,
    allFonts: settings?.allFonts ?? DEFAULT_WORKSPACE_EXPORT_SETTINGS.allFonts,
    allIcons: settings?.allIcons ?? DEFAULT_WORKSPACE_EXPORT_SETTINGS.allIcons,
    allThemes: settings?.allThemes ?? DEFAULT_WORKSPACE_EXPORT_SETTINGS.allThemes,
    includeHidden: settings?.includeHidden ?? DEFAULT_WORKSPACE_EXPORT_SETTINGS.includeHidden,
    savedWorkspace: settings?.savedWorkspace ?? DEFAULT_WORKSPACE_EXPORT_SETTINGS.savedWorkspace,
    includeScripts: settings?.includeScripts ?? DEFAULT_WORKSPACE_EXPORT_SETTINGS.includeScripts,
  }
}

/**
 * True when every export-setting field is present. A missing block or field
 * still needs a load repair even when the filled values would match defaults.
 */
export function hasCompleteExportSettings(
  settings?: WorkspaceExportSettings,
): settings is Required<WorkspaceExportSettings> {
  if (!settings) return false

  return EXPORT_SETTING_KEYS.every((key) => settings[key] !== undefined)
}

/**
 * True when two settings blocks resolve to the same complete values.
 */
export function exportSettingsEqual(
  left?: WorkspaceExportSettings,
  right?: WorkspaceExportSettings,
): boolean {
  const completedLeft = completeExportSettings(left)
  const completedRight = completeExportSettings(right)

  return EXPORT_SETTING_KEYS.every((key) => completedLeft[key] === completedRight[key])
}
