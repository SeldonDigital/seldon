import { VariantId } from "@seldon/core"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import { getNodeById } from "@seldon/core/workspace/helpers/nodes/get-node-by-id"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import { nodeRetrievalService } from "@seldon/core/workspace/services"
import { Workspace } from "@seldon/core/workspace/types"
import { ComponentToExport, JSONTreeNode } from "../../../types"
import { getHumanReadablePropName } from "../../discovery/get-human-readable-prop-name"
import { camelCase } from "../../utils/case-utils"
import {
  getComponentIdFromComponent,
  getComponentIdFromName,
  validateComponentProps,
} from "../../validation/validate-component-props"
import { ComponentMetadataStorage } from "../component-metadata"
import { isCustomComponent } from "../custom-components/is-custom-component"
import { isInlineComponent } from "../inline-components/is-inline-component"

/**
 * Generates prop VALUE names map for variable names in generated code.
 *
 * These are unique, verbose names based on parent component's naming rules and component type.
 * The naming strategy varies based on depth and component type (inline, custom, default):
 * - Direct children (depth 1): Base name with numbering (button, button2, button3)
 * - Grandchildren (depth 2): Inherit parent numbering or use component-specific logic
 *
 * @example
 * "button.icon" → "buttonIcon" (first button)
 * "button2.icon" → "button2Icon" (second button)
 * "barTabs.button.icon" → "barTabsButtonIcon" (inline component)
 *
 * @param component - The component to generate prop value names for
 * @param workspace - Optional workspace for component type detection
 * @returns Map from node paths to prop value names
 */
export function generatePropValuesMap(
  component: ComponentToExport,
  workspace?: Workspace,
): Map<string, string> {
  const propValuesMap = new Map<string, string>()
  const scopedBaseNameCounts = new Map<string, Map<string, number>>()

  const componentId = getComponentIdFromComponent(component)
  const rootValidation =
    componentId && Array.isArray(component.tree.children)
      ? validateComponentProps(
          component.name,
          componentId,
          component.tree.children,
        )
      : {
          validProps: Array.isArray(component.tree.children)
            ? component.tree.children
            : [],
          invalidProps: [],
          componentHasFewerPropsThanSchema: false,
        }

  const rootIsInline = isInlineComponent(component)
  const rootIsCustom = workspace
    ? isCustomComponent(component, workspace)
    : false

  function traverse(node: JSONTreeNode, parentPropName?: string) {
    const path = node.dataBinding.path
    const pathParts = path.split(".")
    const hasRootPrefix = pathParts[0] === "root"
    // Depth calculation:
    // - Paths with "root." prefix: "root.button" = depth 1, "root.button.icon" = depth 2
    // - Paths without "root." prefix: "button" = depth 1 (direct child), "button.icon" = depth 2
    // So depth = pathParts.length - (hasRootPrefix ? 1 : 0)
    const depth = hasRootPrefix ? pathParts.length - 1 : pathParts.length

    const propName = getHumanReadablePropName(path, {
      simplifiedPropNames: true,
      parentComponentName: component.name,
    })

    let finalPropName: string

    // Determine component type and depth explicitly
    if (depth === 1) {
      // Direct child (depth 1) - all component types use same logic
      const parentPath = pathParts.slice(0, -1).join(".")
      let counts = scopedBaseNameCounts.get(parentPath)
      if (!counts) {
        counts = new Map<string, number>()
        scopedBaseNameCounts.set(parentPath, counts)
      }
      const baseName = propName.replace(/\d+$/, "").replace(/Props$/, "")
      const currentCount = counts.get(baseName) || 0
      const newCount = currentCount + 1
      counts.set(baseName, newCount)

      if (newCount === 1) {
        finalPropName = baseName
      } else {
        const baseNameWithoutProps = baseName.replace(/Props$/, "")
        finalPropName =
          baseNameWithoutProps +
          newCount +
          (baseName.endsWith("Props") ? "Props" : "")
      }
    } else if (depth === 2) {
      // Grandchild (depth 2) - different logic based on component type
      // For paths like "root.button.icon" or "listItemTree.button.icon":
      // - With "root" prefix: root is at 0, first child is at 1
      // - Without "root" prefix: root component name is at 0, first child is at 1
      // So first child is always at index 1 for depth 2 paths
      const rootChildIndex = 1
      const rootChildName = pathParts[rootChildIndex]

      let rootChildNode: JSONTreeNode | null = null
      if (Array.isArray(component.tree.children)) {
        for (const child of component.tree.children) {
          // Extract the child name from the child's path
          // Paths can be: "root.button", "listItemTree.button", or just "button"
          const normalizedChildPath = child.dataBinding.path.replace(
            /^root\./,
            "",
          )
          // Get the last segment of the path (the child name)
          const childPathParts = normalizedChildPath.split(".")
          const childName = childPathParts[childPathParts.length - 1]

          if (childName === rootChildName) {
            rootChildNode = child
            break
          }
        }
      }

      const rootChildIsValidProp = rootChildNode
        ? rootValidation.validProps.some(
            (validNode: JSONTreeNode) =>
              validNode.dataBinding.path === rootChildNode!.dataBinding.path,
          )
        : false

      if (rootIsInline) {
        // Inline component: concatenate root child name + intermediate parts + grandchild name
        const intermediateParts = pathParts.slice(2, -1)
        const rootChildBaseName = camelCase(rootChildName)
        let prefix = rootChildBaseName

        for (const part of intermediateParts) {
          const partNumberMatch = part.match(/^(.+?)(\d+)$/)
          if (partNumberMatch) {
            const [, partBase, partNumber] = partNumberMatch
            const partBaseName = camelCase(partBase)
            prefix +=
              partBaseName.charAt(0).toUpperCase() +
              partBaseName.slice(1) +
              partNumber
          } else {
            const partBaseName = camelCase(part)
            prefix +=
              partBaseName.charAt(0).toUpperCase() + partBaseName.slice(1)
          }
        }

        const grandchildBaseName = propName
          .replace(/\d+$/, "")
          .replace(/Props$/, "")
        finalPropName =
          prefix +
          grandchildBaseName.charAt(0).toUpperCase() +
          grandchildBaseName.slice(1)
      } else if (!rootChildIsValidProp || rootIsCustom) {
        // Custom component: parent name + capitalized grandchild name
        // Example: root.button.icon → buttonIcon, root.button2.icon → button2Icon
        // For depth 2 grandchildren, we always use parent name prefix (never fallback to counting)
        const immediateParentName =
          pathParts.length >= 3
            ? pathParts[pathParts.length - 2]
            : pathParts.length === 2
              ? pathParts[0]
              : undefined

        // For depth 2 grandchildren, we MUST have an immediate parent name
        // If we don't, something is wrong with the path structure
        if (immediateParentName) {
          // Extract grandchild name directly from path (last segment), not from propName
          // This ensures we use the actual component name, not a processed prop name
          const grandchildName = pathParts[pathParts.length - 1]
          const grandchildBaseName = camelCase(grandchildName)
            .replace(/\d+$/, "")
            .replace(/Props$/, "")
          finalPropName =
            immediateParentName +
            grandchildBaseName.charAt(0).toUpperCase() +
            grandchildBaseName.slice(1)
        } else {
          // This should never happen for depth 2 paths, but if it does, throw an error
          // to help debug the issue
          throw new Error(
            `Cannot determine immediate parent name for grandchild path "${path}" in component "${component.name}" (custom component path). ` +
              `Path parts: ${JSON.stringify(pathParts)}, depth: ${depth}`,
          )
        }
      } else {
        // Regular component (default component): parent name + capitalized grandchild name
        // This matches the custom component strategy but for default components with valid props
        // Example: root.button.icon → buttonIcon, root.button2.icon → button2Icon, root.button3.icon → button3Icon
        // For depth 2 grandchildren, we always use parent name prefix (never fallback to counting)
        const immediateParentName =
          pathParts.length >= 3
            ? pathParts[pathParts.length - 2]
            : pathParts.length === 2
              ? pathParts[0]
              : undefined

        // For depth 2 grandchildren, we MUST have an immediate parent name
        // If we don't, something is wrong with the path structure
        if (immediateParentName) {
          // Extract grandchild name directly from path (last segment), not from propName
          // This ensures we use the actual component name, not a processed prop name
          const grandchildName = pathParts[pathParts.length - 1]
          const grandchildBaseName = camelCase(grandchildName)
            .replace(/\d+$/, "")
            .replace(/Props$/, "")
          finalPropName =
            immediateParentName +
            grandchildBaseName.charAt(0).toUpperCase() +
            grandchildBaseName.slice(1)
        } else {
          // This should never happen for depth 2 paths, but if it does, throw an error
          // to help debug the issue
          throw new Error(
            `Cannot determine immediate parent name for grandchild path "${path}" in component "${component.name}". ` +
              `Path parts: ${JSON.stringify(pathParts)}, depth: ${depth}`,
          )
        }
      }
    } else if (depth === 0) {
      // Depth 0 - this is the root component itself, shouldn't be processed as a prop
      throw new Error(
        `Unexpected depth 0 for path "${path}" in component "${component.name}". ` +
          `Root component paths should not be processed as props. ` +
          `Path parts: ${JSON.stringify(pathParts)}`,
      )
    } else if (depth >= 3) {
      // Depth 3+ - great-grandchildren or deeper
      // Build prefix chain from all parent names recursively
      // Example: frame.buttonIconic.icon → frame + ButtonIconic + Icon = frameButtonIconicIcon
      const parentNames = pathParts.slice(hasRootPrefix ? 1 : 0, -1)
      let prefix = ""

      for (let i = 0; i < parentNames.length; i++) {
        const parentName = parentNames[i]
        const parentBaseName = camelCase(parentName).replace(/\d+$/, "")

        if (i === 0) {
          // First parent name: use as-is (camelCase)
          prefix = parentBaseName
        } else {
          // Subsequent parent names: capitalize first letter and append
          prefix +=
            parentBaseName.charAt(0).toUpperCase() + parentBaseName.slice(1)
        }
      }

      // Extract grandchild name (last segment)
      const grandchildName = pathParts[pathParts.length - 1]
      const grandchildBaseName = camelCase(grandchildName)
        .replace(/\d+$/, "")
        .replace(/Props$/, "")

      finalPropName =
        prefix +
        grandchildBaseName.charAt(0).toUpperCase() +
        grandchildBaseName.slice(1)
    } else {
      // This should never happen, but if it does, throw an error
      throw new Error(
        `Unexpected depth ${depth} for path "${path}" in component "${component.name}". ` +
          `Path parts: ${JSON.stringify(pathParts)}, depth: ${depth}`,
      )
    }

    propValuesMap.set(path, finalPropName)

    if (Array.isArray(node.children)) {
      node.children.forEach((child: JSONTreeNode) =>
        traverse(child, finalPropName),
      )
    }
  }

  if (Array.isArray(component.tree.children)) {
    component.tree.children.forEach((child: JSONTreeNode) => traverse(child))
  }

  return propValuesMap
}

/**
 * Generates prop KEY names map for JSX attributes and interface prop keys.
 *
 * These names match what child components expect in their interfaces, ensuring type compatibility.
 * The strategy differs from propValuesMap: keys are based on child component interfaces, not parent naming.
 *
 * Rules:
 * - Direct children (depth 1): Prop key matches child's interface prop name (e.g., "button", "button2")
 * - Grandchildren (depth 2): Prop key is looked up from child component's propKeysMap
 *   Example: "barTabs.button.icon" → look up "button.icon" in Button's propKeysMap → "icon"
 *
 * This ensures parent components pass props using the correct keys that child components expect.
 *
 * @param component - The component to generate prop keys for
 * @param workspace - Workspace for node lookup and component detection
 * @param componentMetadataStorage - Storage containing child component metadata for prop key lookup
 * @returns Map from node paths to prop key names
 */
export function generatePropKeysMap(
  component: ComponentToExport,
  workspace: Workspace,
  componentMetadataStorage: ComponentMetadataStorage,
): Map<string, string> {
  const propKeysMap = new Map<string, string>()

  const hasChildren =
    Array.isArray(component.tree.children) && component.tree.children.length > 0
  if (!hasChildren || !Array.isArray(component.tree.children)) {
    return propKeysMap
  }

  // Process all descendants explicitly
  function processDescendants(node: JSONTreeNode, parentPath: string = "") {
    const nodePath = node.dataBinding.path
    const pathParts = nodePath.split(".")
    const hasRootPrefix = pathParts[0] === "root"
    // Depth calculation matches generatePropValuesMap:
    // - Paths with "root." prefix: "root.button" = depth 1, "root.button.icon" = depth 2
    // - Paths without "root." prefix: "button" = depth 1 (direct child), "button.icon" = depth 2
    const depth = hasRootPrefix ? pathParts.length - 1 : pathParts.length

    if (parentPath === "") {
      // Direct child (depth 1)
      // Prop key should match what the child component expects in its interface
      // Use same numbering scheme as propValuesMap: base name (no number), second gets "2", third gets "3", etc.
      const childName = pathParts[pathParts.length - 1]
      const baseName = childName.replace(/\d+$/, "").replace(/Props$/, "")

      // Count existing entries with same base name to determine number
      // Only count direct children (entries where the path has depth 1)
      let count = 0
      for (const [existingPath, existingKey] of propKeysMap.entries()) {
        const existingPathParts = existingPath.split(".")
        const existingHasRootPrefix = existingPathParts[0] === "root"
        const existingDepth = existingHasRootPrefix
          ? existingPathParts.length - 1
          : existingPathParts.length
        // Only count direct children (depth 1), not grandchildren
        if (existingDepth === 1) {
          const existingBaseName = existingKey
            .replace(/\d+$/, "")
            .replace(/Props$/, "")
          if (existingBaseName === baseName) {
            count++
          }
        }
      }

      // First instance gets base name (no number), second gets "2", third gets "3", etc.
      let propKey: string
      if (count === 0) {
        propKey = baseName
      } else {
        const baseNameWithoutProps = baseName.replace(/Props$/, "")
        propKey =
          baseNameWithoutProps +
          (count + 1) +
          (baseName.endsWith("Props") ? "Props" : "")
      }

      propKeysMap.set(nodePath, propKey)
    } else {
      // Grandchild (depth 2)
      // Look up what the direct child component expects for this relative path
      const directChildPath = pathParts[0] // e.g., "barTabs"
      const relativePath = pathParts.slice(1).join(".") // e.g., "button.icon"

      // Find the direct child component
      const directChildNode = Array.isArray(component.tree.children)
        ? component.tree.children.find((child: JSONTreeNode) => {
            if (typeof child === "string") return false
            const childPath = child.dataBinding.path
            const normalizedChildPath = childPath.replace(/^root\./, "")
            return (
              normalizedChildPath === directChildPath ||
              childPath === directChildPath ||
              childPath === `root.${directChildPath}`
            )
          })
        : undefined

      if (directChildNode && typeof directChildNode !== "string") {
        // Special case: Frame components are not exported, so they don't have metadata
        if (
          directChildNode.level === ComponentLevel.FRAME ||
          directChildNode.name === "Frame"
        ) {
          // For Frame, grandchildren are direct children - use the relative path as the prop key
          const grandchildName = pathParts[pathParts.length - 1]
          const grandchildPropName = getHumanReadablePropName(grandchildName, {
            simplifiedPropNames: true,
          })
          const grandchildBaseName = grandchildPropName
            .replace(/\d+$/, "")
            .replace(/Props$/, "")

          // Ensure uniqueness
          let propKey = grandchildBaseName
          let count = 1
          const propKeyValues = Array.from(propKeysMap.values())
          while (propKeyValues.includes(propKey)) {
            count++
            const baseNameWithoutProps = grandchildBaseName.replace(
              /Props$/,
              "",
            )
            propKey =
              baseNameWithoutProps +
              count +
              (grandchildBaseName.endsWith("Props") ? "Props" : "")
          }

          propKeysMap.set(nodePath, propKey)
        } else {
          // Get component ID from workspace node
          let directChildComponentId: ComponentId | null = null
          try {
            const directChildWorkspaceNode = getNodeById(
              directChildNode.nodeId,
              workspace,
            )
            directChildComponentId = getNodeCatalogId(
              directChildWorkspaceNode,
              workspace,
            ) as ComponentId | null
          } catch (error) {
            directChildComponentId = getComponentIdFromName(
              directChildNode.name,
            )
          }

          if (directChildComponentId) {
            // Find direct child variant ID from metadata storage
            let directChildVariantId: VariantId | null = null
            for (const [
              variantId,
              metadata,
            ] of componentMetadataStorage.entries()) {
              if (metadata.componentId === directChildComponentId) {
                const defaultVariant = nodeRetrievalService.getDefaultVariant(
                  directChildComponentId,
                  workspace,
                )
                if (defaultVariant && defaultVariant.id === variantId) {
                  directChildVariantId = variantId
                  break
                }
                if (!directChildVariantId) {
                  directChildVariantId = variantId
                }
              }
            }

            if (directChildVariantId) {
              const directChildMetadata =
                componentMetadataStorage.get(directChildVariantId)
              if (directChildMetadata && directChildMetadata.propKeysMap) {
                // Look up prop key from child component's propKeysMap
                let propKey = directChildMetadata.propKeysMap.get(relativePath)
                if (!propKey) {
                  // Try with "root." prefix
                  propKey = directChildMetadata.propKeysMap.get(
                    `root.${relativePath}`,
                  )
                }
                if (!propKey) {
                  // Try without "root." prefix
                  const withoutRoot = relativePath.replace(/^root\./, "")
                  if (withoutRoot !== relativePath) {
                    propKey = directChildMetadata.propKeysMap.get(withoutRoot)
                  }
                }

                if (propKey) {
                  propKeysMap.set(nodePath, propKey)
                } else {
                  // If relative path is a single segment (direct prop), use it directly
                  if (pathParts.length === 2) {
                    const propName = pathParts[pathParts.length - 1]
                    propKeysMap.set(nodePath, propName)
                  } else {
                    const availablePaths = Array.from(
                      directChildMetadata.propKeysMap.keys(),
                    )
                      .slice(0, 20)
                      .join(", ")
                    throw new Error(
                      `Prop key not found for relative path "${relativePath}" in direct child component "${directChildNode.name}" ` +
                        `when processing "${nodePath}" in component "${component.name}". ` +
                        `Tried: "${relativePath}", "root.${relativePath}", "${relativePath.replace(/^root\./, "")}". ` +
                        `Available paths in direct child propKeysMap (first 20): ${availablePaths}`,
                    )
                  }
                }
              } else {
                throw new Error(
                  `Direct child component metadata or propKeysMap not found for variant "${directChildVariantId}" ` +
                    `when processing "${nodePath}" in component "${component.name}".`,
                )
              }
            } else {
              throw new Error(
                `Direct child variant ID not found for component "${directChildComponentId}" ` +
                  `when processing "${nodePath}" in component "${component.name}".`,
              )
            }
          } else {
            throw new Error(
              `Direct child component ID not found for node "${directChildNode.name}" ` +
                `when processing "${nodePath}" in component "${component.name}".`,
            )
          }
        }
      } else {
        throw new Error(
          `Direct child component node not found for path "${directChildPath}" ` +
            `when processing "${nodePath}" in component "${component.name}".`,
        )
      }
    }

    // Recursively process children
    if (Array.isArray(node.children) && node.children.length > 0) {
      for (const child of node.children) {
        if (typeof child === "string") {
          continue
        }
        processDescendants(child, nodePath)
      }
    }
  }

  // Process all children
  for (const child of component.tree.children) {
    if (typeof child === "string") {
      continue
    }
    processDescendants(child, "")
  }

  return propKeysMap
}
