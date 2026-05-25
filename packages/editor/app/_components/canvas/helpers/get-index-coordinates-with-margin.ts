/**
 * Calculates the margin-adjusted coordinate for a child element.
 *
 * @param {number} childStart - The top or left coordinate of the child element.
 * @param {number} previousChildEnd - The bottom or right coordinate of the previous child element.
 * @returns {number} - The calculated coordinate including half of the distance between the children.
 */
function calculateMarginAdjustedCoordinate(
  childStart: number,
  previousChildEnd: number,
): number {
  const margin = (childStart - previousChildEnd) / 2
  return previousChildEnd + margin
}

/**
 * Calculates the top and left coordinates of the child, taking the distance between the child and the previous child into account, hence "margin"
 *
 * @param {DOMRect} childRect - The DOMRect representing the current child element.
 * @param {DOMRect | null} previousChildRect - The DOMRect representing the previous child element, or null if there is no previous child.
 * @returns {{ topWithMargin: number, leftWithMargin: number }} - The calculated top and left coordinates including half of the distance between the children.
 */
export function getIndexCoordinatesWithMargin(
  childRect: DOMRect,
  previousChildRect: DOMRect | null,
) {
  let topWithMargin = childRect.top
  let leftWithMargin = childRect.left

  if (previousChildRect) {
    topWithMargin = calculateMarginAdjustedCoordinate(
      childRect.top,
      previousChildRect.bottom,
    )
    leftWithMargin = calculateMarginAdjustedCoordinate(
      childRect.left,
      previousChildRect.right,
    )
  }

  return { topWithMargin, leftWithMargin }
}
