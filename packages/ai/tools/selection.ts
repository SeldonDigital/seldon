import { Type } from "typebox"

import { walkBoardTreeRefs } from "@seldon/core/workspace/helpers/components/walk-board-tree-refs"
import { isAuthoredBoard, isComponentBoard } from "@seldon/core/workspace/model/components"

import { defineSeldonTool } from "./context"

import type { SelectionScope } from "../types"
import type { SeldonTool } from "./context"
import type { TargetSpec } from "./resolve-target"
import type { BoardKey, Workspace } from "@seldon/core/workspace/types"

/** The valid selection scopes an agent may set. */
const SCOPES: SelectionScope[] = [
  "workspace",
  "board",
  "variant",
  "instance",
  "theme",
  "fontCollection",
  "iconSet",
  "media",
]

/** The board key and variant root whose tree lists a node id, if any. */
function locateNode(
  workspace: Workspace,
  nodeId: string,
): { boardKey: BoardKey; variantRootId: string } | undefined {
  for (const [key, board] of Object.entries(workspace.boards)) {
    if (!isComponentBoard(board) && !isAuthoredBoard(board)) continue

    for (const variant of board.variants) {
      let found = false

      walkBoardTreeRefs([variant], (ref) => {
        if (ref.id !== nodeId) return
        found = true

        return true
      })
      if (found) return { boardKey: key as BoardKey, variantRootId: variant.id }
    }
  }

  return undefined
}

const selectNode = defineSeldonTool({
  name: "select_node",
  label: "Select Node",
  description:
    "Set the current selection to a node so later edits target it by default. Pass an explicit nodeId, or a match string to locate one by label or catalog id. Sets the active board and variant column from the node.",
  kind: "select",
  parameters: Type.Object({
    nodeId: Type.Optional(Type.String({ description: "Node id to select." })),
    match: Type.Optional(
      Type.String({ description: "Label or catalog id to locate the node instead of an id." }),
    ),
  }),
  run: (ctx, params) => {
    const workspace = ctx.getWorkspace()
    const explicitId = params.nodeId as string | undefined
    const match = params.match as string | undefined

    let nodeId = explicitId

    if (!nodeId && match) {
      const resolution = ctx.resolveTarget("selection" as TargetSpec, match)

      if (resolution.kind === "message") return resolution.text
      nodeId = resolution.nodeId
    }

    if (!nodeId) return "Pass a nodeId or a match string to select a node."
    if (!workspace.nodes[nodeId]) return `No node found for id "${nodeId}".`

    const located = locateNode(workspace, nodeId)

    ctx.setSelection({
      selectedNodeId: nodeId,
      selectedNodeRootId: located?.variantRootId,
      selectedBoardId: undefined,
      resolvedKey: located?.boardKey ?? ctx.selection.resolvedKey,
      scope: "instance",
    })

    const boardNote = located ? ` on board ${located.boardKey}` : ""

    return `Selected node ${nodeId}${boardNote}. Later edits default to it.`
  },
})

const selectBoard = defineSeldonTool({
  name: "select_board",
  label: "Select Board",
  description:
    "Set the current selection to a board so later edits and reads target it by default. Pass its board key (from list_boards).",
  kind: "select",
  parameters: Type.Object({
    boardKey: Type.String({ description: "Board key to select (from list_boards)." }),
  }),
  run: (ctx, params) => {
    const boardKey = params.boardKey as BoardKey
    const workspace = ctx.getWorkspace()

    if (!workspace.boards[boardKey]) return `No board found for key "${boardKey}".`

    ctx.setSelection({
      resolvedKey: boardKey,
      selectedBoardId: boardKey,
      selectedNodeId: undefined,
      selectedNodeRootId: undefined,
      scope: "board",
    })

    return `Selected board ${boardKey}. Later edits and reads default to it.`
  },
})

const setScope = defineSeldonTool({
  name: "set_scope",
  label: "Set Scope",
  description:
    'Set the selection scope, which drives edit reach and defaults: "workspace", "board", "variant", "instance", "theme", "fontCollection", "iconSet", or "media". Instance keeps edits local; board or variant lets a property edit cascade to the shared source.',
  kind: "select",
  parameters: Type.Object({
    scope: Type.Union(
      SCOPES.map((scope) => Type.Literal(scope)),
      { description: "The selection scope to set." },
    ),
  }),
  run: (ctx, params) => {
    const scope = params.scope as SelectionScope

    ctx.setSelection({ scope })

    return `Scope set to "${scope}".`
  },
})

/** Selection tools, exposed to MCP so an external agent builds its own target context. */
export const SELECTION_TOOLS: SeldonTool[] = [selectNode, selectBoard, setScope]
