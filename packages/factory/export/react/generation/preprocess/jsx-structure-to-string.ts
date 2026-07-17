import { ComponentToExport } from "../../../types"
import { generateRootAttributePropsString } from "../shared/attribute-props"
import { getReactReturnTag } from "../shared/custom-react"
import { dataSeldonRefAttr } from "../shared/data-ref-attr"
import { JSXNode } from "./types"

type GrandchildProp = NonNullable<JSXNode["grandchildProps"]>[number]

/**
 * Renders a forwarded grandchild as a JSX attribute. Conditional leaves are
 * guarded by their source prop (`textLabel={textLabel && textLabelProps}`) so an
 * omitted caller value keeps the slot empty; canonical leaves forward directly.
 */
function grandchildPropAttr(gp: GrandchildProp): string {
  if (gp.nullLiteral) return `${gp.propKeyName}={null}`
  const value = gp.guard ? `${gp.guard} && ${gp.propVarName}` : gp.propVarName
  return `${gp.propKeyName}={${value}}`
}

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
  withRef: boolean = false,
): string {
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
          .map((gp) => grandchildPropAttr(gp))
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
          .map((gp) => grandchildPropAttr(gp))
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

  // Build return statement. Callers can replace the default slot tree by
  // nesting their own children, mirroring how instance trees override the
  // catalog default tree. Without this, nested children passed by a parent
  // generated component (e.g. ItemInputRow nesting into FormControlIconic)
  // would be silently discarded by React's explicit-children precedence.
  const rootRefAttr = dataSeldonRefAttr(jsxRoot.ref)
  const rootAttrProps = generateRootAttributePropsString(component)
  const forwardedRefProp = withRef ? " ref={ref}" : ""
  const rootTag = getReactReturnTag(component)
  let content = `
  return (\n    <${rootTag} className={${classNameVarName}}${rootRefAttr}${rootAttrProps}${forwardedRefProp} {...props}>`

  if (jsxRoot.children && jsxRoot.children.length > 0) {
    content += `\n      {children !== undefined ? (\n        children\n      ) : (\n        <>`
    jsxRoot.children.forEach((child) => {
      content += nodeToString(child, 10) // 10 spaces for slot children inside the fragment
    })
    content += `\n        </>\n      )}`
  }

  content += `\n    </${rootTag}>\n  )`
  return content
}
