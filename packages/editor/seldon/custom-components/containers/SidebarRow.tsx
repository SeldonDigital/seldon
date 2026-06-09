import { CSSProperties, ReactNode, Ref } from "react"

interface SidebarRowProps {
  selectionId: string
  selectionKind: string
  style?: CSSProperties
  /** When set, wraps children in a second positioned div. */
  innerStyle?: CSSProperties
  ref?: Ref<HTMLDivElement>
  children: ReactNode
}

/**
 * Selectable wrapper for an objects-sidebar row. Carries the selection data
 * attributes the canvas tracking and selection bridges read.
 */
export function SidebarRow({
  selectionId,
  selectionKind,
  style,
  innerStyle,
  ref,
  children,
}: SidebarRowProps) {
  const content = innerStyle ? <div style={innerStyle}>{children}</div> : children
  return (
    <div
      ref={ref}
      style={style}
      data-selection-id={selectionId}
      data-selection-kind={selectionKind}
    >
      {content}
    </div>
  )
}
