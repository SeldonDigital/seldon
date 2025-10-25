/**
 * Calculates the distance between the drop location and a child element.
 *
 * @param {DOMRect} childRect - The bounding rectangle of the child element.
 * @param {number} currentPageX - The current X coordinate of the drop location.
 * @param {number} currentPageY - The current Y coordinate of the drop location.
 * @param {boolean} isHorizontal - Indicates whether the parent orientation is horizontal.
 * @returns The distance between the drop location and the child element based on the orientation.
 */
export function getChildDistance(
  childRect: DOMRect,
  currentPageX: number,
  currentPageY: number,
  isHorizontal: boolean,
) {
  // Calculate the distance from the drop location to the child
  // use the x distance if the orientation is horizontal, otherwise use the y distance
  const distanceX = currentPageX - childRect.left
  const distanceY = currentPageY - childRect.top
  const applicableDistance = isHorizontal ? distanceX : distanceY
  const distance = Math.sqrt(Math.pow(applicableDistance, 2))

  return distance
}
