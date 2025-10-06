import { invariant } from "@seldon/core"
import { NATIVE_REACT_PRIMITIVES } from "@seldon/core/components/constants"
import { NodeIdToClass } from "../../css/types"
import { ComponentToExport } from "../../types"
import { getVariantClassNames } from "../utils/class-name"

/**
 * Generate the return statement for an iconMap component
 */
export function generateIconMapReturn(
  component: ComponentToExport,
  nodeIdToClass: NodeIdToClass,
): string {
  const mapped = nodeIdToClass[component.variantId]
  return `
    let Icon = iconMap[icon || "__default__"]
    if (!Icon) {
      Icon = iconMap["__default__"]
      console.error(\`Icon \${icon} not found. Falling back to the default icon.\`)
    }
    return <Icon className={"${mapped} " + className} {...props} />
  `
}

/**
 * Generate the return statement for an htmlElement component (switch statement)
 */
export function generateHtmlElementReturn(
  component: ComponentToExport,
  nodeIdToClass: NodeIdToClass,
): string {
  const { tree } = component
  const { options, defaultValue } = tree.dataBinding.props.htmlElement

  // Validate options and defaultValue
  invariant(options, "htmlElement.options is required to create a switch")
  invariant(
    defaultValue,
    "htmlElement.defaultValue is required to create a switch",
  )
  if (typeof defaultValue !== "string") {
    throw new Error("defaultValue must be a string")
  }

  // Create switch statement
  let content = `switch(htmlElement) { \n`

  // Loop through options
  options
    .filter((option) => option !== defaultValue)
    .forEach((option) => {
      // Find the component based on the htmlElement option
      const hit = Object.entries(NATIVE_REACT_PRIMITIVES).find(
        ([_, value]) => value.htmlElementOption === option,
      )
      const Component = hit?.[0]
      invariant(Component, "Component is required to create a switch")

      content += `case "${option}": return <${Component} className={"${getVariantClassNames(component, nodeIdToClass)} " + className} {...props} /> \n`
    })

  const hit = Object.entries(NATIVE_REACT_PRIMITIVES).find(
    ([_, value]) => value.htmlElementOption === defaultValue,
  )
  const Component = hit?.[0]
  invariant(Component, `Could not find default component for ${defaultValue}`)
  content += `default: return <${Component} className={"${getVariantClassNames(component, nodeIdToClass)} " + className} {...props} /> \n`
  content += `}`

  return content
}

/**
 * Generate a simple return statement for components without children
 */
export function generateSimpleReturn(
  component: ComponentToExport,
  nodeIdToClass: NodeIdToClass,
): string {
  const { config } = component
  return `return <${config.react.returns} className={"${getVariantClassNames(component, nodeIdToClass)} " + className} {...props} />`
}

// Export with the expected name for tests
export const generateReactComponentReturnStatements = {
  generateIconMapReturn,
  generateHtmlElementReturn,
  generateSimpleReturn,
}
