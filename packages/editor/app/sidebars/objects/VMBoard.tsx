import { useRowActionsMenu } from "@lib/menus/use-row-actions-menu"
import {
  buildActivatedRefProps,
  buildFieldStateProps,
  mergeStateProps,
} from "@lib/views/state-props"
import { memo, useCallback, useRef } from "react"
import { Board as BoardType } from "@seldon/core"
import { useSidebarCanvasTrackingBoard } from "../../tracking/hooks/use-sidebar-canvas-tracking"
import { IndentationLevel } from "../hooks/use-indentation"
import { useRenameInput } from "../hooks/use-rename-input"
import { useRowBoard } from "./hooks/use-row-board"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { FramerExpandable } from "@seldon/components/custom-components"
import { ItemNode } from "@seldon/components/elements/ItemNode"
import { RowSelectionTarget } from "./RowSelectionTarget"
import { VMNode } from "./VMNode"
import { VMResourceEntry } from "./VMResourceEntry"
import { getBoardResourceRowConfig } from "./helpers/resource-row-config"

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
  const seldonRefs = { nodeLabel: { value: label, readOnly: true } }
  return (
    <ItemNode
      buttonIconic={null}
      comboboxField={{}}
      icon2={null}
      buttonIconic2={null}
      seldonRefs={seldonRefs}
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
    isBoardSelected,
    boardIsActive,
    variants,
  } = useRowBoard(board, { show })

  // A child node or resource is selected under this board, but the board itself
  // is not the direct selection. The row shows the subtler activated state
  // instead of the full selected field highlight.
  const isActivated = boardIsActive && !isBoardSelected

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
    : variants.map((variantId, index) => {
        const disableReordering = index === 0
        return (
          <VMNode
            key={variantId}
            nodeId={variantId}
            rootId={variantId}
            show={show}
            parentIsSelected={boardIsActive}
            disableReordering={disableReordering}
          />
        )
      })

  if (!show) return null

  // The toggle chevron rotates 90° when the board is expanded. Color, hover, and
  // selection tints come from the generated component CSS.
  const toggleIcon = {
    ...icon,
    style: {
      transition: "transform 0.2s ease",
      ...(isExpanded ? { transform: "rotate(90deg)" } : {}),
    },
  }

  // Activated tints the field leaves (icon, label) without the selected field
  // border, so a board with the selection inside it reads as activated.
  const activatedRef = buildActivatedRefProps(isActivated)

  // Drive every slot through its stable workspace ref. The trailing actions icon
  // has no ref; it keeps the generated `seldon-more` default and is hidden by the
  // actions button placeholder (visibility cascades), so it needs none.
  const seldonRefs = {
    nodeToggle: { ...buttonIconic },
    nodeToggleIcon: { ...toggleIcon },
    nodeIcon: mergeStateProps(icon2, activatedRef),
    nodeLabel: mergeStateProps(nameInput, activatedRef),
    nodeActions: { ...actionsMenu.buttonIconic },
  }

  // Selected (direct board click) is styled on the combobox-field child via the
  // field cascade. Containing the selection uses activated instead.
  const comboboxField = buildFieldStateProps({ selected: isBoardSelected })

  // Root-level row state mirrors selection for selectors and tests.
  const itemNodeState = {
    "aria-selected": isBoardSelected || undefined,
    "data-activated": isActivated || undefined,
  }

  return (
    <>
      <RowSelectionTarget
        ref={rowRef}
        selectionId={boardKey}
        selectionKind={BOARD_SELECTION_KIND}
      >
        <ItemNode
          buttonIconic={{}}
          comboboxField={comboboxField}
          seldonRefs={seldonRefs}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          onMouseEnter={handleRowMouseEnter}
          onMouseLeave={handleRowMouseLeave}
          {...itemNodeState}
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
