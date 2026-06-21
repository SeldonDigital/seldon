import { memo, type ReactElement } from "react"
import {
  MAX_REPEAT_COUNT,
  getNodeRepeat,
  isMeaningfulRepeat,
} from "@seldon/core"
import type { EntryNode } from "@seldon/core/workspace/types"
import { useRowHighlightStyle } from "@lib/workspace/hooks/use-object-hover"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { useSidebarCanvasTracking } from "../../tracking/hooks/use-sidebar-canvas-tracking"
import { useSidebarRowStyling } from "../../tracking/hooks/use-sidebar-row-styling"
import { IndentationLevel } from "../hooks/use-indentation"
import { useInlineRename } from "../hooks/use-inline-rename"
import { useRowNode } from "./hooks/use-row-node"
import { getNode } from "@lib/workspace/workspace-accessors"
import { FramerExpandable } from "@seldon/components/custom-components"
import { ItemNodeRow } from "@seldon/components/elements/ItemNodeRow"
import { IconProps } from "@seldon/components/primitives/Icon"
import { TextLabelProps } from "@seldon/components/primitives/TextLabel"
import { SidebarTracking } from "../../tracking/SidebarTracking"
import { applyTrackingColor } from "../helpers/apply-tracking-color"
import { rowWrapperStyle } from "../helpers/sidebar-row-styles"
import { useRowActionsMenu } from "../shared/use-row-actions-menu"
import { RowSelectionTarget } from "./RowSelectionTarget"

const NODE_SELECTION_KIND = "node"

/** Most echo rows to list before collapsing the remainder into a summary row. */
const ECHO_ROW_LIMIT = 6

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
  /**
   * Render this row as a repeat echo: a stripped leaf with an italic label that
   * routes selection to the underlying node (index 0 of the repeat).
   */
  isEcho?: boolean
}

/** Muted summary row standing in for echo rows beyond {@link ECHO_ROW_LIMIT}. */
function RepeatEchoSummaryRow({ count }: { count: number }) {
  return (
    <div
      style={{
        padding: "2px 8px",
        fontStyle: "italic",
        opacity: 0.6,
        fontSize: 12,
      }}
    >
      +{count} more
    </div>
  )
}

const VMNodeInner = function VMNodeInner({
  node,
  rootId,
  show,
  parentIsSelected,
  disableReordering,
  isEcho,
}: {
  node: EntryNode
  rootId: string
  show: boolean
  parentIsSelected: boolean
  disableReordering: boolean
  isEcho: boolean
}) {
  const { workspace } = useWorkspace({ usePreview: false })
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
    isEcho,
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

  // Expand a repeated child into its index-0 row plus stripped echo rows. Echo
  // rows reuse index 0's rootId so selecting one routes to the same node and
  // highlights the same canvas copy.
  function renderChildRows(childNodeId: string): ReactElement[] {
    const childRootId = `${rootId}/${childNodeId}`
    const indexZeroRow = (
      <VMNode
        key={childNodeId}
        nodeId={childNodeId}
        rootId={childRootId}
        show={show}
        parentIsSelected={isSelected}
      />
    )

    const childNode = workspace.nodes[childNodeId]
    const repeat = childNode ? getNodeRepeat(childNode) : undefined
    if (!isMeaningfulRepeat(repeat)) return [indexZeroRow]

    const total = Math.min(repeat.count, MAX_REPEAT_COUNT)
    const echoCount = total - 1
    const shownEchoes = Math.min(echoCount, ECHO_ROW_LIMIT)

    const rows: ReactElement[] = [indexZeroRow]
    for (let echoIndex = 1; echoIndex <= shownEchoes; echoIndex++) {
      rows.push(
        <VMNode
          key={`${childNodeId}#echo${echoIndex}`}
          nodeId={childNodeId}
          rootId={childRootId}
          show={show}
          parentIsSelected={isSelected}
          isEcho
        />,
      )
    }
    if (echoCount > shownEchoes) {
      rows.push(
        <RepeatEchoSummaryRow
          key={`${childNodeId}#more`}
          count={echoCount - shownEchoes}
        />,
      )
    }
    return rows
  }

  const childrenSection = hasChildren ? (
    <FramerExpandable isExpanded={isExpanded}>
      <IndentationLevel>
        {children.flatMap((childNodeId) => renderChildRows(childNodeId))}
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
  isEcho = false,
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
      isEcho={isEcho}
    />
  )
})
