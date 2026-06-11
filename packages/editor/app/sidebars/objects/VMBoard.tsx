import { memo, useCallback } from "react"
import { Board as BoardType, Variant } from "@seldon/core"
import { useRowHighlightStyle } from "@lib/workspace/hooks/use-object-hover"
import { useSidebarCanvasTrackingBoard } from "../../tracking/hooks/use-sidebar-canvas-tracking"
import { useSidebarRowStyling } from "../../tracking/hooks/use-sidebar-row-styling"
import { IndentationLevel } from "../hooks/use-indentation"
import { useRowBoard } from "./hooks/use-row-board"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { RowSelectionTarget } from "./RowSelectionTarget"
import { ItemNodeRow } from "@seldon/components/elements/ItemNodeRow"
import { IconProps } from "@seldon/components/primitives/Icon"
import { TextLabelProps } from "@seldon/components/primitives/TextLabel"
import { applyTrackingColor } from "../helpers/apply-tracking-color"
import { rowWrapperStyle } from "../helpers/sidebar-row-styles"
import { relativeFullWidthStyle } from "../helpers/sidebar-styles"
import { FramerExpandable } from "@seldon/components/custom-components"
import { VMNode } from "./VMNode"
import {
  VMResourceEntry,
  getBoardResourceRowConfig,
} from "./VMResourceEntry"

const BOARD_SELECTION_KIND = "board"

interface VMBoardProps {
  board: BoardType
  show?: boolean
}

/**
 * View-model for a board row in the objects sidebar.
 * Handles board selection, expansion, and canvas tracking. Hover highlight comes
 * from the shared hover bridge via the tree-root controller.
 */
export const VMBoard = memo(function VMBoard({
  board,
  show = true,
}: VMBoardProps) {
  // Core board data: buttons, icons, handlers, state
  const {
    label: baseLabel,
    buttonIconic,
    icon,
    icon2,
    buttonIconic2,
    icon3,
    onClick,
    isExpanded,
    isBoardSelected,
    boardIsActive,
    boardContainsSelectedNode,
    boardContainsSelectedResourceEntry,
    variants,
  } = useRowBoard(board, { show })

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
  const coloredIcon = applyTrackingColor(icon, "color", iconColor)
  const coloredIcon2 = applyTrackingColor(icon2, "color", iconColor)
  const coloredIcon3 = applyTrackingColor(icon3, "color", iconColor)

  // Label: apply tracking color if provided
  const textLabel: TextLabelProps = {
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
        style={rowWrapperStyle}
        innerStyle={relativeFullWidthStyle}
        selectionId={boardKey}
        selectionKind={BOARD_SELECTION_KIND}
      >
        <ItemNodeRow
          buttonIconic={buttonIconic}
          icon={coloredIcon as IconProps}
          icon2={coloredIcon2 as IconProps}
          textLabel={textLabel}
          buttonIconic2={buttonIconic2 ?? null}
          icon3={buttonIconic2 ? (coloredIcon3 as IconProps) : null}
          buttonIconic3={null}
          icon4={null}
          onClick={onClick}
          onMouseEnter={handleRowMouseEnter}
          onMouseLeave={handleRowMouseLeave}
          data-testid={dataTestId}
          data-componentid={dataComponentId}
          data-active={boardIsActive}
          style={combinedRowStyle}
        />
      </RowSelectionTarget>

      <FramerExpandable isExpanded={isExpanded}>
        <IndentationLevel>{childRows}</IndentationLevel>
      </FramerExpandable>
    </>
  )
})
