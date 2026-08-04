import { useRefBindingsStatus } from "@app/refs/use-ref-bindings"
import { WindowSurface } from "@app/windows/WindowSurface.bespoke"
import { MIN_WINDOW_SIZE, useDraggableWindow } from "@app/windows/hooks/use-draggable-window"
import { MessageRefController } from "@seldon/components/elements/MessageRefController"
import { PanelRefs } from "@seldon/components/modules/PanelRefs"
import { getCanvasElement } from "@seldon/editor/lib/canvas/dom/canvas-elements"
import { describeBinding } from "@seldon/editor/lib/refs/describe-binding"
import { useCallback, useEffect, useMemo } from "react"

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
 * The edges a card offers to drag: the two it grew toward, and the corner between them.
 * Offering the anchored edges would let a drag pull the card over its badge.
 */
const RESIZE_SIDES: Record<
  RefCardPosition["grows"],
  Record<RefCardPosition["opens"], ResizeSide[]>
> = {
  left: {
    below: ["left", "bottom", "bottom-left"],
    above: ["left", "top", "top-left"],
  },
  right: {
    below: ["right", "bottom", "bottom-right"],
    above: ["right", "top", "top-right"],
  },
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
  const status = useRefBindingsStatus()

  const { viewNote, note, views, controllers } = useMemo(
    () => describeBinding(binding, status),
    [binding, status],
  )

  // The card renders in the canvas layer so the sidebar clips it like the badges, rather
  // than floating over the chrome. Its position already arrives in that layer's space.
  const canvas = getCanvasElement()

  const { x, y, width, height, onResizeStart, onResize, getRect, moveControls, dragConstraints } =
    useDraggableWindow({
      initialPosition: { x: position.x, y: position.y },
      initialSize: { width: position.width, height: position.height },
      handleClose: onClose,
      minWidth: MIN_WINDOW_SIZE.width,
      minHeight: MIN_WINDOW_SIZE.height,
    })

  const resizeSides = RESIZE_SIDES[position.grows][position.opens]

  // The badge moves as the canvas scrolls, and the card travels with it. Only the corner
  // moves, so the size the reader dragged this card to survives the trip.
  useEffect(() => {
    x.set(position.x)
    y.set(position.y)
  }, [position.x, position.y, x, y])

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
  //
  // With no views the first Text carries the note instead, and the other two stay off.
  // A path and a condition have nothing to report about a view that is not there, and
  // leaving all three off would collapse the section to a bare heading.
  const viewLines =
    views.length === 0 ? viewNote : views.map((view) => toViewLine(binding.ref, view)).join("\n")
  const pathLines = views.map((view) => view.file).join("\n")
  const conditionLines = views.map((view) => view.condition).join("\n")
  const hasViews = views.length > 0

  // The card body reads from the binding, not the position, so it is held stable and a pan
  // moving the card does not reconcile it. Only the surface's transform changes per frame.
  const panel = useMemo(() => {
    const viewSlot = viewLines === null ? null : {}
    const viewFieldSlot = hasViews ? {} : null
    const cardRefs = {
      refCardView: { children: viewLines, style: styles.multiline },
      refCardPath: { children: pathLines, style: styles.multiline },
      refCardCondition: { children: conditionLines, style: styles.multiline },
      refCardControllers: { children: rows },
    }
    const sectionLabelSlot = { style: styles.sectionLabel }

    return (
      <PanelRefs
        role="presentation"
        style={styles.panel}
        seldonRefs={cardRefs}
        textLabel2={sectionLabelSlot}
        text={viewSlot}
        text2={viewFieldSlot}
        text3={viewFieldSlot}
        textLabel3={sectionLabelSlot}
      />
    )
  }, [viewLines, pathLines, conditionLines, hasViews, rows])

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
      minWidth={MIN_WINDOW_SIZE.width}
      minHeight={MIN_WINDOW_SIZE.height}
      portalTarget={canvas}
      anchored={canvas !== null}
    >
      {panel}
    </WindowSurface>
  )
}

/**
 * `nodeLabel: { textLabel }`, the ref and the prop the view takes it as.
 *
 * Named by the ref rather than the file, so the line answers to the badge that opened
 * the card. The file it is exposed from is the line under it.
 */
function toViewLine(ref: string, view: BindingViewDescription): string {
  return `${ref}: { ${view.slot} }`
}

/**
 * A row per code snippet that drives the ref, under a note when there is one to make.
 *
 * The note leads rather than replaces, because a note and controllers can both apply.
 * Files that disagree on their target still report consumers, and the reader needs the
 * warning before reading the rows it casts doubt on.
 */
function buildControllerRows(
  note: string | null,
  controllers: BindingControllerDescription[],
): ReactNode {
  const rows = controllers.map((controller, index) =>
    joinControllerRow(controller, index, controllers.length),
  )

  if (note === null) return rows

  return [buildNoteRow(note, controllers.length > 0), ...rows]
}

/** The note on a row of its own, ruled off from any controllers under it. */
function buildNoteRow(note: string, hasControllers: boolean): ReactNode {
  const noteRefs = { refCardControllerName: { children: note } }
  const separator = hasControllers ? {} : null

  return <MessageRefController key="note" seldonRefs={noteRefs} text={{}} hr={separator} />
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
  panel: {
    width: "100%",
    height: "100%",
    padding: 0,
    cursor: "default",
  },
  multiline: {
    whiteSpace: "pre-line",
  },
  sectionLabel: {
    pointerEvents: "none",
  },
}
