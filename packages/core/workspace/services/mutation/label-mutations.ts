import { plural } from "pluralize"

import { getComponentSchema } from "../../../components/catalog"
import { ComponentId } from "../../../components/constants"
import { walkBoardTreeRefs } from "../../helpers/components/walk-board-tree-refs"
import { getNextVariantLabel } from "../../helpers/general/get-next-variant-label"
import { getSpecialBoardVariantLabel } from "../../helpers/general/get-special-board-variant-label"
import { getWorkspaceNodes } from "../../helpers/general/get-workspace-nodes"
import {
  applyNodeRepeat,
  type RepeatEditorData,
} from "../../helpers/nodes/node-repeat"
import { Board, InstanceId, VariantId, Workspace } from "../../types"
import { nodeRetrievalService } from "../nodes/node-retrieval.service"
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

  const defaultVariant = board
    ? nodeRetrievalService.getDefaultVariant(componentId, workspace)
    : undefined
  const base =
    defaultVariant?.label && defaultVariant.label !== "Default"
      ? defaultVariant.label
      : (board?.label ?? defaultVariant?.label ?? "Variant")

  return getNextVariantLabel(base, existingLabels)
}

/** Pluralizes the component schema name for a new board label, such as "Buttons". */
export function getInitialComponentLabel(componentId: ComponentId): string {
  try {
    return plural(getComponentSchema(componentId).name)
  } catch {
    return `Unknown Component (${componentId})`
  }
}

function collectVariantNodeIdsOnBoard(board: Board): Set<string> {
  const ids = new Set<string>()
  walkBoardTreeRefs(board.variants, (ref) => {
    ids.add(ref.id)
  })
  return ids
}
