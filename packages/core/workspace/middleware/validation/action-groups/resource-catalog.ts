import { invariant } from "../../../../index"
import {
  FONT_COLLECTION_BOARD_CATALOG_IDS,
  ICON_SET_BOARD_CATALOG_IDS,
  MEDIA_BOARD_CATALOG_IDS,
  THEME_BOARD_CATALOG_IDS,
} from "../../../helpers/components/resource-board-catalog-ids"
import {
  isComponentBoard,
  isFontCollectionBoard,
  isIconSetBoard,
  isMediaBoard,
  isPlaygroundBoard,
  isThemeBoard,
} from "../../../model/components"
import { shouldBlockDeletableBoardRemoval } from "../../../helpers/removal/board-removal-guards"
import { DEFAULT_FONT_COLLECTION_BOARD_KEY } from "../../../helpers/seed/seed-default-font-collection-board"
import { DEFAULT_ICON_SET_BOARD_KEY } from "../../../helpers/seed/seed-default-icon-set-board"
import { DEFAULT_THEME_BOARD_KEY } from "../../../helpers/seed/seed-default-theme-board"
import { ErrorMessages } from "../../../constants"
import { boardValidators, isPackagedCatalogBoard } from "../validators"
import { WorkspaceValidationError } from "../workspace-validation-error"
import type { ComponentId } from "../../../../components/constants"
import type { Action, Board, Workspace } from "../../../types"

const RESOURCE_CATALOGS = {
  "add_font_collection": {
    idKey: "catalogId" as const,
    allowed: FONT_COLLECTION_BOARD_CATALOG_IDS,
    label: "Font collection",
  },
  "add_media": {
    idKey: "catalogId" as const,
    allowed: MEDIA_BOARD_CATALOG_IDS,
    label: "Media",
  },
  "add_icon_set": {
    idKey: "catalogId" as const,
    allowed: ICON_SET_BOARD_CATALOG_IDS,
    label: "Icon set",
  },
  "add_theme": {
    idKey: "boardKey" as const,
    allowed: THEME_BOARD_CATALOG_IDS,
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
      ? action.payload.boardKey
      : action.payload.catalogId
  boardValidators.doesNotExist(workspace, catalogId)
  try {
    boardValidators.assertCatalogId(catalogId, config.allowed, config.label)
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
  boardValidators.exists(workspace, action.payload.sourceBoardKey)
  boardValidators.doesNotExist(workspace, action.payload.newBoardKey)
  const sourceBoard = workspace.components[action.payload.sourceBoardKey]
  invariant(
    sourceBoard,
    `Board ${action.payload.sourceBoardKey} missing after exists check`,
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
        isPackagedCatalogBoard(sourceBoard, THEME_BOARD_CATALOG_IDS),
      "Cannot duplicate a theme board tied to a packaged theme catalog",
    ],
    [
      isFontCollectionBoard(sourceBoard) &&
        isPackagedCatalogBoard(
          sourceBoard,
          FONT_COLLECTION_BOARD_CATALOG_IDS,
        ),
      "Cannot duplicate a font collection board tied to a packaged catalog",
    ],
    [
      isIconSetBoard(sourceBoard) &&
        isPackagedCatalogBoard(sourceBoard, ICON_SET_BOARD_CATALOG_IDS),
      "Cannot duplicate an icon set board tied to a packaged catalog",
    ],
    [
      isMediaBoard(sourceBoard) &&
        isPackagedCatalogBoard(sourceBoard, MEDIA_BOARD_CATALOG_IDS),
      "Cannot duplicate a media board tied to a packaged catalog",
    ],
  ]

  for (const [blocked, message] of packagedChecks) {
    if (blocked) {
      throw new WorkspaceValidationError(message, action)
    }
  }
}

interface RemoveBoardRule {
  /** Payload field that holds the board key. */
  keyField: "boardKey" | "catalogId"
  typeGuard: (board: Board) => boolean
  /** Article + label used in the wrong-type message, such as "a theme board". */
  expectedLabel: string
  /** Protected default board key that may never be removed. */
  protectedKey?: string
  protectedMessage?: string
  buildInUseError: (key: string, action: Action) => Error
}

const REMOVE_BOARD_RULES: Record<string, RemoveBoardRule> = {
  remove_component: {
    keyField: "boardKey",
    typeGuard: isComponentBoard,
    expectedLabel: "a component board",
    buildInUseError: (key) =>
      new Error(ErrorMessages.componentVariantsInUse(key as ComponentId)),
  },
  remove_playground: {
    keyField: "boardKey",
    typeGuard: isPlaygroundBoard,
    expectedLabel: "a playground board",
    buildInUseError: (_key, action) =>
      new WorkspaceValidationError(
        "Playground board is still referenced by another catalog",
        action,
      ),
  },
  remove_font_collection: {
    keyField: "catalogId",
    typeGuard: isFontCollectionBoard,
    expectedLabel: "a font collection board",
    protectedKey: DEFAULT_FONT_COLLECTION_BOARD_KEY,
    protectedMessage:
      "Cannot remove the System font collection board. Every workspace requires the system fonts and the Seldon theme, so this board is always kept.",
    buildInUseError: (_key, action) =>
      new WorkspaceValidationError(
        "Font collection catalog rows are still referenced in another board",
        action,
      ),
  },
  remove_media: {
    keyField: "catalogId",
    typeGuard: isMediaBoard,
    expectedLabel: "a media board",
    buildInUseError: (_key, action) =>
      new WorkspaceValidationError(
        "Media catalog rows are still referenced in another board",
        action,
      ),
  },
  remove_icon_set: {
    keyField: "catalogId",
    typeGuard: isIconSetBoard,
    expectedLabel: "an icon set board",
    protectedKey: DEFAULT_ICON_SET_BOARD_KEY,
    protectedMessage:
      "Cannot remove the Seldon icon set board. Every workspace requires the Seldon icon set, so this board is always kept.",
    buildInUseError: (_key, action) =>
      new WorkspaceValidationError(
        "Icon set catalog rows are still referenced in another board",
        action,
      ),
  },
  remove_theme: {
    keyField: "boardKey",
    typeGuard: isThemeBoard,
    expectedLabel: "a theme board",
    protectedKey: DEFAULT_THEME_BOARD_KEY,
    protectedMessage:
      "Cannot remove the Seldon theme board. Every workspace requires the Seldon theme, so this board is always kept.",
    buildInUseError: (_key, action) =>
      new WorkspaceValidationError(
        "Theme catalog rows are still referenced in another board",
        action,
      ),
  },
}

export function validateRemoveBoard(
  workspace: Workspace,
  action: Action,
): void {
  const rule = REMOVE_BOARD_RULES[action.type]
  if (!rule) return

  const key = (action.payload as Record<string, string>)[rule.keyField]
  boardValidators.exists(workspace, key)

  const board = workspace.components[key]
  if (!board || !rule.typeGuard(board)) {
    throw new WorkspaceValidationError(
      `Expected ${rule.expectedLabel} at ${key}`,
      action,
    )
  }

  if (rule.protectedKey && key === rule.protectedKey) {
    throw new WorkspaceValidationError(rule.protectedMessage!, action)
  }

  if (shouldBlockDeletableBoardRemoval(board, workspace, key)) {
    throw rule.buildInUseError(key, action)
  }
}
