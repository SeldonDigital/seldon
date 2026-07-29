import { MessageRefController } from "@seldon/components/elements/MessageRefController"
import { Frame } from "@seldon/components/frames/Frame"
import { PanelRefs } from "@seldon/components/modules/PanelRefs"
import {
  describeBinding,
  getBindingDirectory,
  getBindingFileName,
} from "@seldon/editor/lib/refs/describe-binding"
import { useMemo } from "react"
import { createPortal } from "react-dom"

import { getRefCardResizeSides, useRefCardHandles, useRefCardSize } from "./hooks/use-ref-card-size"
import { refCardMultilineStyle, refCardWrapperStyle } from "./ref-card-style"
import { refsPanelStyle } from "./ref-chip-style"

import type { RefCardHandle } from "./hooks/use-ref-card-size"
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
  /** Lets the chip tell a click inside the card from a click away. */
  cardRef: Ref<HTMLElement>
}

/**
 * Binds one ref binding to the card half of `PanelRefs`.
 *
 * The wording comes from `@seldon/editor/lib/refs`, so the properties sidebar reports a
 * binding the same way. The card leaves the chip slot out, since the chip that opened
 * it is still on screen beside it and already names the ref.
 *
 * The card is portaled to the body rather than drawn in place, because the canvas is
 * its own stacking context and a board with hidden overflow would clip it. Its wrapper
 * carries the placement and hosts the resize handles, which a module cannot do itself.
 */
export function RefCardController({ binding, position, cardRef }: RefCardControllerProps) {
  const { note, views, controllers } = useMemo(() => describeBinding(binding), [binding])
  const size = useRefCardSize()
  const sides = useMemo(() => getRefCardResizeSides(position.opens), [position.opens])
  const handles = useRefCardHandles(sides)

  const wrapperStyle = useMemo(() => refCardWrapperStyle(position, size), [position, size])
  const handleElements = useMemo(() => handles.map(toHandle), [handles])
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

  const card = (
    <Frame ref={cardRef} style={wrapperStyle}>
      <PanelRefs
        role="presentation"
        style={refsPanelStyle}
        seldonRefs={cardRefs}
        textLabel2={{}}
        text={viewSlot}
        text2={viewSlot}
        text3={viewSlot}
        textLabel3={{}}
      />
      {handleElements}
    </Frame>
  )

  return createPortal(card, document.body)
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

function toHandle({ side, style, onPointerDown }: RefCardHandle): ReactNode {
  return <Frame key={side} style={style} onPointerDown={onPointerDown} />
}
