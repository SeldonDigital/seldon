import { invariant } from "@seldon/core"
import { NATIVE_REACT_PRIMITIVES } from "@seldon/core/components/constants"

import { NodeIdToClass } from "../../../css/types"
import { ComponentToExport } from "../../../types"
import {
  generateRootAttributePropsString,
  isAttributeKey,
} from "./attribute-props"
import { dataSeldonRefAttr } from "./data-ref-attr"

/**
 * Generate the return statement for an iconMap component
 */
export function generateIconMapReturn(
  component: ComponentToExport,
  _nodeIdToClass: NodeIdToClass,
  classNameVarName: string,
): string {
  const refAttr =
    dataSeldonRefAttr(component.tree.ref) +
    generateRootAttributePropsString(component)
  return `
    let Icon = iconMap[icon || "__default__"]
    if (!Icon) {
      Icon = iconMap["__default__"]
    }
  //
  // React JSX component with merged default and custom properties
  //
    return <Icon className={${classNameVarName}}${refAttr} {...props} />
  `
}

/**
 * Generate the return statement for an htmlElement component (switch statement)
 */
export function generateHtmlElementReturn(
  component: ComponentToExport,
  nodeIdToClass: NodeIdToClass,
  classNameVarName: string,
): string {
  const { tree } = component
  const refAttr =
    dataSeldonRefAttr(tree.ref) + generateRootAttributePropsString(component)
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

  // Check if children prop exists in rootProps
  const hasChildrenProp = "children" in tree.dataBinding.props

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

      if (hasChildrenProp) {
        content += `case "${option}": 
  //
  // React JSX component with merged default and custom properties
  //
  return <${Component} className={${classNameVarName}}${refAttr} {...props}>{children}</${Component}> \n`
      } else {
        content += `case "${option}": 
  //
  // React JSX component with merged default and custom properties
  //
  return <${Component} className={${classNameVarName}}${refAttr} {...props} /> \n`
      }
    })

  const hit = Object.entries(NATIVE_REACT_PRIMITIVES).find(
    ([_, value]) => value.htmlElementOption === defaultValue,
  )
  const Component = hit?.[0]
  invariant(Component, `Could not find default component for ${defaultValue}`)
  if (hasChildrenProp) {
    content += `default: 
  //
  // React JSX component with merged default and custom properties
  //
  return <${Component} className={${classNameVarName}}${refAttr} {...props}>{children}</${Component}> \n`
  } else {
    content += `default: 
  //
  // React JSX component with merged default and custom properties
  //
  return <${Component} className={${classNameVarName}}${refAttr} {...props} /> \n`
  }
  content += `}`

  return content
}

/**
 * Generate the return statement for a wrapperElement component (switch statement)
 */
export function generateWrapperElementReturn(
  component: ComponentToExport,
  nodeIdToClass: NodeIdToClass,
  classNameVarName: string,
): string {
  const { tree } = component
  const refAttr =
    dataSeldonRefAttr(tree.ref) + generateRootAttributePropsString(component)
  const { options, defaultValue } = tree.dataBinding.props.wrapperElement

  invariant(options, "wrapperElement.options is required to create a switch")
  invariant(
    defaultValue,
    "wrapperElement.defaultValue is required to create a switch",
  )
  if (typeof defaultValue !== "string") {
    throw new Error("defaultValue must be a string")
  }

  const hasChildrenProp = "children" in tree.dataBinding.props

  let content = `switch(wrapperElement) { \n`

  options
    .filter((option) => option !== defaultValue)
    .forEach((option) => {
      const hit = Object.entries(NATIVE_REACT_PRIMITIVES).find(
        ([_, value]) => value.wrapperElementOption === option,
      )
      const Component = hit?.[0]
      invariant(Component, "Component is required to create a switch")

      if (hasChildrenProp) {
        content += `case "${option}": 
  //
  // React JSX component with merged default and custom properties
  //
  return <${Component} className={${classNameVarName}}${refAttr} {...props}>{children}</${Component}> \n`
      } else {
        content += `case "${option}": 
  //
  // React JSX component with merged default and custom properties
  //
  return <${Component} className={${classNameVarName}}${refAttr} {...props} /> \n`
      }
    })

  const hit = Object.entries(NATIVE_REACT_PRIMITIVES).find(
    ([_, value]) => value.wrapperElementOption === defaultValue,
  )
  const Component = hit?.[0]
  invariant(Component, `Could not find default component for ${defaultValue}`)
  if (hasChildrenProp) {
    content += `default: 
  //
  // React JSX component with merged default and custom properties
  //
  return <${Component} className={${classNameVarName}}${refAttr} {...props}>{children}</${Component}> \n`
  } else {
    content += `default: 
  //
  // React JSX component with merged default and custom properties
  //
  return <${Component} className={${classNameVarName}}${refAttr} {...props} /> \n`
  }
  content += `}`

  return content
}

/**
 * Generate a simple return statement for components without children
 */
export function generateSimpleReturn(
  component: ComponentToExport,
  nodeIdToClass: NodeIdToClass,
  classNameVarName: string,
  withRef: boolean = false,
): string {
  const { config, tree } = component
  const refAttr = dataSeldonRefAttr(tree.ref)
  const forwardedRefProp = withRef ? " ref={ref}" : ""
  // Check if children prop exists in rootProps
  const hasChildrenProp = "children" in tree.dataBinding.props

  // Get root-level props that need to be explicitly passed
  // (excluding className and children which are handled separately)
  const rootProps = tree.dataBinding.props
  const rootLevelProps: string[] = []
  for (const [propKey] of Object.entries(rootProps)) {
    // Attribute-style keys (role, aria-*) are emitted from `sdn` as literals,
    // not as destructured identifiers.
    if (
      propKey !== "className" &&
      propKey !== "children" &&
      !isAttributeKey(propKey)
    ) {
      rootLevelProps.push(`${propKey}={${propKey}}`)
    }
  }
  const rootPropsString =
    rootLevelProps.length > 0 ? " " + rootLevelProps.join(" ") : ""
  const attrPropsString = generateRootAttributePropsString(component)

  if (hasChildrenProp) {
    return `
  //
  // React JSX component with merged default and custom properties
  //
  return <${config.react.returns} className={${classNameVarName}}${rootPropsString}${refAttr}${attrPropsString}${forwardedRefProp} {...props}>{children}</${config.react.returns}>`
  } else {
    return `
  //
  // React JSX component with merged default and custom properties
  //
  return <${config.react.returns} className={${classNameVarName}}${rootPropsString}${refAttr}${attrPropsString}${forwardedRefProp} {...props} />`
  }
}
