import { getComponentSchema } from "../../../../components/catalog"
import { ComponentId, isComponentId } from "../../../../components/constants"
import { areBoardVariantsInUse } from "../../../helpers/components/are-board-variants-in-use"
import { getComponentPropertyDefaults } from "../../../helpers/components/get-component-property-defaults"
import { isIconSetBoard, isThemeBoard } from "../../../model/components"
import { ErrorMessages } from "../../../constants"
import { check } from "../check"
import type { Workspace } from "../../../types"

export const componentValidators = {
  exists: (workspace: Workspace, id: string) => {
    check(workspace.components[id], ErrorMessages.componentNotFound(id))
  },
  doesNotExist: (workspace: Workspace, id: string) => {
    check(!workspace.components[id], ErrorMessages.componentAlreadyExists(id))
  },
  notInUse: (workspace: Workspace, id: ComponentId) => {
    const board = workspace.components[id]
    if (board && areBoardVariantsInUse(board, workspace)) {
      throw new Error(ErrorMessages.componentVariantsInUse(id))
    }
  },
  hasDefaultVariant: (workspace: Workspace, id: ComponentId) => {
    const board = workspace.components[id]!
    if (isIconSetBoard(board) || isThemeBoard(board)) {
      return
    }
    check(board.variants.length > 0, ErrorMessages.defaultVariantNotFound(id))
  },
  allowedPropertyKeys: (
    componentId: ComponentId,
    board?: { type: string },
  ): Set<string> => {
    const schema = getComponentSchema(componentId)
    const allowedKeys = new Set(Object.keys(schema.properties))
    if (board) {
      for (const key of Object.keys(
        getComponentPropertyDefaults(),
      )) {
        allowedKeys.add(key)
      }
    }
    return allowedKeys
  },
  assertCatalogId: (
    catalogId: string | undefined,
    allowedIds: ReadonlySet<string>,
    label: string,
  ) => {
    check(Boolean(catalogId?.trim()), `${label} catalogId is required`)
    check(
      allowedIds.has(catalogId!),
      `Unknown ${label} catalog: ${catalogId}`,
    )
  },
}

export function isPackagedCatalogBoard(
  board: { type: string; catalogId?: string },
  packagedIds: ReadonlySet<string>,
): boolean {
  return "catalogId" in board && packagedIds.has(board.catalogId ?? "")
}
