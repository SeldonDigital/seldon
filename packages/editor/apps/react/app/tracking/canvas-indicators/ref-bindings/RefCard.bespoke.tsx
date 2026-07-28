// BESPOKE-VIEW: hand-authored transitional View with inline token styling.
// Replace with a generated workspace card once seldon-editor.json covers it. The
// props are shaped like a generated part, so the swap is an import change: slots
// arrive as named prop objects and the body takes its rows as `frame.children`.
import { Frame } from "@seldon/components/frames/Frame"
import { useMemo } from "react"

import { refCardSurfaceStyle, refCardTitleStyle } from "./ref-card-style"

import type { FrameProps } from "@seldon/components/frames/Frame"
import type { CSSProperties, HTMLAttributes, Ref } from "react"

export interface RefCardProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>
  /** The ref name the card opens with. */
  textLabel?: FrameProps | null
  /** The body. Rows arrive as this slot's `children`. */
  frame?: FrameProps | null
}

/**
 * The card behind a connector chip, listing what a ref is wired to.
 *
 * It holds no derivation. The Controller resolves the title and the rows, so this
 * View only dresses them, which is what a generated card would do in its place.
 */
export function RefCard({ ref, style, textLabel, frame, ...props }: RefCardProps) {
  const surfaceStyle = useMemo(() => mergeSurfaceStyle(style), [style])

  return (
    <Frame ref={ref} style={surfaceStyle} {...props}>
      <Frame style={refCardTitleStyle} {...textLabel} />
      <Frame {...frame} />
    </Frame>
  )
}

/** Placement comes in as `style`, appearance is the View's own. */
function mergeSurfaceStyle(style: CSSProperties | undefined): CSSProperties {
  return { ...refCardSurfaceStyle, ...style }
}
