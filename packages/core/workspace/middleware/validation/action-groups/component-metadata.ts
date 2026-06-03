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
import type { Action, ComponentEntry, Workspace } from "../../../types"

export function assertComponentHasAllowedKind(
  workspace: Workspace,
  componentKey: string,
  action: Action,
  allowed: ReadonlyArray<ComponentEntry["type"]>,
): void {
  componentValidators.exists(workspace, componentKey)
  const board = workspace.components[componentKey]
  invariant(board, `ComponentEntry ${componentKey} missing after exists check`)
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
] as const satisfies ReadonlyArray<ComponentEntry["type"]>

const AUTHOR_BOARDS = ["component", "theme"] as const satisfies ReadonlyArray<
  ComponentEntry["type"]
>

const CREDENTIALS_BOARDS = [
  "font-collection",
  "icon-set",
  "media",
] as const satisfies ReadonlyArray<ComponentEntry["type"]>

const PREVIEW_BOARDS = [
  "theme",
  "font-collection",
  "icon-set",
  "media",
] as const satisfies ReadonlyArray<ComponentEntry["type"]>

export function validateComponentMetadata(
  workspace: Workspace,
  action: Action,
): void {
  switch (action.type) {
    case "set_component_label":
    case "set_component_intent":
    case "set_component_tags":
    case "set_component_editor_data":
    case "reset_component_label":
    case "reset_component_intent":
    case "reset_component_tags":
    case "reset_component_editor_data":
      componentValidators.exists(workspace, action.payload.componentKey)
      break
    case "set_component_license":
      assertComponentHasAllowedKind(
        workspace,
        action.payload.componentKey,
        action,
        LICENSE_BOARDS,
      )
      break
    case "reset_component_license":
      assertComponentHasAllowedKind(
        workspace,
        action.payload.componentKey,
        action,
        LICENSE_BOARDS,
      )
      componentValidators.exists(workspace, action.payload.componentKey)
      break
    case "set_component_author":
      assertComponentHasAllowedKind(
        workspace,
        action.payload.componentKey,
        action,
        AUTHOR_BOARDS,
      )
      break
    case "reset_component_author":
      assertComponentHasAllowedKind(
        workspace,
        action.payload.componentKey,
        action,
        AUTHOR_BOARDS,
      )
      componentValidators.exists(workspace, action.payload.componentKey)
      break
    case "set_component_credentials":
      assertComponentHasAllowedKind(
        workspace,
        action.payload.componentKey,
        action,
        CREDENTIALS_BOARDS,
      )
      break
    case "reset_component_credentials":
      assertComponentHasAllowedKind(
        workspace,
        action.payload.componentKey,
        action,
        CREDENTIALS_BOARDS,
      )
      componentValidators.exists(workspace, action.payload.componentKey)
      break
    case "set_component_preview":
      assertComponentHasAllowedKind(
        workspace,
        action.payload.componentKey,
        action,
        PREVIEW_BOARDS,
      )
      break
    case "reset_component_preview":
      assertComponentHasAllowedKind(
        workspace,
        action.payload.componentKey,
        action,
        PREVIEW_BOARDS,
      )
      componentValidators.exists(workspace, action.payload.componentKey)
      break
    case "set_component_properties": {
      const componentKey = action.payload.componentKey
      componentValidators.exists(workspace, componentKey)
      const board = workspace.components[componentKey]
      // Resource boards (theme, font collection, icon set, media) key by their
      // resource id, not a ComponentId. They only carry board-level properties,
      // so validate those against the BOARD schema.
      const componentId =
        board && isResourceType(board)
          ? ComponentId.BOARD
          : (componentKey as ComponentId)
      propertyValidators.keys(action.payload.properties, componentId, board)
      propertyValidators.values(
        action.payload.properties,
        workspace,
        board?.componentTheme,
      )
      break
    }
    case "reset_component_property": {
      const componentKey = action.payload.componentKey
      componentValidators.exists(workspace, componentKey)
      const board = workspace.components[componentKey]
      const componentId =
        board && isResourceType(board)
          ? ComponentId.BOARD
          : (componentKey as ComponentId)
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
      const componentKey = action.payload.componentKey
      componentValidators.exists(workspace, componentKey)
      themeValidators.exists(workspace, action.payload.theme)
      break
    }
  }
}
