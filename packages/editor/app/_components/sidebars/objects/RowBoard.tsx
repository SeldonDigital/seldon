import { CSSProperties, memo, useCallback } from "react"
import { Board as BoardType, Variant } from "@seldon/core"
import {
  isFontCollectionBoard,
  isIconSetBoard,
  isThemeBoard,
} from "@seldon/core/workspace/model/components"
import { useSidebarCanvasTrackingBoard } from "../../tracking/hooks/use-sidebar-canvas-tracking"
import { useSidebarRowStyling } from "../../tracking/hooks/use-sidebar-row-styling"
import { workspaceFontCollectionService } from "@seldon/core/workspace/services/font-collection/font-collection.service"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { useRowBoard } from "./hooks/use-row-board"
import { useRowHover } from "./hooks/use-row-hover"
import { ListItemTreeNode as SeldonNode } from "../../../seldon/elements/ListItemTreeNode"
import { LabelProps } from "../../../seldon/primitives/Label"
import { relativeFullWidthStyle } from "../helpers/sidebar-styles"
import { IndentationLevel } from "../helpers/use-indentation"
import { FramerExpandable } from "../shared/FramerExpandable"
import { RowFontFamilyEntry } from "./RowFontFamilyEntry"
import { RowIconSetEntry } from "./RowIconSetEntry"
import { RowNode } from "./RowNode"
import { RowThemeEntry } from "./RowThemeEntry"

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
 * Handles board selection, expansion, and canvas tracking.
 * Uses useRowHover for hover background (boards don't use tracking system styling).
 */
export const RowBoard = memo(function RowBoard({
  board,
  show = true,
  disableReordering = false,
}: RowBoardProps) {
  const { workspace } = useWorkspace({ usePreview: false })

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
    boardContainsSelectedThemeEntry,
    dragging,
    ref,
    variants,
  } = useRowBoard(board, { show, disableReordering })

  // Styling: row colors, icon colors, hover effects
  const { setIsHovered, style: hoverStyle } = useRowHover(isBoardSelected)
  const { rowStyle, iconColor, labelColor } = useSidebarRowStyling(
    board as unknown as Variant,
    { isSelected: boardIsActive },
  )
  const combinedRowStyle =
    (boardContainsSelectedNode || boardContainsSelectedThemeEntry) &&
    !isBoardSelected
      ? { ...hoverStyle, ...rowStyle, borderColor: undefined }
      : { ...hoverStyle, ...rowStyle }

  // Canvas tracking: highlights board on canvas when hovering sidebar row
  const { handleCanvasTrackingEnter, handleCanvasTrackingLeave } =
    useSidebarCanvasTrackingBoard(board)

  // Event handlers: combine hover state with canvas tracking
  const handleRowMouseEnter = useCallback(() => {
    if (!boardIsActive) {
      setIsHovered(true)
      handleCanvasTrackingEnter()
    }
  }, [boardIsActive, setIsHovered, handleCanvasTrackingEnter])

  const handleRowMouseLeave = useCallback(() => {
    setIsHovered(false)
    handleCanvasTrackingLeave()
  }, [setIsHovered, handleCanvasTrackingLeave])

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
  const dataComponentId = getComponentKey(board)

  if (!show) return null

  return (
    <>
      <div ref={ref} style={rowWrapperStyle}>
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
            ? variants.map((themeEntryId) => (
                <RowThemeEntry
                  key={themeEntryId}
                  themeEntryId={themeEntryId}
                  show={show}
                  parentIsSelected={boardIsActive}
                />
              ))
            : isFontCollectionBoard(board)
              ? Object.entries(
                  workspaceFontCollectionService.getBoardFontCollection(
                    getComponentKey(board),
                    workspace,
                  )?.families ?? {},
                ).map(([slot, family]) => (
                  <RowFontFamilyEntry
                    key={slot}
                    componentKey={getComponentKey(board)}
                    slot={slot}
                    family={family}
                    show={show}
                    parentIsSelected={boardIsActive}
                  />
                ))
              : isIconSetBoard(board)
                ? variants.map((iconSetEntryId) => (
                    <RowIconSetEntry
                      key={iconSetEntryId}
                      iconSetEntryId={iconSetEntryId}
                      label={
                        workspace["icon-sets"]?.[iconSetEntryId]?.id ??
                        iconSetEntryId
                      }
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
