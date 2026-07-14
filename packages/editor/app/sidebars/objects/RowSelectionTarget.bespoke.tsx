// BESPOKE-VIEW: stamps selection data attributes the selection resolver and
// canvas tracking bridges read. Renders no styling of its own.
import { ReactNode, Ref } from "react"

interface RowSelectionTargetProps {
  selectionId: string
  selectionKind: string
  /**
   * Node-id path of this copy, from the variant-root down to this row, joined
   * by "/". Stamped as `data-selection-root-id` so the shared selection
   * resolver can tell apart copies of a child id reused across variants.
   */
  selectionRootId?: string
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
  ref,
  children,
}: RowSelectionTargetProps) {
  return (
    <div
      ref={ref}
      tabIndex={-1}
      data-selection-id={selectionId}
      data-selection-kind={selectionKind}
      data-selection-root-id={selectionRootId}
    >
      {children}
    </div>
  )
}
