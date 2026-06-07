import { isEqual } from "lodash"
import { Workspace } from "@seldon/core"
import type { EntryNode } from "@seldon/core/workspace/types"
import type { NodeParentIndex } from "@seldon/core/workspace/compute"
import { getVariantById } from "@seldon/core/workspace/helpers/general/get-variant-by-id"
import { isDefaultVariant } from "@seldon/core/workspace/helpers/general/is-default-variant"
import { findParentNode } from "@seldon/core/workspace/helpers/nodes/find-parent-node"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import { isVariantNode } from "@seldon/core/workspace/helpers/nodes/is-variant-node"
import { isEntryNodeInstance } from "@seldon/core/workspace/model/entry-node"
import { typeCheckingService } from "@seldon/core/workspace/services"
import { getStyleContext } from "../../../helpers/build-export-context"
import {
  getTemplateSourceNodeId,
  getWorkspaceNodeList,
  resolveSourceVariantId,
} from "../../../helpers/workspace-nodes"
import { getCssObjectFromProperties } from "../../../styles/css-properties/get-css-object-from-properties"
import { CSSObject } from "../../../styles/css-properties/types"
import { getThemeSlug } from "../generation/get-theme-slug"
import { Classes, NodeIdToClass } from "../types"
import { getClassNameForNode } from "./get-class-name"

function getNodeTreeDepth(nodeId: string, workspace: Workspace): number {
  const node = workspace.nodes[nodeId]
  if (!node || isVariantNode(node)) {
    return 0
  }

  let depth = 0
  let currentId: string | null = nodeId

  while (currentId) {
    const parent = findParentNode(currentId, workspace)
    if (!parent) break
    depth++
    if (isVariantNode(parent)) break
    currentId = parent.id
  }

  return depth
}

function calculateCssDifferences(
  baseCss: CSSObject,
  instanceCss: CSSObject,
): CSSObject {
  const differences: CSSObject = {}

  for (const [key, value] of Object.entries(instanceCss)) {
    const baseValue = baseCss[key as keyof CSSObject]
    if (baseValue === undefined || !isEqual(baseValue, value)) {
      differences[key as keyof CSSObject] = value
    }
  }

  return differences
}

function isInstanceWithTemplateSource(node: EntryNode): boolean {
  return (
    typeCheckingService.isInstance(node) &&
    getTemplateSourceNodeId(node) !== null
  )
}

export const buildStyleRegistry = (
  workspace: Workspace,
  forceRegeneration: boolean = false,
  parentIndex: NodeParentIndex,
): {
  classes: Classes
  nodeIdToClass: NodeIdToClass
  classNameToNodeId: Record<string, string>
  nodeTreeDepths: Record<string, number>
} => {
  const classes: Classes = {}
  const nodeIdToClass: NodeIdToClass = {}
  const classNameToNodeId: Record<string, string> = {}
  const nodeTreeDepths: Record<string, number> = {}
  const classNameToComponentId: Record<string, string> = {}

  const sortedNodes = getWorkspaceNodeList(workspace).sort((a, b) => {
    const aIsDefault = typeCheckingService.isVariant(a) && isDefaultVariant(a)
    const bIsDefault = typeCheckingService.isVariant(b) && isDefaultVariant(b)
    const aIsVariant = typeCheckingService.isVariant(a)
    const bIsVariant = typeCheckingService.isVariant(b)
    const aIsInstance = typeCheckingService.isInstance(a)
    const bIsInstance = typeCheckingService.isInstance(b)

    if (aIsDefault && !bIsDefault) return -1
    if (!aIsDefault && bIsDefault) return 1
    if (aIsVariant && !bIsVariant) return -1
    if (!aIsVariant && bIsVariant) return 1
    if (aIsInstance && !bIsInstance) return -1
    if (!aIsInstance && bIsInstance) return 1
    return 0
  })

  sortedNodes.forEach((node) => {
    const className = getClassNameForNode(node, workspace)
    nodeTreeDepths[node.id] = getNodeTreeDepth(node.id, workspace)

    const sourceVariantId = typeCheckingService.isInstance(node)
      ? resolveSourceVariantId(node, workspace)
      : null
    const hasTemplateSource = sourceVariantId !== null

    let css: CSSObject

    if (hasTemplateSource && sourceVariantId) {
      const variant = getVariantById(sourceVariantId, workspace)
      const variantContext = getStyleContext(variant.id, workspace, parentIndex)
      const instanceContext = getStyleContext(node.id, workspace, parentIndex)

      const variantCss = getCssObjectFromProperties(variantContext.properties, {
        properties: variantContext.properties,
        parentContext: variantContext.parentContext,
        theme: variantContext.theme,
        useThemeVariableReferences: true,
        themeSlug: getThemeSlug(variantContext.theme.id as string, workspace),
      })

      const instanceCss = getCssObjectFromProperties(
        instanceContext.properties,
        {
          properties: instanceContext.properties,
          parentContext: instanceContext.parentContext,
          theme: instanceContext.theme,
          useThemeVariableReferences: true,
          themeSlug: getThemeSlug(
            instanceContext.theme.id as string,
            workspace,
          ),
        },
      )

      css = calculateCssDifferences(variantCss, instanceCss)
    } else {
      const context = getStyleContext(node.id, workspace, parentIndex)
      css = getCssObjectFromProperties(context.properties, {
        properties: context.properties,
        parentContext: context.parentContext,
        theme: context.theme,
        useThemeVariableReferences: true,
        themeSlug: getThemeSlug(context.theme.id as string, workspace),
      })
    }

    const isDefault =
      typeCheckingService.isVariant(node) && isDefaultVariant(node)

    if (
      !forceRegeneration &&
      Object.keys(css).length === 0 &&
      !isDefault &&
      !hasTemplateSource
    ) {
      return
    }

    const componentId = getNodeCatalogId(node, workspace) ?? node.id

    const existing = Object.entries(classes).find(
      ([existingClassName, existingCss]) => {
        const existingComponentId = classNameToComponentId[existingClassName]
        return isEqual(existingCss, css) && existingComponentId === componentId
      },
    )

    if (existing) {
      nodeIdToClass[node.id] = existing[0]
      classNameToNodeId[existing[0]] = node.id
      if (!classNameToComponentId[existing[0]]) {
        classNameToComponentId[existing[0]] = componentId
      }
    } else {
      classes[className] = css
      nodeIdToClass[node.id] = className
      classNameToNodeId[className] = node.id
      classNameToComponentId[className] = componentId
    }
  })

  if (forceRegeneration) {
    getWorkspaceNodeList(workspace).forEach((node) => {
      const hasTemplateSource = isInstanceWithTemplateSource(node)

      if (!nodeIdToClass[node.id] && !hasTemplateSource) {
        const className = getClassNameForNode(node, workspace)
        const componentId = getNodeCatalogId(node, workspace) ?? node.id

        const existing = Object.entries(classes).find(
          ([existingClassName, existingCss]) => {
            const existingComponentId =
              classNameToComponentId[existingClassName]
            return (
              Object.keys(existingCss).length === 0 &&
              existingComponentId === componentId
            )
          },
        )

        if (existing) {
          nodeIdToClass[node.id] = existing[0]
          classNameToNodeId[existing[0]] = node.id
          if (!classNameToComponentId[existing[0]]) {
            classNameToComponentId[existing[0]] = componentId
          }
        } else {
          nodeIdToClass[node.id] = className
          classNameToNodeId[className] = node.id
          classNameToComponentId[className] = componentId
          if (!classes[className]) {
            classes[className] = {}
          }
        }
      }
    })
  }

  getWorkspaceNodeList(workspace).forEach((node) => {
    const templateSourceId = getTemplateSourceNodeId(node)
    if (
      isEntryNodeInstance(node) &&
      templateSourceId &&
      !nodeIdToClass[node.id]
    ) {
      const className = getClassNameForNode(node, workspace)
      const componentId = getNodeCatalogId(node, workspace) ?? node.id

      if (!classes[className]) {
        classes[className] = {}
      }

      nodeIdToClass[node.id] = className
      classNameToNodeId[className] = node.id
      classNameToComponentId[className] = componentId
    }
  })

  return { classes, nodeIdToClass, classNameToNodeId, nodeTreeDepths }
}
