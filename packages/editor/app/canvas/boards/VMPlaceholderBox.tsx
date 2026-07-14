import { CSSProperties, ReactNode } from "react"
import { Frame } from "@seldon/components/frames/Frame"

interface VMPlaceholderBoxProps {
  boardId: string
  className?: string
  children: ReactNode
}

const placeholderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
}

/** Centered placeholder board used while a board kind has no real preview. */
export function VMPlaceholderBox({
  boardId,
  className,
  children,
}: VMPlaceholderBoxProps) {
  return (
    <Frame data-board-id={boardId} className={className} style={placeholderStyle}>
      {children}
    </Frame>
  )
}
