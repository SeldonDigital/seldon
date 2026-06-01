import { ComponentToExport } from "../../../types"
import { JSXNode } from "./types"

/**
 * Converts JSX structure to JSX string for component function body.
 *
 * This function takes the structured JSX representation and converts it
 * back to a string that can be inserted into the component function.
 *
 * @param jsxRoot - Root JSX node of the structure
 * @param component - Component being processed
 * @param classNameVarName - Variable name for the component's className
 * @returns JSX string for the component return statement
 */
export function jsxStructureToString(
  jsxRoot: JSXNode,
  component: ComponentToExport,
  classNameVarName: string,
): string {
  const { config } = component

  // Handle simple case: single child without grandchildren, conditionals, or grandchild props
  if (
    jsxRoot.children &&
    jsxRoot.children.length === 1 &&
    !jsxRoot.children[0].children &&
    jsxRoot.children[0].type !== "conditional" &&
    !jsxRoot.children[0].grandchildProps
  ) {
    const child = jsxRoot.children[0]
    return `
  return <${config.react.returns} className={${classNameVarName}} {...props}>
        <${child.name} {...${child.propVarName}} />
    </${config.react.returns}>`
  }

  // Build JSX string recursively
  function nodeToString(node: JSXNode, indent: number = 0): string {
    const indentStr = " ".repeat(indent)
    const nextIndent = indent + 2

    if (node.type === "frame") {
      // Frame component
      let content = `\n${indentStr}<Frame {...${node.propVarName}}>`

      if (node.children) {
        node.children.forEach((child) => {
          content += nodeToString(child, nextIndent)
        })
      }

      content += `\n${indentStr}</Frame>`
      return content
    } else if (node.type === "conditional") {
      // Conditionally rendered component
      if (!node.condition) {
        throw new Error(
          `Conditional node "${node.name}" at path "${node.path}" in component "${component.name}" ` +
            `is missing condition property. This indicates a bug in JSX structure generation.`,
        )
      }

      let content = `\n${indentStr}{${node.condition} && (`

      if (node.grandchildProps && node.grandchildProps.length > 0) {
        // Component with grandchildren passed as props
        const grandchildPropsString = node.grandchildProps
          .map((gp) => `${gp.propKeyName}={${gp.propVarName}}`)
          .join(" ")
        content += `\n${indentStr}  <${node.name} {...${node.propVarName}} ${grandchildPropsString} />`
      } else if (node.children && node.children.length > 0) {
        // Component with children
        content += `\n${indentStr}  <${node.name} {...${node.propVarName}}>`
        node.children.forEach((child) => {
          content += nodeToString(child, nextIndent + 2)
        })
        content += `\n${indentStr}  </${node.name}>`
      } else {
        // Self-closing component
        content += `\n${indentStr}  <${node.name} {...${node.propVarName}} />`
      }

      content += `\n${indentStr})}`
      return content
    } else {
      // Regular component
      if (node.grandchildProps && node.grandchildProps.length > 0) {
        // Component with grandchildren passed as props
        const grandchildPropsString = node.grandchildProps
          .map((gp) => `${gp.propKeyName}={${gp.propVarName}}`)
          .join(" ")
        return `\n${indentStr}<${node.name} {...${node.propVarName}} ${grandchildPropsString} />`
      } else if (node.children && node.children.length > 0) {
        // Component with children
        let content = `\n${indentStr}<${node.name} {...${node.propVarName}}>`
        node.children.forEach((child) => {
          content += nodeToString(child, nextIndent)
        })
        content += `\n${indentStr}</${node.name}>`
        return content
      } else {
        // Self-closing component
        return `\n${indentStr}<${node.name} {...${node.propVarName}} />`
      }
    }
  }

  // Build return statement
  let content = `
  return (\n    <${config.react.returns} className={${classNameVarName}} {...props}>`

  if (jsxRoot.children && jsxRoot.children.length > 0) {
    jsxRoot.children.forEach((child) => {
      content += nodeToString(child, 6) // 6 spaces for children of root
    })
  }

  content += `\n    </${config.react.returns}>\n  )`
  return content
}
