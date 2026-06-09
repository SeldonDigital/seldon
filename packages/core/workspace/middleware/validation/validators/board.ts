import { getComponentSchema } from "../../../../components/catalog"
import { ComponentId } from "../../../../components/constants"
import { ErrorMessages } from "../../../constants"
import { getComponentPropertyDefaults } from "../../../helpers/components/get-component-property-defaults"
import type { Workspace } from "../../../types"
import { check } from "../check"

export const boardValidators = {
  exists: (workspace: Workspace, id: string) => {
    check(workspace.boards[id], ErrorMessages.componentNotFound(id))
  },
  doesNotExist: (workspace: Workspace, id: string) => {
    check(!workspace.boards[id], ErrorMessages.componentAlreadyExists(id))
  },
  allowedPropertyKeys: (
    componentId: ComponentId,
    board?: { type: string },
  ): Set<string> => {
    const schema = getComponentSchema(componentId)
    const allowedKeys = new Set(Object.keys(schema.properties))
    if (board) {
      for (const key of Object.keys(getComponentPropertyDefaults())) {
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
    check(allowedIds.has(catalogId!), `Unknown ${label} catalog: ${catalogId}`)
  },
}

export function isPackagedCatalogBoard(
  board: { type: string; catalogId?: string },
  packagedIds: ReadonlySet<string>,
): boolean {
  return "catalogId" in board && packagedIds.has(board.catalogId ?? "")
}
