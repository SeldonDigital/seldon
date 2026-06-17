import { CSSProperties, ReactNode } from "react"

interface PreviewItemWrapperProps {
  canvasSelectionId: string
  selectionId: string
  selectionKind: string
  title?: string
  children: ReactNode
}

const wrapperStyle: CSSProperties = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}

/**
 * Selectable preview cell for a resource board (theme, icon, font specimen).
 * Carries both canvas and sidebar selection ids so the shared bridges resolve.
 */
export function PreviewItemWrapper({
  canvasSelectionId,
  selectionId,
  selectionKind,
  title,
  children,
}: PreviewItemWrapperProps) {
  return (
    <div
      title={title}
      data-canvas-selection-id={canvasSelectionId}
      data-selection-id={selectionId}
      data-selection-kind={selectionKind}
      style={wrapperStyle}
    >
      {children}
    </div>
  )
}
