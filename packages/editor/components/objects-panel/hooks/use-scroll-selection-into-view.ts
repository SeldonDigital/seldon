import { useEffect, useRef } from "react"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { useSelection } from "@lib/workspace/use-selection"

const SCROLL_OFFSET_TOP = 130

export function useScrollSelectionIntoView() {
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

      // Check if element is already in view with 150px margin from top
      if (!isInView) {
        // Calculate the scroll position to show element 150px from top
        const scrollPosition = elRect.top - SCROLL_OFFSET_TOP

        // Scroll to the calculated position with smooth behavior
        scrollerRef.current.scrollTo({
          top: scrollPosition,
          behavior: "smooth",
        })
      }
    }
  }, [autoScrollToSelection, selectedBoardId, selectedNodeId])

  return scrollerRef
}
