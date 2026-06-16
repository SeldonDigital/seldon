import { removeNewLines } from "@lib/helpers/new-lines"
import { MenuEntry } from "@lib/menus"
import { CSSProperties } from "react"
import { Display, InstanceId, Properties, VariantId } from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { ComponentId, isComponentId } from "@seldon/core/components/constants"
import { isEmptyValue } from "@seldon/core/helpers/type-guards/value/is-empty-value"
import { IconId, iconLabels } from "@seldon/core/icon-sets"
import { rules } from "@seldon/core/rules/config/rules.config"
import { isVariantInUse } from "@seldon/core/workspace/helpers/general/is-variant-in-use"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import { nodeSubtreeHasOverrides } from "@seldon/core/workspace/helpers/nodes/get-node-subtree-ids"
import { isSandboxNode } from "@seldon/core/workspace/helpers/nodes/sandbox"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import type { EntryNode } from "@seldon/core/workspace/types"
import {
  buildDefaultSnippet,
  buildVariantSnippet,
} from "@lib/copy-schema/build-schema-snippet"
import { serializeSchemaSnippet } from "@lib/copy-schema/serialize-schema-ts"
import { usePropertiesClipboard } from "@lib/workspace/hooks/use-properties-clipboard"
import { useAddToast } from "@app/toaster/hooks/use-add-toast"
import {
  useSelection,
  useStore as useSelectionStore,
} from "@lib/workspace/hooks/use-selection"
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
  getSelectionTarget,
  selectFromTarget,
} from "@lib/workspace/selection-target"
import {
  getComponentKey,
  getNode,
  hasNode,
} from "@lib/workspace/workspace-accessors"
import { IconProps } from "@seldon/components/custom-components"
import { TextLabelProps } from "@seldon/components/primitives/TextLabel"
import { useDraggable } from "./use-draggable"
import { useEditState } from "./use-edit-state"
import { useExpansion, useIsExpanded } from "./use-expansion"
import { useRowButton } from "./use-row-button"
import { useRowClick } from "./use-row-click"
import { buildResetMenuEntry } from "../../shared/build-reset-menu-entry"
import { useRowToggle } from "./use-row-toggle"
import { useSelectionRelations } from "./use-selection-relations"

/**
 * Hook that provides all state and handlers for rendering a node row in the objects sidebar.
 * Children come from the board variant tree via `getNodeChildIds` (1:1 with saved JSON).
 */
export function useRowNode(
  node: EntryNode,
  options?: {
    rootId?: string
    show?: boolean
    parentIsSelected?: boolean
    disableReordering?: boolean
  },
) {
  const { workspace, dispatch } = useWorkspace({ usePreview: false })
  const { activeTool } = useTool()
  const { selectNode, selectBoard, selectResourceEntry, selectResourceItem } =
    useSelection()
  const { selectedNodeId, parentOfSelectedNodeId, ancestorIdsOfSelected } =
    useSelectionRelations()
  const { showNodeIds } = useDebugMode()
  const { autoScrollToSelection } = useEditorConfig()
  const addToast = useAddToast()
  const hasClipboardProperties = usePropertiesClipboard(
    (state) => state.properties !== null,
  )

  const { toggle, expandObjects, collapseObjects, getAllDescendantNodeIds } =
    useExpansion()
  const { toggleSection } = useSectionExpansion()

  const { isEditingName, setEditingName } = useEditState(node)

  const rootId = options?.rootId
  const selectionPath = rootId ?? node.id
  const show = options?.show ?? true
  const parentIsSelected = options?.parentIsSelected ?? false
  const disableReordering = options?.disableReordering ?? false

  const nodeExistsInWorkspace = hasNode(workspace, node.id)
  const properties: Properties = nodeExistsInWorkspace
    ? getNodeProperties(node, workspace)
    : {}
  const expandedId = node.id
  const isExpandedState = useIsExpanded(expandedId)

  const children = nodeExistsInWorkspace ? getNodeChildIds(node, workspace) : []
  const hasChildren = children.length > 0

  // A child id is shared across variant columns, so match the selected copy by
  // its path. Selections made without a path (e.g. a variant chosen
  // programmatically) fall back to id-only matching. `selectionPath` falls back
  // to the node id when the row path is not threaded into the hook.
  const isSelected = useSelectionStore(
    (state) =>
      state.selectedNodeId === node.id &&
      (state.selectedNodeRootId == null ||
        state.selectedNodeRootId === selectionPath),
  )
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

  // Resolve and dispatch the selection through the same shared path the canvas
  // uses, so a sidebar click and a canvas click run identical logic.
  const onClick = useRowClick({
    activeTool,
    onSelect: (event) => {
      const target = getSelectionTarget(event.target as Element)
      if (target) {
        selectFromTarget(target, {
          selectNode,
          selectBoard,
          selectResourceEntry,
          selectResourceItem,
        })
      }
    },
  })

  const { createToggleButton, createToggleIcon } = useRowButton({
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
    return "Reset to Default"
  }

  function buildResetAction(): MenuEntry {
    return buildResetMenuEntry({
      label: getResetLabel(),
      onSelect: handleReset,
      testId: `object-panel-node-${node.id}-reset`,
    })
  }

  function handleDuplicate() {
    dispatch({
      type: "duplicate_node",
      payload: { nodeId: node.id as VariantId },
    })
  }

  async function handleCopyJson() {
    if (workspaceService.isInstance(node)) {
      addToast("Nested children cannot be copied as schema JSON")
      return
    }
    const snippet = workspaceService.isDefaultVariant(node)
      ? buildDefaultSnippet(node, workspace)
      : buildVariantSnippet(node, workspace)
    if (!snippet) {
      addToast("Could not resolve a catalog component for the selection")
      return
    }
    await navigator.clipboard.writeText(serializeSchemaSnippet(snippet))
    addToast("Schema JSON copied to clipboard")
  }

  function handleCopyProperties() {
    usePropertiesClipboard
      .getState()
      .setProperties(structuredClone(node.overrides))
    addToast("Properties copied")
  }

  function handlePasteProperties() {
    const clipboard = usePropertiesClipboard.getState().properties
    if (!clipboard) {
      addToast("No properties to paste")
      return
    }
    dispatch({
      type: "set_node_properties",
      payload: {
        nodeId: node.id as VariantId,
        properties: clipboard,
        options: { mergeSubProperties: true },
      },
    })
  }

  function handleDelete() {
    const isVariant = workspaceService.isVariant(node)
    if (isVariant && isVariantInUse(node.id, workspace)) {
      const confirmed = window.confirm(
        "This variant is used in other components. Deleting it will also remove it from those components. Delete anyway?",
      )
      if (!confirmed) return
    }
    const subject = workspaceService.getNode(node.id, workspace)
    const adjacentId =
      workspaceService.findAdjacent(subject, "before", workspace)?.id ??
      workspaceService.findAdjacent(subject, "after", workspace)?.id ??
      null
    if (isVariant) {
      dispatch({
        type: "remove_variant",
        payload: { variantRootId: node.id as VariantId },
      })
    } else {
      dispatch({
        type: "remove_instance",
        payload: { instanceId: node.id as InstanceId },
      })
    }
    selectNode(adjacentId as VariantId | InstanceId | null)
  }

  function buildNodeActions(): MenuEntry[] {
    const isDefault = workspaceService.isDefaultVariant(node)
    const isUser = workspaceService.isUserVariant(node)
    const isInstance = workspaceService.isInstance(node)

    // Sandbox roots have no catalog default and are not exported, so they skip
    // Copy JSON and Reset. Their child instances keep the standard menus below.
    if (isSelected && isSandboxNode(node)) {
      return [
        {
          id: "duplicate",
          label: `Duplicate ${node.label}`,
          onSelect: handleDuplicate,
          testId: `object-panel-node-${node.id}-duplicate`,
        },
        "separator",
        {
          id: "copy-properties",
          label: "Copy Properties",
          onSelect: handleCopyProperties,
          testId: `object-panel-node-${node.id}-copy-properties`,
        },
        {
          id: "paste-properties",
          label: "Paste Properties",
          onSelect: handlePasteProperties,
          disabled: !hasClipboardProperties,
          testId: `object-panel-node-${node.id}-paste-properties`,
        },
        "separator",
        {
          id: "delete",
          label: `Delete ${node.label}`,
          onSelect: handleDelete,
          testId: `object-panel-node-${node.id}-delete`,
        },
      ]
    }

    // Selected instance (child) rows get the variant menu minus "Copy JSON",
    // which only applies to default and user variant rows.
    if (isSelected && isInstance) {
      return [
        {
          id: "duplicate",
          label: `Duplicate ${node.label}`,
          onSelect: handleDuplicate,
          testId: `object-panel-node-${node.id}-duplicate`,
        },
        "separator",
        {
          id: "copy-properties",
          label: "Copy Properties",
          onSelect: handleCopyProperties,
          testId: `object-panel-node-${node.id}-copy-properties`,
        },
        {
          id: "paste-properties",
          label: "Paste Properties",
          onSelect: handlePasteProperties,
          disabled: !hasClipboardProperties,
          testId: `object-panel-node-${node.id}-paste-properties`,
        },
        "separator",
        {
          id: "delete",
          label: `Delete ${node.label}`,
          onSelect: handleDelete,
          testId: `object-panel-node-${node.id}-delete`,
        },
        buildResetAction(),
      ]
    }

    // Only the selected default or user variant row gets the full action menu.
    // Unselected rows keep the reset-only menu below.
    if (isSelected && (isDefault || isUser)) {
      const entries: MenuEntry[] = [
        {
          id: "duplicate",
          label: isDefault
            ? `Duplicate ${node.label} Default`
            : `Duplicate ${node.label}`,
          onSelect: handleDuplicate,
          testId: `object-panel-node-${node.id}-duplicate`,
        },
        "separator",
        {
          id: "copy-json",
          label: "Copy JSON",
          onSelect: handleCopyJson,
          testId: `object-panel-node-${node.id}-copy-json`,
        },
        "separator",
        {
          id: "copy-properties",
          label: "Copy Properties",
          onSelect: handleCopyProperties,
          testId: `object-panel-node-${node.id}-copy-properties`,
        },
        {
          id: "paste-properties",
          label: "Paste Properties",
          onSelect: handlePasteProperties,
          disabled: !hasClipboardProperties,
          testId: `object-panel-node-${node.id}-paste-properties`,
        },
        "separator",
      ]

      if (isUser) {
        entries.push({
          id: "delete",
          label: `Delete ${node.label}`,
          onSelect: handleDelete,
          testId: `object-panel-node-${node.id}-delete`,
        })
      }

      entries.push(buildResetAction())
      return entries
    }

    return canReset ? [buildResetAction()] : []
  }

  const actions: MenuEntry[] = buildNodeActions()

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

  function setNodeLabel(newLabel: string) {
    dispatch({
      type: "set_node_label",
      payload: {
        nodeId: node.id as VariantId,
        label: newLabel.trim(),
      },
    })
    setEditingName(false)
  }

  return {
    label: label as TextLabelProps,
    buttonIconic,
    icon,
    icon2,
    actions,
    onClick,
    onDoubleClick: handleDoubleClick,
    isExpanded: isExpandedState,
    isSelected,
    isNodeActive,
    isEditingName,
    setEditingName,
    setNodeLabel,
    hasChildren,
    children,
    dragging,
    ref,
    properties,
    dataNodeType: workspaceService.getEntityType(node),
  }
}
