import {
  Display,
  InstanceId,
  Properties,
  ValueType,
  VariantId,
} from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { ComponentId, isComponentId } from "@seldon/core/components/constants"
import { isComplexSchema } from "@seldon/core/components/types"
import { IconId } from "@seldon/core/icon-sets"
import { getWorkspaceEnabledIcons } from "@seldon/core/icon-sets/helpers"
import { WrapperElement } from "@seldon/core/properties"
import { componentBoardSchemaVariantNodeId } from "@seldon/core/workspace/helpers/components/entry-node-ids"
import { getBoardByNodeId } from "@seldon/core/workspace/helpers/components/get-board-by-node-id"
import { getChildrenIds } from "@seldon/core/workspace/helpers/components/get-children-ids"
import { getNodeById } from "@seldon/core/workspace/helpers/nodes/get-node-by-id"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import { isComponentBoard } from "@seldon/core/workspace/model/components"
import { typeCheckingService } from "@seldon/core/workspace/services"
import type { EntryNode, Workspace } from "@seldon/core/workspace/types"

import {
  getTemplateSourceNodeId,
  resolveSourceVariantId,
} from "../../../helpers/workspace-nodes"
import { DataBinding, JSONTreeNode } from "../../types"
import { camelCase, pascalCase } from "../utils/case-utils"
import { getComponentName } from "./get-component-name"
import { getNodeOriginChain } from "./get-node-origin-chain"
import { getUsedIconIds } from "./get-used-icon-ids"
import { HTML_ELEMENT_OPTIONS } from "./html-element-options"

export function getJsonTreeFromChildren(
  variant: EntryNode & { type: "default" | "variant" },
  workspace: Workspace,
  nodeIdToClass: Record<string, string>,
): JSONTreeNode {
  const board = getBoardByNodeId(workspace, variant.id)
  if (!board || !isComponentBoard(board)) {
    throw new Error(`Component board not found for variant ${variant.id}`)
  }

  const name = getComponentName(variant, workspace)
  const variantProperties = getNodeProperties(variant, workspace)
  const variantIsStub = variantProperties.display?.value === Display.STUB

  const childIds = getChildrenIds(board, variant.id)
  const referenceMap: Record<string, string[]> = {}
  const children = childIds
    .filter((childId) => shouldExportChild(childId))
    .map((childId) => convertNode(childId, referenceMap, "", [], variantIsStub))

  const componentId = getComponentIdOrThrow(variant, workspace)
  const schema = getComponentSchema(componentId)
  const componentLevel = schema.level
  const schemaVariantId = getSchemaVariantId(variant, componentId, workspace)

  const tree = {
    name,
    componentId,
    schemaVariantId,
    nodeId: variant.id,
    ref: variant.ref,
    level: componentLevel,
    dataBinding: {
      interfaceName: name + "Props",
      path: camelCase(name),
      props: getVariantProps(
        variantProperties,
        schema?.properties ?? {},
        componentId,
        workspace,
      ),
    },
    children: children.length > 0 ? children : null,
    classNames: getNodeOriginChain(variant, workspace)
      .map((node) => nodeIdToClass[node.id])
      .filter(Boolean),
    isStub: variantIsStub,
  }

  return tree

  function shouldExportChild(child: InstanceId | VariantId) {
    try {
      const childNode = getNodeById(child, workspace)
      const childProperties = getNodeProperties(childNode, workspace)
      const displayValue = childProperties.display?.value
      return displayValue !== Display.EXCLUDE && displayValue !== Display.MOCK
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Circular reference")
      ) {
        return false
      }
      throw error
    }
  }

  function convertNode(
    id: InstanceId | VariantId,
    referenceMap: Record<string, string[]>,
    currentPath: string = "",
    pathNodes: string[] = [],
    inheritedStub: boolean = false,
  ): JSONTreeNode {
    if (pathNodes.includes(id)) {
      throw new Error(
        `Circular reference detected: ${id} is already being processed in the current path`,
      )
    }

    const newPathNodes = [...pathNodes, id]
    const node = getNodeById(id, workspace)

    let nodeProperties: Properties
    try {
      nodeProperties = getNodeProperties(node, workspace)
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Circular reference")
      ) {
        nodeProperties = {}
      } else {
        throw error
      }
    }

    const isStub =
      inheritedStub || nodeProperties.display?.value === Display.STUB

    const name = getComponentName(node, workspace)
    const catalogId = getNodeCatalogId(node, workspace) ?? node.id

    let reference: string = camelCase(name)
    if (referenceMap[catalogId]) {
      reference += referenceMap[catalogId].length + 1
      referenceMap[catalogId].push(node.id)
    } else {
      referenceMap[catalogId] = [node.id]
    }

    const path = currentPath ? `${currentPath}.${reference}` : reference

    const nodeBoard = getBoardByNodeId(workspace, node.id)
    let children: JSONTreeNode[] | null = null
    if (nodeBoard && isComponentBoard(nodeBoard)) {
      const childReferenceMap: Record<string, string[]> = {}
      const childIds = getChildrenIds(nodeBoard, node.id)
      children = childIds
        .filter((childId) => shouldExportChild(childId))
        .map((childId) =>
          convertNode(childId, childReferenceMap, path, newPathNodes, isStub),
        )
    }

    const referenceName = pascalCase(reference) + "Props"
    const interfaceName = pascalCase(name) + "Props"

    let classNamesArray: string[] = []

    if (typeCheckingService.isVariant(node)) {
      const variantClass = nodeIdToClass[node.id]
      if (variantClass) {
        classNamesArray.push(variantClass)
      }
    } else if (typeCheckingService.isInstance(node)) {
      const sourceId = resolveSourceVariantId(node, workspace)
      if (sourceId) {
        const variantClass = nodeIdToClass[sourceId]
        const instanceClass = nodeIdToClass[node.id]
        if (variantClass) {
          classNamesArray.push(variantClass)
        }
        if (instanceClass) {
          classNamesArray.push(instanceClass)
        }
      }
    } else {
      classNamesArray = getNodeOriginChain(node, workspace)
        .map((n) => nodeIdToClass[n.id])
        .filter(Boolean)
    }

    const childComponentId = getComponentIdOrThrow(node, workspace)
    const childSchema = getComponentSchema(childComponentId)
    const childSchemaVariantId = getSchemaVariantId(
      node,
      childComponentId,
      workspace,
    )

    return {
      name,
      componentId: childComponentId,
      schemaVariantId: childSchemaVariantId,
      nodeId: node.id,
      ref: node.ref,
      level: childSchema.level,
      dataBinding: {
        interfaceName,
        referenceName,
        path,
        props: {
          ...getChildNodeProps(nodeProperties),
          ...getAriaAttributeProps(nodeProperties),
        },
      },
      children,
      classNames: classNamesArray,
      isStub,
    }
  }
}

function getComponentIdOrThrow(
  node: EntryNode,
  workspace: Workspace,
): ComponentId {
  const catalogId = getNodeCatalogId(node, workspace)
  if (!catalogId || !isComponentId(catalogId)) {
    throw new Error(`Component id not found for node ${node.id}`)
  }
  return catalogId
}

function getSchemaVariantId(
  node: EntryNode,
  componentId: ComponentId,
  workspace: Workspace,
): string | null {
  const schema = getComponentSchema(componentId)
  if (!isComplexSchema(schema) || !schema.variants?.length) {
    return null
  }

  const schemaVariantIdByNodeId = new Map<string, string>(
    schema.variants.map((variant) => [
      componentBoardSchemaVariantNodeId(componentId, variant.id),
      variant.id,
    ]),
  )

  const visited = new Set<string>()
  let current: EntryNode | undefined = node

  while (current && !visited.has(current.id)) {
    visited.add(current.id)
    const schemaVariantId = schemaVariantIdByNodeId.get(current.id)
    if (schemaVariantId) {
      return schemaVariantId
    }

    const sourceNodeId = getTemplateSourceNodeId(current)
    if (!sourceNodeId) {
      return null
    }

    current = getNodeById(sourceNodeId, workspace)
  }

  return null
}

function getChildNodeProps(properties: Properties) {
  const props: DataBinding["props"] = {}
  const { content, symbol, source, htmlElement, wrapperElement, inputType } =
    properties
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
  if (wrapperElement?.value) {
    props.wrapperElement = { defaultValue: wrapperElement.value }
  }
  if (inputType?.value) {
    props.type = { defaultValue: inputType.value }
  }

  return props
}

/**
 * Adds accessibility attributes to a child node's props. These map straight
 * onto the rendered element and are forwarded through the spread of the child's
 * `sdn` default props, so the keys can be hyphenated (`aria-*`). They are scoped
 * to child nodes because a component's own root props are also destructured as
 * named parameters, where hyphenated keys are not valid identifiers.
 */
function getAriaAttributeProps(properties: Properties): DataBinding["props"] {
  const props: DataBinding["props"] = {}
  const ariaAttributeValues: Record<string, unknown> = {
    role: properties.role?.value,
    "aria-label": properties.ariaLabel?.value,
    "aria-hidden": properties.ariaHidden?.value,
    "aria-disabled": properties.ariaDisabled?.value,
    "aria-expanded": properties.ariaExpanded?.value,
    "aria-selected": properties.ariaSelected?.value,
    "aria-checked": properties.ariaChecked?.value,
    "aria-pressed": properties.ariaPressed?.value,
    "aria-current": properties.ariaCurrent?.value,
    "aria-haspopup": properties.ariaHasPopup?.value,
    "aria-invalid": properties.ariaInvalid?.value,
    "aria-required": properties.ariaRequired?.value,
    "aria-readonly": properties.ariaReadonly?.value,
    "aria-live": properties.ariaLive?.value,
  }
  for (const [attribute, value] of Object.entries(ariaAttributeValues)) {
    if (value == null) continue
    props[attribute] = { defaultValue: String(value) }
  }
  return props
}

function getVariantProps(
  properties: Properties,
  schemaProperties: Properties,
  componentId: ComponentId,
  workspace: Workspace,
) {
  const props: DataBinding["props"] = {
    ...getChildNodeProps(properties),
    ...getAriaAttributeProps(properties),
  }
  const { symbol, htmlElement, wrapperElement } = schemaProperties

  const htmlElementOptions = HTML_ELEMENT_OPTIONS[componentId]
  if (htmlElementOptions?.length) {
    props.htmlElement = {
      defaultValue:
        properties.htmlElement?.value ||
        htmlElement?.value ||
        htmlElementOptions[0],
      options: [...htmlElementOptions],
    }
  }

  if (wrapperElement?.type === ValueType.OPTION && wrapperElement.value) {
    props.wrapperElement = {
      defaultValue:
        (properties.wrapperElement?.value as string) ?? wrapperElement.value,
      options: Object.values(WrapperElement),
    }
  }

  if (symbol) {
    // Match the widened set used for the iconMap and icon file emission so
    // the generated IconProps["icon"] union covers every exported icon.
    const iconIds = getUsedIconIds(workspace)
    for (const iconId of getWorkspaceEnabledIcons(workspace)) {
      iconIds.add(iconId)
    }
    const options: IconId[] = Array.from(iconIds)
    props.icon = {
      defaultValue: properties.symbol?.value || options[0],
      options,
    }
  }

  return props
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}
