import {
  Board,
  Instance,
  ThemeInstanceId,
  ValueType,
  Variant,
  Workspace,
} from "@seldon/core"
import { getBoardThemeRef as readBoardThemeRef } from "@seldon/core/workspace/helpers/components/get-board-theme-ref"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { getThemeEntryDisplayName } from "@seldon/core/workspace/helpers/themes/get-theme-entry-display-name"
import { workspaceThemeService } from "@seldon/core/workspace/services/theme/theme.service"
import { FlatProperty } from "./properties-data"

const DEFAULT_BOARD_THEME_ID = "seldon" as ThemeInstanceId

/**
 * Theme ref for a catalog board. Boards always resolve a theme; missing refs use Default.
 */
export function getBoardThemeRef(board: Board): ThemeInstanceId {
  return readBoardThemeRef(board) ?? DEFAULT_BOARD_THEME_ID
}

function getThemeDisplayName(themeId: string, workspace: Workspace): string {
  const composedName = getThemeEntryDisplayName(themeId, workspace)
  if (composedName) {
    return composedName
  }

  try {
    return workspaceThemeService.getTheme(themeId as ThemeInstanceId, workspace)
      .metadata.name
  } catch {
    return themeId
  }
}

/**
 * Display label for the synthetic Theme property row on nodes and boards.
 */
export function getThemeAssignmentDisplayValue(
  node: Variant | Instance | Board,
  workspace: Workspace,
): string {
  if (isBoard(node)) {
    return getThemeDisplayName(getBoardThemeRef(node), workspace)
  }

  if (!node.theme) {
    return "Inherit"
  }

  return getThemeDisplayName(node.theme, workspace)
}

/**
 * Synthetic Theme row for the properties sidebar.
 */
export function buildThemeAssignmentProperty(
  node: Variant | Instance | Board,
  workspace: Workspace,
): FlatProperty {
  const nodeIsBoard = isBoard(node)
  const themeRef = nodeIsBoard ? getBoardThemeRef(node) : node.theme

  return {
    key: "theme",
    propertyType: "atomic",
    label: "Theme",
    icon: "seldon-component",
    value: themeRef
      ? { type: ValueType.EXACT, value: themeRef }
      : { type: ValueType.EMPTY, value: null },
    actualValue: getThemeAssignmentDisplayValue(node, workspace),
    valueType: themeRef ? ValueType.EXACT : ValueType.EMPTY,
    controlType: "menu",
    pickerVariant: "themeAssignment",
    isCompound: false,
    isShorthand: false,
    isSubProperty: false,
    status: nodeIsBoard || themeRef ? "set" : "unset",
  }
}
