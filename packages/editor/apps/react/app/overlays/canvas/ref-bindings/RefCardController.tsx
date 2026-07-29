import { WindowSurface } from "@app/windows/WindowSurface.bespoke"
import { useDraggableWindow } from "@app/windows/hooks/use-draggable-window"
import { MessageRefController } from "@seldon/components/elements/MessageRefController"
import { PanelRefs } from "@seldon/components/modules/PanelRefs"
import { REF_CARD_MIN_SIZE } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import {
  describeBinding,
  getBindingDirectory,
  getBindingFileName,
} from "@seldon/editor/lib/refs/describe-binding"
import { useCallback, useMemo } from "react"

import { setRefCardSize } from "./hooks/use-ref-card"

import type { Rect, ResizeSide } from "@seldon/components/utils/resize"
import type { RefCardPosition } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type {
  BindingControllerDescription,
  BindingViewDescription,
} from "@seldon/editor/lib/refs/describe-binding"
import type { RefBinding } from "@seldon/editor/lib/refs/join-refs-and-bindings"
import type { CSSProperties, ReactNode, Ref } from "react"

/**
 * A card opening below its chip grows down and left, and one opening above grows up
 * and left. Offering the anchored edges would let a drag pull the card over its chip.
 */
const RESIZE_SIDES: Record<RefCardPosition["opens"], ResizeSide[]> = {
  below: ["left", "bottom", "bottom-left"],
  above: ["left", "top", "top-left"],
}

interface RefCardControllerProps {
  binding: RefBinding
  position: RefCardPosition
  onClose: () => void
  cardRef: Ref<HTMLDivElement>
}

/**
 * Binds one ref binding to the card half of `PanelRefs`.
 *
 * It floats on `WindowSurface`, the same shell the dialogs and palettes use, which
 * portals it clear of the canvas and its overflow, re-applies the editor theme outside
 * the chrome root, and draws the resize handles.
 */
export function RefCardController({ binding, position, onClose, cardRef }: RefCardControllerProps) {
  const { note, views, controllers } = useMemo(() => describeBinding(binding), [binding])

  const { x, y, width, height, onResizeStart, onResize, getRect, moveControls, dragConstraints } =
    useDraggableWindow({
      initialPosition: { x: position.x, y: position.y },
      initialSize: { width: position.width, height: position.height },
      handleClose: onClose,
      minWidth: REF_CARD_MIN_SIZE.width,
      minHeight: REF_CARD_MIN_SIZE.height,
    })

  const resizeSides = RESIZE_SIDES[position.opens]

  // The drag drives this card, and the size it lands on is what the next card opens at.
  const handleResize = useCallback(
    (rect: Rect) => {
      onResize(rect)
      setRefCardSize({ width: rect.width, height: rect.height })
    },
    [onResize],
  )

  const rows = useMemo(() => buildControllerRows(note, controllers), [note, controllers])

  // The view section has one Text per field rather than one per component, so several
  // components that expose the same ref stack as lines inside each Text and stay lined
  // up across the three.
  const viewLines = views.map(toViewLine).join("\n")
  const folderLines = views.map(toFolderLine).join("\n")
  const conditionLines = views.map(toConditionLine).join("\n")
  const viewSlot = views.length === 0 ? null : {}

  const cardRefs = {
    refCardView: { children: viewLines, style: styles.multiline },
    refCardPath: { children: folderLines, style: styles.multiline },
    refCardCondition: { children: conditionLines, style: styles.multiline },
    refCardControllers: { children: rows },
  }

  return (
    <WindowSurface
      onClose={onClose}
      surfaceRef={cardRef}
      x={x}
      y={y}
      width={width}
      height={height}
      moveControls={moveControls}
      dragConstraints={dragConstraints}
      onResizeStart={onResizeStart}
      onResize={handleResize}
      getRect={getRect}
      resizeSides={resizeSides}
      minWidth={REF_CARD_MIN_SIZE.width}
      minHeight={REF_CARD_MIN_SIZE.height}
    >
      <PanelRefs
        role="presentation"
        style={styles.panel}
        seldonRefs={cardRefs}
        textLabel2={{}}
        text={viewSlot}
        text2={viewSlot}
        text3={viewSlot}
        textLabel3={{}}
      />
    </WindowSurface>
  )
}

/** `ItemNode.tsx: { textLabel }`, the file that exposes the ref and the slot it is. */
function toViewLine(view: BindingViewDescription): string {
  return `${getBindingFileName(view.file)}: { ${view.slot} }`
}

function toFolderLine(view: BindingViewDescription): string {
  return getBindingDirectory(view.file)
}

function toConditionLine(view: BindingViewDescription): string {
  return view.condition
}

/**
 * A row per code snippet drives the ref, or one row carrying a note when nothing does.
 */
function buildControllerRows(
  note: string | null,
  controllers: BindingControllerDescription[],
): ReactNode {
  if (controllers.length === 0) {
    if (!note) return null

    const noteRefs = { refCardControllerName: { children: note } }

    return <MessageRefController seldonRefs={noteRefs} text={{}} />
  }

  return controllers.map((controller, index) =>
    joinControllerRow(controller, index, controllers.length),
  )
}

function joinControllerRow(
  controller: BindingControllerDescription,
  index: number,
  count: number,
): ReactNode {
  const location = controller.conditional
    ? `${controller.location} (conditional)`
    : controller.location

  const rowRefs = {
    refCardControllerName: { children: controller.name },
    refCardControllerPath: { children: location },
    refCardControllerPass: { children: controller.pass },
    refCardControllerFrom: {
      children: controller.from.join("\n"),
      style: styles.multiline,
    },
  }

  const pass = controller.pass === null ? null : {}
  const from = controller.from.length === 0 ? null : {}
  const separator = index === count - 1 ? null : {}

  return (
    <MessageRefController
      key={`${controller.location}#${index}`}
      seldonRefs={rowRefs}
      text={{}}
      text2={{}}
      text3={pass}
      text4={from}
      hr={separator}
    />
  )
}

const styles: Record<string, CSSProperties> = {
  // The surface owns the box the reader drags, so the board's own size and padding go
  // and the panel fills what it is given.
  panel: {
    width: "100%",
    height: "100%",
    padding: 0,
  },
  // Holds the line breaks in a slot that carries several lines in one Text.
  multiline: {
    whiteSpace: "pre-line",
  },
}
