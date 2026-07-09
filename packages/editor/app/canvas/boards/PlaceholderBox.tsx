// BESPOKE-VIEW: hand-authored centered placeholder board for boards with no
// real preview yet.
import { CSSProperties, ReactNode } from "react"
import { BoardCanvasFrame } from "./BoardCanvasFrame.bespoke"

interface PlaceholderBoxProps {
  boardId: string
  className?: string
  children: ReactNode
}

const placeholderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "200px",
  width: "100%",
}

/** Centered placeholder board used while a board kind has no real preview. */
export function PlaceholderBox({
  boardId,
  className,
  children,
}: PlaceholderBoxProps) {
  return (
    <BoardCanvasFrame
      boardId={boardId}
      className={className}
      style={placeholderStyle}
    >
      {children}
    </BoardCanvasFrame>
  )
}
