import { ComponentId } from "@seldon/core/components/constants"

export function getHtmlElementByBoardId(
  boardId: ComponentId,
): HTMLElement | null {
  return document.querySelector(`[data-board-id="${boardId}"]`)
}
