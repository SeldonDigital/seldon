import { produce } from "immer"
import { getInitialBoardComponentProperties } from "../../../helpers/components/get-initial-board-component-properties"
import { isComponentId } from "../../../../components/constants"
import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import {
  getComponentOrder,
  setComponentOrder,
} from "../../../helpers/components/component-sort-order"
import { WORKSPACE_EDITABLE_THEME_ENTRY_ID } from "../../../helpers/themes/workspace-editable-theme"
import { formatThemeCatalog } from "../../../model/template-ref"
import { STOCK_THEMES_BY_ID } from "../../../../themes/catalog"
import type { ThemeTemplateId } from "../../../../themes/types/theme-id"
import {
  workspaceMutationService,
  workspacePropagationService,
} from "../../../services"
import type { ValidationOptions } from "../../helpers/validation"

/**
 * Inserts a theme board and one `themes` row: a default row rooted at `catalog:{componentKey}`.
 *
 * Returns the incoming workspace when creation is blocked by rules, when validation fails, or when `workspace.components[componentKey]` already exists.
 */
export function addTheme(
  payload: ExtractPayload<"add_theme">,
  workspace: Workspace,
  options: ValidationOptions = {},
): Workspace {
  if (!rules.mutations.create.board.allowed) {
    return workspace
  }

  return produce(workspace, (draft) => {
    const componentKey = payload.componentKey

    if (draft.components[componentKey]) {
      return draft
    }

    const existingBoards = Object.values(draft.components)
    const maxOrder =
      existingBoards.length > 0
        ? Math.max(...existingBoards.map((b) => getComponentOrder(b)))
        : -1

    const defaultThemeEntryId = `theme-${componentKey}-default`

    const stockTheme = STOCK_THEMES_BY_ID[componentKey as ThemeTemplateId]
    const label = stockTheme
      ? stockTheme.metadata.name
      : isComponentId(componentKey)
        ? workspaceMutationService.getInitialComponentLabel(componentKey)
        : componentKey

    draft.themes[defaultThemeEntryId] = {
      id: defaultThemeEntryId,
      type: "default",
      label: "Default",
      template: formatThemeCatalog(componentKey),
      overrides: {},
    }

    const board = {
      type: "theme" as const,
      catalogId: componentKey,
      label,
      author: "Seldon Digital",
      componentPreview: "seldonThemePreview",
      componentTheme: WORKSPACE_EDITABLE_THEME_ENTRY_ID,
      componentProperties: getInitialBoardComponentProperties("theme"),
      variants: [{ id: defaultThemeEntryId }],
    }
    setComponentOrder(board, maxOrder + 1)
    draft.components[componentKey] = board

    const updatedWorkspace = workspacePropagationService.realignComponentOrder(draft)
    Object.assign(draft.components, updatedWorkspace.components)
  })
}
