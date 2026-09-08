import { TEXT_EDITABLE_IDS, getCatalogId } from "./helpers"

import type { EntryNode, Workspace } from "@seldon/core/workspace/types"

export function isTextEditableNode(node: EntryNode, workspace: Workspace): boolean {
  const catalogId = getCatalogId(node, workspace)

  return catalogId != null && TEXT_EDITABLE_IDS.has(catalogId)
}
