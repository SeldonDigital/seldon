// BESPOKE-VIEW: hand-authored board root wrapper carrying the canvas board id.
import { CSSProperties, ReactNode, Ref } from "react"

interface BoardCanvasFrameProps {
  boardId: string
  className?: string
  style?: CSSProperties
  ref?: Ref<HTMLDivElement>
  children: ReactNode
}

/** Board root wrapper on the canvas. Carries the board id the canvas reads. */
export function BoardCanvasFrame({
  boardId,
  className,
  style,
  ref,
  children,
}: BoardCanvasFrameProps) {
  return (
    <div ref={ref} data-board-id={boardId} className={className} style={style}>
      {children}
    </div>
  )
}
