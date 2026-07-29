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

import { getRefCardResizeSides, setRefCardSize } from "./ref-card-size"
import { refCardMultilineStyle, refCardPanelStyle } from "./ref-card-style"

import type { Rect } from "@seldon/components/utils/resize"
import type { RefCardPosition } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type {
  BindingControllerDescription,
  BindingViewDescription,
} from "@seldon/editor/lib/refs/describe-binding"
import type { RefBinding } from "@seldon/editor/lib/refs/join-refs-and-bindings"
import type { ReactNode, Ref } from "react"

interface RefCardControllerProps {
  binding: RefBinding
  position: RefCardPosition
  onClose: () => void
  /** Lets the chip tell a press inside the card, handles included, from a press away. */
  cardRef: Ref<HTMLDivElement>
}

/**
 * Binds one ref binding to the card half of `PanelRefs`.
 *
 * The wording comes from `@seldon/editor/lib/refs`, so the properties sidebar reports a
 * binding the same way. The card leaves the chip slot out, since the chip that opened
 * it is still on screen beside it and already names the ref.
 *
 * It floats on `WindowSurface`, the same shell the dialogs and palettes use, which
 * portals it clear of the canvas and its overflow, re-applies the editor theme outside
 * the chrome root, and draws the resize handles. `useDraggableWindow` owns the rect, so
 * a drag moves the edge under the pointer and holds the other three. It stays non-modal
 * and grows no drag handle: a card follows its chip and the canvas stays usable behind
 * it.
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

  const resizeSides = useMemo(() => getRefCardResizeSides(position.opens), [position.opens])

  // The drag drives this card, and the size it lands on is what the next card opens
  // at. Recorded outside React state, so a live drag re-renders nothing.
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
  // up across the three. One enabler covers the section, since the component, its
  // folder, and when its slot renders only make sense together.
  const viewLines = views.map(toViewLine).join("\n")
  const folderLines = views.map(toFolderLine).join("\n")
  const conditionLines = views.map(toConditionLine).join("\n")
  const viewSlot = views.length === 0 ? null : {}

  const cardRefs = {
    refCardView: { children: viewLines, style: refCardMultilineStyle },
    refCardPath: { children: folderLines, style: refCardMultilineStyle },
    refCardCondition: { children: conditionLines, style: refCardMultilineStyle },
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
        style={refCardPanelStyle}
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
 * A row per place code drives the ref, or one row carrying the note when nothing does.
 *
 * The note rides in the name slot rather than a slot of its own, because an empty card
 * has one thing to say and the row already has somewhere to say it.
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
    toControllerRow(controller, index, controllers.length),
  )
}

function toControllerRow(
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
      style: refCardMultilineStyle,
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
