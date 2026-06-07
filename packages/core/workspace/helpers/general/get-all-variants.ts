import { isComponentBoard, isPlaygroundBoard } from "../../model/components"
import { EntryNode, Workspace } from "../../types"
import { getBoardVariantRootIds } from "../components/get-board-variant-root-ids"
import { getVariantById } from "./get-variant-by-id"

/**
 * Retrieves all variant nodes from all boards in the workspace.
 *
 * Only component and playground rows reference entries in `workspace.nodes`.
 * Theme, font collection, icon set, and media rows point to other resource
 * maps, so they are skipped here.
 *
 * @param workspace - The workspace to extract variants from
 * @returns Array of all variant nodes
 */
export function getAllVariants(
  workspace: Workspace,
): (EntryNode & { type: "default" | "variant" })[] {
  return Object.values(workspace.boards)
    .filter((board) => isComponentBoard(board) || isPlaygroundBoard(board))
    .flatMap((board) =>
      getBoardVariantRootIds(board).map((variantId) =>
        getVariantById(variantId, workspace),
      ),
    )
}
