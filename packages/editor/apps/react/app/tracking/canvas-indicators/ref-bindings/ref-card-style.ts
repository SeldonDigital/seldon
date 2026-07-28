import { REF_CARD_MAX_WIDTH } from "@seldon/editor/lib/canvas/connectors/connector-layout"

import type { RefCardPosition } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type { BindingDescriptionKind } from "@seldon/editor/lib/refs/describe-binding"
import type { CSSProperties } from "react"

/**
 * Transitional styling for the ref card, paired with `RefCard.bespoke`.
 * A workspace card carries its own theme values, so this file is deleted with the
 * bespoke View it dresses.
 */

/** Above every board and overlay, since the card is portaled out of the canvas. */
const CARD_Z_INDEX = 2147483000

/** Supporting text under a row, dimmed so the row above it leads. */
const SUPPORTING_OPACITY = 0.7

/**
 * Where the card draws, kept apart from how it looks.
 *
 * The Controller passes this to the View as `style`, which is the seam a generated
 * card needs: placement comes from canvas geometry, appearance comes from the theme.
 *
 * One of `top` and `bottom` is set, whichever side of the chip the card opens on.
 */
export function refCardPositionStyle(position: RefCardPosition): CSSProperties {
  return {
    position: "fixed",
    top: position.top === undefined ? undefined : `${position.top}px`,
    bottom: position.bottom === undefined ? undefined : `${position.bottom}px`,
    left: `${position.left}px`,
    zIndex: CARD_Z_INDEX,
    maxWidth: `${REF_CARD_MAX_WIDTH}px`,
    maxHeight: `${position.maxHeight}px`,
  }
}

/**
 * The card surface. It takes pointer events, unlike the rest of the overlay, so it
 * can be scrolled and so a click inside it is not mistaken for a click away.
 */
export const refCardSurfaceStyle: CSSProperties = {
  overflowY: "auto",
  padding: "var(--sdn-paddings-compact)",
  borderRadius: "var(--sdn-corners-tight)",
  border: "var(--sdn-border-width-small) solid var(--sdn-swatch-primary)",
  backgroundColor: "var(--sdn-swatch-offBlack)",
  color: "var(--sdn-swatch-offWhite)",
  fontFamily: "var(--sdn-font-family-primary), system-ui, sans-serif",
  fontSize: "var(--sdn-font-size-xsmall)",
  lineHeight: "var(--sdn-line-height-compact)",
  pointerEvents: "auto",
  boxShadow:
    "0 var(--sdn-sizes-xxsmall) var(--sdn-sizes-small) color-mix(in srgb, var(--sdn-swatch-black) 35%, transparent)",
}

/** The ref name the card opens with. */
export const refCardTitleStyle: CSSProperties = {
  fontWeight: "var(--sdn-font-weight-bold)",
  marginBottom: "var(--sdn-margins-tight)",
}

const CODE_STYLE: CSSProperties = {
  fontFamily: "ui-monospace, monospace",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
}

const SUPPORTING_STYLE: CSSProperties = {
  marginTop: "var(--sdn-margins-tight)",
  opacity: SUPPORTING_OPACITY,
}

const DESCRIPTION_STYLES: Record<BindingDescriptionKind, CSSProperties> = {
  note: SUPPORTING_STYLE,
  heading: SUPPORTING_STYLE,
  view: CODE_STYLE,
  consumer: CODE_STYLE,
  detail: {
    ...CODE_STYLE,
    paddingLeft: "var(--sdn-paddings-compact)",
    opacity: SUPPORTING_OPACITY,
  },
}

/**
 * Styling for one description, by what it is about. File paths and code read as
 * monospace.
 */
export function refCardDescriptionStyle(kind: BindingDescriptionKind): CSSProperties {
  return DESCRIPTION_STYLES[kind]
}
