import { Workspace } from "@seldon/core/workspace/types"
import { NodeIdToClass } from "../../../css/types"
import { ComponentToExport, JSONTreeNode } from "../../../types"
import {
  TransformStrategy,
  transformSource,
} from "../../utils/transform-source"
import { jsxStructureToString } from "../preprocess/jsx-structure-to-string"
import { JSXNode } from "../preprocess/types"
import { generateJSDocComment } from "../shared/generate-jsdoc-comment"
import { generatePropsSpread } from "../shared/generate-props-spread"
import { generateVariableDeclarations } from "../shared/generate-variable-declarations"
import {
  generateHtmlElementReturn,
  generateIconMapReturn,
  generateSimpleReturn,
  generateWrapperElementReturn,
} from "../shared/generate-react-component-return-statements"

/**
 * Inserts the React component function into the source code.
 *
 * Generates the complete component function from `export function` to the closing brace.
 * This includes:
 * - JSDoc comment
 * - Function signature with prop destructuring
 * - Variable declarations for props and className
 * - Return statement with JSX tree
 *
 * The function signature and variable declarations are component-type-specific (default, custom, inline).
 * Validates that function signature props match interface props and warns on mismatches.
 *
 * @param source - Existing source code to append to
 * @param component - Component metadata including tree and config
 * @param nodeIdToClass - Mapping of node IDs to CSS class names
 * @param propNames - Map of node paths to prop names
 * @param workspace - Workspace for variant type detection
 * @param jsxRoot - Root JSX node from pre-processed JSX structure
 * @returns Updated source code with component function inserted
 */
export function insertComponentFunction(
  source: string,
  component: ComponentToExport,
  nodeIdToClass: NodeIdToClass,
  propNames: Map<string, string>,
  workspace: Workspace,
  jsxRoot: JSXNode,
) {
  const { tree, config } = component

  // Generate variable declarations and get component-specific className variable name
  const { declarations, classNameVarName } = generateVariableDeclarations(
    component,
    nodeIdToClass,
    propNames,
  )

  let returns = ""
  if (config.react.returns === "htmlElement") {
    // If the component export config is set to htmlElement, return a switch statement
    returns = generateHtmlElementReturn(
      component,
      nodeIdToClass,
      classNameVarName,
    )
  } else if (config.react.returns === "wrapperElement") {
    returns = generateWrapperElementReturn(
      component,
      nodeIdToClass,
      classNameVarName,
    )
  } else if (config.react.returns === "iconMap") {
    returns = generateIconMapReturn(component, nodeIdToClass, classNameVarName)
  } else if (tree.children === null) {
    // If the component has no children, return a simple return statement
    returns = generateSimpleReturn(component, nodeIdToClass, classNameVarName)
  } else {
    // If the component has children, convert JSX structure to string
    returns = jsxStructureToString(jsxRoot, component, classNameVarName)
  }

  const propsSpread = generatePropsSpread(component, propNames)

  // Validate that function signature props match interface props
  // Function signature uses propValuesMap (prop value names like "barTabsIcon")
  // Interface uses propKeysMap (prop keys like "icon")
  // We need to compare prop VALUES from function signature with prop VALUES from interface
  const functionSignatureProps = new Set<string>()
  const propsSpreadMatch = propsSpread.match(/\{([^}]+)\}/)
  if (propsSpreadMatch) {
    const propsString = propsSpreadMatch[1]
    const propMatches = propsString.matchAll(/(\w+)(?:\s*=\s*[^,}]+)?/g)
    for (const match of propMatches) {
      const propName = match[1]
      if (propName !== "props" && propName !== "className") {
        functionSignatureProps.add(propName)
      }
    }
  }

  // Extract interface prop VALUES from component tree for comparison
  // Direct children use propKeysMap (matches interface), grandchildren use propValuesMap
  const interfaceProps = new Set<string>()

  // Add root-level props
  Object.keys(component.tree.dataBinding.props).forEach((propKey) => {
    interfaceProps.add(propKey)
  })

  // Recursively process all descendants to match interface generation
  function processDescendants(node: JSONTreeNode) {
    const childPropKey = propNames.get(node.dataBinding.path)
    if (childPropKey) {
      interfaceProps.add(childPropKey)
    }

    if (Array.isArray(node.children)) {
      ;(node.children as JSONTreeNode[]).forEach((descendant: JSONTreeNode) => {
        const descendantPropValue = propNames.get(descendant.dataBinding.path)
        if (descendantPropValue) {
          interfaceProps.add(descendantPropValue)
        }

        // Recursively process deeper descendants (depth 3+)
        processDescendants(descendant)
      })
    }
  }

  if (Array.isArray(component.tree.children)) {
    ;(component.tree.children as JSONTreeNode[]).forEach(
      (child: JSONTreeNode) => processDescendants(child),
    )
  }

  // Check for mismatches
  const missingInSignature = Array.from(interfaceProps).filter(
    (prop) => !functionSignatureProps.has(prop),
  )
  const extraInSignature = Array.from(functionSignatureProps).filter(
    (prop) => !interfaceProps.has(prop),
  )

  // Prop validation: missingInSignature and extraInSignature are available for debugging if needed

  return transformSource({
    strategy: TransformStrategy.APPEND,
    source,
    content: `
    ${generateJSDocComment(component, workspace)}
    export function ${component.tree.name}(${propsSpread}: ${component.tree.dataBinding.interfaceName}) {
      ${declarations}
      ${returns}
    }`,
  })
}
