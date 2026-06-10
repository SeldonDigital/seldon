import { Workspace } from "@seldon/core/workspace/types"

import { NodeIdToClass } from "../../../css/types"
import { ComponentToExport } from "../../../types"
import {
  TransformStrategy,
  transformSource,
} from "../../utils/transform-source"
import { jsxStructureToString } from "../preprocess/jsx-structure-to-string"
import { JSXNode } from "../preprocess/types"
import { generateJSDocComment } from "../shared/generate-jsdoc-comment"
import { generatePropsSpread } from "../shared/generate-props-spread"
import {
  generateHtmlElementReturn,
  generateIconMapReturn,
  generateSimpleReturn,
  generateWrapperElementReturn,
} from "../shared/generate-react-component-return-statements"
import { generateVariableDeclarations } from "../shared/generate-variable-declarations"

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
