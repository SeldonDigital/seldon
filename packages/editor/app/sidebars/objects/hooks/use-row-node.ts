import { removeNewLines } from "@lib/helpers/new-lines"
import { MenuItem } from "@lib/menus"
import { CSSProperties } from "react"
import { Display, Properties, VariantId } from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { ComponentId, isComponentId } from "@seldon/core/components/constants"
import { isEmptyValue } from "@seldon/core/helpers/type-guards/value/is-empty-value"
import { IconId, iconLabels } from "@seldon/core/icon-sets"
import { rules } from "@seldon/core/rules/config/rules.config"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import { nodeSubtreeHasOverrides } from "@seldon/core/workspace/helpers/nodes/get-node-subtree-ids"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import type { EntryNode } from "@seldon/core/workspace/types"
import { useSelection } from "@lib/workspace/hooks/use-selection"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { useDebugMode } from "@lib/hooks/use-debug-mode"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { useTool } from "@lib/hooks/use-tool"
import { useSectionExpansion } from "../../hooks/use-section-expansion"
import {
  getNodeCatalogComponentId,
  getNodeChildIds,
} from "@lib/workspace/node-tree"
import {
  getComponentKey,
  getNode,
  hasNode,
} from "@lib/workspace/workspace-accessors"
import { IconProps } from "@seldon/components/primitives/Icon"
import { LabelProps } from "@seldon/components/primitives/Label"
import { useDraggable } from "./use-draggable"
import { useEditState } from "./use-edit-state"
import { useExpansion, useIsExpanded } from "./use-expansion"
import { useRowButton } from "./use-row-button"
import { useRowClick } from "./use-row-click"
import { useRowToggle } from "./use-row-toggle"
import { useSelectionRelations } from "./use-selection-relations"

/**
 * Hook that provides all state and handlers for rendering a node row in the objects sidebar.
 * Children come from the board variant tree via `getNodeChildIds` (1:1 with saved JSON).
 */
export function useRowNode(
  node: EntryNode,
  options?: {
    show?: boolean
    parentIsSelected?: boolean
    disableReordering?: boolean
    onSelect?: () => void
  },
) {
  const { workspace, dispatch } = useWorkspace({ usePreview: false })
  const { activeTool } = useTool()
  const { selectNode } = useSelection()
  const { selectedNodeId, parentOfSelectedNodeId, ancestorIdsOfSelected } =
    useSelectionRelations()
  const { showNodeIds } = useDebugMode()
  const { autoScrollToSelection } = useEditorConfig()

  const { toggle, expandObjects, collapseObjects, getAllDescendantNodeIds } =
    useExpansion()
  const { toggleSection } = useSectionExpansion()

  const { isEditingName, setEditingName } = useEditState(node)

  const show = options?.show ?? true
  const parentIsSelected = options?.parentIsSelected ?? false
  const disableReordering = options?.disableReordering ?? false
  const onSelect = options?.onSelect

  const nodeExistsInWorkspace = hasNode(workspace, node.id)
  const properties: Properties = nodeExistsInWorkspace
    ? getNodeProperties(node, workspace)
    : {}
  const expandedId = node.id
  const isExpandedState = useIsExpanded(expandedId)

  const children = nodeExistsInWorkspace ? getNodeChildIds(node, workspace) : []
  const hasChildren = children.length > 0

  const isSelected = selectedNodeId === node.id
  const selectedNodeIsWithin = ancestorIdsOfSelected.has(node.id)
  const isParentOfSelectedNode = parentOfSelectedNodeId === node.id
  const isNodeActive =
    parentIsSelected || isParentOfSelectedNode || selectedNodeIsWithin

  const { dragging, ref } = useDraggable({
    enable: show && !isEditingName && !disableReordering,
    target: node,
    onDragStart: () => toggle(expandedId, false),
  })

  const onToggle = useRowToggle({
    expandedId,
    isExpanded: isExpandedState,
    toggle,
    expandObjects,
    collapseObjects,
    getAllIdsForAltClick: () => {
      const descendantIds = getAllDescendantNodeIds(expandedId)
      return [expandedId, ...descendantIds]
    },
    hasChildren,
  })

  const onClick = useRowClick({
    activeTool,
    onSelect: () => selectNode(node.id),
    onSelectCallback: onSelect,
  })

  const { createToggleButton, createToggleIcon, createStaticButton2 } =
    useRowButton({
      isExpanded: isExpandedState,
      isSelected,
      hasChildren,
      onToggle,
    })

  function findOwningVariantId(): string | null {
    let current: EntryNode | null = node
    while (current) {
      if (workspaceService.isVariant(current)) {
        return current.id
      }
      const parent = workspaceService.findParentNode(current.id, workspace)
      current = parent ? (parent as EntryNode) : null
    }
    return null
  }

  function handleDoubleClick() {
    const entityType = workspaceService.getEntityType(node)
    if (rules.mutations.rename[entityType].allowed) {
      setEditingName(true)
    } else if (workspaceService.isInstance(node)) {
      const variantId = findOwningVariantId()
      if (!variantId) return

      if (autoScrollToSelection && nodeExistsInWorkspace) {
        const variantNode = getNode(workspace, variantId)
        if (variantNode) {
          const root = workspaceService.getRootVariant(variantNode, workspace)
          const rootEntry = getNode(workspace, root.id)
          const rootCatalogId = rootEntry
            ? getNodeCatalogComponentId(rootEntry, workspace)
            : null
          if (rootCatalogId && isComponentId(rootCatalogId)) {
            toggleSection(getComponentSchema(rootCatalogId).level, true)
          }
          toggle(variantId, true, { includeAncestors: true })
        }
      }

      selectNode(variantId)
    }
  }

  function getNodeLabel() {
    if (showNodeIds) {
      return `ID: ${node.id} / TEMPLATE: ${node.template}`
    }

    if (
      workspaceService.isInstance(node) &&
      properties?.content &&
      !isEmptyValue(properties.content)
    ) {
      return removeNewLines(properties.content.value)
    }

    if (
      workspaceService.isInstance(node) &&
      properties?.symbol &&
      !isEmptyValue(properties.symbol) &&
      iconLabels[properties.symbol.value as IconId]
    ) {
      return iconLabels[properties.symbol.value as IconId] + " icon"
    }

    return node.label
  }

  const icon = createToggleIcon()
  const buttonIconic = createToggleButton()

  const getComponentTypeIcon = (): IconProps["icon"] => {
    if (workspaceService.isVariant(node)) {
      if (workspaceService.isDefaultVariant(node)) {
        return "seldon-componentDefault"
      }
      if (workspaceService.isUserVariant(node)) {
        return "seldon-componentVariant"
      }
    }
    return "seldon-stub"
  }

  const icon2: IconProps = {
    icon: getComponentTypeIcon(),
  }
  const buttonIconic2 = createStaticButton2()

  const isResettableType =
    workspaceService.isDefaultVariant(node) ||
    workspaceService.isUserVariant(node) ||
    workspaceService.isInstance(node)
  // A catalog-backed default variant can always reset to its catalog schema,
  // so offer "Reset to Catalog" whenever such a row is selected. The action is
  // idempotent when the tree already matches the catalog.
  const catalogComponentId = nodeExistsInWorkspace
    ? getNodeCatalogComponentId(node, workspace)
    : null
  const isCatalogBackedDefaultVariant =
    workspaceService.isDefaultVariant(node) &&
    !!catalogComponentId &&
    isComponentId(catalogComponentId)
  // Detecting subtree overrides walks the variant tree, so only run it for the
  // selected resettable row rather than on every rendered row.
  const canReset =
    isSelected &&
    isResettableType &&
    nodeExistsInWorkspace &&
    (isCatalogBackedDefaultVariant ||
      nodeSubtreeHasOverrides(node.id, workspace))

  function handleReset() {
    if (workspaceService.isDefaultVariant(node)) {
      dispatch({
        type: "reset_default_variant_to_catalog",
        payload: { defaultVariantRootId: node.id as VariantId },
      })
    } else if (workspaceService.isUserVariant(node)) {
      dispatch({
        type: "reset_user_variant_to_default",
        payload: { variantRootId: node.id as VariantId },
      })
    } else {
      dispatch({
        type: "reset_node",
        payload: { nodeId: node.id as VariantId },
      })
    }
  }

  function getResetLabel(): string {
    if (workspaceService.isDefaultVariant(node)) return "Reset to Catalog"
    if (workspaceService.isUserVariant(node)) return "Reset to Default"
    return "Reset"
  }

  const resetActions: MenuItem[] = canReset
    ? [
        {
          id: "reset",
          label: getResetLabel(),
          onSelect: handleReset,
          testId: `object-panel-node-${node.id}-reset`,
        },
      ]
    : []

  function checkIfExcluded(): boolean {
    if (!nodeExistsInWorkspace) {
      return false
    }

    const isExcluded = properties?.display?.value === Display.EXCLUDE
    if (isExcluded) return true

    if (!workspaceService.isInstance(node)) {
      return false
    }

    let currentParent = workspaceService.findParentNode(node.id, workspace)
    while (currentParent) {
      const parentProps = getNodeProperties(
        currentParent as EntryNode,
        workspace,
      )
      if (parentProps?.display?.value === Display.EXCLUDE) {
        return true
      }
      if (workspaceService.isInstance(currentParent)) {
        currentParent = workspaceService.findParentNode(
          currentParent.id,
          workspace,
        )
      } else {
        break
      }
    }

    return false
  }

  const labelStyle: CSSProperties | undefined = checkIfExcluded()
    ? { textDecoration: "line-through" }
    : undefined

  const label = {
    children: getNodeLabel(),
    style: labelStyle,
  }

  return {
    label: label as LabelProps,
    buttonIconic,
    icon,
    buttonIconic2,
    icon2,
    resetActions,
    onClick,
    onDoubleClick: handleDoubleClick,
    isExpanded: isExpandedState,
    isSelected,
    isNodeActive,
    isEditingName,
    setEditingName,
    hasChildren,
    children,
    dragging,
    ref,
    properties,
  }
}
