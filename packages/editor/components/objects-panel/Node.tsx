import { clipText } from "@lib/utils/clip-text"
import { removeNewLines } from "@lib/utils/new-lines"
import { InstanceId, VariantId } from "@seldon/core"
import { IconId, iconLabels } from "@seldon/core/components/icons"
import { isEmptyValue } from "@seldon/core/helpers/type-guards/value/is-empty-value"
import { rules } from "@seldon/core/rules/config/rules.config"
import { getNodeProperties } from "@seldon/core/workspace/helpers/get-node-properties"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { useDebugMode } from "@lib/hooks/use-debug-mode"
import { useTool } from "@lib/hooks/use-tool"
import { useDragAndDropDraggable } from "./hooks/use-drag-and-drop-draggable"
import { useNodeIcon } from "./hooks/use-node-icon"
import { useObjectExpansion } from "./hooks/use-object-expansion"
import { useObjectsPanelShortcuts } from "./hooks/use-objects-panel-shortcuts"
import { useSelection } from "@lib/workspace/use-selection"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { LabelInput } from "../ui/LabelInput"
import { Item } from "./Item"
import { Overlay } from "./Overlay"
import { IndentationLevel } from "./contexts/indentation-context"

export function Node({
  show = true,
  nodeId,
  onSelect,
  parentIsSelected,
  disableReordering = false,
}: {
  show?: boolean
  nodeId: VariantId | InstanceId
  onSelect?: () => void
  parentIsSelected?: boolean
  labelPrefix?: string
  disableReordering?: boolean
}) {
  const { workspace, dispatch } = useWorkspace({ usePreview: false })
  const { activeTool } = useTool()
  const node = workspace.byId[nodeId]
  const properties = getNodeProperties(node, workspace)
  const { toggle, isObjectExpanded } = useObjectExpansion()
  const { selectNode, selectedNodeId } = useSelection()
  const { isEditingName, setEditingName } = useObjectsPanelShortcuts(node)
  const selectedNodeIsWithin = selectedNodeId
    ? workspaceService.isParentOfNode(nodeId, selectedNodeId, workspace)
    : false
  const isSelected = selectedNodeId === node.id
  const parentOfSelectedNode = selectedNodeId
    ? workspaceService.findParentNode(selectedNodeId, workspace)
    : null
  const isParentOfSelectedNode = parentOfSelectedNode?.id === node.id
  const { debugModeEnabled } = useDebugMode()
  const children = "children" in node && node.children ? node.children : []
  const hasChildren = children.length > 0
  const icon = useNodeIcon(node)
  const isExpanded = isObjectExpanded(nodeId)

  const { dragging, ref } = useDragAndDropDraggable({
    enable: show && !isEditingName,
    target: node,
    onDragStart: () => toggle(nodeId, false),
  })

  function onToggle() {
    if (hasChildren) {
      toggle(nodeId, !isExpanded)
    }
  }

  function onClick() {
    if (activeTool === "select") {
      selectNode(node.id)
    }
  }

  const nodeState = isSelected
    ? "selected"
    : activeTool === "select"
      ? "default"
      : "static"
  const isDraggable = !disableReordering && activeTool === "select"

  const overlay = isEditingName ? null : (
    <Overlay isExpanded={isExpanded} node={node} />
  )

  if (!show) return null

  return (
    <>
      <style>
        {`
          .objects-sidebar-node[data-dragging="true"] {
            opacity: 0.6;
          }

          .objects-sidebar-node[data-display="exclude"] {
            opacity: 0.6;
            text-decoration: line-through;
          }

          .objects-sidebar-node[data-display="exclude"] {
            opacity: 0.6;
            text-decoration: line-through;
          }

          .objects-sidebar-node[data-display="hide"] {
            opacity: 0.6;
          }

          .objects-sidebar-node[data-active="true"] {
            color: rgb(63 181 255 / 1);
          }
        }
        `}
      </style>
      <Item
        ref={ref}
        key={node.id}
        state={nodeState}
        draggable={isDraggable}
        icon={icon}
        expandable={hasChildren}
        isExpanded={isExpanded}
        onToggle={onToggle}
        overlay={overlay}
        layoutId={`object-panel-item-${node.id}`}
        data-nodeid={node.id}
        data-node-type={workspaceService.getEntityType(node)}
        data-dragging={dragging}
        data-display={properties.display?.value}
        data-active={
          parentIsSelected || isParentOfSelectedNode || selectedNodeIsWithin
        }
        data-testid={`object-panel-node-${node.id}`}
        onClick={onClick}
        onDoubleClick={handleDoubleClick}
        className="objects-sidebar-node" // TODO: Remove once states are working
      >
        {isEditingName ? (
          <LabelInput
            initialValue={node.label}
            onSubmit={(newLabel) => {
              dispatch({
                type: "set_node_label",
                payload: {
                  nodeId: node.id as VariantId,
                  label: newLabel.trim(),
                },
              })

              setEditingName(false)
            }}
          />
        ) : (
          getNodeLabel()
        )}
      </Item>

      {hasChildren && isExpanded && (
        <IndentationLevel>
          {children.map((childNodeId) => (
            <Node
              key={childNodeId}
              nodeId={childNodeId}
              show={show}
              parentIsSelected={isSelected}
              onSelect={() => {
                onSelect?.()
              }}
            />
          ))}
        </IndentationLevel>
      )}
    </>
  )

  /**
   * Handle double click on the node
   * - If the node is editable, set it to editing mode
   * - If the node is an instance, select its variant
   */
  function handleDoubleClick() {
    const entityType = workspaceService.getEntityType(node)
    if (rules.mutations.rename[entityType].allowed) {
      setEditingName(true)
    } else if (workspaceService.isInstance(node)) {
      selectNode(node.variant)
    }
  }

  /**
   * Determine the label to show in the list item depending on the node type and properties
   * @returns Label to show in the list item
   */
  function getNodeLabel() {
    if (debugModeEnabled) {
      return `ID: ${node.id} / REF: ${"instanceOf" in node && node.instanceOf ? node.instanceOf : "-"}`
    }

    // Text instances should use their contents for the default label
    if (
      workspaceService.isInstance(node) &&
      properties.content &&
      !isEmptyValue(properties.content)
    ) {
      return clipText(removeNewLines(properties.content.value))
    }

    // Icon components should use their icon name for the default label
    if (
      workspaceService.isInstance(node) &&
      properties.symbol &&
      !isEmptyValue(properties.symbol) &&
      iconLabels[properties.symbol.value as IconId]
    ) {
      return clipText(iconLabels[properties.symbol.value as IconId])
    }

    return node.label
  }
}
