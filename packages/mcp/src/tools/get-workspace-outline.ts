import type {
  Board,
  ComponentTreeRef,
  Workspace,
} from "@seldon/core/workspace/types"

import { redactValue } from "../redact"
import type { ToolContext } from "./context"

export const getWorkspaceOutlineInputSchema = {}

/**
 * Compact workspace tree (the get_workspace_outline tool): boards with
 * type/label/intent and variant identity, playground sandboxes,
 * theme/collection entries — never node property bags, never the full
 * JSON. Component-board variants carry ids and labels so an agent can
 * navigate into get_node even without a search tool.
 */
export interface OutlineBoard {
  key: string
  type: Board["type"]
  label: string
  intent?: string
  level?: string
  variantCount: number
  /** Component boards only: variant identity for navigation, no properties. */
  variants?: Array<{ id: string; label?: string; type?: string }>
}

export interface WorkspaceOutlineResult {
  label: string
  boards: OutlineBoard[]
  playgrounds: Array<{
    key: string
    label: string
    sandboxes: Array<{ id: string; label?: string }>
  }>
  themes: Array<{ id: string; type: string; label: string }>
  fontCollections: Array<{ id: string; label: string }>
  iconSets: Array<{ id: string; label: string }>
}

function variantIdentity(
  workspace: Workspace,
  ref: ComponentTreeRef,
): { id: string; label?: string; type?: string } {
  const node = workspace.nodes[ref.id]
  return { id: ref.id, label: node?.label, type: node?.type }
}

export function getWorkspaceOutline(ctx: ToolContext): WorkspaceOutlineResult {
  const { workspace } = ctx.session.requireOpen()

  const boards = Object.entries(workspace.boards).map(
    ([key, board]): OutlineBoard => {
      const base: OutlineBoard = {
        key,
        type: board.type,
        label: board.label,
        intent: board.intent,
        variantCount: board.variants.length,
      }
      if (board.type === "component") {
        base.level = board.level
        base.variants = board.variants.map((ref) =>
          variantIdentity(workspace, ref),
        )
      }
      return base
    },
  )

  const playgrounds = Object.entries(workspace.playgrounds).map(
    ([key, playground]) => ({
      key,
      label: playground.label,
      sandboxes: playground.variants.map((ref) => ({
        id: ref.id,
        label: workspace.nodes[ref.id]?.label,
      })),
    }),
  )

  return redactValue({
    label: workspace.metadata.label ?? "",
    boards,
    playgrounds,
    themes: Object.values(workspace.themes).map((theme) => ({
      id: theme.id,
      type: theme.type,
      label: theme.label,
    })),
    fontCollections: Object.values(workspace["font-collections"]).map(
      (entry) => ({ id: entry.id, label: entry.label }),
    ),
    iconSets: Object.values(workspace["icon-sets"]).map((entry) => ({
      id: entry.id,
      label: entry.label,
    })),
  })
}
