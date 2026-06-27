import {
  buildDefaultSnippet,
  buildVariantSnippet,
} from "@lib/copy-schema/build-schema-snippet"
import { serializeSchemaSnippet } from "@lib/copy-schema/serialize-schema-ts"
import { removeNewLines } from "@lib/helpers/new-lines"
import { MenuEntry } from "@lib/menus"
import { CSSProperties } from "react"
import { Display, InstanceId, Properties, VariantId } from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { ComponentId, isComponentId } from "@seldon/core/components/constants"
import { isEmptyValue } from "@seldon/core/helpers/type-guards/value/is-empty-value"
import { IconId, iconLabels } from "@seldon/core/icon-sets"
import { rules } from "@seldon/core/rules/config/rules.config"
import { componentBoardSchemaVariantNodeId } from "@seldon/core/workspace/helpers/components/entry-node-ids"
import { isVariantInUse } from "@seldon/core/workspace/helpers/general/is-variant-in-use"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import { isSandboxNode } from "@seldon/core/workspace/helpers/nodes/sandbox"
import {
  nodeRelationshipService,
  nodeRetrievalService,
  nodeTraversalService,
  resolveOriginalNodeId,
  resolveSourceNodeId,
  typeCheckingService,
} from "@seldon/core/workspace/services"
import type { EntryNode } from "@seldon/core/workspace/types"
import { usePropertiesClipboard } from "@lib/workspace/hooks/use-properties-clipboard"
import {
  useSelectionActions,
  useStore as useSelectionStore,
} from "@lib/workspace/hooks/use-selection"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { useDebugMode } from "@lib/hooks/use-debug-mode"
import { useTool } from "@lib/hooks/use-tool"
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
  hasNode,
} from "@lib/workspace/workspace-accessors"
import { IconProps } from "@seldon/components/primitives/Icon"
import { TextLabelProps } from "@seldon/components/primitives/TextLabel"
import { useAddToast } from "@app/toaster/hooks/use-add-toast"
import { buildResetMenuEntry } from "../../shared/build-reset-menu-entry"
import { useDraggable } from "./use-draggable"
import { useEditState } from "./use-edit-state"
import { useExpansion, useIsExpanded } from "./use-expansion"
import { useRowButton } from "./use-row-button"
import { useRowClick } from "./use-row-click"
import { useRowToggle } from "./use-row-toggle"
import {
  useIsAncestorOfSelection,
  useIsParentOfSelection,
} from "./use-selection-relations"

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
    /**
     * Render this row as a repeat echo: a stripped leaf (no chevron, no child
     * rows, no actions) with an italic label. Selection still routes to the
     * underlying node, which is index 0 of the repeat.
     */
    isEcho?: boolean
  },
) {
  const { workspace, dispatch } = useWorkspace({ usePreview: false })
  const { activeTool } = useTool()
  const { selectNode, selectBoard, selectResourceEntry, selectResourceItem } =
    useSelectionActions()
  const { showNodeIds } = useDebugMode()
  const addToast = useAddToast()
  const hasClipboardProperties = usePropertiesClipboard(
    (state) => state.properties !== null,
  )

  const { toggle, expandObjects, collapseObjects, getAllDescendantNodeIds } =
    useExpansion()

  const { isEditingName, setEditingName } = useEditState(node)

  const rootId = options?.rootId
  const selectionPath = rootId ?? node.id
  const show = options?.show ?? true
  const parentIsSelected = options?.parentIsSelected ?? false
  const disableReordering = options?.disableReordering ?? false
  const isEcho = options?.isEcho ?? false

  const nodeExistsInWorkspace = hasNode(workspace, node.id)
  const properties: Properties = nodeExistsInWorkspace
    ? getNodeProperties(node, workspace)
    : {}
  const expandedId = node.id
  const isExpandedState = useIsExpanded(expandedId)

  // Echo rows are leaves: they never disclose children, which also renders an
  // inert, transparent chevron via useRowButton.
  const children =
    !isEcho && nodeExistsInWorkspace ? getNodeChildIds(node, workspace) : []
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
  const selectedNodeIsWithin = useIsAncestorOfSelection(node.id)
  const isParentOfSelectedNode = useIsParentOfSelection(node.id)
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
    hasChildren,
    onToggle,
  })

  function handleDoubleClick() {
    if (isEcho) return
    const entityType = typeCheckingService.getEntityType(node)
    if (rules.mutations.rename[entityType].allowed) {
      setEditingName(true)
    } else if (typeCheckingService.isInstance(node)) {
      // An instance mirrors its source variant, so its name is read-only here.
      // Renaming happens at the source the user reaches through the row menu.
      addToast("This name can only be changed at its source")
    }
  }

  function getNodeLabel() {
    if (showNodeIds) {
      return `ID: ${node.id} / TEMPLATE: ${node.template}`
    }

    if (
      typeCheckingService.isInstance(node) &&
      properties?.content &&
      !isEmptyValue(properties.content)
    ) {
      return removeNewLines(properties.content.value)
    }

    if (
      typeCheckingService.isInstance(node) &&
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
    if (typeCheckingService.isVariant(node)) {
      if (typeCheckingService.isDefaultVariant(node)) {
        return "seldon-componentDefault"
      }
      if (typeCheckingService.isUserVariant(node)) {
        return "seldon-componentVariant"
      }
    }
    return "seldon-stub"
  }

  const icon2: IconProps = {
    icon: getComponentTypeIcon(),
  }

  const catalogComponentId = nodeExistsInWorkspace
    ? getNodeCatalogComponentId(node, workspace)
    : null

  // A schema-backed user variant has a catalog template in the component schema:
  // its root id matches a schema variant id. Only those reset to catalog. A user
  // variant a person built from scratch has no catalog variant to reset to.
  const isSchemaBackedVariant =
    typeCheckingService.isUserVariant(node) &&
    !!catalogComponentId &&
    isComponentId(catalogComponentId) &&
    (getComponentSchema(catalogComponentId).variants ?? []).some(
      (variant) =>
        componentBoardSchemaVariantNodeId(catalogComponentId, variant.id) ===
        node.id,
    )

  // Instance resets walk the template chain. Source is the node one hop up;
  // Original is the chain terminal. Disable a target that does not resolve to a
  // different node, and drop Original when it matches Source.
  const isInstanceNode =
    nodeExistsInWorkspace && typeCheckingService.isInstance(node)
  const instanceSourceId = isInstanceNode
    ? resolveSourceNodeId(workspace, node.id)
    : null
  const instanceOriginalId = isInstanceNode
    ? resolveOriginalNodeId(workspace, node.id)
    : null
  const canResetToSource = !!instanceSourceId && instanceSourceId !== node.id
  const canResetToOriginal =
    !!instanceOriginalId &&
    instanceOriginalId !== node.id &&
    instanceOriginalId !== instanceSourceId

  // A user variant can reset its instances when at least one instance links
  // straight to it as its source. Enables the "Reset Instances" action.
  const canResetVariantInstances =
    nodeExistsInWorkspace &&
    typeCheckingService.isUserVariant(node) &&
    Object.values(workspace.nodes).some(
      (candidate) =>
        typeCheckingService.isInstance(candidate) &&
        resolveSourceNodeId(workspace, candidate.id) === node.id,
    )

  function handleResetDefaultVariantToCatalog() {
    dispatch({
      type: "reset_default_variant_to_catalog",
      payload: { defaultVariantRootId: node.id as VariantId },
    })
  }

  function handleResetVariantToCatalog() {
    dispatch({
      type: "reset_variant_to_catalog",
      payload: { variantRootId: node.id as VariantId },
    })
  }

  function handleResetVariantInstances() {
    dispatch({
      type: "reset_variant_instances",
      payload: { variantRootId: node.id as VariantId },
    })
  }

  function handleResetInstanceToSource() {
    dispatch({
      type: "reset_instance_to_source",
      payload: { instanceId: node.id as InstanceId },
    })
  }

  function handleResetInstanceToOriginal() {
    dispatch({
      type: "reset_instance_to_original",
      payload: { instanceId: node.id as InstanceId },
    })
  }

  // The default variant always resets to its catalog schema. A custom variant
  // resets to its schema variant, disabled when it has no catalog template.
  function buildVariantResetAction(): MenuEntry {
    if (typeCheckingService.isDefaultVariant(node)) {
      return buildResetMenuEntry({
        id: "reset-to-catalog",
        label: "Reset to Catalog",
        onSelect: handleResetDefaultVariantToCatalog,
        testId: `object-panel-node-${node.id}-reset-to-catalog`,
      })
    }
    return buildResetMenuEntry({
      id: "reset-to-catalog",
      label: "Reset to Catalog",
      onSelect: handleResetVariantToCatalog,
      disabled: !isSchemaBackedVariant,
      testId: `object-panel-node-${node.id}-reset-to-catalog`,
    })
  }

  function buildInstanceResetActions(): MenuEntry[] {
    return [
      buildResetMenuEntry({
        id: "reset-to-source",
        label: "Reset to Source",
        onSelect: handleResetInstanceToSource,
        disabled: !canResetToSource,
        testId: `object-panel-node-${node.id}-reset-to-source`,
      }),
      buildResetMenuEntry({
        id: "reset-to-original",
        label: "Reset to Original",
        onSelect: handleResetInstanceToOriginal,
        disabled: !canResetToOriginal,
        testId: `object-panel-node-${node.id}-reset-to-original`,
      }),
    ]
  }

  function handleDuplicate() {
    dispatch({
      type: "duplicate_node",
      payload: { nodeId: node.id as VariantId },
    })
  }

  async function handleCopyJson() {
    if (typeCheckingService.isInstance(node)) {
      addToast("Nested children cannot be copied as schema JSON")
      return
    }
    const snippet = typeCheckingService.isDefaultVariant(node)
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
    const isVariant = typeCheckingService.isVariant(node)
    if (isVariant && isVariantInUse(node.id, workspace)) {
      const confirmed = window.confirm(
        "This variant is used in other components. Deleting it will also remove it from those components. Delete anyway?",
      )
      if (!confirmed) return
    }
    const subject = nodeRetrievalService.getNode(node.id, workspace)
    const adjacentId =
      nodeRelationshipService.findAdjacent(subject, "before", workspace)?.id ??
      nodeRelationshipService.findAdjacent(subject, "after", workspace)?.id ??
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
    const isDefault = typeCheckingService.isDefaultVariant(node)
    const isUser = typeCheckingService.isUserVariant(node)
    const isInstance = typeCheckingService.isInstance(node)

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
        ...buildInstanceResetActions(),
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

      if (isUser) {
        entries.push(
          buildResetMenuEntry({
            id: "reset-variant-instances",
            label: "Reset Instances",
            onSelect: handleResetVariantInstances,
            disabled: !canResetVariantInstances,
            testId: `object-panel-node-${node.id}-reset-instances`,
          }),
        )
      }

      entries.push(buildVariantResetAction())
      return entries
    }

    return []
  }

  const actions: MenuEntry[] = isEcho ? [] : buildNodeActions()

  function checkIfExcluded(): boolean {
    if (!nodeExistsInWorkspace) {
      return false
    }

    const isExcluded = properties?.display?.value === Display.EXCLUDE
    if (isExcluded) return true

    if (!typeCheckingService.isInstance(node)) {
      return false
    }

    let currentParent = nodeTraversalService.findParentNode(node.id, workspace)
    while (currentParent) {
      const parentProps = getNodeProperties(
        currentParent as EntryNode,
        workspace,
      )
      if (parentProps?.display?.value === Display.EXCLUDE) {
        return true
      }
      if (typeCheckingService.isInstance(currentParent)) {
        currentParent = nodeTraversalService.findParentNode(
          currentParent.id,
          workspace,
        )
      } else {
        break
      }
    }

    return false
  }

  // Excluded rows (own display or an excluded ancestor) read as italic. Hidden
  // rows use the node's own display only. Both drive the disabled look.
  const isExcluded = checkIfExcluded()
  const isHidden = properties?.display?.value === Display.HIDE

  const baseLabelStyle: CSSProperties | undefined = isExcluded
    ? { fontStyle: "italic" }
    : undefined
  const labelStyle: CSSProperties | undefined = isEcho
    ? { ...baseLabelStyle, fontStyle: "italic", opacity: 0.7 }
    : baseLabelStyle

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
    isExcluded,
    isHidden,
    dataNodeType: typeCheckingService.getEntityType(node),
  }
}
