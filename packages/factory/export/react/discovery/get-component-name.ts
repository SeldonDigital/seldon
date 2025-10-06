import { Instance, Variant, Workspace } from "@seldon/core"
import { getVariantById } from "@seldon/core/workspace/helpers/get-variant-by-id"
import { isDefaultVariant } from "@seldon/core/workspace/helpers/is-default-variant"
import { isVariantNode } from "@seldon/core/workspace/helpers/is-variant-node"
import { pascalCase } from "../utils/case-utils"

/**
 * Get the ouput name of a component
 * @param node - Component child or -variant
 * @param workspace - Workspace
 * @returns Name of the component
 */
export function getComponentName(
  node: Instance | Variant,
  workspace: Workspace,
) {
  // Only variant nodes have a label
  if (isVariantNode(node)) {
    if (isDefaultVariant(node)) {
      return pascalCase(node.component)
    }
    return `${pascalCase(node.component)}${pascalCase(node.label)}`
  }

  const variant = getVariantById(node.variant, workspace)
  if (isDefaultVariant(variant)) {
    return pascalCase(variant.component)
  }
  return `${pascalCase(variant.component)}${pascalCase(variant.label)}`
}
