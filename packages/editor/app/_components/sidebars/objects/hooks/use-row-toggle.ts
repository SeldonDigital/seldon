import { MouseEvent } from "react"

/**
 * Hook that provides a toggle handler for row expansion with Alt+click support.
 * Handles both single toggle and Alt+click to expand/collapse all descendants.
 *
 * @param options - Configuration for toggle behavior
 * @returns Toggle handler function
 */
export function useRowToggle(options: {
  expandedId: string
  isExpanded: boolean
  toggle: (id: string, expanded: boolean) => void
  expandObjects: (ids: string[]) => void
  collapseObjects: (ids: string[]) => void
  getAllIdsForAltClick: () => string[]
  hasChildren?: boolean
}) {
  const {
    expandedId,
    isExpanded,
    toggle,
    expandObjects,
    collapseObjects,
    getAllIdsForAltClick,
    hasChildren,
  } = options

  return function onToggle(event?: MouseEvent<HTMLButtonElement>) {
    event?.stopPropagation()

    if (hasChildren === false) return

    if (event?.altKey) {
      const shouldExpand = !isExpanded
      const allIds = getAllIdsForAltClick()

      if (shouldExpand) {
        expandObjects(allIds)
      } else {
        collapseObjects(allIds)
      }
    } else {
      toggle(expandedId, !isExpanded)
    }
  }
}
