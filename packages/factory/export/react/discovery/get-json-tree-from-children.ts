import {
  Display,
  InstanceId,
  Properties,
  Variant,
  VariantId,
  Workspace,
} from "@seldon/core"
import { IconId } from "@seldon/core/components/icons"
import { getNodeById } from "@seldon/core/workspace/helpers/get-node-by-id"
import { getNodeProperties } from "@seldon/core/workspace/helpers/get-node-properties"
import { DataBinding, JSONTreeNode } from "../../types"
import { camelCase, pascalCase } from "../utils/case-utils"
import { getComponentName } from "./get-component-name"
import { getNodeOriginChain } from "./get-node-origin-chain"
import { getUsedIconIds } from "./get-used-icon-ids"

/**
 * Get the JSON tree from a component variant
 * The JSON tree is used to generate the needed import statements, props pass trough, and JSX string for creating the template
 *
 * For example it will return (simplified):
 * {
 *   type: "Button",
 *   children: [{
 *     type: "Icon",
 *     props: {
 *       icon: "arrow-right",
 *     },
 *   }, {
 *     type: "Text",
 *     props: {
 *       text: "Click me",
 *     },
 *   }],
 * }
 *
 * @param variant - Component variant
 * @param tree - Workspace
 * @returns JSON tree
 */
export function getJsonTreeFromChildren(
  variant: Variant,
  workspace: Workspace,
  nodeIdToClass: Record<string, string>,
): JSONTreeNode {
  let children: JSONTreeNode[] = []
  if ("children" in variant && variant.children) {
    let referenceMap: Record<string, string[]> = {}
    children = variant.children
      .filter(shouldExportChild)
      .map((childId) => convertNode(childId, referenceMap, "", []))
  }

  const name = getComponentName(variant, workspace)
  const variantProperties = getNodeProperties(variant, workspace)

  return {
    name,
    nodeId: variant.id,
    level: variant.level,
    dataBinding: {
      interfaceName: name + "Props",
      path: camelCase(name),
      props: getVariantProps(variantProperties, workspace),
    },
    children: children.length > 0 ? children : null,
    classNames: getNodeOriginChain(variant, workspace).map(
      (node) => nodeIdToClass[node.id],
    ),
  }

  /**
   * If a child has display: hide, it should not be exported
   *
   * @param child - Child to check
   * @returns True if the child should be exported, false otherwise
   */
  function shouldExportChild(child: InstanceId | VariantId) {
    try {
      const childProperties = getNodeProperties(
        workspace.byId[child],
        workspace,
      )
      return childProperties.display?.value !== Display.EXCLUDE
    } catch (error) {
      // If we get a circular reference error, skip this child
      if (
        error instanceof Error &&
        error.message.includes("Circular reference")
      ) {
        return false
      }
      throw error
    }
  }

  /**
   * Convert a single node to a JSON tree
   *
   * @param id - Node ID
   * @param referenceMap - Map of references
   * @param currentPath - Current path
   * @param pathNodes - Array of node IDs in the current path (for circular reference detection)
   * @returns JSON tree
   */
  function convertNode(
    id: InstanceId | VariantId,
    referenceMap: Record<string, string[]>,
    currentPath: string = "",
    pathNodes: string[] = [],
  ): JSONTreeNode {
    // Check for circular reference - only within the current path
    if (pathNodes.includes(id)) {
      throw new Error(
        `Circular reference detected: ${id} is already being processed in the current path`,
      )
    }

    // Add current node to the path
    const newPathNodes = [...pathNodes, id]

    const node = getNodeById(id, workspace)
    let nodeProperties: Properties
    try {
      nodeProperties = getNodeProperties(node, workspace)
    } catch (error) {
      // If we get a circular reference error, use empty properties
      if (
        error instanceof Error &&
        error.message.includes("Circular reference")
      ) {
        nodeProperties = {}
      } else {
        throw error
      }
    }
    const name = getComponentName(node, workspace)

    let reference: string = camelCase(name)
    if (referenceMap[node.component]) {
      reference += referenceMap[node.component].length
      referenceMap[node.component].push(node.id)
    } else {
      referenceMap[node.component] = [node.id]
    }

    const path = currentPath ? `${currentPath}.${reference}` : reference

    let children: JSONTreeNode[] | string | null = null
    if (node.children) {
      let referenceMap: Record<string, string[]> = {}

      children = node.children
        .filter(shouldExportChild)
        .map((child) => convertNode(child, referenceMap, path, newPathNodes))
    }

    // Convert the relative path in the tree (e.g. button2.icon) to a camelCase props name (e.g. button2IconProps)
    const referenceName = pascalCase(reference) + "Props" // Results in Button2Props
    const interfaceName = pascalCase(name) + "Props" // Results in ButtonProps

    return {
      name,
      nodeId: node.id,
      level: node.level,
      dataBinding: {
        interfaceName,
        referenceName,
        path,
        props: getChildNodeProps(nodeProperties),
      },
      children,
      classNames: getNodeOriginChain(node, workspace).map(
        (node) => nodeIdToClass[node.id],
      ),
    }
  }
}

/**
 * Return a props object based on the workspace node properties
 * Basically this is a simple key-value map of the properties where some properties are mapped to specific props
 * E.g. src for overrides.source and children for overrides.content
 *
 * @param properties
 * @returns
 */
function getChildNodeProps(properties: Properties) {
  const props: DataBinding["props"] = {}
  const { content, symbol, source, htmlElement, inputType } = properties
  if (content?.value) {
    props.children = { defaultValue: escapeHtml(content.value) }
  }
  if (symbol?.value) {
    props.icon = { defaultValue: symbol.value }
  }
  if (source?.value) {
    props.src = { defaultValue: source.value }
  }
  if (htmlElement?.value) {
    props.htmlElement = { defaultValue: htmlElement.value }
  }
  if (inputType?.value) {
    props.inputType = { defaultValue: inputType.value }
  }

  return props
}

/**
 * Variant props are roughly similar to child props but they also need to have options for some properties like htmlElement and inputType
 *
 * @param properties
 * @param workspace
 * @returns
 */
function getVariantProps(properties: Properties, workspace: Workspace) {
  const props: DataBinding["props"] = getChildNodeProps(properties)
  const { symbol, htmlElement, inputType } = properties

  if (htmlElement && htmlElement.restrictions?.allowedValues) {
    props.htmlElement = {
      defaultValue:
        htmlElement.value || htmlElement.restrictions.allowedValues[0],
      options: htmlElement.restrictions.allowedValues,
    }
  }

  if (inputType && inputType.restrictions?.allowedValues) {
    props.inputType = {
      defaultValue: inputType.value || inputType.restrictions.allowedValues[0],
      options: inputType.restrictions.allowedValues,
    }
  }
  if (symbol) {
    // Get all icons in the workspace and add them as options for the icon prop
    const options: IconId[] = Array.from(getUsedIconIds(workspace))
    props.icon = {
      defaultValue: symbol.value || options[0],
      options,
    }
  }

  return props
}

/**
 * Escapes HTML special characters in a string
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}
