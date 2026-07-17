import { ComponentId } from "../../../../components/constants"
import { isComponentId } from "../../../../components/constants"
import { invariant } from "../../../../index"
import { ValueType } from "../../../../properties"
import { isResourceType } from "../../../helpers/components/is-resource-type"
import { getNodeCatalogId } from "../../../helpers/nodes/get-node-catalog-id"
import { isAuthoredBoard } from "../../../model/components"
import type { Action, Board, EntryNode, Workspace } from "../../../types"
import {
  boardValidators,
  propertyValidators,
  themeValidators,
} from "../validators"
import { WorkspaceValidationError } from "../workspace-validation-error"

function assertBoardHasAllowedKind(
  workspace: Workspace,
  boardKey: string,
  action: Action,
  allowed: ReadonlyArray<Board["type"]>,
): void {
  boardValidators.exists(workspace, boardKey)
  const board = workspace.boards[boardKey]
  invariant(board, `Board ${boardKey} missing after exists check`)
  if (!allowed.includes(board.type)) {
    throw new WorkspaceValidationError(
      "That update does not apply to this board type.",
      action,
    )
  }
}

/**
 * Schema id used to validate a board's properties. Resource boards key by their
 * resource id rather than a ComponentId, so they validate against the BOARD
 * schema. Authored boards have no catalog schema of their own, so they validate
 * against their ghost root component (Container or Frame): the authored
 * component's property vocabulary is that root's, even though the root is not
 * the board's template or catalogId.
 */
function resolvePropertySchemaId(
  board: Board | undefined,
  boardKey: string,
  workspace: Workspace,
): ComponentId {
  if (board && isResourceType(board)) {
    return ComponentId.BOARD
  }
  if (board && isAuthoredBoard(board)) {
    const rootId = board.variants[0]?.id
    const rootNode = rootId
      ? (workspace.nodes[rootId] as EntryNode | undefined)
      : undefined
    const catalogId = rootNode ? getNodeCatalogId(rootNode, workspace) : null
    invariant(
      catalogId && isComponentId(catalogId),
      `Authored board ${boardKey} has no resolvable ghost component`,
    )
    return catalogId
  }
  return boardKey as ComponentId
}

const LICENSE_BOARDS = [
  "component",
  "theme",
  "font-collection",
  "icon-set",
  "media",
] as const satisfies ReadonlyArray<Board["type"]>

const AUTHOR_BOARDS = ["component", "theme"] as const satisfies ReadonlyArray<
  Board["type"]
>

const CREDENTIALS_BOARDS = [
  "font-collection",
  "icon-set",
  "media",
] as const satisfies ReadonlyArray<Board["type"]>

const PREVIEW_BOARDS = [
  "theme",
  "font-collection",
  "icon-set",
  "media",
] as const satisfies ReadonlyArray<Board["type"]>

const COMPONENT_BOARDS = ["component"] as const satisfies ReadonlyArray<
  Board["type"]
>

export function validateBoardMetadata(
  workspace: Workspace,
  action: Action,
): void {
  switch (action.type) {
    case "set_board_label":
    case "set_board_intent":
    case "set_board_tags":
    case "set_board_editor_data":
    case "reset_board_label":
    case "reset_board_intent":
    case "reset_board_tags":
    case "reset_board_editor_data":
      boardValidators.exists(workspace, action.payload.boardKey)
      return
    case "set_board_license":
    case "reset_board_license":
      assertBoardHasAllowedKind(
        workspace,
        action.payload.boardKey,
        action,
        LICENSE_BOARDS,
      )
      return
    case "set_board_author":
    case "reset_board_author":
      assertBoardHasAllowedKind(
        workspace,
        action.payload.boardKey,
        action,
        AUTHOR_BOARDS,
      )
      return
    case "set_board_credentials":
    case "reset_board_credentials":
      assertBoardHasAllowedKind(
        workspace,
        action.payload.boardKey,
        action,
        CREDENTIALS_BOARDS,
      )
      return
    case "set_board_preview":
    case "reset_board_preview":
      assertBoardHasAllowedKind(
        workspace,
        action.payload.boardKey,
        action,
        PREVIEW_BOARDS,
      )
      return
    case "set_component_properties": {
      const boardKey = action.payload.boardKey
      boardValidators.exists(workspace, boardKey)
      const board = workspace.boards[boardKey]
      const schemaId = resolvePropertySchemaId(board, boardKey, workspace)
      propertyValidators.keys(action.payload.properties, schemaId, board, {
        rejectDottedKeys: true,
      })
      propertyValidators.values(
        action.payload.properties,
        workspace,
        board?.componentTheme,
      )
      return
    }
    case "reset_component_property": {
      const boardKey = action.payload.boardKey
      boardValidators.exists(workspace, boardKey)
      const board = workspace.boards[boardKey]
      propertyValidators.keys(
        {
          [action.payload.propertyKey]: { type: ValueType.EMPTY, value: null },
        },
        resolvePropertySchemaId(board, boardKey, workspace),
        board,
      )
      return
    }
    case "reset_component_board":
      assertBoardHasAllowedKind(
        workspace,
        action.payload.boardKey,
        action,
        COMPONENT_BOARDS,
      )
      return
    case "apply_component_properties_to_all_boards":
      assertBoardHasAllowedKind(
        workspace,
        action.payload.sourceBoardKey,
        action,
        COMPONENT_BOARDS,
      )
      return
    case "set_component_theme":
      boardValidators.exists(workspace, action.payload.boardKey)
      themeValidators.exists(workspace, action.payload.theme)
      return
  }
}
