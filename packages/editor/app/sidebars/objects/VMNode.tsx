import { memo } from "react"
import type { EntryNode } from "@seldon/core/workspace/types"
import { useRowHighlightStyle } from "@lib/workspace/hooks/use-object-hover"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { useSidebarCanvasTracking } from "../../tracking/hooks/use-sidebar-canvas-tracking"
import { useSidebarRowStyling } from "../../tracking/hooks/use-sidebar-row-styling"
import { IndentationLevel } from "../hooks/use-indentation"
import { useRowNode } from "./hooks/use-row-node"
import { getNode } from "@lib/workspace/workspace-accessors"
import { RowSelectionTarget } from "./RowSelectionTarget"
import { ItemNodeRow } from "@seldon/components/elements/ItemNodeRow"
import { IconProps } from "@seldon/components/primitives/Icon"
import { TextLabelProps } from "@seldon/components/primitives/TextLabel"
import { SidebarTracking } from "../../tracking/SidebarTracking"
import { applyTrackingColor } from "../helpers/apply-tracking-color"
import { rowWrapperStyle } from "../helpers/sidebar-row-styles"
import { useInlineRename } from "../hooks/use-inline-rename"
import { FramerExpandable } from "@seldon/components/custom-components"
import { useRowActionsMenu } from "../shared/use-row-actions-menu"

const NODE_SELECTION_KIND = "node"

interface VMNodeProps {
  nodeId: string
  /**
   * Node-id path of this copy, from the variant-root down to this row, joined
   * by "/". Threaded so selection resolves the clicked copy of a child id that
   * is shared across variant columns.
   */
  rootId: string
  show?: boolean
  parentIsSelected?: boolean
  disableReordering?: boolean
}

const VMNodeInner = function VMNodeInner({
  node,
  rootId,
  show,
  parentIsSelected,
  disableReordering,
}: {
  node: EntryNode
  rootId: string
  show: boolean
  parentIsSelected: boolean
  disableReordering: boolean
}) {
  const {
    label: baseLabel,
    buttonIconic,
    icon,
    icon2,
    actions,
    onClick,
    onDoubleClick,
    isExpanded,
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
    dataNodeType,
  } = useRowNode(node, {
    rootId,
    show,
    parentIsSelected,
    disableReordering,
  })

  const { rowStyle, iconColor, labelColor } = useSidebarRowStyling(node, {
    isSelected,
  })
  const hoverStyle = useRowHighlightStyle(node.id, isSelected, rootId)
  const combinedRowStyle = { ...hoverStyle, ...rowStyle }

  const actionsMenu = useRowActionsMenu(actions, {
    color: iconColor,
    focusTargetRef: ref,
  })

  const { handleCanvasTrackingEnter, handleCanvasTrackingLeave } =
    useSidebarCanvasTracking(node)

  const coloredIcon = hasChildren
    ? applyTrackingColor(icon, "color", iconColor)
    : icon
  const coloredIcon2 = applyTrackingColor(icon2, "color", iconColor)

  const { labelChildren: renameLabel } = useInlineRename({
    label: String(baseLabel.children),
    isEditing: isEditingName,
    setEditing: setEditingName,
    onSubmit: setNodeLabel,
  })

  const labelChildren = isEditingName ? renameLabel : baseLabel.children

  const textLabel: TextLabelProps = {
    ...baseLabel,
    children: labelChildren,
    style: {
      ...baseLabel.style,
      ...(labelColor ? { color: labelColor } : {}),
    },
  } as TextLabelProps

  const dataTestId = `object-panel-node-${node.id}`
  const dataNodeId = node.id
  const dataDisplay =
    properties && "display" in properties
      ? properties.display?.value
      : undefined

  const childrenSection = hasChildren ? (
    <FramerExpandable isExpanded={isExpanded}>
      <IndentationLevel>
        {children.map((childNodeId) => (
          <VMNode
            key={childNodeId}
            nodeId={childNodeId}
            rootId={`${rootId}/${childNodeId}`}
            show={show}
            parentIsSelected={isSelected}
          />
        ))}
      </IndentationLevel>
    </FramerExpandable>
  ) : null

  return (
    <>
      <RowSelectionTarget
        ref={ref}
        style={rowWrapperStyle}
        selectionId={node.id}
        selectionKind={NODE_SELECTION_KIND}
        selectionRootId={rootId}
      >
        <SidebarTracking
          node={node}
          isExpanded={isExpanded}
          onRowClick={onClick}
          onRowDoubleClick={onDoubleClick}
          onCanvasTrackingEnter={handleCanvasTrackingEnter}
          onCanvasTrackingLeave={handleCanvasTrackingLeave}
        >
          <ItemNodeRow
            buttonIconic={buttonIconic}
            icon={coloredIcon as IconProps}
            icon2={coloredIcon2 as IconProps}
            textLabel={textLabel}
            buttonIconic2={null}
            icon3={null}
            buttonIconic3={actionsMenu.buttonIconic}
            icon4={actionsMenu.icon}
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
      </RowSelectionTarget>
      {actionsMenu.menu}

      {childrenSection}
    </>
  )
}

export const VMNode = memo(function VMNode({
  nodeId,
  rootId,
  show = true,
  parentIsSelected = false,
  disableReordering = false,
}: VMNodeProps) {
  const { workspace } = useWorkspace({ usePreview: false })
  const node = getNode(workspace, nodeId)

  if (!node) return null

  return (
    <VMNodeInner
      node={node}
      rootId={rootId}
      show={show}
      parentIsSelected={parentIsSelected}
      disableReordering={disableReordering}
    />
  )
})
