import { expect, it } from "bun:test"
import { getChildDistance } from "./get-child-distance"

it.each([
  // Vertical orientation, using y distance
  {
    childRect: {
      top: 200,
      left: 200,
    } as DOMRect,
    currentPageX: 0,
    currentPageY: 251,
    isHorizontal: false,
    expected: 51,
  },
  // Vertical orientation, using y distance, y = less than childRect.top
  {
    childRect: {
      top: 200,
      left: 200,
    } as DOMRect,
    currentPageX: 0,
    currentPageY: 53,
    isHorizontal: false,
    expected: 147,
  },
  // Horizontal orientation, using x distance
  {
    childRect: {
      top: 200,
      left: 200,
    } as DOMRect,
    currentPageX: 295,
    currentPageY: 0,
    isHorizontal: true,
    expected: 95,
  },
  // Horizontal orientation, using x distance, x = less than childRect.left
  {
    childRect: {
      top: 200,
      left: 200,
    } as DOMRect,
    currentPageX: 53,
    currentPageY: 0,
    isHorizontal: true,
    expected: 147,
  },
])(
  "returns $expected when childRect is $childRect and previousChildRect is $previousChildRect",
  ({ childRect, currentPageX, currentPageY, isHorizontal, expected }) => {
    expect(
      getChildDistance(childRect, currentPageX, currentPageY, isHorizontal),
    ).toStrictEqual(expected)
  },
)
