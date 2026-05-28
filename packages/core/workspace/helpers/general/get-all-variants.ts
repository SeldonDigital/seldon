import { EntryNode, Workspace } from "../../types"
import { getComponentVariantRootIds } from "../components/get-component-variant-root-ids"
import { getVariantById } from "./get-variant-by-id"

/**
 * Retrieves all variant nodes from all boards in the workspace.
 * @param workspace - The workspace to extract variants from
 * @returns Array of all variant nodes
 */
export function getAllVariants(
  workspace: Workspace,
): (EntryNode & { type: "default" | "variant" })[] {
  return Object.values(workspace.components).flatMap((board) =>
    getComponentVariantRootIds(board).map((variantId) =>
      getVariantById(variantId, workspace),
    ),
  )
}
