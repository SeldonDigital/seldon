import { CSSProperties, ReactNode, Ref } from "react"

interface SidebarRowProps {
  selectionId: string
  selectionKind: string
  /**
   * Node-id path of this copy, from the variant-root down to this row, joined
   * by "/". Stamped as `data-selection-root-id` so the shared selection
   * resolver can tell apart copies of a child id reused across variants.
   */
  selectionRootId?: string
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
  selectionRootId,
  style,
  innerStyle,
  ref,
  children,
}: SidebarRowProps) {
  const content = innerStyle ? (
    <div style={innerStyle}>{children}</div>
  ) : (
    children
  )
  return (
    <div
      ref={ref}
      style={style}
      data-selection-id={selectionId}
      data-selection-kind={selectionKind}
      data-selection-root-id={selectionRootId}
    >
      {content}
    </div>
  )
}
