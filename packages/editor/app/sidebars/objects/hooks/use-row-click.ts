import { MouseEvent } from "react"

/**
 * Hook that provides a click handler for row selection.
 * Prevents selection when clicking buttons and only selects when active tool is "select".
 *
 * @param options - Configuration for click behavior
 * @returns Click handler function
 */
export function useRowClick(options: {
  activeTool: string
  onSelect: (event: MouseEvent<HTMLElement>) => void
  onSelectCallback?: () => void
}) {
  const { activeTool, onSelect, onSelectCallback } = options

  return function onClick(event: MouseEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest("button")) {
      return
    }

    if (activeTool === "select") {
      event.stopPropagation()
      onSelect(event)
      onSelectCallback?.()
    }
  }
}
