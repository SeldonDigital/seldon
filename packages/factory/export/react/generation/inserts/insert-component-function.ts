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

  // Opt-in `forwardRef`: the root rendered element receives a `ref={ref}` prop so
  // callers can anchor to it. Only the slot-tree and simple-return paths thread
  // the ref onto a single root element; switch/iconMap paths are unsupported.
  const forwardRefType = config.react.forwardRef
  const useForwardRef = Boolean(forwardRefType)

  let returns = ""
  let usesSlotTree = false
  if (config.react.returns === "htmlElement") {
    if (useForwardRef) {
      throw new Error(
        `forwardRef is not supported for htmlElement components (${component.tree.name})`,
      )
    }
    // If the component export config is set to htmlElement, return a switch statement
    returns = generateHtmlElementReturn(
      component,
      nodeIdToClass,
      classNameVarName,
    )
  } else if (config.react.returns === "wrapperElement") {
    if (useForwardRef) {
      throw new Error(
        `forwardRef is not supported for wrapperElement components (${component.tree.name})`,
      )
    }
    returns = generateWrapperElementReturn(
      component,
      nodeIdToClass,
      classNameVarName,
    )
  } else if (config.react.returns === "iconMap") {
    if (useForwardRef) {
      throw new Error(
        `forwardRef is not supported for iconMap components (${component.tree.name})`,
      )
    }
    returns = generateIconMapReturn(component, nodeIdToClass, classNameVarName)
  } else if (tree.children === null) {
    // If the component has no children, return a simple return statement
    returns = generateSimpleReturn(
      component,
      nodeIdToClass,
      classNameVarName,
      useForwardRef,
    )
  } else {
    // If the component has children, convert JSX structure to string
    returns = jsxStructureToString(
      jsxRoot,
      component,
      classNameVarName,
      useForwardRef,
    )
    usesSlotTree = Boolean(jsxRoot.children && jsxRoot.children.length > 0)
  }

  // Slot-tree components destructure `children` so callers can replace the
  // default slot tree by nesting their own children.
  const propsSpread = generatePropsSpread(component, propNames, {
    includeChildren: usesSlotTree,
  })

  const componentName = component.tree.name
  const interfaceName = component.tree.dataBinding.interfaceName

  // forwardRef components bind the props type through the generic, so the
  // destructured params carry no inline annotation and gain a second `ref` arg.
  const functionSource = useForwardRef
    ? `export const ${componentName} = forwardRef<${forwardRefType}, ${interfaceName}>(
      function ${componentName}(${propsSpread}, ref) {
        ${declarations}
        ${returns}
      },
    )`
    : `export function ${componentName}(${propsSpread}: ${interfaceName}) {
      ${declarations}
      ${returns}
    }`

  return transformSource({
    strategy: TransformStrategy.APPEND,
    source,
    content: `
    ${generateJSDocComment(component, workspace)}
    ${functionSource}`,
  })
}
