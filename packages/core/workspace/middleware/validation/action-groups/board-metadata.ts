import { invariant } from "../../../../index"
import { ComponentId } from "../../../../components/constants"
import { ValueType } from "../../../../properties"
import { isResourceType } from "../../../helpers/components/is-resource-type"
import {
  boardValidators,
  propertyValidators,
  themeValidators,
} from "../validators"
import { WorkspaceValidationError } from "../workspace-validation-error"
import type { Action, Board, Workspace } from "../../../types"

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
 * resource id rather than a ComponentId, so they validate against the BOARD schema.
 */
function resolvePropertySchemaId(
  board: Board | undefined,
  boardKey: string,
): ComponentId {
  return board && isResourceType(board)
    ? ComponentId.BOARD
    : (boardKey as ComponentId)
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
      const schemaId = resolvePropertySchemaId(board, boardKey)
      propertyValidators.keys(action.payload.properties, schemaId, board)
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
        resolvePropertySchemaId(board, boardKey),
        board,
      )
      return
    }
    case "set_component_theme":
      boardValidators.exists(workspace, action.payload.boardKey)
      themeValidators.exists(workspace, action.payload.theme)
      return
  }
}
