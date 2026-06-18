import { CURRENT_WORKSPACE_VERSION } from "../middleware/migration/middleware"
import type { Workspace } from "../model/workspace"
import { seedDefaultFontCollectionBoard } from "./seed/seed-default-font-collection-board"
import { seedDefaultIconSetBoard } from "./seed/seed-default-icon-set-board"
import { seedDefaultThemeBoard } from "./seed/seed-default-theme-board"

/**
 * Minimal workspace (editor “clear workspace”, tests, debug panels).
 */
export function createEmptyWorkspace(): Workspace {
  const workspace: Workspace = {
    metadata: {
      version: CURRENT_WORKSPACE_VERSION,
      label: "",
    },
    boards: {},
    playgrounds: {},
    nodes: {},
    themes: {},
    "font-collections": {},
    "icon-sets": {},
    media: {},
  }
  seedDefaultThemeBoard(workspace)
  seedDefaultFontCollectionBoard(workspace)
  seedDefaultIconSetBoard(workspace)
  return workspace
}
