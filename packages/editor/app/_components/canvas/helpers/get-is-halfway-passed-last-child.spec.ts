import { expect, it } from "bun:test"
import { getIsHalfwayPassedLastChild } from "./get-is-halfway-passed-last-child"

it.each([
  // currentPageY is greater than half of the last child's height and isHorizontal is false
  {
    childRect: {
      top: 200,
      left: 200,
      height: 100,
      width: 100,
    } as DOMRect,
    currentPageX: 0,
    currentPageY: 251,
    isHorizontal: false,
    expected: true,
  },
  // Not halfway passed child, because currentPageY is less than half of child's height and isHorizontal is false
  {
    childRect: {
      top: 200,
      left: 200,
      height: 100,
      width: 100,
    } as DOMRect,
    currentPageX: 0,
    currentPageY: 251,
    isHorizontal: true,
    expected: false,
  },
  // currentPageX is greater than half of the last child's width and isHorizontal is true
  {
    childRect: {
      top: 200,
      left: 200,
      height: 100,
      width: 100,
    } as DOMRect,
    currentPageX: 251,
    currentPageY: 0,
    isHorizontal: true,
    expected: true,
  },
  // Not halfway passed child, because currentPageX is less than half of child's width and isHorizontal is true
  {
    childRect: {
      top: 200,
      left: 200,
      height: 100,
      width: 100,
    } as DOMRect,
    currentPageX: 249,
    currentPageY: 0,
    isHorizontal: true,
    expected: false,
  },
])(
  "returns the expected outcome when calculating whether the drop location is halfway passed the last child",
  ({ childRect, currentPageX, currentPageY, isHorizontal, expected }) => {
    expect(
      getIsHalfwayPassedLastChild(
        childRect,
        currentPageX,
        currentPageY,
        isHorizontal,
      ),
    ).toStrictEqual(expected)
  },
)
