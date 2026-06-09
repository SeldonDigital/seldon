import { CSSProperties, memo, useCallback } from "react"
import { Board as BoardType, Variant } from "@seldon/core"
import { useRowHighlightStyle } from "@lib/workspace/hooks/use-object-hover"
import { useSidebarCanvasTrackingBoard } from "../../tracking/hooks/use-sidebar-canvas-tracking"
import { useSidebarRowStyling } from "../../tracking/hooks/use-sidebar-row-styling"
import { IndentationLevel } from "../hooks/use-indentation"
import { useRowBoard } from "./hooks/use-row-board"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { SidebarRow } from "@seldon/components/custom-components"
import { ListItemTreeNode as SeldonNode } from "@seldon/components/elements/ListItemTreeNode"
import { LabelProps } from "@seldon/components/primitives/Label"
import { relativeFullWidthStyle } from "../helpers/sidebar-styles"
import { FramerExpandable } from "../shared/FramerExpandable"
import { RowNode } from "./RowNode"
import { RowResourceEntry, getBoardResourceRowConfig } from "./RowResourceEntry"

const rowWrapperStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
}

const BOARD_SELECTION_KIND = "board"

interface RowBoardProps {
  board: BoardType
  show?: boolean
  disableReordering?: boolean
}

/**
 * Renders a board row in the objects sidebar.
 * Handles board selection, expansion, and canvas tracking. Hover highlight comes
 * from the shared hover bridge via the tree-root controller.
 */
export const RowBoard = memo(function RowBoard({
  board,
  show = true,
  disableReordering = false,
}: RowBoardProps) {
  // Core board data: buttons, icons, handlers, state
  const {
    label: baseLabel,
    buttonIconic,
    icon,
    buttonIconic2,
    icon2,
    buttonIconic3,
    icon3,
    onClick,
    isExpanded,
    isBoardSelected,
    boardIsActive,
    boardContainsSelectedNode,
    boardContainsSelectedResourceEntry,
    dragging,
    ref,
    variants,
  } = useRowBoard(board, { show, disableReordering })

  // Styling: row colors, icon colors, hover effects
  const boardKey = getComponentKey(board)
  const hoverStyle = useRowHighlightStyle(boardKey, isBoardSelected)
  const { rowStyle, iconColor, labelColor } = useSidebarRowStyling(
    board as unknown as Variant,
    { isSelected: boardIsActive },
  )
  const combinedRowStyle =
    (boardContainsSelectedNode || boardContainsSelectedResourceEntry) &&
    !isBoardSelected
      ? { ...hoverStyle, ...rowStyle, borderColor: undefined }
      : { ...hoverStyle, ...rowStyle }

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

  // Apply tracking colors: icons get color
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

  const coloredIcon = applyTrackingColor(icon, "color")
  const coloredIcon2 = applyTrackingColor(icon2, "color")
  const coloredIcon3 = applyTrackingColor(icon3, "color")
  const coloredButtonIconic3 = buttonIconic3

  // Label: apply tracking color if provided
  const label: LabelProps = {
    ...baseLabel,
    style: {
      ...("style" in baseLabel && baseLabel.style ? baseLabel.style : {}),
      ...(labelColor ? { color: labelColor } : {}),
    },
  }

  // Data attributes
  const dataTestId = "objects-sidebar-board"
  const dataComponentId = boardKey

  const resourceRowConfig = getBoardResourceRowConfig(board)
  const childRows = resourceRowConfig
    ? variants.map((entryId) => (
        <RowResourceEntry
          key={entryId}
          config={resourceRowConfig}
          entryId={entryId}
          show={show}
          parentIsSelected={boardIsActive}
        />
      ))
    : variants.map((variantId, index) => (
        <RowNode
          key={variantId}
          nodeId={variantId}
          rootId={variantId}
          show={show}
          parentIsSelected={boardIsActive}
          disableReordering={index === 0}
        />
      ))

  if (!show) return null

  return (
    <>
      <SidebarRow
        ref={ref}
        style={rowWrapperStyle}
        innerStyle={relativeFullWidthStyle}
        selectionId={boardKey}
        selectionKind={BOARD_SELECTION_KIND}
      >
        <SeldonNode
          buttonIconic={buttonIconic}
          icon={coloredIcon}
          buttonIconic2={buttonIconic2}
          icon2={coloredIcon2}
          label={label}
          buttonIconic3={coloredButtonIconic3}
          icon3={coloredIcon3}
          onClick={onClick}
          onMouseEnter={handleRowMouseEnter}
          onMouseLeave={handleRowMouseLeave}
          data-testid={dataTestId}
          data-componentid={dataComponentId}
          data-dragging={dragging}
          data-active={boardIsActive}
          style={combinedRowStyle}
        />
      </SidebarRow>

      <FramerExpandable isExpanded={isExpanded}>
        <IndentationLevel>{childRows}</IndentationLevel>
      </FramerExpandable>
    </>
  )
})
