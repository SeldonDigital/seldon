import { ComponentId } from "@seldon/core/components/constants"

export function getBoardIdForEventTarget(
  element: HTMLDivElement,
): ComponentId | null {
  return element.dataset.boardId as ComponentId | null
}
