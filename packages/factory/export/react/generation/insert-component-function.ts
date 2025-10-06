import { NodeIdToClass } from "../../css/types"
import { ComponentToExport, JSONTreeNode } from "../../types"
import { getHumanReadablePropName } from "../discovery/get-human-readable-prop-name"
import { getVariantClassNames } from "../utils/class-name"
import { TransformStrategy, transformSource } from "../utils/transform-source"
import { generateJSDocComment } from "./generate-jsdoc-comment"
import { generatePropNamesMap } from "./generate-prop-names-map"
import {
  generateHtmlElementReturn,
  generateIconMapReturn,
  generateSimpleReturn,
} from "./generate-react-component-return-statements"
import { generatePropsSpread } from "./generate-react-function-signature"
import { generateJSXTree } from "./generate-react-jsx-tree"

/**
 * Inserts the component function for a component
 * This will return everything from export function X to the closing }
 *
 * @param source
 * @param component
 * @returns - Update source content
 */
export function insertComponentFunction(
  source: string,
  component: ComponentToExport,
  nodeIdToClass: NodeIdToClass,
) {
  const { tree, config } = component

  // Generate consistent prop names for this component
  const propNamesMap = generatePropNamesMap(component)

  let returns = ""
  if (config.react.returns === "htmlElement") {
    // If the component export config is set to htmlElement, return a switch statement
    returns = generateHtmlElementReturn(component, nodeIdToClass)
  } else if (config.react.returns === "iconMap") {
    returns = generateIconMapReturn(component, nodeIdToClass)
  } else if (tree.children === null) {
    // If the component has no children, return a simple return statement
    returns = generateSimpleReturn(component, nodeIdToClass)
  } else {
    // If the component has children, return a JSX tree using the new cleaner pattern
    returns = generateJSXTree(component, nodeIdToClass, propNamesMap)
  }

  return transformSource({
    strategy: TransformStrategy.APPEND,
    source,
    content: `
    ${generateJSDocComment(component)}
    export function ${component.tree.name}(${generatePropsSpread(component, propNamesMap)}: ${component.tree.dataBinding.interfaceName}) {
      ${generateVariableDeclarations(component, nodeIdToClass, propNamesMap)}
      ${returns}
    }`,
  })
}

/**
 * Generate variable declarations for props with combineClassNames
 */
function generateVariableDeclarations(
  component: ComponentToExport,
  nodeIdToClass: NodeIdToClass,
  propNamesMap: Map<string, string>,
): string {
  const { tree, config } = component

  if (!Array.isArray(tree.children)) {
    return ""
  }

  const declarations: string[] = []

  // Generate frame className declaration
  const frameClassName = getVariantClassNames(component, nodeIdToClass)
  declarations.push(
    `const frameClassName = combineClassNames("${frameClassName}", className)`,
  )

  function traverseAndGenerateDeclarations(node: JSONTreeNode) {
    const propsName =
      propNamesMap.get(node.dataBinding.path) ||
      getHumanReadablePropName(node.dataBinding.path, {
        simplifiedPropNames: true,
        parentComponentName: component.name,
      })

    const propsVarName = `${propsName}Props`

    declarations.push(
      `const ${propsVarName} = { ...sdn.${propsName}, ...${propsName}, className: combineClassNames(sdn.${propsName}?.className, ${propsName}?.className) }`,
    )

    if (Array.isArray(node.children)) {
      node.children.forEach(traverseAndGenerateDeclarations)
    }
  }

  tree.children.forEach(traverseAndGenerateDeclarations)

  return declarations.length > 0
    ? "\n  " + declarations.join("\n  ") + "\n"
    : ""
}
