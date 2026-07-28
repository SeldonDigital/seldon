import { getComponentSchema } from "@seldon/core/components/catalog"
import { ComponentLevel } from "@seldon/core/components/constants"

import { isCustomComponent } from "../custom-components/is-custom-component"
import { isInlineComponent } from "../inline-components/is-inline-component"

import type { ComponentToExport, JSONTreeNode } from "../../../types"
import type { Workspace } from "@seldon/core/workspace/types"

/** Loose prop descriptor used only to render JSDoc example values. */
type JsdocPropValue = {
  defaultValue?: unknown
  options?: unknown[]
}

/** One line of the structure map: the indented node, its slot, and its ref. */
interface StructureRow {
  label: string
  propName: string
  ref?: string
}

/** Minimal tree node shape walked when deriving example props from children. */
type JsdocChild = {
  dataBinding?: { path?: string }
  children?: null | string | JsdocChild[]
}

/**
 * Generates a JSDoc comment for a React component based on its schema.
 *
 * Pass `propNames` to include the structure map, which pairs each node in the
 * tree with the slot prop that drives it and the `data-seldon-ref` name that
 * addresses it. A comment is the one place real indentation survives, so the map
 * shows the nesting that the flat prop list cannot.
 */
export function generateJSDocComment(
  component: ComponentToExport,
  workspace: Workspace,
  propNames?: Map<string, string>,
): string {
  // Handle cases where componentId might not be available (e.g., in tests)
  // Note: fallback doesn't use workspace, so it defaults to "Default"
  if (!component.componentId) {
    return generateFallbackJSDocComment(component, propNames)
  }

  // Authored components resolve their `componentId` to the Container/Frame root
  // template, so its schema would report the wrong level, intent, and tags. Use
  // the board's own metadata carried on the component instead.
  if (component.authored) {
    return generateAuthoredJSDocComment(component, workspace, propNames)
  }

  const schema = getComponentSchema(component.componentId)
  const { tree } = component

  // Extract short name from component name (e.g., "ListItemTreeSection" -> "TreeSection")
  const shortName = extractShortName(tree.name, schema.name)

  // Format component name (e.g., "Tree Item" or extract from component name)
  const formattedComponentName = formatComponentName(tree.name, schema.name)

  // Get level
  const level = getLevelString(schema.level)

  // Get intent
  const intent = schema.intent

  // Get tags
  const tags = schema.tags?.join(", ") || ""

  // Determine component type
  const isInline = isInlineComponent(component)
  const isCustom = isCustomComponent(component, workspace)
  const componentType = isInline ? "Inline" : isCustom ? "Custom" : "Default"

  // Generate props list for the example
  const propsExample = generatePropsExample(tree.dataBinding.props, component)

  return `/**
 * ${formattedComponentName}: ${shortName}
 * Level: ${level}
 * Intent: ${intent}
 * Tags: ${tags}
 * Type: ${componentType}
${generateStructureSection(component, propNames)} *
 * @example
 * \`\`\`tsx
 * <${tree.name}
${propsExample}
 * />
 * \`\`\`
 */`
}

/**
 * Generates a JSDoc comment for an authored component from the board metadata
 * carried on the component, rather than the root template's schema.
 */
function generateAuthoredJSDocComment(
  component: ComponentToExport,
  workspace: Workspace,
  propNames?: Map<string, string>,
): string {
  const { tree, authored } = component
  const level = getLevelString(authored!.level)
  const intent = authored!.intent ?? ""
  const tags = authored!.tags?.join(", ") ?? ""

  const isInline = isInlineComponent(component)
  const isCustom = isCustomComponent(component, workspace)
  const componentType = isInline ? "Inline" : isCustom ? "Custom" : "Default"

  const propsExample = generatePropsExample(tree.dataBinding.props, component)

  return `/**
 * ${level}: ${tree.name}
 * Level: ${level}
 * Intent: ${intent}
 * Tags: ${tags}
 * Type: ${componentType}
${generateStructureSection(component, propNames)} *
 * @example
 * \`\`\`tsx
 * <${tree.name}
${propsExample}
 * />
 * \`\`\`
 */`
}

/**
 * Generates a fallback JSDoc comment when schema information is not available
 */
function generateFallbackJSDocComment(
  component: ComponentToExport,
  propNames?: Map<string, string>,
): string {
  const { tree } = component
  const propsExample = generatePropsExample(tree.dataBinding.props, component)

  return `/**
 * ${tree.name}
 * Level: Component
 * Intent: React component
 * Tags: component
 * Type: Default
${generateStructureSection(component, propNames)} *
 * @example
 * \`\`\`tsx
 * <${tree.name}
${propsExample}
 * />
 * \`\`\`
 */`
}

/**
 * Renders the component's tree as an aligned three-column map: the node name
 * indented by depth, the slot prop that drives it, and the `data-seldon-ref`
 * name a caller addresses it by. Returns an empty string when the component has
 * no children or the prop name map was not supplied.
 */
function generateStructureSection(
  component: ComponentToExport,
  propNames?: Map<string, string>,
): string {
  const children = component.tree.children

  if (!propNames) return ""
  if (!Array.isArray(children) || children.length === 0) return ""

  const names = propNames
  const rows: StructureRow[] = []

  function walk(node: JSONTreeNode, depth: number) {
    rows.push({
      label: "  ".repeat(depth) + node.name,
      propName: names.get(node.dataBinding.path) ?? "",
      ref: node.ref,
    })

    if (Array.isArray(node.children)) {
      node.children.forEach((child) => walk(child, depth + 1))
    }
  }

  children.forEach((child) => walk(child, 1))

  const labelWidth = Math.max(...rows.map((row) => row.label.length))
  const propWidth = Math.max(...rows.map((row) => row.propName.length))

  const lines = rows.map((row) => {
    const propName = row.ref ? row.propName.padEnd(propWidth) : row.propName
    const ref = row.ref ? `  -> ${row.ref}` : ""

    return ` * ${row.label.padEnd(labelWidth)}  ${propName}${ref}`.trimEnd()
  })

  return ` *\n * Structure:\n${lines.join("\n")}\n`
}

/**
 * Extracts short name from component name by removing common prefixes
 * Example: "ListItemTreeSection" -> "TreeSection"
 */
function extractShortName(componentName: string, _schemaName: string): string {
  // Common prefixes to remove (ordered by length, longest first to avoid partial matches)
  const prefixes = [
    "ListItem",
    "Button",
    "Icon",
    "Label",
    "Frame",
    "Image",
    "Input",
    "Section",
    "Screen",
    "Table",
    "List",
  ]

  // Try to find and remove a matching prefix
  for (const prefix of prefixes) {
    if (componentName.startsWith(prefix)) {
      const remaining = componentName.slice(prefix.length)

      // If there's a meaningful remainder, return it
      if (remaining.length > 0) {
        return remaining
      }
    }
  }

  // If no prefix matches, return the component name as-is
  return componentName
}

/**
 * Formats component name for JSDoc header
 * Example: "ListItemTreeSection" -> "List Item"
 */
function formatComponentName(componentName: string, schemaName: string): string {
  // Extract prefix from component name and format it (ordered by length, longest first)
  const prefixes = [
    { prefix: "ListItem", formatted: "List Item" },
    { prefix: "Button", formatted: "Button" },
    { prefix: "Icon", formatted: "Icon" },
    { prefix: "Label", formatted: "Label" },
    { prefix: "Frame", formatted: "Frame" },
    { prefix: "Image", formatted: "Image" },
    { prefix: "Input", formatted: "Input" },
    { prefix: "Section", formatted: "Section" },
    { prefix: "Screen", formatted: "Screen" },
    { prefix: "Table", formatted: "Table" },
    { prefix: "List", formatted: "List" },
  ]

  for (const { prefix, formatted } of prefixes) {
    if (componentName.startsWith(prefix)) {
      return formatted
    }
  }

  // Fallback: use schema name or component name
  return schemaName || componentName
}

/**
 * Converts ComponentLevel enum to readable string
 */
function getLevelString(level: ComponentLevel): string {
  switch (level) {
    case ComponentLevel.PRIMITIVE:
      return "Primitive"
    case ComponentLevel.ELEMENT:
      return "Element"
    case ComponentLevel.PART:
      return "Part"
    case ComponentLevel.MODULE:
      return "Module"
    case ComponentLevel.SCREEN:
      return "Screen"
    case ComponentLevel.FRAME:
      return "Frame"
    default:
      return "Component"
  }
}

/**
 * Generates props example for JSDoc
 */
function generatePropsExample(
  props: Record<string, JsdocPropValue>,
  component?: ComponentToExport,
): string {
  // First try to get props from the main dataBinding.props
  let allProps = { ...props }

  // If the main props are empty or minimal, try to extract props from component children
  if (
    component &&
    component.tree.children &&
    Array.isArray(component.tree.children) &&
    Object.keys(props).length <= 1
  ) {
    allProps = extractPropsFromChildren(component.tree.children, allProps)
  }

  if (!allProps || Object.keys(allProps).length === 0) {
    return ""
  }

  const propStrings = Object.entries(allProps)
    .filter(([propName, propValue]) => {
      // Filter out props with empty string defaults unless they're important
      if (propValue.defaultValue === "" && propName !== "className") {
        return false
      }

      return true
    })
    .map(([propName, propValue]) => {
      // Generate example values based on prop type and default
      const exampleValue = generateExampleValue(propValue, propName)

      return ` *   ${propName}=${exampleValue}`
    })

  return propStrings.join("\n")
}

/**
 * Extracts props from component children to generate better examples
 */
function extractPropsFromChildren(
  children: JsdocChild[],
  currentProps: Record<string, JsdocPropValue>,
): Record<string, JsdocPropValue> {
  const extractedProps = { ...currentProps }

  if (!Array.isArray(children)) {
    return extractedProps
  }

  children.forEach((child) => {
    if (child && child.dataBinding && child.dataBinding.path) {
      let propName = child.dataBinding.path

      // Remove parent component prefix if it exists (e.g., "textblockDetails.tagline" -> "tagline")
      if (propName.includes(".")) {
        propName = propName.split(".").pop() || propName
      }

      // Generate example props based on component type and name
      if (propName.includes("tagline")) {
        extractedProps[propName] = { defaultValue: "Featured Product" }
      } else if (propName.includes("title") || propName.includes("Title")) {
        extractedProps[propName] = { defaultValue: "Product Title" }
      } else if (propName.includes("description")) {
        extractedProps[propName] = { defaultValue: "Product description text" }
      } else if (propName.includes("button") && !propName.includes("Bar")) {
        extractedProps[propName] = { defaultValue: "() => {}" }
      } else if (propName.includes("icon")) {
        extractedProps[propName] = { defaultValue: "material-star" }
      } else if (propName.includes("label")) {
        extractedProps[propName] = { defaultValue: "Button Label" }
      } else if (propName.includes("image") || propName.includes("avatar")) {
        extractedProps[propName] = { defaultValue: "/image.jpg" }
      } else if (propName.includes("price")) {
        extractedProps[propName] = { defaultValue: "$99.99" }
      } else {
        // For complex component props, use object notation
        extractedProps[propName] = { defaultValue: "{}" }
      }
    }

    // Recursively extract from nested children
    if (child.children && Array.isArray(child.children)) {
      Object.assign(extractedProps, extractPropsFromChildren(child.children, extractedProps))
    }
  })

  return extractedProps
}

/**
 * Generates example values for props based on their type and default values
 */
function generateExampleValue(propValue: JsdocPropValue, propName: string): string {
  // If there's a defaultValue, use it as a reference
  if (propValue.defaultValue !== undefined) {
    if (typeof propValue.defaultValue === "string") {
      // Special handling for function strings
      if (propValue.defaultValue.includes("=>") || propValue.defaultValue.includes("function")) {
        return `{${propValue.defaultValue}}`
      }

      // Special handling for JSX comment placeholders
      if (propValue.defaultValue.includes("/*") && propValue.defaultValue.includes("*/")) {
        return `{{}}`
      }

      // Don't show empty strings in examples unless it's className
      if (propValue.defaultValue === "" && propName !== "className") {
        return `""`
      }

      return `"${propValue.defaultValue}"`
    } else if (typeof propValue.defaultValue === "boolean") {
      return `{${propValue.defaultValue}}`
    } else if (typeof propValue.defaultValue === "object") {
      return `{{}}`
    } else {
      return `{${JSON.stringify(propValue.defaultValue)}}`
    }
  }

  // If there are options, use the first one
  if (propValue.options && propValue.options.length > 0) {
    const firstOption = propValue.options[0]

    if (typeof firstOption === "string") {
      return `"${firstOption}"`
    } else {
      return `{${JSON.stringify(firstOption)}}`
    }
  }

  // Default examples based on common prop names
  if (propName.includes("children") || propName.includes("text")) {
    return `"Example text"`
  } else if (propName.includes("onClick") || propName.includes("onPress")) {
    return `{() => {}}`
  } else if (propName.includes("style")) {
    return `{{}}`
  } else if (propName.includes("className")) {
    return `"custom-class"`
  } else if (propName.includes("icon")) {
    return `"material-star"`
  } else if (propName.includes("color")) {
    return `"primary"`
  } else if (propName.includes("size")) {
    return `"medium"`
  } else {
    return `{{}}`
  }
}
