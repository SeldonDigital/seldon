import { removeNewLines } from "@seldon/editor/lib/helpers/new-lines"
import { getComponentName } from "@seldon/factory/export/react/discovery/get-component-name"
import { Properties } from "@seldon/core"
import { isEmptyValue } from "@seldon/core/helpers/type-guards/value/is-empty-value"
import { IconId, iconLabels } from "@seldon/core/icon-sets"
import { typeCheckingService } from "@seldon/core/workspace/services"
import type { EntryNode } from "@seldon/core/workspace/types"

type Workspace = Parameters<typeof getComponentName>[1]

interface NodeLabelOptions {
  showNodeIds: boolean
  showCodeNames: boolean
  nodeExistsInWorkspace: boolean
  properties: Properties
}

/**
 * Text shown for a node row. Debug "Show Node Ids" wins, then "Show Code Names"
 * swaps in the export component name. Instances fall back to their content text
 * or icon label. Display only; the node label and rename are unchanged. Ported
 * from the React `row-node-label`.
 */
export function getNodeLabel(
  node: EntryNode,
  workspace: Workspace,
  { showNodeIds, showCodeNames, nodeExistsInWorkspace, properties }: NodeLabelOptions,
): string {
  if (showNodeIds) {
    return `${node.id} | ${node.template}`
  }

  if (showCodeNames && nodeExistsInWorkspace) {
    return getComponentName(node, workspace)
  }

  if (
    typeCheckingService.isInstance(node) &&
    properties?.content &&
    !isEmptyValue(properties.content)
  ) {
    return removeNewLines(properties.content.value)
  }

  if (
    typeCheckingService.isInstance(node) &&
    properties?.symbol &&
    !isEmptyValue(properties.symbol) &&
    iconLabels[properties.symbol.value as IconId]
  ) {
    return iconLabels[properties.symbol.value as IconId] + " icon"
  }

  return node.label
}

/** Icon id for the node's entity type shown left of the row label. */
export function getComponentTypeIcon(node: EntryNode): string {
  if (typeCheckingService.isVariant(node)) {
    if (typeCheckingService.isDefaultVariant(node)) return "seldon-componentDefault"
    if (typeCheckingService.isUserVariant(node)) return "seldon-componentVariant"
  }
  return "seldon-stub"
}

/**
 * Debug "Show Node Types" tint for the row icon and label. User variants use the
 * Punch swatch, instances a lighter tint. Boards and default variants keep the
 * default color.
 */
export function getNodeTypeColor(
  node: EntryNode,
  showNodeTypes: boolean,
): string | undefined {
  if (!showNodeTypes) return undefined
  if (typeCheckingService.isInstance(node)) {
    return "color-mix(in srgb, var(--sdn-swatch-punch) 80%, var(--sdn-swatch-white))"
  }
  if (typeCheckingService.isUserVariant(node)) {
    return "var(--sdn-swatch-punch)"
  }
  return undefined
}
