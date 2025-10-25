import { CSSProperties } from "react"
import { ComponentId } from "@seldon/core/components/constants"
import { useDragAndDropDraggable } from "./hooks/use-drag-and-drop-draggable"
import { useObjectExpansion } from "./hooks/use-object-expansion"
import { useActiveBoard } from "@lib/workspace/use-active-board"
import { useAutoSelectNode } from "@lib/workspace/use-auto-select-node"
import { useSelection } from "@lib/workspace/use-selection"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { Frame } from "../seldon/frames/Frame"
import { Dropzone } from "./Dropzone"
import { Item } from "./Item"
import { Node } from "./Node"
import { IndentationLevel } from "./contexts/indentation-context"

export const Board = ({ componentId }: { componentId: ComponentId }) => {
  const { workspace } = useWorkspace({ usePreview: false })
  const { activeBoard } = useActiveBoard()
  const { selectBoard, selectedNodeId } = useSelection()
  const { toggle, isObjectExpanded } = useObjectExpansion()
  const { dispatchWithAutoSelect } = useAutoSelectNode()

  const board = workspace.boards[componentId]!
  const isActive = activeBoard?.id === componentId
  const isSelected = isActive && selectedNodeId === null
  const currentState = isSelected ? "selected" : isActive ? "active" : "default"
  const isExpanded = isObjectExpanded(componentId)

  const { dragging, ref } = useDragAndDropDraggable({
    target: board!,
    onDragStart: () => toggle(componentId, false),
  })

  function onToggle() {
    toggle(componentId, !isExpanded)
  }

  function onClick() {
    selectBoard(componentId)
  }

  function onAddVariant() {
    dispatchWithAutoSelect({
      type: "add_variant",
      payload: { componentId },
    })
  }

  const overlay = (
    <Frame style={styles.overlay}>
      {board && <Dropzone placement="before" target={board} />}
      {!isExpanded && board && <Dropzone placement="after" target={board} />}
    </Frame>
  )

  return (
    <>
      <style>
        {`
          .objects-sidebar-board[data-hidden="true"] {
            opacity: 0.5;
          }
          .objects-sidebar-board[data-active="true"] {
            color: rgb(63 181 255 / 1);
          }
        `}
      </style>
      <Item
        draggable
        ref={ref}
        className="objects-sidebar-board"
        icon="seldon-component"
        data-testid="objects-sidebar-board"
        data-componentid={componentId}
        data-dragging={dragging}
        data-active={isSelected}
        state={currentState}
        onToggle={onToggle}
        isExpanded={isExpanded}
        onClick={onClick}
        overlay={overlay}
        buttonIconic1Props={{
          style: { visibility: "hidden" }, // TODO: Fix props
        }}
        buttonIconic1IconProps={{
          icon: "seldon-reset",
        }}
        buttonIconic2Props={{
          style: isExpanded ? styles.visible : styles.hidden,
          onClick: onAddVariant,
          // @ts-expect-error - data-testid is not a valid prop for ButtonIconic
          "data-testid": `add-${componentId}-variant-button`,
        }}
        buttonIconic2IconProps={{
          icon: "material-add",
        }}
      >
        {board.label}
      </Item>

      {isExpanded && board && (
        <IndentationLevel>
          {Object.values(board.variants).map((variantId, index) => {
            return (
              <Node
                disableReordering={index === 0}
                key={variantId}
                nodeId={variantId}
                parentIsSelected={isSelected}
              />
            )
          })}
        </IndentationLevel>
      )}
    </>
  )
}

// TODO: Use props instead of styles
const styles: Record<string, CSSProperties> = {
  overlay: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    left: 0,
    right: 0,
    top: -2,
    bottom: -2,
  },
  frame: {
    display: "flex",
    flexDirection: "row",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "space-between",
    height: "fit-content",
  },
  visible: {
    position: "relative",
    zIndex: 1,
    visibility: "visible",
  },
  hidden: {
    visibility: "hidden",
  },
}
