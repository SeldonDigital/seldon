import { CSSProperties, memo } from "react"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
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
import { Combobox } from "../properties/controls/combobox/Combobox"
import { FramerExpandable } from "../shared/FramerExpandable"
import { useRowActionsMenu } from "../shared/use-row-actions-menu"

const rowWrapperStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
}

const NODE_SELECTION_KIND = "node"

interface VMNodeProps {
  nodeId: string
  /**
   * Node-id path of this copy, from the variant-root down to this row, joined
   * by "/". Threaded so selection resolves the clicked copy of a child id that
   * is shared across variant columns.
   */
  rootId: string
  node?: EntryNode
  show?: boolean
  parentIsSelected?: boolean
  disableReordering?: boolean
  onSelect?: () => void
}

const VMNodeInner = memo(function VMNodeInner({
  node,
  rootId,
  show,
  parentIsSelected,
  disableReordering,
  onSelect,
}: {
  node: EntryNode
  rootId: string
  show: boolean
  parentIsSelected: boolean
  disableReordering: boolean
  onSelect?: () => void
}) {
  const {
    label: baseLabel,
    buttonIconic,
    icon,
    icon2,
    resetActions,
    onClick,
    onDoubleClick,
    isExpanded,
    isSelected,
    isNodeActive,
    isEditingName,
    setNodeLabel,
    hasChildren,
    children,
    dragging,
    ref,
    properties,
  } = useRowNode(node, {
    rootId,
    show,
    parentIsSelected,
    disableReordering,
    onSelect,
  })

  const { rowStyle, iconColor, labelColor } = useSidebarRowStyling(node, {
    isSelected,
  })
  const hoverStyle = useRowHighlightStyle(node.id, isSelected, rootId)
  const combinedRowStyle = { ...hoverStyle, ...rowStyle }

  const actionsMenu = useRowActionsMenu(resetActions, { color: iconColor })
  const hasActions = resetActions.length > 0

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

  const labelChildren = isEditingName ? (
    <Combobox
      mode="standalone"
      initialValue={node.label}
      onSubmit={setNodeLabel}
    />
  ) : (
    baseLabel.children
  )

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
  const dataNodeType = workspaceService.getEntityType(node)
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
            onSelect={onSelect}
          />
        ))}
      </IndentationLevel>
    </FramerExpandable>
  ) : null

  // Node rows never use dynamic icon-custom-* ids, so the casts to the
  // generated IconProps at the row boundary are safe.
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
            buttonIconic3={hasActions ? actionsMenu.buttonIconic : null}
            icon4={hasActions ? actionsMenu.icon : null}
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
})

export const VMNode = memo(function VMNode({
  nodeId,
  rootId,
  node: nodeProp,
  show = true,
  parentIsSelected = false,
  disableReordering = false,
  onSelect,
}: VMNodeProps) {
  const { workspace } = useWorkspace({ usePreview: false })
  const node = nodeProp ?? getNode(workspace, nodeId)

  if (!node) return null

  return (
    <VMNodeInner
      node={node}
      rootId={rootId}
      show={show}
      parentIsSelected={parentIsSelected}
      disableReordering={disableReordering}
      onSelect={onSelect}
    />
  )
})
