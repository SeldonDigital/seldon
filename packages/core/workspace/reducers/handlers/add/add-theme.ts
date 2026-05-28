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
import {
  formatThemeCatalog,
  formatThemeLink,
} from "../../../model/template-ref"
import {
  nodeRetrievalService,
  nodeTraversalService,
  nodeRelationshipService,
  nodeOperationsService,
  workspaceMutationService,
  workspaceThemeService,
  workspacePropagationService,
  typeCheckingService,
} from "../../../services"
import type { ValidationOptions } from "../../helpers/validation"

/**
 * Inserts a theme board and two `themes` rows: a default row rooted at `catalog:{componentKey}` and a variant row that links to that default.
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
    const variantEntryId = `theme-${componentKey}-custom-${Date.now()}`

    const label = isComponentId(componentKey)
      ? workspaceMutationService.getInitialComponentLabel(componentKey)
      : componentKey

    draft.themes[defaultThemeEntryId] = {
      id: defaultThemeEntryId,
      type: "default",
      label,
      template: formatThemeCatalog(componentKey),
      overrides: {},
    }

    draft.themes[variantEntryId] = {
      id: variantEntryId,
      type: "variant",
      label: "Custom",
      template: formatThemeLink(defaultThemeEntryId),
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
      variants: [{ id: defaultThemeEntryId }, { id: variantEntryId }],
    }
    setComponentOrder(board, maxOrder + 1)
    draft.components[componentKey] = board

    const updatedWorkspace = workspacePropagationService.realignComponentOrder(draft)
    Object.assign(draft.components, updatedWorkspace.components)
  })
}
