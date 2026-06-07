import { invariant } from "../../../../index"
import { ComponentId } from "../../../../components/constants"
import { ValueType } from "../../../../properties"
import { isResourceType } from "../../../helpers/components/is-resource-type"
import {
  componentValidators,
  propertyValidators,
  themeValidators,
} from "../validators"
import { WorkspaceValidationError } from "../workspace-validation-error"
import type { Action, Board, Workspace } from "../../../types"

export function assertComponentHasAllowedKind(
  workspace: Workspace,
  boardKey: string,
  action: Action,
  allowed: ReadonlyArray<Board["type"]>,
): void {
  componentValidators.exists(workspace, boardKey)
  const board = workspace.components[boardKey]
  invariant(board, `Board ${boardKey} missing after exists check`)
  if (!allowed.includes(board.type)) {
    throw new WorkspaceValidationError(
      "That update does not apply to this board type.",
      action,
    )
  }
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

export function validateComponentMetadata(
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
      componentValidators.exists(workspace, action.payload.boardKey)
      break
    case "set_board_license":
      assertComponentHasAllowedKind(
        workspace,
        action.payload.boardKey,
        action,
        LICENSE_BOARDS,
      )
      break
    case "reset_board_license":
      assertComponentHasAllowedKind(
        workspace,
        action.payload.boardKey,
        action,
        LICENSE_BOARDS,
      )
      componentValidators.exists(workspace, action.payload.boardKey)
      break
    case "set_board_author":
      assertComponentHasAllowedKind(
        workspace,
        action.payload.boardKey,
        action,
        AUTHOR_BOARDS,
      )
      break
    case "reset_board_author":
      assertComponentHasAllowedKind(
        workspace,
        action.payload.boardKey,
        action,
        AUTHOR_BOARDS,
      )
      componentValidators.exists(workspace, action.payload.boardKey)
      break
    case "set_board_credentials":
      assertComponentHasAllowedKind(
        workspace,
        action.payload.boardKey,
        action,
        CREDENTIALS_BOARDS,
      )
      break
    case "reset_board_credentials":
      assertComponentHasAllowedKind(
        workspace,
        action.payload.boardKey,
        action,
        CREDENTIALS_BOARDS,
      )
      componentValidators.exists(workspace, action.payload.boardKey)
      break
    case "set_board_preview":
      assertComponentHasAllowedKind(
        workspace,
        action.payload.boardKey,
        action,
        PREVIEW_BOARDS,
      )
      break
    case "reset_board_preview":
      assertComponentHasAllowedKind(
        workspace,
        action.payload.boardKey,
        action,
        PREVIEW_BOARDS,
      )
      componentValidators.exists(workspace, action.payload.boardKey)
      break
    case "set_component_properties": {
      const boardKey = action.payload.boardKey
      componentValidators.exists(workspace, boardKey)
      const board = workspace.components[boardKey]
      // Resource boards (theme, font collection, icon set, media) key by their
      // resource id, not a ComponentId. They only carry board-level properties,
      // so validate those against the BOARD schema.
      const componentId =
        board && isResourceType(board)
          ? ComponentId.BOARD
          : (boardKey as ComponentId)
      propertyValidators.keys(action.payload.properties, componentId, board)
      propertyValidators.values(
        action.payload.properties,
        workspace,
        board?.componentTheme,
      )
      break
    }
    case "reset_component_property": {
      const boardKey = action.payload.boardKey
      componentValidators.exists(workspace, boardKey)
      const board = workspace.components[boardKey]
      const componentId =
        board && isResourceType(board)
          ? ComponentId.BOARD
          : (boardKey as ComponentId)
      propertyValidators.keys(
        {
          [action.payload.propertyKey]: {
            type: ValueType.EMPTY,
            value: null,
          },
        },
        componentId,
        board,
      )
      break
    }
    case "set_component_theme": {
      const boardKey = action.payload.boardKey
      componentValidators.exists(workspace, boardKey)
      themeValidators.exists(workspace, action.payload.theme)
      break
    }
  }
}
