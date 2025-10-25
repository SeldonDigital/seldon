import { expect, it } from "bun:test"
import { getIndexCoordinatesWithMargin } from "./get-index-coordinates-with-margin"

it.each([
  {
    childRect: {
      top: 200,
      left: 100,
    } as DOMRect,
    previousChildRect: null,
    expected: {
      topWithMargin: 200,
      leftWithMargin: 100,
    },
  },
  {
    childRect: {
      top: 200,
      left: 100,
    } as DOMRect,
    previousChildRect: {
      bottom: 150,
      right: 50,
    } as DOMRect,
    expected: {
      topWithMargin: 175,
      leftWithMargin: 75,
    },
  },
  {
    childRect: {
      top: 200,
      left: 100,
    } as DOMRect,
    previousChildRect: {
      bottom: 0,
      right: 50,
    } as DOMRect,
    expected: {
      topWithMargin: 100,
      leftWithMargin: 75,
    },
  },
])(
  "returns $expected when childRect is $childRect and previousChildRect is $previousChildRect",
  ({ childRect, previousChildRect, expected }) => {
    expect(
      getIndexCoordinatesWithMargin(childRect, previousChildRect),
    ).toStrictEqual(expected)
  },
)
