import type { Workspace } from "../model/workspace"
import { seedDefaultThemeBoard } from "./themes/seed-default-theme-board"

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
    components: {},
    nodes: {},
    themes: {},
    "font-collections": {},
    "icon-sets": {},
    media: {},
  }
  seedDefaultThemeBoard(workspace)
  return workspace
}
