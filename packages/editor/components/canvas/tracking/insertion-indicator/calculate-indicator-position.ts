import { Placement } from "@lib/types"

const LINE_WIDTH = 3

interface HighlightPosition {
  top: number
  left: number
  width: number
  height: number
}

interface CalculateHighlightPositionParams {
  placement: Placement
  orientation: "horizontal" | "vertical"
  containerElement: HTMLElement
  childElement: HTMLElement | null
  canvasElement: HTMLElement
}

/**
 * Horizontally oriented elements show a highlight along the left or right side of element
 * Vertically oriented elements show a highlight along the top or bottom side of element
 */
export function calculateIndicatorPosition({
  placement,
  orientation,
  containerElement,
  childElement,
  canvasElement,
}: CalculateHighlightPositionParams): HighlightPosition {
  const canvasRect = canvasElement.getBoundingClientRect()
  const containerRect = containerElement.getBoundingClientRect()
  const childRect = childElement?.getBoundingClientRect()
  const containerStyle = window.getComputedStyle(containerElement)
  const paddingTop = parseFloat(containerStyle.paddingTop) || 0
  const paddingLeft = parseFloat(containerStyle.paddingLeft) || 0
  const paddingRight = parseFloat(containerStyle.paddingRight) || 0
  const paddingBottom = parseFloat(containerStyle.paddingBottom) || 0

  // If the child element that we're highlighting has both a previous and next sibling,
  // we need to adjust the position to account for the container gap
  const inBetween = Boolean(childElement?.nextElementSibling)
  const gap = parseFloat(containerStyle.gap) || 0

  if (orientation === "horizontal") {
    // Render vertical line
    const width = LINE_WIDTH
    const height = containerRect.height - paddingTop - paddingBottom
    const top = containerRect.top + paddingTop

    const left = childRect
      ? inBetween
        ? childRect.right + gap / 2
        : childRect.right
      : placement === "before"
        ? inBetween
          ? containerRect.left - gap / 2
          : containerRect.left + paddingLeft
        : inBetween
          ? containerRect.right + gap / 2
          : containerRect.right

    return {
      top: top - canvasRect.top,
      left: left - canvasRect.left - LINE_WIDTH / 2,
      width: width,
      height: height,
    }
  } else {
    // Render horizontal line
    const height = LINE_WIDTH
    const width = containerRect.width - paddingLeft - paddingRight
    const left = containerRect.left + paddingLeft

    const top = childRect
      ? inBetween
        ? childRect.bottom + gap / 2
        : childRect.bottom
      : placement === "before"
        ? inBetween
          ? containerRect.top - gap / 2
          : containerRect.top + paddingTop
        : inBetween
          ? containerRect.bottom + gap / 2
          : containerRect.bottom

    return {
      top: top - canvasRect.top - LINE_WIDTH / 2,
      left: left - canvasRect.left,
      width: width,
      height: height,
    }
  }
}
