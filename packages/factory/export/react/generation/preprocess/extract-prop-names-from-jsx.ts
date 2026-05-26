import { VariantId } from "@seldon/core"
import { componentBoardSchemaVariantNodeId } from "@seldon/core/workspace/helpers/components/entry-node-ids"
import { nodeRetrievalService } from "@seldon/core/workspace/services"
import { Workspace } from "@seldon/core/workspace/types"
import { ComponentToExport, JSONTreeNode } from "../../../types"
import { ComponentMetadataStorage } from "../component-metadata"
import { JSXNode } from "./types"

/**
 * Extracts prop values map from JSX structure.
 *
 * Maps node paths to prop value names (for variable names in generated code).
 * These are the names used in variable declarations and function signatures.
 *
 * @param jsxRoot - Root JSX node of the structure
 * @param component - Component being processed
 * @returns Map from node paths to prop value names
 */
export function extractPropValuesFromJSX(
  jsxRoot: JSXNode,
  component: ComponentToExport,
): Map<string, string> {
  const propValuesMap = new Map<string, string>()

  function traverse(node: JSXNode) {
    if (node.path && node.propVarName) {
      const propValueName = node.propVarName.replace(/Props$/, "")
      propValuesMap.set(node.path, propValueName)
    }

    if (node.grandchildProps) {
      node.grandchildProps.forEach((gp) => {
        const grandchildPath = gp.propKey
        const grandchildPropValue = gp.propVarName.replace(/Props$/, "")
        propValuesMap.set(grandchildPath, grandchildPropValue)
      })
    }

    if (node.children) {
      node.children.forEach((child) => traverse(child))
    }
  }

  if (jsxRoot.children && jsxRoot.children.length > 0) {
    jsxRoot.children.forEach((child) => traverse(child))
  }

  return propValuesMap
}

/**
 * Extracts prop keys map from JSX structure.
 *
 * Maps node paths to prop key names (for JSX attributes and interface keys).
 * These are the names used in component interfaces and JSX attributes.
 *
 * @param jsxRoot - Root JSX node of the structure
 * @param component - Component being processed
 * @param componentMetadataStorage - Storage for component metadata lookup
 * @param workspace - Workspace for variant type detection
 * @returns Map from node paths to prop key names
 */
export function extractPropKeysFromJSX(
  jsxRoot: JSXNode,
  component: ComponentToExport,
  componentMetadataStorage: ComponentMetadataStorage,
  workspace: Workspace,
): Map<string, string> {
  const propKeysMap = new Map<string, string>()

  function getMetadataVariantId(node: JSONTreeNode): VariantId {
    if (node.schemaVariantId) {
      return componentBoardSchemaVariantNodeId(
        node.componentId,
        node.schemaVariantId,
      ) as VariantId
    }

    return nodeRetrievalService.getDefaultVariant(node.componentId, workspace)
      .id as VariantId
  }

  function findJSXNodeByPath(
    root: JSXNode,
    targetPath: string,
  ): JSXNode | null {
    if (root.path === targetPath) {
      return root
    }

    if (root.grandchildProps) {
      for (const gp of root.grandchildProps) {
        if (gp.propKey === targetPath) {
          const pathParts = targetPath.split(".")
          const relativePath = pathParts.slice(1).join(".")

          function findInTree(node: any, path: string): any {
            if (
              node.dataBinding?.path === path ||
              node.dataBinding?.path === `root.${path}`
            ) {
              return node
            }
            if (Array.isArray(node.children)) {
              for (const child of node.children) {
                const found = findInTree(child, path)
                if (found) return found
              }
            }
            return null
          }

          const grandchildTreeNode = findInTree(component.tree, targetPath)
          if (grandchildTreeNode) {
            const propKeyName = gp.propVarName.replace(/Props$/, "")
            return {
              type: "component" as const,
              name: grandchildTreeNode.name,
              path: targetPath,
              propVarName: gp.propVarName,
              propKeyName,
            }
          }
        }
      }
    }

    if (root.children) {
      for (const child of root.children) {
        const found = findJSXNodeByPath(child, targetPath)
        if (found) return found
      }
    }
    return null
  }

  // Recursive function to look up prop keys for nested grandchildren
  function lookupNestedPropKey(
    grandchildPath: string,
    currentNode: JSONTreeNode,
    currentPath: string,
  ): string {
    const pathParts = grandchildPath.split(".")
    const currentDepth = currentPath.split(".").length - 1
    const targetDepth = pathParts.length - 1

    // If we've reached the target depth, this is the final prop key
    if (currentDepth === targetDepth - 1) {
      // We're at the parent of the target, need to look up the final segment
      const finalSegment = pathParts[pathParts.length - 1]

      const componentId = currentNode.componentId

      const variantId = getMetadataVariantId(currentNode)

      const metadata = componentMetadataStorage.get(variantId)
      if (!metadata || !metadata.propKeysMap) {
        throw new Error(
          `Metadata or propKeysMap not found for variant "${variantId}" ` +
            `when processing grandchild "${grandchildPath}" in component "${component.name}".`,
        )
      }

      // Look up the final segment in the component's propKeysMap
      let propKey = metadata.propKeysMap.get(finalSegment)
      if (!propKey) {
        propKey = metadata.propKeysMap.get(`root.${finalSegment}`)
      }
      if (!propKey) {
        const withoutRoot = finalSegment.replace(/^root\./, "")
        if (withoutRoot !== finalSegment) {
          propKey = metadata.propKeysMap.get(withoutRoot)
        }
      }

      if (!propKey) {
        const availablePaths = Array.from(metadata.propKeysMap.keys())
          .slice(0, 20)
          .join(", ")
        throw new Error(
          `Prop key not found for segment "${finalSegment}" in component "${currentNode.name}" ` +
            `when processing "${grandchildPath}" in component "${component.name}". ` +
            `Available paths (first 20): ${availablePaths}`,
        )
      }

      return propKey
    }

    // Otherwise, continue traversing down the path
    const nextSegment = pathParts[currentDepth + 1]
    const nextPath = currentPath ? `${currentPath}.${nextSegment}` : nextSegment

    // Find the child node matching the next segment
    let nextNode: JSONTreeNode | undefined
    if (Array.isArray(currentNode.children)) {
      nextNode = currentNode.children.find((child) => {
        const childPath = child.dataBinding.path
        const normalizedChildPath = childPath.replace(/^root\./, "")
        return (
          normalizedChildPath === nextPath ||
          childPath === nextPath ||
          childPath === `root.${nextPath}` ||
          normalizedChildPath.endsWith(`.${nextSegment}`) ||
          childPath.endsWith(`.${nextSegment}`)
        )
      })
    }

    if (!nextNode) {
      throw new Error(
        `Child node not found for path "${nextPath}" ` +
          `when processing grandchild "${grandchildPath}" in component "${component.name}". ` +
          `Current path: "${currentPath}", Next segment: "${nextSegment}".`,
      )
    }

    return lookupNestedPropKey(grandchildPath, nextNode, nextPath)
  }

  function traverse(node: JSXNode, parentPath: string = "") {
    if (node.grandchildProps) {
      node.grandchildProps.forEach((gp) => {
        const grandchildPath = gp.propKey
        const pathParts = grandchildPath.split(".")
        const directChildPath = pathParts[0]

        let directChildNode: JSONTreeNode | undefined
        if (Array.isArray(component.tree.children)) {
          directChildNode = component.tree.children.find((child) => {
            const childPath = child.dataBinding.path
            const normalizedChildPath = childPath.replace(/^root\./, "")
            return (
              normalizedChildPath === directChildPath ||
              childPath === directChildPath ||
              childPath === `root.${directChildPath}`
            )
          })
        }

        if (!directChildNode) {
          throw new Error(
            `Direct child node not found for path "${directChildPath}" ` +
              `when processing grandchild "${grandchildPath}" in component "${component.name}". ` +
              `This indicates a bug in JSX structure generation.`,
          )
        }

        // Use recursive lookup for nested grandchildren
        const propKey = lookupNestedPropKey(
          grandchildPath,
          directChildNode,
          directChildPath,
        )

        propKeysMap.set(grandchildPath, propKey)
      })
    }

    const pathParts = node.path.split(".")
    const depth = pathParts.length

    if (depth === 1 || parentPath === "") {
      if (node.path && node.propKeyName) {
        propKeysMap.set(node.path, node.propKeyName)
      }
    } else {
      const grandchildJSXNode = findJSXNodeByPath(jsxRoot, node.path)
      if (!grandchildJSXNode || !grandchildJSXNode.propKeyName) {
        throw new Error(
          `Grandchild JSX node not found for path "${node.path}" ` +
            `when processing "${component.name}". ` +
            `This indicates a bug in JSX structure generation.`,
        )
      }

      propKeysMap.set(node.path, grandchildJSXNode.propKeyName)
    }

    if (node.children) {
      node.children.forEach((child) => traverse(child, node.path))
    }
  }

  if (jsxRoot.children && jsxRoot.children.length > 0) {
    jsxRoot.children.forEach((child) => traverse(child, ""))
  }

  return propKeysMap
}
