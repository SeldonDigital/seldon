import { memo, useCallback, useRef } from "react"
import { Board as BoardType } from "@seldon/core"
import { useSidebarCanvasTrackingBoard } from "../../tracking/hooks/use-sidebar-canvas-tracking"
import { IndentationLevel } from "../hooks/use-indentation"
import { useRenameInput } from "../hooks/use-rename-input"
import { useRowBoard } from "./hooks/use-row-board"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { FramerExpandable } from "@seldon/components/custom-components"
import { ItemNode } from "@seldon/components/elements/ItemNode"
import { IconProps } from "@seldon/components/primitives/Icon"
import { withoutStyle } from "../helpers/without-style"
import { useRowActionsMenu } from "../shared/use-row-actions-menu"
import { RowSelectionTarget } from "./RowSelectionTarget"
import { VMNode } from "./VMNode"
import { VMResourceEntry, getBoardResourceRowConfig } from "./VMResourceEntry"

const BOARD_SELECTION_KIND = "board"

type VMBoardProps =
  | { board: BoardType; show?: boolean }
  | { emptyLabel: string }

/**
 * View-model for a board row in the objects sidebar.
 * Renders a real board row, or an inert placeholder row when `emptyLabel` is
 * passed for a section with no boards. Branches before any board hooks run so
 * the empty case never needs board data.
 */
export const VMBoard = memo(function VMBoard(props: VMBoardProps) {
  if ("emptyLabel" in props) {
    return <VMBoardEmpty label={props.emptyLabel} />
  }
  return <VMBoardRow board={props.board} show={props.show} />
})

/**
 * Inert placeholder row shown when a section has no boards. Mirrors a board row
 * shell with all slots empty, so it reads as a disabled "No <section>" line.
 */
function VMBoardEmpty({ label }: { label: string }) {
  return (
    <ItemNode
      buttonIconic={null}
      comboboxField={{}}
      icon2={null}
      input={{ value: label, readOnly: true }}
      buttonIconic2={null}
      aria-disabled
      data-testid="objects-sidebar-empty-section"
    />
  )
}

/**
 * View-model for a board row in the objects sidebar.
 * Handles board selection, expansion, and canvas tracking. Hover highlight comes
 * from the shared hover bridge via the tree-root controller.
 */
function VMBoardRow({
  board,
  show = true,
}: {
  board: BoardType
  show?: boolean
}) {
  // Core board data: buttons, icons, handlers, state
  const {
    label: baseLabel,
    buttonIconic,
    icon,
    icon2,
    actions,
    onClick,
    onDoubleClick,
    isEditingName,
    setEditingName,
    setPlaygroundLabel,
    isExpanded,
    boardIsActive,
    variants,
  } = useRowBoard(board, { show })

  const boardKey = getComponentKey(board)

  // Trailing "..." actions menu for the board row.
  const rowRef = useRef<HTMLDivElement>(null)
  const actionsMenu = useRowActionsMenu(actions, {
    focusTargetRef: rowRef,
  })

  // Canvas tracking: highlights board on canvas when hovering sidebar row
  const { handleCanvasTrackingEnter, handleCanvasTrackingLeave } =
    useSidebarCanvasTrackingBoard(board)

  // Event handlers: canvas insertion tracking only; hover highlight is driven
  // centrally by the tree-root controller via the shared hover bridge.
  const handleRowMouseEnter = useCallback(() => {
    if (!boardIsActive) {
      handleCanvasTrackingEnter()
    }
  }, [boardIsActive, handleCanvasTrackingEnter])

  const handleRowMouseLeave = useCallback(() => {
    handleCanvasTrackingLeave()
  }, [handleCanvasTrackingLeave])

  const nameInput = useRenameInput({
    label: String(baseLabel.children),
    isEditing: isEditingName,
    setEditing: setEditingName,
    onSubmit: setPlaygroundLabel,
  })

  // Data attributes
  const dataTestId = "objects-sidebar-board"
  const dataComponentId = boardKey

  const resourceRowConfig = getBoardResourceRowConfig(board)
  const childRows = resourceRowConfig
    ? variants.map((entryId) => (
        <VMResourceEntry
          key={entryId}
          config={resourceRowConfig}
          entryId={entryId}
          show={show}
          parentIsSelected={boardIsActive}
        />
      ))
    : variants.map((variantId, index) => (
        <VMNode
          key={variantId}
          nodeId={variantId}
          rootId={variantId}
          show={show}
          parentIsSelected={boardIsActive}
          disableReordering={index === 0}
        />
      ))

  if (!show) return null

  // Board rows never use dynamic icon-custom-* ids, so the casts to the
  // generated IconProps at the row boundary are safe.
  return (
    <>
      <RowSelectionTarget
        ref={rowRef}
        selectionId={boardKey}
        selectionKind={BOARD_SELECTION_KIND}
      >
        <ItemNode
          buttonIconic={withoutStyle(buttonIconic)}
          icon={withoutStyle(icon) as IconProps}
          comboboxField={{}}
          icon2={withoutStyle(icon2) as IconProps}
          input={nameInput}
          buttonIconic2={withoutStyle(actionsMenu.buttonIconic)}
          icon3={withoutStyle(actionsMenu.icon)}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          onMouseEnter={handleRowMouseEnter}
          onMouseLeave={handleRowMouseLeave}
          data-testid={dataTestId}
          data-componentid={dataComponentId}
          data-active={boardIsActive}
        />
      </RowSelectionTarget>
      {actionsMenu.menu}

      <FramerExpandable isExpanded={isExpanded}>
        <IndentationLevel>{childRows}</IndentationLevel>
      </FramerExpandable>
    </>
  )
}
