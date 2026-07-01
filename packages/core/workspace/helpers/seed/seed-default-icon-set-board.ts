import { STOCK_ICON_SETS_BY_ID } from "../../../icon-sets/catalog"
import type { IconSetTemplateId } from "../../../icon-sets/types/icon-set-id"
import type { Board, IconSetBoard } from "../../model/components"
import { isIconSetBoard } from "../../model/components"
import type {
  EntryIconSet,
  EntryIconSetOverrides,
} from "../../model/entry-icon-set"
import { formatIconSetCatalog } from "../../model/template-ref"
import { setBoardOrder } from "../components/board-sort-order"
import { getInitialBoardComponentProperties } from "../components/get-initial-board-component-properties"
import { WORKSPACE_EDITABLE_THEME_ENTRY_ID } from "../themes/workspace-editable-theme"
import { type SeedableWorkspace, nextBoardOrder } from "./seedable-workspace"

/** Catalog row key for the default icon set board (matches the Seldon icon set id). */
export const DEFAULT_ICON_SET_BOARD_KEY = "seldonIcons" as const

/** Icon set entry id for the default board's default variant. */
export const DEFAULT_ICON_SET_ENTRY_ID = "icon-set-seldonIcons-default" as const

/** Extra icon set boards seeded into every new workspace alongside Seldon. Deletable. */
export const ADDITIONAL_ICON_SET_BOARD_KEYS = [
  "googleSymbols",
] as const satisfies IconSetTemplateId[]

/**
 * Builds inclusion overrides that turn on every icon in a set, so each
 * subcategory derives the `all` preset.
 */
function createAllIncludedIconsOverrides(
  catalogId: IconSetTemplateId,
): EntryIconSetOverrides {
  const includedIcons: Record<string, boolean> = {}
  for (const iconId of STOCK_ICON_SETS_BY_ID[catalogId].icons) {
    includedIcons[iconId] = true
  }
  return { includedIcons }
}

/**
 * Builds the default Seldon icon set entry with every icon enabled, so all
 * subcategories start on `all`.
 */
export function createDefaultIconSetEntry(): EntryIconSet {
  return {
    id: DEFAULT_ICON_SET_ENTRY_ID,
    type: "default",
    label: "Default",
    template: formatIconSetCatalog(DEFAULT_ICON_SET_BOARD_KEY),
    overrides: createAllIncludedIconsOverrides(DEFAULT_ICON_SET_BOARD_KEY),
  }
}

/**
 * Adds the default Seldon icon set board plus the extra stock icon sets
 * (`googleSymbols`) when missing.
 *
 * Idempotent per board: skips any icon set board that already exists. Mutates
 * the passed workspace in place. Seldon is the protected base; the extras are
 * deletable like any added stock icon set. The Seldon entry enables every
 * icon, so all its subcategories start on `all`. The extra entries seed empty
 * and follow their set's default inclusion.
 */
export function seedDefaultIconSetBoard(workspace: SeedableWorkspace): void {
  if (!workspace.boards) {
    workspace.boards = {}
  }
  if (!workspace["icon-sets"]) {
    workspace["icon-sets"] = {}
  }

  seedIconSetBoard(
    workspace,
    DEFAULT_ICON_SET_BOARD_KEY,
    createDefaultIconSetEntry(),
  )

  // Extra sets seed with empty overrides so inclusion falls back to the set's
  // defaults, such as the curated `defaultEnabledIcons` of `googleSymbols`.
  for (const boardKey of ADDITIONAL_ICON_SET_BOARD_KEYS) {
    seedIconSetBoard(workspace, boardKey, {
      id: `icon-set-${boardKey}-default`,
      type: "default",
      label: "Default",
      template: formatIconSetCatalog(boardKey),
      overrides: {},
    })
  }
}

/** Seeds one icon set board and its entry when the board is missing. */
function seedIconSetBoard(
  workspace: SeedableWorkspace,
  boardKey: IconSetTemplateId,
  entry: EntryIconSet,
): void {
  const existing = workspace.boards[boardKey] as Board | undefined
  if (existing && isIconSetBoard(existing)) {
    return
  }

  workspace["icon-sets"][entry.id] = entry

  const board: IconSetBoard = {
    type: "icon-set",
    catalogId: boardKey,
    label: STOCK_ICON_SETS_BY_ID[boardKey].metadata.name,
    componentPreview: "seldonIconsPreview",
    componentTheme: WORKSPACE_EDITABLE_THEME_ENTRY_ID,
    componentProperties: getInitialBoardComponentProperties("icon-set"),
    variants: [{ id: entry.id }],
  }
  setBoardOrder(board, nextBoardOrder(workspace.boards))
  workspace.boards[boardKey] = board
}
