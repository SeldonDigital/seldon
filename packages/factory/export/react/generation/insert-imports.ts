import {
  ComponentLevel,
  NATIVE_REACT_PRIMITIVES,
} from "@seldon/core/components/constants"
import { ComponentToExport, JSONTreeNode } from "../../types"
import { pascalCase } from "../utils/case-utils"
import { pluralizeLevel } from "../utils/pluralize-level"
import { TransformStrategy, transformSource } from "../utils/transform-source"
import {
  getComponentIdFromComponent,
  getComponentIdFromName,
  validateComponentProps,
} from "../validation/validate-component-props"

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
 * @param imports
 * @returns Updated source file
 */
export function insertImports(
  source: string,
  component: ComponentToExport,
): string {
  const { config, tree } = component

  const imports = getReactImports(component)

  if (config.react.returns === "Frame") {
    imports["../frames/Frame"] = ["Frame"]
  }

  // No longer need to import Frame for custom components since we render them directly

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

  if (tree.dataBinding.props.icon?.options) {
    for (const option of tree.dataBinding.props.icon.options) {
      if (option === "__default__") {
        imports["../icons/IconDefault"] = ["IconDefault"]
      } else {
        const name = `Icon${pascalCase(option)}`
        imports[`../icons/${name}`] = [name]
      }
    }
  }

  function traverseAndAddInterfaceToImports(node: JSONTreeNode) {
    const key = `../${pluralizeLevel(node.level)}/${node.name}`

    if (Array.isArray(node.children)) {
      // Check if this component will be rendered inline
      const componentId = getComponentIdFromName(node.name)

      const validation = componentId
        ? validateComponentProps(node.name, componentId, node.children)
        : {
            validProps: node.children,
            invalidProps: [],
            componentHasFewerPropsThanSchema: false,
          }

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

    if (Array.isArray(node.children)) {
      // Check if this component will be rendered inline
      const componentId = getComponentIdFromName(node.name)

      const validation = componentId
        ? validateComponentProps(node.name, componentId, node.children)
        : {
            validProps: node.children,
            invalidProps: [],
            componentHasFewerPropsThanSchema: false,
          }

      // If component has invalid props, it will be rendered inline
      // So we need to import only the components that are actually rendered
      if (validation.invalidProps.length > 0) {
        // Don't import the parent component, but import the components that are actually rendered
        node.children.forEach((child: JSONTreeNode) => {
          const childIsValid = validation.validProps.some(
            (validChild: JSONTreeNode) =>
              validChild.dataBinding.path === child.dataBinding.path,
          )

          // Import the child component itself
          const childKey = `../${pluralizeLevel(child.level)}/${child.name}`
          if (imports[childKey]) {
            if (!imports[childKey].includes(child.name)) {
              imports[childKey].push(child.name)
            }
          } else {
            imports[childKey] = [child.name]
          }

          // Also import children of this child (e.g., Icon, Label for Button)
          if (Array.isArray(child.children)) {
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
          }

          // For valid children, continue traversing their children normally
          if (childIsValid && Array.isArray(child.children)) {
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

        // Continue traversing children normally
        node.children.forEach(traverseAndAddComponentToImports)
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

    // If this is a frame, we need to keep on traversing and adding the imports for the children
    if (node.level === ComponentLevel.FRAME && node.name === "Frame") {
      if (Array.isArray(node.children)) {
        node.children.forEach(traverseAndAddComponentToImports)
      }
    }
  }

  if (Array.isArray(component.tree.children)) {
    component.tree.children.forEach(traverseAndAddComponentToImports)
    component.tree.children.forEach(traverseAndAddInterfaceToImports)
    // Add combineClassNames utility import when there are children
    imports["../utils/class-name"] = ["combineClassNames"]
  }

  let importString = ""
  for (const [location, modules] of Object.entries(imports)) {
    importString += `import {${modules.join(",")}} from "${location}"\n`
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
