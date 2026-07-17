import { Properties, VariantId } from "@seldon/core"
import { rules } from "@seldon/core/rules/config/rules.config"
import { isDuplicateVariantLabel } from "@seldon/core/workspace/helpers/components/duplicate-variant-labels"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import { typeCheckingService } from "@seldon/core/workspace/services"
import type { EntryNode } from "@seldon/core/workspace/types"
import {
  useSelectionActions,
  useStore as useSelectionStore,
} from "@lib/workspace/hooks/use-selection"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { useDebugMode } from "@lib/hooks/use-debug-mode"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { useTool } from "@lib/hooks/use-tool"
import { useSharedNodeHighlight } from "../../../tracking/hooks/use-shared-node-highlight"
import { getNodeChildIds } from "@lib/workspace/node-tree"
import {
  getSelectionTarget,
  selectFromTarget,
} from "@lib/workspace/selection-target"
import { hasNode } from "@lib/workspace/workspace-accessors"
import { IconProps } from "@seldon/components/primitives/Icon"
import { TextLabelProps } from "@seldon/components/primitives/TextLabel"
import { useAddToast } from "@app/toaster/hooks/use-add-toast"
import { useDraggable } from "./use-draggable"
import { useEditState } from "./use-edit-state"
import { useExpansion, useIsExpanded } from "./use-expansion"
import {
  getComponentTypeIcon,
  getNodeLabel,
  getNodeTypeColor,
} from "./row-node-label"
import { useRowButton } from "./use-row-button"
import { useRowClick } from "./use-row-click"
import { useRowNodeActions } from "./use-row-node-actions"
import { useRowNodeDisplay } from "./use-row-node-display"
import { useRowToggle } from "./use-row-toggle"
import {
  useIsAncestorOfSelection,
  useIsParentOfSelection,
} from "./use-selection-relations"

/**
 * Assembles the view model for a node row in the objects sidebar: selection and
 * lineage state, drag/click/toggle wiring, the row label, the actions menu, and
 * the Display picker. Children come from the board variant tree via
 * `getNodeChildIds` (1:1 with saved JSON). The heavier concerns live in
 * `useRowNodeActions`, `useRowNodeDisplay`, and the `row-node-label` helpers.
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
     * rows, no actions). Selection still routes to the underlying node, which is
     * index 0 of the repeat.
     */
    isEcho?: boolean
  },
) {
  const { workspace, dispatch } = useWorkspace({ usePreview: false })
  const { activeTool } = useTool()
  const { selectNode, selectBoard, selectResourceEntry, selectResourceItem } =
    useSelectionActions()
  const { showNodeIds, showNodeTypes } = useDebugMode()
  const { showCodeNames } = useEditorConfig()
  const addToast = useAddToast()

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

  // A user variant that repeats a sibling's label reads as an error: it exports
  // under a colliding component name and blocks factory export.
  const isDuplicateLabel =
    nodeExistsInWorkspace && isDuplicateVariantLabel(workspace, node.id)
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

  // Show Leaves / Branch / Tree lineage highlight from the View menu. Primary
  // rows change when the selection is edited; secondary rows are related
  // lineage that does not. The selected row keeps its own selection styling, so
  // it is excluded here. When the mode is "selection" the sets are empty and no
  // row lights up, which is the default.
  const sharedHighlight = useSharedNodeHighlight()
  const isPrimaryShared = !isSelected && sharedHighlight.primary.has(node.id)
  const isSecondaryShared =
    !isSelected && !isPrimaryShared && sharedHighlight.secondary.has(node.id)

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

  const icon = createToggleIcon()
  const buttonIconic = createToggleButton()
  const icon2: IconProps = { icon: getComponentTypeIcon(node) }

  // Show Node Types debug tint by node type. NodeController applies it onto the
  // icon and label refs only, so borders, buttons, and the disclosure arrow are
  // unaffected.
  const nodeTypeColor = getNodeTypeColor(node, showNodeTypes)

  const actions = useRowNodeActions({
    node,
    workspace,
    dispatch,
    isSelected,
    isEcho,
  })

  const {
    displayOptionGroups,
    displayValue,
    selectDisplay,
    resolveDisplayOptionIcon,
    displayIcon,
    isDimmed,
    dimStyle,
    labelDecorationStyle,
  } = useRowNodeDisplay({
    node,
    workspace,
    dispatch,
    properties,
    nodeExistsInWorkspace,
    isEcho,
  })

  const label: TextLabelProps = {
    children: getNodeLabel(node, workspace, {
      showNodeIds,
      showCodeNames,
      nodeExistsInWorkspace,
      properties,
    }),
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
    label,
    buttonIconic,
    icon,
    icon2,
    actions,
    displayOptionGroups,
    displayValue,
    selectDisplay,
    resolveDisplayOptionIcon,
    displayIcon,
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
    isDimmed,
    dimStyle,
    labelDecorationStyle,
    isDuplicateLabel,
    nodeTypeColor,
    isPrimaryShared,
    isSecondaryShared,
    dataNodeType: typeCheckingService.getEntityType(node),
  }
}
