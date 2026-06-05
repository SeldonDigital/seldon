import { invariant } from "../../../../index"
import {
  FONT_COLLECTION_COMPONENT_CATALOG_IDS,
  ICON_SET_COMPONENT_CATALOG_IDS,
  MEDIA_COMPONENT_CATALOG_IDS,
  THEME_COMPONENT_CATALOG_IDS,
} from "../../../helpers/components/resource-component-catalog-ids"
import {
  isComponentBoard,
  isFontCollectionBoard,
  isIconSetBoard,
  isMediaBoard,
  isPlaygroundBoard,
  isThemeBoard,
} from "../../../model/components"
import { shouldBlockDeletableComponentRemoval } from "../../../helpers/removal/component-removal-guards"
import { DEFAULT_FONT_COLLECTION_BOARD_KEY } from "../../../helpers/font-collections/seed-default-font-collection-board"
import { DEFAULT_ICON_SET_BOARD_KEY } from "../../../helpers/icon-sets/seed-default-icon-set-board"
import { DEFAULT_THEME_BOARD_KEY } from "../../../helpers/themes/seed-default-theme-board"
import { ErrorMessages } from "../../../constants"
import { componentValidators, isPackagedCatalogBoard } from "../validators"
import { WorkspaceValidationError } from "../workspace-validation-error"
import type { ComponentId } from "../../../../components/constants"
import type { Action, Workspace } from "../../../types"

const RESOURCE_CATALOGS = {
  "add_font_collection": {
    idKey: "catalogId" as const,
    allowed: FONT_COLLECTION_COMPONENT_CATALOG_IDS,
    label: "Font collection",
  },
  "add_media": {
    idKey: "catalogId" as const,
    allowed: MEDIA_COMPONENT_CATALOG_IDS,
    label: "Media",
  },
  "add_icon_set": {
    idKey: "catalogId" as const,
    allowed: ICON_SET_COMPONENT_CATALOG_IDS,
    label: "Icon set",
  },
  "add_theme": {
    idKey: "componentKey" as const,
    allowed: THEME_COMPONENT_CATALOG_IDS,
    label: "Theme",
  },
} as const

export function validateAddResourceCatalog(
  workspace: Workspace,
  action: Extract<
    Action,
  { type: "add_font_collection" | "add_media" | "add_icon_set" | "add_theme" }
  >,
): void {
  const config = RESOURCE_CATALOGS[action.type]
  const catalogId =
    action.type === "add_theme"
      ? action.payload.componentKey
      : action.payload.catalogId
  componentValidators.doesNotExist(workspace, catalogId)
  try {
    componentValidators.assertCatalogId(catalogId, config.allowed, config.label)
  } catch (error) {
    if (error instanceof Error) {
      throw new WorkspaceValidationError(error.message, action)
    }
    throw error
  }
}

export function validateDuplicateComponent(
  workspace: Workspace,
  action: Extract<Action, { type: "duplicate_component" }>,
): void {
  componentValidators.exists(workspace, action.payload.sourceComponentKey)
  componentValidators.doesNotExist(workspace, action.payload.newComponentKey)
  const sourceBoard = workspace.components[action.payload.sourceComponentKey]
  invariant(
    sourceBoard,
    `ComponentEntry ${action.payload.sourceComponentKey} missing after exists check`,
  )

  if (isComponentBoard(sourceBoard)) {
    throw new WorkspaceValidationError(
      "Cannot duplicate a component board",
      action,
    )
  }

  const packagedChecks: Array<[boolean, string]> = [
    [
      isThemeBoard(sourceBoard) &&
        isPackagedCatalogBoard(sourceBoard, THEME_COMPONENT_CATALOG_IDS),
      "Cannot duplicate a theme board tied to a packaged theme catalog",
    ],
    [
      isFontCollectionBoard(sourceBoard) &&
        isPackagedCatalogBoard(
          sourceBoard,
          FONT_COLLECTION_COMPONENT_CATALOG_IDS,
        ),
      "Cannot duplicate a font collection board tied to a packaged catalog",
    ],
    [
      isIconSetBoard(sourceBoard) &&
        isPackagedCatalogBoard(sourceBoard, ICON_SET_COMPONENT_CATALOG_IDS),
      "Cannot duplicate an icon set board tied to a packaged catalog",
    ],
    [
      isMediaBoard(sourceBoard) &&
        isPackagedCatalogBoard(sourceBoard, MEDIA_COMPONENT_CATALOG_IDS),
      "Cannot duplicate a media board tied to a packaged catalog",
    ],
  ]

  for (const [blocked, message] of packagedChecks) {
    if (blocked) {
      throw new WorkspaceValidationError(message, action)
    }
  }
}

export function validateRemoveBoard(
  workspace: Workspace,
  action: Action,
): void {
  switch (action.type) {
    case "remove_component": {
      const componentId = action.payload.componentId
      componentValidators.exists(workspace, componentId)
      const board = workspace.components[componentId]
      if (!board || !isComponentBoard(board)) {
        throw new WorkspaceValidationError(
          `Expected a component board at ${componentId}`,
          action,
        )
      }
      if (
        shouldBlockDeletableComponentRemoval(board, workspace, componentId)
      ) {
        throw new Error(
          ErrorMessages.componentVariantsInUse(componentId as ComponentId),
        )
      }
      break
    }
    case "remove_playground": {
      const { componentKey } = action.payload
      componentValidators.exists(workspace, componentKey)
      const board = workspace.components[componentKey]
      if (!board || !isPlaygroundBoard(board)) {
        throw new WorkspaceValidationError(
          `Expected a playground board at ${componentKey}`,
          action,
        )
      }
      if (
        shouldBlockDeletableComponentRemoval(board, workspace, componentKey)
      ) {
        throw new WorkspaceValidationError(
          "Playground board is still referenced by another catalog",
          action,
        )
      }
      break
    }
    case "remove_font_collection": {
      const catalogId = action.payload.catalogId
      componentValidators.exists(workspace, catalogId)
      const board = workspace.components[catalogId]
      if (!board || !isFontCollectionBoard(board)) {
        throw new WorkspaceValidationError(
          `Expected a font collection board at ${catalogId}`,
          action,
        )
      }
      if (catalogId === DEFAULT_FONT_COLLECTION_BOARD_KEY) {
        throw new WorkspaceValidationError(
          "Cannot remove the System font collection board. Every workspace requires the system fonts and the Seldon theme, so this board is always kept.",
          action,
        )
      }
      if (
        shouldBlockDeletableComponentRemoval(board, workspace, catalogId)
      ) {
        throw new WorkspaceValidationError(
          "Font collection catalog rows are still referenced in another board",
          action,
        )
      }
      break
    }
    case "remove_media": {
      const catalogId = action.payload.catalogId
      componentValidators.exists(workspace, catalogId)
      const board = workspace.components[catalogId]
      if (!board || !isMediaBoard(board)) {
        throw new WorkspaceValidationError(
          `Expected a media board at ${catalogId}`,
          action,
        )
      }
      if (shouldBlockDeletableComponentRemoval(board, workspace, catalogId)) {
        throw new WorkspaceValidationError(
          "Media catalog rows are still referenced in another board",
          action,
        )
      }
      break
    }
    case "remove_icon_set": {
      const catalogId = action.payload.catalogId
      componentValidators.exists(workspace, catalogId)
      const board = workspace.components[catalogId]
      if (!board || !isIconSetBoard(board)) {
        throw new WorkspaceValidationError(
          `Expected an icon set board at ${catalogId}`,
          action,
        )
      }
      if (catalogId === DEFAULT_ICON_SET_BOARD_KEY) {
        throw new WorkspaceValidationError(
          "Cannot remove the Seldon icon set board. Every workspace requires the Seldon icon set, so this board is always kept.",
          action,
        )
      }
      if (shouldBlockDeletableComponentRemoval(board, workspace, catalogId)) {
        throw new WorkspaceValidationError(
          "Icon set catalog rows are still referenced in another board",
          action,
        )
      }
      break
    }
    case "remove_theme": {
      const componentKey = action.payload.componentKey
      componentValidators.exists(workspace, componentKey)
      const board = workspace.components[componentKey]
      if (!board || !isThemeBoard(board)) {
        throw new WorkspaceValidationError(
          `Expected a theme board at ${componentKey}`,
          action,
        )
      }
      if (componentKey === DEFAULT_THEME_BOARD_KEY) {
        throw new WorkspaceValidationError(
          "Cannot remove the Seldon theme board. Every workspace requires the Seldon theme, so this board is always kept.",
          action,
        )
      }
      if (shouldBlockDeletableComponentRemoval(board, workspace, componentKey)) {
        throw new WorkspaceValidationError(
          "Theme catalog rows are still referenced in another board",
          action,
        )
      }
      break
    }
  }
}
