/**
 * Determines if the current cursor coordinates are halfway passed the last child element.
 *
 * @param {DOMRect} childRect - The bounding rectangle of the child element.
 * @param {number} currentPageX - The current X position of the cursor/drag event.
 * @param {number} currentPageY - The current Y position of the cursor/drag event.
 * @param {boolean} isHorizontal - A flag indicating if the scrolling direction is horizontal.
 * @returns A boolean value indicating if the current coordinates are halfway passed the last child element.
 */
export function getIsHalfwayPassedLastChild(
  childRect: DOMRect,
  currentPageX: number,
  currentPageY: number,
  isHorizontal: boolean,
) {
  if (isHorizontal) {
    return currentPageX > childRect.left + childRect.width / 2
  }

  return currentPageY > childRect.top + childRect.height / 2
}
