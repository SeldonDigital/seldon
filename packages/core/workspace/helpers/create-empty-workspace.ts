import type { Workspace } from "../model/workspace"
import { seedDefaultFontCollectionBoard } from "./seed/seed-default-font-collection-board"
import { seedDefaultIconSetBoard } from "./seed/seed-default-icon-set-board"
import { seedDefaultThemeBoard } from "./seed/seed-default-theme-board"

/** Baseline version matching `CURRENT_WORKSPACE_VERSION`. */
const EMPTY_WORKSPACE_FILE_VERSION = 0

/**
 * Minimal v0 workspace (editor “clear workspace”, tests, debug panels).
 */
export function createEmptyWorkspace(): Workspace {
  const workspace: Workspace = {
    metadata: {
      version: EMPTY_WORKSPACE_FILE_VERSION,
      label: "",
    },
    boards: {},
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
