import { getBoardThemeRef } from "../components/get-board-theme-ref"
import { getWorkspaceNodes } from "../general/get-workspace-nodes"
import { workspaceThemeService } from "../../services"
import type { VariantId, Workspace } from "../../types"

/**
 * True when any board uses `themeId` as its catalog theme ref, or any node
 * resolves to that id as its effective theme (inheritance-aware).
 */
export function hasEffectiveThemeReference(
  workspace: Workspace,
  themeId: string,
): boolean {
  for (const board of Object.values(workspace.components)) {
    if (!board) continue
    const ref = getBoardThemeRef(board)
    if (ref === themeId) return true
  }

  const nodes = getWorkspaceNodes(workspace)
  for (const node of Object.values(nodes)) {
    if (!node || typeof node.id !== "string") continue
    try {
      const resolved = workspaceThemeService.getNodeThemeId(node.id as VariantId, workspace)
      if (resolved === themeId) return true
    } catch {
      // Missing parent/board chain — skip; strict validation happens elsewhere
    }
  }

  return false
}
