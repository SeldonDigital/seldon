import { CSSProperties, memo, useCallback, useRef } from "react"
import { Board as BoardType, Variant } from "@seldon/core"
import { useRowHighlightStyle } from "@lib/workspace/hooks/use-object-hover"
import { useTool } from "@lib/hooks/use-tool"
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
import { useRowActionsMenu } from "../shared/use-row-actions-menu"
import { VMNode } from "./VMNode"
import {
  VMResourceEntry,
  getBoardResourceRowConfig,
} from "./VMResourceEntry"

const BOARD_SELECTION_KIND = "board"

const emptyRowWrapperStyle: CSSProperties = {
  ...rowWrapperStyle,
  position: "relative",
}

const emptyLabelStyle: CSSProperties = {
  fontFamily: "var(--sdn-seldon-font-family-primary)",
  fontSize: "var(--sdn-font-size-xsmall)",
  color: "var(--sdn-seldon-swatch-white)",
  paddingInlineStart: "var(--sdn-padding-compact)",
}

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
    <div style={emptyRowWrapperStyle}>
      <ItemNodeRow
        buttonIconic={null}
        icon={null}
        icon2={null}
        textLabel={{ children: label, style: emptyLabelStyle }}
        buttonIconic2={null}
        icon3={null}
        buttonIconic3={null}
        icon4={null}
        aria-disabled
        data-testid="objects-sidebar-empty-section"
      />
    </div>
  )
}

/**
 * View-model for a board row in the objects sidebar.
 * Handles board selection, expansion, and canvas tracking. Hover highlight comes
 * from the shared hover bridge via the tree-root controller.
 */
function VMBoardRow({ board, show = true }: { board: BoardType; show?: boolean }) {
  // Core board data: buttons, icons, handlers, state
  const {
    label: baseLabel,
    buttonIconic,
    icon,
    icon2,
    actions,
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
  const { activeTool } = useTool()
  const hoverStyle = useRowHighlightStyle(boardKey, isBoardSelected)
  const { rowStyle, iconColor, labelColor } = useSidebarRowStyling(
    board as unknown as Variant,
    { isSelected: boardIsActive },
  )
  // The insert component tool highlights the selected board in the accent color
  // to signal it as the active insertion context, recoloring the whole row
  // (border, icons, and label) instead of the default primary selection color.
  const accentActive = isBoardSelected && activeTool === "component"
  const accentColor = "var(--sdn-seldon-swatch-accent)"
  const effectiveIconColor = accentActive ? accentColor : iconColor
  const effectiveLabelColor = accentActive ? accentColor : labelColor
  const selectedBorderStyle: CSSProperties = accentActive
    ? { borderColor: accentColor }
    : {}
  const combinedRowStyle =
    (boardContainsSelectedNode || boardContainsSelectedResourceEntry) &&
    !isBoardSelected
      ? { ...hoverStyle, ...rowStyle, borderColor: undefined }
      : { ...hoverStyle, ...rowStyle, ...selectedBorderStyle }

  // Trailing "..." actions menu for the board row.
  const rowRef = useRef<HTMLDivElement>(null)
  const actionsMenu = useRowActionsMenu(actions, {
    color: effectiveIconColor,
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

  // Apply tracking colors: icons get color
  const coloredIcon = applyTrackingColor(icon, "color", effectiveIconColor)
  const coloredIcon2 = applyTrackingColor(icon2, "color", effectiveIconColor)

  // Label: apply tracking color if provided
  const textLabel: TextLabelProps = {
    ...baseLabel,
    style: {
      ...("style" in baseLabel && baseLabel.style ? baseLabel.style : {}),
      ...(effectiveLabelColor ? { color: effectiveLabelColor } : {}),
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
        ref={rowRef}
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
          buttonIconic2={null}
          icon3={null}
          buttonIconic3={actionsMenu.buttonIconic}
          icon4={actionsMenu.icon}
          onClick={onClick}
          onMouseEnter={handleRowMouseEnter}
          onMouseLeave={handleRowMouseLeave}
          data-testid={dataTestId}
          data-componentid={dataComponentId}
          data-active={boardIsActive}
          style={combinedRowStyle}
        />
      </RowSelectionTarget>
      {actionsMenu.menu}

      <FramerExpandable isExpanded={isExpanded}>
        <IndentationLevel>{childRows}</IndentationLevel>
      </FramerExpandable>
    </>
  )
}
