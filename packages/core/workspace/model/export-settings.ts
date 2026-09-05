/**
 * Export target and scope choices saved with a workspace, so the editor, the
 * CLI, and the MCP host export a workspace the same way without re-specifying
 * options each time. Every field is optional; an absent field falls back to the
 * export surface default.
 *
 * `platform`, `framework`, and `outputFolder` are opaque strings at the
 * workspace boundary, matching how the factory names its export target
 * framework, output layout, and destination folder. The editor and the MCP
 * host nest generated files under `outputFolder` and keep `.seldon` at the
 * project root. The boolean keys mirror the factory's export scope flags one
 * to one, so a surface can feed them straight into the shared flag mapping.
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
