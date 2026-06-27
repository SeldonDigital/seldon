import {
  ComponentLevel,
  NATIVE_REACT_PRIMITIVES,
} from "@seldon/core/components/constants"
import { IconId } from "@seldon/core/icon-sets"

import { ComponentToExport, ExportOptions, JSONTreeNode } from "../../../types"
import { getIconComponentName } from "../../discovery/get-icon-component-name"
import { resolveIconExport } from "../../utils/find-icon-path"
import { pluralizeLevel } from "../../utils/pluralize-level"
import {
  TransformStrategy,
  transformSource,
} from "../../utils/transform-source"
import { validateTreeNodeProps } from "../../validation/validate-component-props"
import { JSXNode } from "../preprocess/types"

/**
 * This traverses the tree and checks the used primitives for which imports to add
 * It first creates a map to prevent duplicates
 *
 * After that it converts to a string that looks like this:
 * import { CSSProperties, HTMLAttributes } from "react"
 * import { Frame } from "../frames/Frame"
 *
 * This is then appended to the source file
 *
 * @param source
 * @param component
 * @param jsxRoot - JSXNode - optional for backward compatibility
 * @param options - Export options containing rootDirectory for icon path resolution
 * @returns Updated source file
 */
export function insertImports(
  source: string,
  component: ComponentToExport,
  jsxRoot?: JSXNode, // optional for backward compatibility
  options?: ExportOptions,
): string {
  const { config, tree } = component

  const imports = getReactImports(component)

  if (config.react.returns === "Frame") {
    imports["../frames/Frame"] = ["Frame"]
  }

  if (config.react.returns.startsWith("HTML")) {
    const key = `../native-react/${config.react.returns.replace("HTML", "HTML.")}`
    imports[key] = [config.react.returns]
  }

  if (
    config.react.returns === "htmlElement" &&
    tree.dataBinding.props.htmlElement?.options
  ) {
    for (const option of tree.dataBinding.props.htmlElement.options) {
      const hit = Object.entries(NATIVE_REACT_PRIMITIVES).find(
        ([_, value]) => value.htmlElementOption === option,
      )
      if (hit) {
        const key = `../native-react/${hit[0].replace("HTML", "HTML.")}`
        imports[key] = [hit[0]]
      }
    }
  }

  if (
    config.react.returns === "wrapperElement" &&
    tree.dataBinding.props.wrapperElement?.options
  ) {
    for (const option of tree.dataBinding.props.wrapperElement.options) {
      const hit = Object.entries(NATIVE_REACT_PRIMITIVES).find(
        ([_, value]) => value.wrapperElementOption === option,
      )
      if (hit) {
        const key = `../native-react/${hit[0].replace("HTML", "HTML.")}`
        imports[key] = [hit[0]]
      }
    }
  }

  // For Icon component itself, use wildcard import from index
  // For other components that use icons, use individual imports
  if (config.react.returns === "iconMap") {
    // Icon component: use wildcard import from index
    imports["../icons/index"] = ["* as Icons"]
  } else if (tree.dataBinding.props.icon?.options) {
    // Other components: use individual icon imports
    for (const option of tree.dataBinding.props.icon.options) {
      if (typeof option === "string") {
        const iconId = option as IconId

        if (options?.rootDirectory) {
          const resolved = resolveIconExport(iconId, options.rootDirectory)
          if (!resolved) continue
          imports[`../icons/${resolved.relativePath}`] = [
            resolved.componentName,
          ]
        } else {
          // Fallback to flat structure if options not provided (backward compatibility)
          const componentName = getIconComponentName(iconId)
          imports[`../icons/${componentName}`] = [componentName]
        }
      }
    }
  }

  function traverseAndAddInterfaceToImports(node: JSONTreeNode) {
    const key = `../${pluralizeLevel(node.level)}/${node.name}`

    // Frames should always have their interface imported when used, regardless of validation
    if (node.level === ComponentLevel.FRAME && node.name === "Frame") {
      // Always import Frame interface when it's used
      if (imports[key]) {
        if (!imports[key].includes(node.dataBinding.interfaceName)) {
          imports[key].push(node.dataBinding.interfaceName)
        }
      } else {
        imports[key] = [node.dataBinding.interfaceName]
      }

      // Continue traversing children normally
      if (Array.isArray(node.children)) {
        node.children.forEach(traverseAndAddInterfaceToImports)
      }
      return
    }

    if (Array.isArray(node.children)) {
      // Check if this component will be rendered inline
      const validation = validateTreeNodeProps(node)

      // If component has invalid props, it will be rendered inline
      // So we need to import only the interfaces that are actually rendered
      if (validation.invalidProps.length > 0) {
        // Import the parent component's interface since it's used in the parent interface
        if (imports[key]) {
          if (!imports[key].includes(node.dataBinding.interfaceName)) {
            imports[key].push(node.dataBinding.interfaceName)
          }
        } else {
          imports[key] = [node.dataBinding.interfaceName]
        }

        // Don't import the parent interface, but import the interfaces that are actually rendered
        node.children.forEach((child: JSONTreeNode) => {
          const childIsValid = validation.validProps.some(
            (validChild: JSONTreeNode) =>
              validChild.dataBinding.path === child.dataBinding.path,
          )

          // Import the child interface itself
          const childKey = `../${pluralizeLevel(child.level)}/${child.name}`
          if (imports[childKey]) {
            if (!imports[childKey].includes(child.dataBinding.interfaceName)) {
              imports[childKey].push(child.dataBinding.interfaceName)
            }
          } else {
            imports[childKey] = [child.dataBinding.interfaceName]
          }

          // Also import interfaces for children of this child (e.g., IconProps, LabelProps for Button)
          if (Array.isArray(child.children)) {
            child.children.forEach((grandchild: JSONTreeNode) => {
              const grandchildKey = `../${pluralizeLevel(grandchild.level)}/${grandchild.name}`
              if (imports[grandchildKey]) {
                if (
                  !imports[grandchildKey].includes(
                    grandchild.dataBinding.interfaceName,
                  )
                ) {
                  imports[grandchildKey].push(
                    grandchild.dataBinding.interfaceName,
                  )
                }
              } else {
                imports[grandchildKey] = [grandchild.dataBinding.interfaceName]
              }
            })
          }

          // For valid children, continue traversing their children normally
          if (childIsValid && Array.isArray(child.children)) {
            child.children.forEach(traverseAndAddInterfaceToImports)
          }
        })
      } else {
        // Normal component rendering - import the interface itself
        if (imports[key]) {
          if (!imports[key].includes(node.dataBinding.interfaceName)) {
            imports[key].push(node.dataBinding.interfaceName)
          }
        } else {
          imports[key] = [node.dataBinding.interfaceName]
        }

        // Continue traversing children normally
        node.children.forEach(traverseAndAddInterfaceToImports)
      }
    } else {
      // Leaf component - always import its interface
      if (imports[key]) {
        if (!imports[key].includes(node.dataBinding.interfaceName)) {
          imports[key].push(node.dataBinding.interfaceName)
        }
      } else {
        imports[key] = [node.dataBinding.interfaceName]
      }
    }
  }

  function traverseAndAddComponentToImports(node: JSONTreeNode) {
    const key = `../${pluralizeLevel(node.level)}/${node.name}`

    // Frames should always be imported when used as wrappers, regardless of validation
    if (node.level === ComponentLevel.FRAME && node.name === "Frame") {
      // Always import Frame component when it's used
      if (imports[key]) {
        if (!imports[key].includes(node.name)) {
          imports[key].push(node.name)
        }
      } else {
        imports[key] = [node.name]
      }

      // Continue traversing children normally
      if (Array.isArray(node.children)) {
        node.children.forEach(traverseAndAddComponentToImports)
      }
      return
    }

    if (Array.isArray(node.children)) {
      // Check if this component will be rendered inline
      const validation = validateTreeNodeProps(node)

      // If component has invalid props, it is rendered inline as a JSX
      // wrapper, so import the component itself and the components that are
      // actually rendered inside it
      if (validation.invalidProps.length > 0) {
        if (imports[key]) {
          if (!imports[key].includes(node.name)) {
            imports[key].push(node.name)
          }
        } else {
          imports[key] = [node.name]
        }

        node.children.forEach((child: JSONTreeNode) => {
          // Import the child component itself
          const childKey = `../${pluralizeLevel(child.level)}/${child.name}`
          if (imports[childKey]) {
            if (!imports[childKey].includes(child.name)) {
              imports[childKey].push(child.name)
            }
          } else {
            imports[childKey] = [child.name]
          }

          // Check if child has invalid props to determine if grandchildren are rendered or passed as props
          const childChildren = Array.isArray(child.children)
            ? child.children
            : []
          const childValidation = validateTreeNodeProps({
            ...child,
            children: childChildren,
          })

          // Only import grandchildren as components if child has invalid props
          // (meaning grandchildren will be rendered inline as JSX components)
          // If child has valid props, grandchildren are passed as props, not rendered
          if (
            childValidation.invalidProps.length > 0 &&
            Array.isArray(child.children)
          ) {
            // Grandchildren are rendered, so import them as components
            child.children.forEach((grandchild: JSONTreeNode) => {
              const grandchildKey = `../${pluralizeLevel(grandchild.level)}/${grandchild.name}`
              if (imports[grandchildKey]) {
                if (!imports[grandchildKey].includes(grandchild.name)) {
                  imports[grandchildKey].push(grandchild.name)
                }
              } else {
                imports[grandchildKey] = [grandchild.name]
              }
            })
            // Continue traversing recursively for deeper nesting
            child.children.forEach(traverseAndAddComponentToImports)
          }
        })
      } else {
        // Normal component rendering - import the component itself
        if (imports[key]) {
          if (!imports[key].includes(node.name)) {
            imports[key].push(node.name)
          }
        } else {
          imports[key] = [node.name]
        }
      }
    } else {
      // Leaf component - always import it
      if (imports[key]) {
        if (!imports[key].includes(node.name)) {
          imports[key].push(node.name)
        }
      } else {
        imports[key] = [node.name]
      }
    }
  }

  // Traverse the root component tree to import components
  // The traverseAndAddComponentToImports function handles invalid props in its special branch
  if (Array.isArray(component.tree.children)) {
    component.tree.children.forEach(traverseAndAddComponentToImports)
    // Interface imports are always needed regardless of validation
    component.tree.children.forEach(traverseAndAddInterfaceToImports)
  }

  // Also traverse JSX structure to import all components that are actually rendered as children
  // This catches cases where grandchildren are rendered as JSX children (not passed as props)
  // We import all components found in the JSX structure, checking against already imported ones to avoid duplicates
  if (jsxRoot) {
    function traverseJSXForImports(node: JSXNode) {
      // If this node has children (not grandchildProps), import those components
      // grandchildProps are passed as props, not rendered, so we don't import them here
      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => {
          // Find the corresponding JSONTreeNode to get the level
          let childLevel = ComponentLevel.PRIMITIVE
          function findNodeInTree(
            treeNode: JSONTreeNode,
            targetPath: string,
          ): JSONTreeNode | null {
            if (treeNode.dataBinding.path === targetPath) {
              return treeNode
            }
            if (Array.isArray(treeNode.children)) {
              for (const c of treeNode.children) {
                const found = findNodeInTree(c, targetPath)
                if (found) return found
              }
            }
            return null
          }

          // Search in the component tree to find the node and get its level
          if (Array.isArray(component.tree.children)) {
            for (const treeChild of component.tree.children) {
              const found = findNodeInTree(treeChild, child.path)
              if (found) {
                childLevel = found.level
                break
              }
            }
          }

          const childKey = `../${pluralizeLevel(childLevel)}/${child.name}`
          // Only add if not already imported (avoid duplicates)
          if (imports[childKey]) {
            if (!imports[childKey].includes(child.name)) {
              imports[childKey].push(child.name)
            }
          } else {
            imports[childKey] = [child.name]
          }
          // Recursively traverse children
          traverseJSXForImports(child)
        })
      }
    }

    // Traverse JSX root children
    if (jsxRoot.children && jsxRoot.children.length > 0) {
      jsxRoot.children.forEach(traverseJSXForImports)
    }
  }

  // Always add combineClassNames utility import since we always generate className declarations
  imports["../utils/class-name"] = ["combineClassNames"]

  // Components that compose children wrap each merged slot props with applyRef
  // to support the ref override channel. Leaf components have no slot props, so
  // they skip the import to avoid an unused binding.
  if (
    Array.isArray(component.tree.children) &&
    component.tree.children.length > 0
  ) {
    imports["../utils/apply-ref"] = ["applyRef"]
  }

  let importString = ""
  for (const [location, modules] of Object.entries(imports)) {
    // Check if this is a wildcard import (only one module and it starts with "*")
    if (modules.length === 1 && modules[0].startsWith("*")) {
      importString += `import ${modules[0]} from "${location}"\n`
    } else {
      importString += `import {${modules.join(",")}} from "${location}"\n`
    }
  }

  return transformSource({
    strategy: TransformStrategy.PREPEND,
    source,
    content: importString,
  })
}

function getReactImports(
  component: ComponentToExport,
): Record<string, string[]> {
  const { config } = component

  if (config.react.returns === "iconMap") {
    return {
      react: [NATIVE_REACT_PRIMITIVES.HTMLSvg.types.generic],
    }
  }

  if (config.react.returns === "htmlElement") {
    return {
      react: ["HTMLAttributes"],
    }
  }

  if (config.react.returns === "wrapperElement") {
    return {
      react: ["HTMLAttributes"],
    }
  }

  if (config.react.returns === "Frame") {
    return {
      react: ["HTMLAttributes"],
    }
  }

  return {
    react: [
      NATIVE_REACT_PRIMITIVES[
        config.react.returns as keyof typeof NATIVE_REACT_PRIMITIVES
      ].types.generic,
    ],
  }
}
