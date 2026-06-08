import { CSSProperties, memo, useCallback } from "react"
import { Board as BoardType, Variant } from "@seldon/core"
import {
  isFontCollectionBoard,
  isIconSetBoard,
  isMediaBoard,
  isThemeBoard,
} from "@seldon/core/workspace/model/components"
import { useSidebarCanvasTrackingBoard } from "../../tracking/hooks/use-sidebar-canvas-tracking"
import { useSidebarRowStyling } from "../../tracking/hooks/use-sidebar-row-styling"
import { useRowHighlightStyle } from "@lib/workspace/hooks/use-object-hover"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { useRowBoard } from "./hooks/use-row-board"
import { ListItemTreeNode as SeldonNode } from "@seldon/components/elements/ListItemTreeNode"
import { LabelProps } from "@seldon/components/primitives/Label"
import { relativeFullWidthStyle } from "../helpers/sidebar-styles"
import { IndentationLevel } from "../hooks/use-indentation"
import { FramerExpandable } from "../shared/FramerExpandable"
import { RowNode } from "./RowNode"
import { RESOURCE_ROW_CONFIG, RowResourceEntry } from "./RowResourceEntry"

const rowWrapperStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
}

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

  if (!show) return null

  return (
    <>
      <div
        ref={ref}
        style={rowWrapperStyle}
        data-selection-id={boardKey}
        data-selection-kind="board"
      >
        <div style={relativeFullWidthStyle}>
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
        </div>
      </div>

      <FramerExpandable isExpanded={isExpanded}>
        <IndentationLevel>
          {isThemeBoard(board)
            ? variants.map((entryId) => (
                <RowResourceEntry
                  key={entryId}
                  config={RESOURCE_ROW_CONFIG.theme}
                  entryId={entryId}
                  show={show}
                  parentIsSelected={boardIsActive}
                />
              ))
            : isFontCollectionBoard(board)
              ? variants.map((entryId) => (
                  <RowResourceEntry
                    key={entryId}
                    config={RESOURCE_ROW_CONFIG.fontCollection}
                    entryId={entryId}
                    show={show}
                    parentIsSelected={boardIsActive}
                  />
                ))
              : isIconSetBoard(board)
                ? variants.map((entryId) => (
                    <RowResourceEntry
                      key={entryId}
                      config={RESOURCE_ROW_CONFIG.iconSet}
                      entryId={entryId}
                      show={show}
                      parentIsSelected={boardIsActive}
                    />
                  ))
                : isMediaBoard(board)
                  ? variants.map((entryId) => (
                      <RowResourceEntry
                        key={entryId}
                        config={RESOURCE_ROW_CONFIG.media}
                        entryId={entryId}
                        show={show}
                        parentIsSelected={boardIsActive}
                      />
                    ))
                  : variants.map((variantId, index) => (
                      <RowNode
                        key={variantId}
                        nodeId={variantId}
                        show={show}
                        parentIsSelected={boardIsActive}
                        disableReordering={index === 0}
                      />
                    ))}
        </IndentationLevel>
      </FramerExpandable>
    </>
  )
})
