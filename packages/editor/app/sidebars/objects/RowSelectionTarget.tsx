import { CSSProperties, ReactNode, Ref } from "react"

interface RowSelectionTargetProps {
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
 * Marks an objects-sidebar row as a selection target. Stamps the selection
 * data attributes that the selection resolver and canvas tracking bridges
 * read; renders no styling of its own.
 */
export function RowSelectionTarget({
  selectionId,
  selectionKind,
  selectionRootId,
  style,
  innerStyle,
  ref,
  children,
}: RowSelectionTargetProps) {
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
