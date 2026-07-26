import { useEditorConfig } from "@app/editor/hooks/use-editor-config"
import { useSelection } from "@app/workspace/hooks/use-selection"
import { useEffect, useRef } from "react"

const SCROLL_OFFSET_TOP = 130

/**
 * Hook that automatically scrolls the objects sidebar to show the selected node or board.
 * Only scrolls if auto-scroll is enabled in editor config and the item is not already in view.
 *
 * @returns Ref to attach to the scrollable container element
 */
export function useScrollSelection() {
  const { selectedNodeId, selectedBoardId } = useSelection()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const { autoScrollToSelection } = useEditorConfig()

  useEffect(() => {
    if (
      !(selectedBoardId || selectedNodeId) ||
      !autoScrollToSelection ||
      !scrollerRef.current
    )
      return

    const selector = selectedBoardId
      ? `[data-componentid="${selectedBoardId}"]`
      : `[data-nodeid="${selectedNodeId}"]`

    const el = scrollerRef.current?.querySelector(selector)

    if (el) {
      const containerRect = scrollerRef.current.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()

      const isInView =
        elRect.top >= containerRect.top + SCROLL_OFFSET_TOP &&
        elRect.bottom <= containerRect.bottom - SCROLL_OFFSET_TOP

      if (!isInView) {
        const scrollPosition = elRect.top - SCROLL_OFFSET_TOP

        scrollerRef.current.scrollTo({
          top: scrollPosition,
          behavior: "smooth",
        })
      }
    }
  }, [autoScrollToSelection, selectedBoardId, selectedNodeId])

  return scrollerRef
}
