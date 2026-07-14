import type { Workspace } from "@seldon/core/workspace/types"

import type { ServerConfig } from "../config"
import type { ScreenshotProvider } from "../render/screenshot"
import type { SemanticSearchProvider } from "../semantic-search"
import type { Session } from "../session"

/** Dependencies every tool receives; the server owns one of each per process. */
export interface ToolContext {
  session: Session
  config: ServerConfig
  /**
   * Optional embedding runtime for search_catalog. Absent (keyword-
   * only installs, most tests) or returning null, search is keyword-only.
   */
  semantic?: SemanticSearchProvider
  /**
   * Optional screenshot backend for view_node's image format.
   * Absent or returning null, image requests degrade to html.
   */
  screenshots?: ScreenshotProvider
}

/** Board counts by board type plus entity-map sizes. Shared by open/info. */
export interface WorkspaceCounts {
  boards: Record<string, number>
  playgrounds: number
  nodes: number
  themes: number
  fontCollections: number
  iconSets: number
}

export function countWorkspace(workspace: Workspace): WorkspaceCounts {
  const boards: Record<string, number> = {}
  for (const board of Object.values(workspace.boards)) {
    boards[board.type] = (boards[board.type] ?? 0) + 1
  }
  return {
    boards,
    playgrounds: Object.keys(workspace.playgrounds).length,
    nodes: Object.keys(workspace.nodes).length,
    themes: Object.keys(workspace.themes).length,
    fontCollections: Object.keys(workspace["font-collections"]).length,
    iconSets: Object.keys(workspace["icon-sets"]).length,
  }
}
