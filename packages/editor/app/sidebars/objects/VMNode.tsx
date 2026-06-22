import { COLORS } from "@lib/helpers/colors"
import { type CSSProperties, type ReactElement, memo } from "react"
import { MAX_REPEAT_COUNT, resolveNodeRepeat } from "@seldon/core"
import type { EntryNode } from "@seldon/core/workspace/types"
import { useRowHighlightStyle } from "@lib/workspace/hooks/use-object-hover"
import { useIsNodeSelected } from "@lib/workspace/hooks/use-selection"
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

/**
 * Selected-echo border. Recolors the row's existing border without touching its
 * width, so no pixel shift occurs. Sides take the selection color; the top is
 * colored only on the first echo when index 0 is open, the bottom only on the
 * last echo. Corners are squared wherever the bracket does not close, so the
 * stacked rows read as one box.
 */
function echoSelectedBorder(
  isFirst: boolean,
  isLast: boolean,
  isExpanded: boolean,
): CSSProperties {
  const color = COLORS.primary[500]
  const showTop = isFirst && isExpanded
  return {
    borderStyle: "dashed",
    borderLeftColor: color,
    borderRightColor: color,
    borderTopColor: showTop ? color : "transparent",
    borderBottomColor: isLast ? color : "transparent",
    ...(showTop ? {} : { borderTopLeftRadius: 0, borderTopRightRadius: 0 }),
    ...(isLast
      ? {}
      : { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }),
  }
}

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
  /** First row of the echo cluster. */
  isFirstEcho?: boolean
  /** Last row of the echo cluster. */
  isLastEcho?: boolean
}

/** Summary row standing in for echo rows beyond {@link ECHO_ROW_LIMIT}. */
function RepeatEchoSummaryRow({
  nodeId,
  count,
}: {
  nodeId: string
  count: number
}) {
  const isSelected = useIsNodeSelected(nodeId)
  return (
    <div
      style={{
        padding: "2px 8px",
        fontStyle: "italic",
        opacity: 0.6,
        fontSize: 12,
        border: "var(--hairline) solid transparent",
        borderRadius: "var(--sdn-corners-tight)",
        ...(isSelected ? echoSelectedBorder(false, true, false) : {}),
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
  isFirstEcho,
  isLastEcho,
}: {
  node: EntryNode
  rootId: string
  show: boolean
  parentIsSelected: boolean
  disableReordering: boolean
  isEcho: boolean
  isFirstEcho: boolean
  isLastEcho: boolean
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

  // Echoes share index 0's node id, so they read as selected with it. They show
  // the dashed bracket instead of the solid selected box.
  const rowSelected = isEcho ? false : isSelected
  const { rowStyle, iconColor, labelColor } = useSidebarRowStyling(node, {
    isSelected: rowSelected,
  })
  const hoverStyle = useRowHighlightStyle(node.id, rowSelected, rootId)
  const echoBorder =
    isEcho && isSelected
      ? echoSelectedBorder(isFirstEcho, isLastEcho, isExpanded)
      : undefined
  const combinedRowStyle = { ...hoverStyle, ...rowStyle, ...echoBorder }

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

  // Expand a repeated child into its index-0 row plus stripped echo rows.
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
    const repeat = childNode
      ? resolveNodeRepeat(childNodeId, workspace)
      : undefined
    if (!repeat || repeat.count <= 1) return [indexZeroRow]

    const total = Math.min(repeat.count, MAX_REPEAT_COUNT)
    const echoCount = total - 1
    const shownEchoes = Math.min(echoCount, ECHO_ROW_LIMIT)

    const hasSummary = echoCount > shownEchoes
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
          isFirstEcho={echoIndex === 1}
          isLastEcho={!hasSummary && echoIndex === shownEchoes}
        />,
      )
    }
    if (hasSummary) {
      rows.push(
        <RepeatEchoSummaryRow
          key={`${childNodeId}#more`}
          nodeId={childNodeId}
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
  isFirstEcho = false,
  isLastEcho = false,
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
      isFirstEcho={isFirstEcho}
      isLastEcho={isLastEcho}
    />
  )
})
