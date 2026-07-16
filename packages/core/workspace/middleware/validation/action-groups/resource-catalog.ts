import type { ComponentId } from "../../../../components/constants"
import { invariant } from "../../../../index"
import { ErrorMessages } from "../../../constants"
import {
  FONT_COLLECTION_BOARD_CATALOG_IDS,
  ICON_SET_BOARD_CATALOG_IDS,
  MEDIA_BOARD_CATALOG_IDS,
  THEME_BOARD_CATALOG_IDS,
} from "../../../helpers/components/resource-board-catalog-ids"
import { shouldBlockDeletableBoardRemoval } from "../../../helpers/removal/board-removal-guards"
import { DEFAULT_FONT_COLLECTION_BOARD_KEY } from "../../../helpers/seed/seed-default-font-collection-board"
import { DEFAULT_ICON_SET_BOARD_KEY } from "../../../helpers/seed/seed-default-icon-set-board"
import { DEFAULT_THEME_BOARD_KEY } from "../../../helpers/seed/seed-default-theme-board"
import {
  isComponentBoard,
  isFontCollectionBoard,
  isIconSetBoard,
  isMediaBoard,
  isThemeBoard,
} from "../../../model/components"
import type { Action, Board, Workspace } from "../../../types"
import { boardValidators, isPackagedCatalogBoard } from "../validators"
import { WorkspaceValidationError } from "../workspace-validation-error"

const RESOURCE_CATALOGS = {
  add_font_collection: {
    idKey: "catalogId" as const,
    allowed: FONT_COLLECTION_BOARD_CATALOG_IDS,
    label: "Font collection",
  },
  add_media: {
    idKey: "catalogId" as const,
    allowed: MEDIA_BOARD_CATALOG_IDS,
    label: "Media",
  },
  add_icon_set: {
    idKey: "catalogId" as const,
    allowed: ICON_SET_BOARD_CATALOG_IDS,
    label: "Icon set",
  },
  add_theme: {
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
  const sourceBoard = workspace.boards[action.payload.sourceBoardKey]
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
        isPackagedCatalogBoard(sourceBoard, FONT_COLLECTION_BOARD_CATALOG_IDS),
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

/** Protected default boards that may never be removed, keyed by board type. */
const PROTECTED_BOARDS: Partial<
  Record<Board["type"], { key: string; message: string }>
> = {
  theme: {
    key: DEFAULT_THEME_BOARD_KEY,
    message:
      "Cannot remove the Seldon theme board. Every workspace requires the Seldon theme, so this board is always kept.",
  },
  "font-collection": {
    key: DEFAULT_FONT_COLLECTION_BOARD_KEY,
    message:
      "Cannot remove the System font collection board. Every workspace requires the system fonts and the Seldon theme, so this board is always kept.",
  },
  "icon-set": {
    key: DEFAULT_ICON_SET_BOARD_KEY,
    message:
      "Cannot remove the Seldon icon set board. Every workspace requires the Seldon icon set, so this board is always kept.",
  },
}

/** Message thrown when a board's variants are still referenced elsewhere. */
const IN_USE_MESSAGES: Partial<Record<Board["type"], (key: string) => string>> =
  {
    component: (key) => ErrorMessages.componentVariantsInUse(key as ComponentId),
    "authored-component": (key) =>
      ErrorMessages.componentVariantsInUse(key as ComponentId),
    theme: () => "Theme catalog rows are still referenced in another board",
    "font-collection": () =>
      "Font collection catalog rows are still referenced in another board",
    media: () => "Media catalog rows are still referenced in another board",
    "icon-set": () =>
      "Icon set catalog rows are still referenced in another board",
    playground: () => "Playground board is still referenced by another catalog",
  }

export function validateRemoveBoard(
  workspace: Workspace,
  action: Action,
): void {
  const key = (action.payload as { boardKey: string }).boardKey
  const board = workspace.boards[key] ?? workspace.playgrounds?.[key]
  if (!board) {
    throw new WorkspaceValidationError(
      ErrorMessages.componentNotFound(key),
      action,
    )
  }

  const protectedBoard = PROTECTED_BOARDS[board.type]
  if (protectedBoard && key === protectedBoard.key) {
    throw new WorkspaceValidationError(protectedBoard.message, action)
  }

  if (shouldBlockDeletableBoardRemoval(board, workspace, key)) {
    const buildMessage = IN_USE_MESSAGES[board.type]
    throw new WorkspaceValidationError(
      buildMessage ? buildMessage(key) : ErrorMessages.componentNotFound(key),
      action,
    )
  }
}
