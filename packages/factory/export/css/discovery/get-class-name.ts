import { InstanceId, VariantId } from "@seldon/core"

/**
 * Generate a class name based on the node id
 *
 * @param nodeId - The node id to generate a class name for
 * @returns The class name for the node id
 */
export const getClassNameForNodeId = (
  nodeId: InstanceId | VariantId | string,
) => {
  let className: string = nodeId
  // Remove the "child-" prefix
  className = className.replace(/^child-/, "")
  // Remove the "variant-" prefix
  className = className.replace(/^variant-/, "")
  // Remove the "-default" suffix
  className = className.replace(/-default$/, "")

  // Convert camelCase to kebab-case
  className = className.replace(/([A-Z])/g, "-$1").toLowerCase()
  className = className.replace(/^-/, "") // Remove leading dash if any

  // Add the "sdn-" prefix
  className = `sdn-${className}`

  return className
}
