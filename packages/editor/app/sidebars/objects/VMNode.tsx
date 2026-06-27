import { type ReactElement, memo } from "react"
import { MAX_REPEAT_COUNT, resolveNodeRepeat } from "@seldon/core"
import type { EntryNode } from "@seldon/core/workspace/types"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { useSidebarCanvasTracking } from "../../tracking/hooks/use-sidebar-canvas-tracking"
import { IndentationLevel } from "../hooks/use-indentation"
import { useRenameInput } from "../hooks/use-rename-input"
import { useRowNode } from "./hooks/use-row-node"
import { getNode } from "@lib/workspace/workspace-accessors"
import { FramerExpandable } from "@seldon/components/custom-components"
import { ItemNode } from "@seldon/components/elements/ItemNode"
import { SidebarTracking } from "../../tracking/SidebarTracking"
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
  /** First row of the echo cluster. */
  isFirstEcho?: boolean
  /** Last row of the echo cluster. */
  isLastEcho?: boolean
}

/** Summary row standing in for echo rows beyond {@link ECHO_ROW_LIMIT}. */
function RepeatEchoSummaryRow({ count }: { count: number }) {
  return <div>+{count} more</div>
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

  const actionsMenu = useRowActionsMenu(actions, {
    focusTargetRef: ref,
  })

  const { handleCanvasTrackingEnter, handleCanvasTrackingLeave } =
    useSidebarCanvasTracking(node)

  const nameInput = useRenameInput({
    label: String(baseLabel.children),
    isEditing: isEditingName,
    setEditing: setEditingName,
    onSubmit: setNodeLabel,
  })

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

  // The nodeToggle chevron rotates 90° when the row is expanded. Leaf rows have
  // no children to disclose, so the chevron is hidden. Color, hover, and
  // selection tints come from the generated component CSS.
  const toggleIcon = {
    ...icon,
    style: {
      transition: "transform 0.2s ease",
      ...(hasChildren
        ? isExpanded
          ? { transform: "rotate(90deg)" }
          : {}
        : { opacity: 0 }),
    },
  }

  // Drive every slot through its stable workspace ref. The trailing actions icon
  // has no ref; it stays on the generated `seldon-more` default and is hidden by
  // the actions button placeholder (visibility cascades), so it needs none.
  const seldonRefs = {
    nodeToggle: { ...buttonIconic },
    nodeToggleIcon: { ...toggleIcon },
    nodeIcon: { ...icon2 },
    nodeLabel: { ...nameInput },
    nodeActions: { ...actionsMenu.buttonIconic },
  }

  return (
    <>
      <RowSelectionTarget
        ref={ref}
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
          <ItemNode
            buttonIconic={{}}
            comboboxField={{}}
            seldonRefs={seldonRefs}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            onMouseEnter={handleCanvasTrackingEnter}
            onMouseLeave={handleCanvasTrackingLeave}
            aria-selected={isSelected || undefined}
            data-testid={dataTestId}
            data-nodeid={dataNodeId}
            data-node-type={dataNodeType}
            data-display={dataDisplay}
            data-dragging={dragging}
            data-active={isNodeActive}
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
