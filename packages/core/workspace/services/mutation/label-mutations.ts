import { plural } from "pluralize"

import { findComponentSchema } from "../../../components/catalog"
import { ComponentId } from "../../../components/constants"
import { walkBoardTreeRefs } from "../../helpers/components/walk-board-tree-refs"
import { getNextVariantLabel } from "../../helpers/general/get-next-variant-label"
import { getSpecialBoardVariantLabel } from "../../helpers/general/get-special-board-variant-label"
import { getWorkspaceNodes } from "../../helpers/general/get-workspace-nodes"
import {
  type RepeatEditorData,
  applyNodeRepeat,
} from "../../helpers/nodes/node-repeat"
import { Board, InstanceId, VariantId, Workspace } from "../../types"
import { withNodeMutation } from "../shared/workspace-operation-helpers"
import { typeCheckingService } from "../type-checking/type-checking.service"

export function setNodeLabel(
  nodeId: VariantId | InstanceId,
  label: string,
  workspace: Workspace,
): Workspace {
  return withNodeMutation(nodeId, workspace, (node) => {
    node.label = label
  })
}

export function setNodeRef(
  nodeId: VariantId | InstanceId,
  ref: string,
  workspace: Workspace,
): Workspace {
  return withNodeMutation(nodeId, workspace, (node) => {
    const trimmed = ref.trim()
    if (trimmed === "") delete node.ref
    else node.ref = trimmed
  })
}

export function setNodeEditorData(
  nodeId: VariantId | InstanceId,
  editorData: Record<string, unknown> | undefined,
  workspace: Workspace,
): Workspace {
  return withNodeMutation(nodeId, workspace, (node) => {
    if (editorData === undefined) delete node.__editor
    else node.__editor = editorData
  })
}

/**
 * Sets the editor-only repeat preview state on a node. Merge-safe: preserves
 * other `__editor` keys such as `initialOverrides`. A non-meaningful repeat
 * (count <= 1 with no data) or `undefined` clears the repeat state.
 */
export function setNodeRepeat(
  nodeId: VariantId | InstanceId,
  repeat: RepeatEditorData | undefined,
  workspace: Workspace,
): Workspace {
  return withNodeMutation(nodeId, workspace, (node) => {
    applyNodeRepeat(node, repeat)
  })
}

/** Picks the next numbered variant label for a component board. */
export function getInitialVariantLabel(
  componentId: ComponentId,
  workspace: Workspace,
): string {
  const nodesMap = getWorkspaceNodes(workspace)
  const board = workspace.boards[componentId]
  const variantIdsOnBoard = board
    ? collectVariantNodeIdsOnBoard(board)
    : new Set<string>()

  const specialLabel = board ? getSpecialBoardVariantLabel(board, false) : null
  if (specialLabel) {
    const specialLabelTaken = Object.values(nodesMap).some(
      (node) =>
        typeCheckingService.isUserVariant(node) &&
        variantIdsOnBoard.has(node.id) &&
        node.label === specialLabel,
    )
    if (!specialLabelTaken) {
      return specialLabel
    }
  }

  const existingLabels = new Set(
    Object.values(nodesMap)
      .filter(
        (node) =>
          typeCheckingService.isUserVariant(node) &&
          variantIdsOnBoard.has(node.id) &&
          node.label,
      )
      .map((node) => node.label),
  )

  // Use a neutral base so the label never repeats the board or catalog name.
  // The export code name prepends that name already, so basing the label on it
  // produced a doubled name such as "DialogDialog_01"; "Variant NN" yields the
  // clean "DialogVariant_01" for both authored and component variants.
  return getNextVariantLabel("Variant", existingLabels)
}

/** Pluralizes the component schema name for a new board label, such as "Buttons". */
export function getInitialComponentLabel(componentId: ComponentId): string {
  const schema = findComponentSchema(componentId)
  return schema ? plural(schema.name) : `Unknown Component (${componentId})`
}

/**
 * Pluralizes an authored component's name for its board label, such as
 * "Dialogs". The board label is a plural grouping convention; the authored root
 * node keeps the singular name that export and code names read.
 */
export function getInitialAuthoredComponentLabel(name: string): string {
  return plural(name)
}

function collectVariantNodeIdsOnBoard(board: Board): Set<string> {
  const ids = new Set<string>()
  walkBoardTreeRefs(board.variants, (ref) => {
    ids.add(ref.id)
  })
  return ids
}
