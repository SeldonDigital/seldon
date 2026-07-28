import { Frame } from "@seldon/components/frames/Frame"
import { describeBinding, formatBindingDescription } from "@seldon/editor/lib/refs/describe-binding"
import { useMemo } from "react"
import { createPortal } from "react-dom"

import { RefCard } from "./RefCard.bespoke"
import { refCardDescriptionStyle, refCardPositionStyle } from "./ref-card-style"

import type { RefCardPosition } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type { BindingDescription } from "@seldon/editor/lib/refs/describe-binding"
import type { RefBinding } from "@seldon/editor/lib/refs/join-refs-and-bindings"
import type { Ref } from "react"

interface RefCardControllerProps {
  binding: RefBinding
  position: RefCardPosition
  /** Lets the chip tell a click inside the card from a click away. */
  cardRef: Ref<HTMLElement>
}

/**
 * Binds one ref binding to the card View.
 *
 * The descriptions come from `@seldon/editor/lib/refs`, so the wording is shared with
 * every other surface that reports a binding rather than restated here.
 *
 * The card is portaled to the body rather than drawn in place, because the canvas is
 * its own stacking context and a board with hidden overflow would clip it.
 */
export function RefCardController({ binding, position, cardRef }: RefCardControllerProps) {
  const descriptions = useMemo(() => describeBinding(binding), [binding])
  const positionStyle = useMemo(() => refCardPositionStyle(position), [position])
  const lines = useMemo(() => descriptions.map(toLine), [descriptions])

  const textLabel = useMemo(() => ({ children: binding.ref }), [binding.ref])
  const frame = useMemo(() => ({ children: lines }), [lines])

  const card = <RefCard ref={cardRef} style={positionStyle} textLabel={textLabel} frame={frame} />

  return createPortal(card, document.body)
}

function toLine(description: BindingDescription) {
  const style = refCardDescriptionStyle(description.kind)
  const text = formatBindingDescription(description)

  return (
    <Frame key={description.key} style={style}>
      {text}
    </Frame>
  )
}
