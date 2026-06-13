import { getComponentSchema } from "@seldon/core/components/catalog"
import { rules } from "@seldon/core/rules/config/rules.config"
import type { EntryNode, Workspace } from "@seldon/core/workspace/types"
import { getNodeCatalogComponentId } from "./node-tree"

/**
 * Whether a node can accept inserted children. Resolves the catalog component id
 * through `node:` links so user variants and composed container instances are
 * recognized, then applies the level containment rule. Primitives and any level
 * with an empty `mayContain` return false.
 *
 * This differs from `workspaceService.canNodeHaveChildren`, which only inspects
 * the immediate template and so reports false for `node:` linked containers.
 */
export function canNodeAcceptChildren(
  node: EntryNode,
  workspace: Workspace,
): boolean {
  const componentId = getNodeCatalogComponentId(node, workspace)
  if (!componentId) return false
  const schema = getComponentSchema(componentId)
  return rules.componentLevels[schema.level].mayContain.length > 0
}
