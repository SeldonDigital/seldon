import { removeNewLines } from "@lib/utils/new-lines"
import { CSSProperties, MouseEvent } from "react"
import { Display, Properties, VariantId } from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { ComponentId, isComponentId } from "@seldon/core/components/constants"
import { isEmptyValue } from "@seldon/core/helpers/type-guards/value/is-empty-value"
import { IconId, iconLabels } from "@seldon/core/icons"
import { rules } from "@seldon/core/rules/config/rules.config"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import { nodeSubtreeHasOverrides } from "@seldon/core/workspace/helpers/nodes/get-node-subtree-ids"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import type { EntryNode } from "@seldon/core/workspace/types"
import {
  getNodeCatalogComponentId,
  getNodeChildIds,
} from "@lib/workspace/node-tree"
import { getComponentKey, getNode, hasNode } from "@lib/workspace/workspace-accessors"
import { useDebugMode } from "@lib/hooks/use-debug-mode"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { useTool } from "@lib/hooks/use-tool"
import { useSelection } from "@lib/workspace/use-selection"
import { useSelectionRelations } from "./use-selection-relations"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { IconProps } from "../../../seldon/primitives/Icon"
import { LabelProps } from "../../../seldon/primitives/Label"
import { useAddToast } from "@components/toaster/hooks/use-add-toast"
import { useDraggable } from "./use-draggable"
import { useEditState } from "./use-edit-state"
import { useExpansion, useIsExpanded } from "./use-expansion"
import { useRowButton } from "./use-row-button"
import { useRowClick } from "./use-row-click"
import { useRowToggle } from "./use-row-toggle"
import { useSectionExpansion } from "../../hooks/use-section-expansion"

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
  const { debugModeEnabled } = useDebugMode()
  const { autoScrollToSelection } = useEditorConfig()
  const addToast = useAddToast()

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

  const children = nodeExistsInWorkspace
    ? getNodeChildIds(node, workspace)
    : []
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
    if (debugModeEnabled) {
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

  const createActionButton = (
    iconName: IconProps["icon"],
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void,
  ) => {
    if (!isSelected) {
      return { icon: undefined, button: undefined }
    }

    return {
      icon: { icon: iconName } as IconProps,
      button: {
        onClick:
          onClick ||
          ((event: MouseEvent<HTMLButtonElement>) => {
            event?.stopPropagation()
            addToast("This feature is coming soon")
          }),
        className: "sdn-button-iconic sdn-button-iconic--0urv",
        style: {
          position: "relative" as const,
          zIndex: 10,
        },
      },
    }
  }

  let icon3: IconProps | undefined
  let buttonIconic3: React.ButtonHTMLAttributes<HTMLButtonElement> | undefined
  let icon4: IconProps | undefined
  let buttonIconic4: React.ButtonHTMLAttributes<HTMLButtonElement> | undefined

  const isResettableType =
    workspaceService.isDefaultVariant(node) ||
    workspaceService.isUserVariant(node) ||
    workspaceService.isInstance(node)
  // Detecting subtree overrides walks the variant tree, so only run it for the
  // selected resettable row rather than on every rendered row.
  const canReset =
    isSelected &&
    isResettableType &&
    nodeExistsInWorkspace &&
    nodeSubtreeHasOverrides(node.id, workspace)

  function handleReset(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
    if (workspaceService.isUserVariant(node)) {
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

  const resetButton = canReset
    ? createActionButton("seldon-reset", handleReset)
    : { icon: undefined, button: undefined }
  const moreButton = createActionButton("seldon-more")
  icon3 = resetButton.icon
  buttonIconic3 = resetButton.button
  icon4 = moreButton.icon
  buttonIconic4 = moreButton.button

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
    buttonIconic3,
    icon3,
    buttonIconic4,
    icon4,
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
