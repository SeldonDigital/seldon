import { isEqual } from "lodash"

import { Workspace } from "@seldon/core"
import { ComponentId, isComponentId } from "@seldon/core/components/constants"
import type { NodeParentIndex } from "@seldon/core/workspace/compute"
import { getBoardByNodeId } from "@seldon/core/workspace/helpers/components/get-board-by-node-id"
import { getChildrenIds } from "@seldon/core/workspace/helpers/components/get-children-ids"
import { getAllVariants } from "@seldon/core/workspace/helpers/general/get-all-variants"
import { getVariantById } from "@seldon/core/workspace/helpers/general/get-variant-by-id"
import { isDefaultVariant } from "@seldon/core/workspace/helpers/general/is-default-variant"
import { findParentNode } from "@seldon/core/workspace/helpers/nodes/find-parent-node"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import { isVariantNode } from "@seldon/core/workspace/helpers/nodes/is-variant-node"
import { isComponentBoard } from "@seldon/core/workspace/model/components"
import { isEntryNodeInstance } from "@seldon/core/workspace/model/entry-node"
import { typeCheckingService } from "@seldon/core/workspace/services"
import type { EntryNode } from "@seldon/core/workspace/types"

import { getStyleContext } from "../../../helpers/build-export-context"
import {
  getTemplateSourceNodeId,
  getWorkspaceNodeList,
  resolveSourceVariantId,
} from "../../../helpers/workspace-nodes"
import { getCssObjectFromProperties } from "../../../styles/css-properties/get-css-object-from-properties"
import { CSSObject } from "../../../styles/css-properties/types"
import { kebabCase } from "../../react/utils/case-utils"
import { getThemeSlug } from "../generation/get-theme-slug"
import {
  Classes,
  DescendantStateClasses,
  NodeIdToClass,
  StateClasses,
} from "../types"
import { getClassNameForNode } from "./get-class-name"

/** Collects every interaction-state key authored anywhere in the workspace. */
function collectUsedStates(workspace: Workspace): string[] {
  const used = new Set<string>()
  for (const node of Object.values(workspace.nodes)) {
    if (node.states) {
      for (const key of Object.keys(node.states)) used.add(key)
    }
  }
  return [...used]
}

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

  // The base class is applied unconditionally (by the component and the shared
  // variant class), so any property the base sets but the instance no longer
  // produces would leak through. This happens for context-dependent layout
  // props such as `align-self: stretch`, which the base bakes from a vertical
  // parent but a node reused in a horizontal row drops in favor of `flex`.
  // Neutralize those base-only keys so base + delta resolve to what the instance
  // computes in its own context, matching the single-rule output the canvas
  // renders. `unset` reverts each property to inherit (for inherited props like
  // font-family) or initial (for the rest), which mirrors an absent declaration.
  // Resets are written before the instance's own values so a shorthand the
  // instance does emit (e.g. `flex`) still overrides a longhand reset it implies
  // (e.g. `flex-shrink`).
  const writableDifferences = differences as Record<string, string>
  for (const [key, baseValue] of Object.entries(baseCss)) {
    if (key in instanceCss) continue
    if (baseValue === undefined || baseValue === null) continue
    // Pseudo-selector blocks are nested objects handled elsewhere, not props.
    if (typeof baseValue === "object") continue
    writableDifferences[key] = "unset"
  }

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

/** Family base class shared by every variant of a component, e.g. `sdn-item`. */
function getFamilyBaseClass(node: EntryNode, workspace: Workspace): string {
  return `sdn-${kebabCase(getNodeCatalogId(node, workspace) ?? "unknown")}`
}

export const buildStyleRegistry = (
  workspace: Workspace,
  forceRegeneration: boolean = false,
  parentIndex: NodeParentIndex,
): {
  classes: Classes
  stateClasses: StateClasses
  descendantStateClasses: DescendantStateClasses
  nodeIdToClass: NodeIdToClass
  classNameToNodeId: Record<string, string>
  nodeTreeDepths: Record<string, number>
} => {
  const classes: Classes = {}
  const stateClasses: StateClasses = {}
  const descendantStateClasses: DescendantStateClasses = {}
  const nodeIdToClass: NodeIdToClass = {}
  const classNameToNodeId: Record<string, string> = {}
  const nodeTreeDepths: Record<string, number> = {}
  const classNameToComponentId: Record<string, string> = {}
  const usedStates = collectUsedStates(workspace)

  // A variant id that appears as a composition parent owns children, so its
  // states cascade to descendants (`.sdn-item-node:hover .sdn-combobox-field--lmje`)
  // instead of styling only itself. Leaf variants keep their self-scoped rule.
  const containerNodeIds = new Set(parentIndex.values())

  /** Records a root-scoped state rule, deduping by descendant target. */
  const addRootScopedRule = (
    rootClass: string,
    stateName: string,
    descendantClass: string | null,
    css: CSSObject,
  ): void => {
    const byState = (descendantStateClasses[rootClass] ??= {})
    const rules = (byState[stateName] ??= [])
    if (rules.some((rule) => rule.descendantClass === descendantClass)) return
    rules.push({ descendantClass, css })
  }

  /** Full computed CSS for a node in its own context, optionally for a state. */
  const computeNodeCss = (nodeId: string, state?: string): CSSObject => {
    const context = getStyleContext(nodeId, workspace, parentIndex, state)
    return getCssObjectFromProperties(context.properties, {
      properties: context.properties,
      parentContext: context.parentContext,
      theme: context.theme,
      layoutMode: context.layoutMode,
      useThemeVariableReferences: true,
      themeSlug: getThemeSlug(context.theme.id as string, workspace),
    })
  }

  /**
   * Every descendant node id under a component-root variant, walking the board's
   * own composition tree. This is the rendered subtree of the exported component,
   * not the global first-parent-wins index, so a node shared by several
   * components is reached once per component that embeds it.
   */
  const collectSubtreeIds = (rootId: string): string[] => {
    const board = getBoardByNodeId(workspace, rootId)
    if (!board || !isComponentBoard(board)) return []
    const ids: string[] = []
    const seen = new Set<string>()
    const stack = [...getChildrenIds(board, rootId)]
    while (stack.length > 0) {
      const id = stack.pop() as string
      if (seen.has(id)) continue
      seen.add(id)
      ids.push(id)
      for (const childId of getChildrenIds(board, id)) stack.push(childId)
    }
    return ids
  }

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
        layoutMode: variantContext.layoutMode,
        useThemeVariableReferences: true,
        themeSlug: getThemeSlug(variantContext.theme.id as string, workspace),
      })

      const instanceCss = getCssObjectFromProperties(
        instanceContext.properties,
        {
          properties: instanceContext.properties,
          parentContext: instanceContext.parentContext,
          theme: instanceContext.theme,
          layoutMode: instanceContext.layoutMode,
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
        layoutMode: context.layoutMode,
        useThemeVariableReferences: true,
        themeSlug: getThemeSlug(context.theme.id as string, workspace),
      })
    }

    // Variants and default variants author interaction states. Compute each used
    // state against the node's Normal CSS and keep the non-empty deltas. The
    // delta is materialized on the variant's class, so instances inherit it for
    // free through the variant class they already carry.
    const nodeStateDeltas: Record<string, CSSObject> = {}
    if (typeCheckingService.isVariant(node) && !hasTemplateSource) {
      for (const state of usedStates) {
        const stateContext = getStyleContext(
          node.id,
          workspace,
          parentIndex,
          state,
        )
        const stateCss = getCssObjectFromProperties(stateContext.properties, {
          properties: stateContext.properties,
          parentContext: stateContext.parentContext,
          theme: stateContext.theme,
          layoutMode: stateContext.layoutMode,
          useThemeVariableReferences: true,
          themeSlug: getThemeSlug(stateContext.theme.id as string, workspace),
        })
        const delta = calculateCssDifferences(css, stateCss)
        if (Object.keys(delta).length > 0) {
          nodeStateDeltas[state] = delta
        }
      }
    }
    const hasStateDeltas = Object.keys(nodeStateDeltas).length > 0

    // A container variant owns the interaction: its states cascade from the row
    // root, so emit them root-scoped (with the ancestor selector for focus and
    // checked) and skip the self-scoped rule. Leaf variants keep their
    // self-scoped rule for standalone use.
    const isContainerVariant = hasStateDeltas && containerNodeIds.has(node.id)
    if (isContainerVariant) {
      const rootClass = getClassNameForNode(node, workspace)
      for (const [stateName, stateCss] of Object.entries(nodeStateDeltas)) {
        addRootScopedRule(rootClass, stateName, null, stateCss)
      }
    }

    const isDefault =
      typeCheckingService.isVariant(node) && isDefaultVariant(node)

    if (
      !forceRegeneration &&
      Object.keys(css).length === 0 &&
      !isDefault &&
      !hasTemplateSource &&
      !hasStateDeltas
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
      if (hasStateDeltas && !isContainerVariant && !stateClasses[existing[0]]) {
        stateClasses[existing[0]] = nodeStateDeltas
      }
    } else {
      classes[className] = css
      nodeIdToClass[node.id] = className
      classNameToNodeId[className] = node.id
      classNameToComponentId[className] = componentId
      if (hasStateDeltas && !isContainerVariant) {
        stateClasses[className] = nodeStateDeltas
      }
    }
  })

  // Cascade every descendant's state delta under its exported component root,
  // e.g. `.sdn-item-node:hover .sdn-icon--vsau`. This mirrors the canvas board
  // preview, where the forced state applies across the whole subtree, so
  // hovering or selecting the row restyles every authored part, including parts
  // nested inside embedded sub-components (a button's icon, a field's input).
  //
  // The root is the exported component, found by walking that component's own
  // composition tree, not the global first-parent-wins index. A node shared by
  // several components (the same icon used standalone, in a button, and in a
  // row) is therefore reached once per component that embeds it, so each gets
  // its own root-scoped rule. The rule targets the descendant's unique instance
  // class, so the cascade only touches the parts this component renders.
  //
  // The delta is computed for the node in its own context. A node whose Normal
  // already matches the state (e.g. a combobox input shown as a static label)
  // yields an empty delta and emits no rule, so the export never adds a state
  // change the canvas does not show.
  const exportComponentRoots = getAllVariants(workspace).filter((variant) => {
    const board = getBoardByNodeId(workspace, variant.id)
    if (!board || !isComponentBoard(board)) return false
    const catalogId = getNodeCatalogId(variant, workspace)
    if (!catalogId || !isComponentId(catalogId)) return false
    return catalogId !== ComponentId.FRAME
  })

  for (const root of exportComponentRoots) {
    // Root the cascade at the variant's own rendered class (`.sdn-item-node`),
    // not the shared family base (`.sdn-item`). The exported root element carries
    // only its variant class, so a family-rooted selector would miss every custom
    // variant (the row) and match only the default variant (the board).
    const rootClass = getClassNameForNode(root, workspace)
    const rootFamily = getFamilyBaseClass(root, workspace)
    for (const descendantId of collectSubtreeIds(root.id)) {
      const descendantNode = workspace.nodes[descendantId]
      if (!descendantNode) continue

      // Skip a same-family nesting so a row never scopes a delta onto itself.
      if (getFamilyBaseClass(descendantNode, workspace) === rootFamily) continue

      const descendantClass =
        nodeIdToClass[descendantId] ??
        getClassNameForNode(descendantNode, workspace)
      const normalCss = computeNodeCss(descendantId)
      for (const stateName of usedStates) {
        const stateCss = computeNodeCss(descendantId, stateName)
        const delta = calculateCssDifferences(normalCss, stateCss)
        if (Object.keys(delta).length > 0) {
          addRootScopedRule(rootClass, stateName, descendantClass, delta)
        }
      }
    }
  }

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

  return {
    classes,
    stateClasses,
    descendantStateClasses,
    nodeIdToClass,
    classNameToNodeId,
    nodeTreeDepths,
  }
}
