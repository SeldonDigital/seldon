import { Frame } from "@seldon/components/frames/Frame"
import {
  describeConsumerLocation,
  describeExpressionInput,
  describeRefView,
  getRefFileName,
} from "@seldon/editor/lib/refs/describe-ref-binding"
import { useMemo } from "react"

import {
  connectionDetailCardStyle,
  detailCardDimRowStyle,
  detailCardRowStyle,
  detailCardSectionStyle,
  detailCardTitleStyle,
} from "./connection-style"

import type { DetailCardPosition } from "@seldon/editor/lib/canvas/connections/connection-layout"
import type { RefBinding } from "@seldon/editor/lib/refs/join-ref-bindings"
import type { RefConsumer } from "@seldon/factory/bindings/types"
import type { CSSProperties, Ref } from "react"

interface ConnectionDetailCardProps {
  binding: RefBinding
  position: DetailCardPosition
  /** Lets the chip tell a click inside the card from a click away. */
  cardRef: Ref<HTMLElement>
}

interface CardLine {
  key: string
  text: string
  style: CSSProperties
}

const STATE_NOTES: Record<string, string> = {
  unbound: "No code drives this ref yet.",
  stale: "The manifest names this ref, but the workspace no longer has it.",
}

/**
 * What a ref is wired to, in full: the generated components that expose it, then
 * every place app code drives it, down to the expression and the hook behind it.
 *
 * The chip carries the name and the sidebar row carries a summary. This is where
 * the detail lives, because it is too long for either.
 */
export function ConnectionDetailCard({ binding, position, cardRef }: ConnectionDetailCardProps) {
  const cardStyle = useMemo(() => connectionDetailCardStyle(position), [position])
  const stateNote = STATE_NOTES[binding.state] ?? null

  const viewLines = useMemo(() => buildViewLines(binding.views), [binding.views])
  const consumerLines = useMemo(() => buildConsumerLines(binding.consumers), [binding.consumers])

  const viewRows = useMemo(
    () =>
      viewLines.map((line) => (
        <Frame key={line.key} style={line.style}>
          {line.text}
        </Frame>
      )),
    [viewLines],
  )

  const consumerRows = useMemo(
    () =>
      consumerLines.map((line) => (
        <Frame key={line.key} style={line.style}>
          {line.text}
        </Frame>
      )),
    [consumerLines],
  )

  const noteRow = useMemo(() => {
    if (!stateNote) return null

    return <Frame style={detailCardSectionStyle}>{stateNote}</Frame>
  }, [stateNote])

  const viewsSection = useMemo(() => {
    if (viewRows.length === 0) return null

    return (
      <>
        <Frame style={detailCardSectionStyle}>Exposed by</Frame>
        {viewRows}
      </>
    )
  }, [viewRows])

  const consumersSection = useMemo(() => {
    if (consumerRows.length === 0) return null

    return (
      <>
        <Frame style={detailCardSectionStyle}>Driven by</Frame>
        {consumerRows}
      </>
    )
  }, [consumerRows])

  return (
    <Frame ref={cardRef} style={cardStyle}>
      <Frame style={detailCardTitleStyle}>{binding.ref}</Frame>
      {noteRow}
      {viewsSection}
      {consumersSection}
    </Frame>
  )
}

function buildViewLines(views: RefBinding["views"]): CardLine[] {
  return views.map((view, index) => ({
    key: `view-${index}`,
    text: describeRefView(view),
    style: detailCardRowStyle,
  }))
}

/**
 * Flattens each consumer into a heading and its supporting detail.
 *
 * One flat list rather than a nested tree, so the card renders with a single pass
 * and every line carries its own resolved style.
 */
function buildConsumerLines(consumers: RefConsumer[]): CardLine[] {
  const lines: CardLine[] = []

  consumers.forEach((consumer, index) => {
    const name = consumer.component || getRefFileName(consumer.file)
    const conditional = consumer.conditional ? " (conditional)" : ""

    lines.push({
      key: `consumer-${index}`,
      text: `${name} · ${describeConsumerLocation(consumer)}${conditional}`,
      style: detailCardRowStyle,
    })

    if (consumer.expression) {
      lines.push({
        key: `consumer-${index}-expression`,
        text: consumer.expression,
        style: detailCardDimRowStyle,
      })
    }

    consumer.inputs.forEach((input, inputIndex) => {
      lines.push({
        key: `consumer-${index}-input-${inputIndex}`,
        text: describeExpressionInput(input),
        style: detailCardDimRowStyle,
      })
    })
  })

  return lines
}
