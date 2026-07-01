import type { Workspace } from "../../../model/workspace"
import { enableGoogleFontFamilies } from "./migrate-00004-enable-default-fonts"

/**
 * v5: enable the Quicksand family, added to the default Google fonts for the
 * refreshed Wildberry theme.
 *
 * Reuses the shared backfill so existing workspaces gain the family in the font
 * picker without clobbering any selection they already made.
 */
const FAMILIES_TO_ENABLE = new Set(["Quicksand"])

export function migrateV5EnableQuicksandFont(workspace: Workspace): Workspace {
  return enableGoogleFontFamilies(workspace, FAMILIES_TO_ENABLE)
}
