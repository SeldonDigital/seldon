import {
  Board,
  Instance,
  ThemeInstanceId,
  ValueType,
  Variant,
  Workspace,
} from "@seldon/core"
import { getComponentLevelThemeRef } from "@seldon/core/workspace/helpers/components/get-component-level-theme-ref"
import { isComponentEntry } from "@seldon/core/workspace/helpers/components/is-component-entry"
import { themeService } from "@seldon/core/workspace/services/theme/theme.service"
import { FlatProperty } from "./properties-data"

const DEFAULT_BOARD_THEME_ID = "default" as ThemeInstanceId

/**
 * Theme ref for a catalog board. Boards always resolve a theme; missing refs use Default.
 */
export function getBoardThemeRef(board: Board): ThemeInstanceId {
  return getComponentLevelThemeRef(board) ?? DEFAULT_BOARD_THEME_ID
}

function getThemeDisplayName(
  themeId: ThemeInstanceId,
  workspace: Workspace,
): string {
  try {
    return themeService.getTheme(themeId, workspace).metadata.name
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
  if (isComponentEntry(node)) {
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
  const isBoard = isComponentEntry(node)
  const themeRef = isBoard ? getBoardThemeRef(node) : node.theme

  return {
    key: "theme",
    propertyType: "atomic",
    label: "Theme",
    icon: "IconSeldonComponent",
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
    status: isBoard || themeRef ? "set" : "unset",
  }
}
