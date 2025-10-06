import { NATIVE_REACT_PRIMITIVES } from "@seldon/core/components/constants"
import { ComponentToExport } from "../../types"

/**
 * Get the needed generic type and its parameter for interface generation
 */
export function getGenericAndParameters(component: ComponentToExport) {
  const { config } = component

  // If this component has an icon, we need to get the generic parameter from there
  if (config.react.returns === "iconMap") {
    const item = NATIVE_REACT_PRIMITIVES.HTMLSvg
    return {
      generic: item.types.generic,
      parameters: [item.types.parameter],
    }
  }

  if (config.react.returns === "htmlElement") {
    // Get the htmlElement option parameters
    const options = component.tree.dataBinding.props.htmlElement?.options ?? []
    if (options.length === 0) {
      throw new Error(
        `Component ${component.name} should return a htmlElement, but it does not have any htmlElement options in the schema`,
      )
    }
    const parameters = Object.values(NATIVE_REACT_PRIMITIVES)
      .filter(
        (item) =>
          item.htmlElementOption && options.includes(item.htmlElementOption),
      )
      .map((item) => item.types.parameter)
    return {
      generic: "HTMLAttributes",
      parameters,
    }
  }

  if (config.react.returns === "Frame") {
    // If this component returns a frame, we need to get the generic parameter from there
    return {
      generic: "HTMLAttributes",
      parameters: ["HTMLElement"],
    }
  }

  // Get the generic parameter
  const item = NATIVE_REACT_PRIMITIVES[config.react.returns]
  return {
    generic: item.types.generic,
    parameters: [item.types.parameter],
  }
}

/**
 * Generate interface content for component's own props
 */
export function generateOwnPropsContent(component: ComponentToExport): string {
  let content = ""

  for (const [key, value] of Object.entries(component.tree.dataBinding.props)) {
    if (value.options) {
      // If this prop has options, create a union (e.g. "span" | "div")
      content += `${key}?: ${value.options?.map((i) => `'${i}'`).join(" | ")};`
    } else if (key === "children" || key === "src" || key === "alt") {
      content += `${key}?: string;`
    } else if (value.type === "boolean") {
      content += `${key}?: boolean;`
    } else if (value.type === "number") {
      content += `${key}?: number;`
    } else if (value.type === "string") {
      content += `${key}?: string;`
    } else if (value.type === "object") {
      content += `${key}?: object;`
    } else if (value.type === "function") {
      // Convert function signatures to use void return type
      const functionSignature = value.value as string
      const voidSignature = functionSignature.replace(/=>\s*\{\}/g, "=> void")
      content += `${key}?: ${voidSignature};`
    } else if (Array.isArray(value.value)) {
      content += `${key}?: ${typeof value.value[0]}[];`
    } else {
      // Default to string for unknown types
      content += `${key}?: string;`
    }
  }

  return content
}

/**
 * Generate the full TypeScript interface for a component
 */
export function generateTypescriptInterfaceBase(
  component: ComponentToExport,
): string {
  const interfaceName =
    component.tree.dataBinding.interfaceName || `${component.name}Props`
  const propsContent = generateOwnPropsContent(component)

  if (propsContent === "") {
    return `export interface ${interfaceName} {}`
  }

  return `export interface ${interfaceName} {\n  ${propsContent}\n}`
}
