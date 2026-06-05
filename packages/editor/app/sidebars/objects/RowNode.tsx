import { CSSProperties, memo } from "react"
import { VariantId } from "@seldon/core"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import type { EntryNode } from "@seldon/core/workspace/types"
import { getNode } from "@lib/workspace/workspace-accessors"
import { useRowHighlightStyle } from "@lib/workspace/hooks/use-object-hover"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { useSidebarCanvasTracking } from "../../tracking/hooks/use-sidebar-canvas-tracking"
import { useSidebarRowStyling } from "../../tracking/hooks/use-sidebar-row-styling"
import { useRowNode } from "./hooks/use-row-node"
import { ListItemTreeNode as SeldonNode } from "../../seldon/elements/ListItemTreeNode"
import { LabelProps } from "../../seldon/primitives/Label"
import { SidebarTracking } from "../../tracking/SidebarTracking"
import { IndentationLevel } from "../hooks/use-indentation"
import { Combobox } from "../properties/controls/combobox/Combobox"
import { FramerExpandable } from "../shared/FramerExpandable"

const rowWrapperStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
}

interface RowNodeProps {
  nodeId: string
  node?: EntryNode
  show?: boolean
  parentIsSelected?: boolean
  disableReordering?: boolean
  onSelect?: () => void
}

const RowNodeInner = memo(function RowNodeInner({
  node,
  show,
  parentIsSelected,
  disableReordering,
  onSelect,
}: {
  node: EntryNode
  show: boolean
  parentIsSelected: boolean
  disableReordering: boolean
  onSelect?: () => void
}) {
  const { dispatch } = useWorkspace({ usePreview: false })
  const {
    label: baseLabel,
    buttonIconic,
    icon,
    buttonIconic2,
    icon2,
    buttonIconic3,
    icon3,
    buttonIconic4,
    icon4,
    onClick,
    onDoubleClick,
    isExpanded,
    isSelected,
    isNodeActive,
    isEditingName,
    setEditingName,
    hasChildren,
    children,
    dragging,
    ref,
    properties,
  } = useRowNode(node, {
    show,
    parentIsSelected,
    disableReordering,
    onSelect,
  })

  const { rowStyle, iconColor, labelColor } = useSidebarRowStyling(node)
  const hoverStyle = useRowHighlightStyle(node.id, isSelected)
  const combinedRowStyle = { ...hoverStyle, ...rowStyle }

  const { handleCanvasTrackingEnter, handleCanvasTrackingLeave } =
    useSidebarCanvasTracking(node)

  const applyTrackingColor = <T extends { style?: React.CSSProperties }>(
    item: T | undefined,
    property: "color" | "borderColor",
  ): T | undefined =>
    iconColor && item
      ? {
          ...item,
          style: { ...item.style, [property]: iconColor },
        }
      : item

  const coloredIcon = hasChildren ? applyTrackingColor(icon, "color") : icon
  const coloredIcon2 = applyTrackingColor(icon2, "color")
  const coloredIcon3 = applyTrackingColor(icon3, "color")
  const coloredIcon4 = applyTrackingColor(icon4, "color")
  const coloredButtonIconic3 = buttonIconic3
  const coloredButtonIconic4 = buttonIconic4

  const label: LabelProps = {
    ...baseLabel,
    children: isEditingName ? (
      <Combobox
        mode="standalone"
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
      baseLabel.children
    ),
    style: {
      ...baseLabel.style,
      ...(labelColor ? { color: labelColor } : {}),
    },
  } as LabelProps

  const dataTestId = `object-panel-node-${node.id}`
  const dataNodeId = node.id
  const dataNodeType = workspaceService.getEntityType(node)
  const dataDisplay =
    properties && "display" in properties
      ? properties.display?.value
      : undefined

  return (
    <>
      <div
        ref={ref}
        style={rowWrapperStyle}
        data-selection-id={node.id}
        data-selection-kind="node"
      >
        <SidebarTracking
          node={node}
          isExpanded={isExpanded}
          onRowClick={onClick}
          onRowDoubleClick={onDoubleClick}
          onCanvasTrackingEnter={handleCanvasTrackingEnter}
          onCanvasTrackingLeave={handleCanvasTrackingLeave}
        >
          <SeldonNode
            buttonIconic={buttonIconic}
            icon={coloredIcon}
            buttonIconic2={buttonIconic2}
            icon2={coloredIcon2}
            label={label}
            buttonIconic3={coloredButtonIconic3}
            icon3={coloredIcon3}
            buttonIconic4={coloredButtonIconic4}
            icon4={coloredIcon4}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            onMouseEnter={handleCanvasTrackingEnter}
            onMouseLeave={handleCanvasTrackingLeave}
            data-testid={dataTestId}
            data-nodeid={dataNodeId}
            data-node-type={dataNodeType}
            data-display={dataDisplay}
            data-dragging={dragging}
            data-active={isNodeActive}
            style={combinedRowStyle}
          />
        </SidebarTracking>
      </div>

      {hasChildren && (
        <FramerExpandable isExpanded={isExpanded}>
          <IndentationLevel>
            {children.map((childNodeId) => (
              <RowNode
                key={childNodeId}
                nodeId={childNodeId}
                show={show}
                parentIsSelected={isSelected}
                onSelect={onSelect}
              />
            ))}
          </IndentationLevel>
        </FramerExpandable>
      )}
    </>
  )
})

export const RowNode = memo(function RowNode({
  nodeId,
  node: nodeProp,
  show = true,
  parentIsSelected = false,
  disableReordering = false,
  onSelect,
}: RowNodeProps) {
  const { workspace } = useWorkspace({ usePreview: false })
  const node = nodeProp ?? getNode(workspace, nodeId)

  if (!node) return null

  return (
    <RowNodeInner
      node={node}
      show={show}
      parentIsSelected={parentIsSelected}
      disableReordering={disableReordering}
      onSelect={onSelect}
    />
  )
})
