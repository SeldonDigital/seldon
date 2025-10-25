import { beforeEach, describe, expect, it } from "bun:test"
import { calculateIndicatorPosition } from "./calculate-indicator-position"

// Mock window object for Node.js environment
const mockWindow = {
  getComputedStyle: () => ({ flexDirection: "row", gap: "10px" }),
}

// Mock DOMRect for Node.js environment
class MockDOMRect {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
  ) {}
  get top() {
    return this.y
  }
  get left() {
    return this.x
  }
  get bottom() {
    return this.y + this.height
  }
  get right() {
    return this.x + this.width
  }
}

// @ts-expect-error - Mocking global window for testing
global.window = mockWindow
// @ts-expect-error - Mocking global DOMRect for testing
global.DOMRect = MockDOMRect

describe("calculateIndicatorPosition", () => {
  let mockCanvasEl: HTMLElement
  let mockNodeEl: HTMLElement

  beforeEach(() => {
    mockCanvasEl = {
      getBoundingClientRect: () => new DOMRect(0, 0, 1000, 1000),
    } as HTMLElement

    mockNodeEl = {
      getBoundingClientRect: () => new DOMRect(100, 100, 200, 200),
      parentElement: {
        style: { flexDirection: "row", gap: "10px" },
      },
      previousElementSibling: {},
      nextElementSibling: {},
    } as unknown as HTMLElement

    Object.defineProperty(mockWindow, "getComputedStyle", {
      value: () => ({ flexDirection: "row", gap: "10px" }),
    })
  })

  describe("basic layout positioning", () => {
    it.each([
      {
        placement: "before" as const,
        orientation: "horizontal" as const,
        flexDirection: "column",
        expected: { height: 200, left: 98.5, top: 100, width: 3 },
        description: "before target in horizontal layout",
      },
      {
        placement: "after" as const,
        orientation: "horizontal" as const,
        flexDirection: "column",
        expected: { height: 200, left: 298.5, top: 100, width: 3 },
        description: "after target in horizontal layout",
      },
      {
        placement: "before" as const,
        orientation: "vertical" as const,
        flexDirection: "column",
        expected: { height: 3, left: 100, top: 98.5, width: 200 },
        description: "before target in vertical layout",
      },
      {
        placement: "after" as const,
        orientation: "vertical" as const,
        flexDirection: "column",
        expected: { height: 3, left: 100, top: 298.5, width: 200 },
        description: "after target in vertical layout",
      },
    ])(
      "calculates correct position for $description",
      ({ placement, orientation, flexDirection, expected }) => {
        Object.defineProperty(window, "getComputedStyle", {
          value: () => ({ flexDirection, gap: "10px" }),
        })

        const result = calculateIndicatorPosition({
          placement,
          orientation,
          containerElement: mockNodeEl,
          childElement: null,
          canvasElement: mockCanvasEl,
        })

        expect(result).toEqual(expected)
      },
    )
  })

  it("calculates position without child element", () => {
    const result = calculateIndicatorPosition({
      placement: "before",
      orientation: "horizontal",
      containerElement: mockNodeEl,
      childElement: null,
      canvasElement: mockCanvasEl,
    })

    expect(result).toEqual({
      top: 100,
      left: 98.5,
      width: 3,
      height: 200,
    })
  })

  describe("child element positioning", () => {
    let mockChildEl: HTMLElement

    beforeEach(() => {
      mockChildEl = {
        getBoundingClientRect: () => new DOMRect(120, 120, 80, 80),
        nextElementSibling: null,
      } as unknown as HTMLElement
    })

    describe("child element without next sibling", () => {
      it.each([
        {
          placement: "before" as const,
          orientation: "horizontal" as const,
          flexDirection: "row",
          expected: { height: 200, left: 198.5, top: 100, width: 3 },
          description: "before child in horizontal layout",
        },
        {
          placement: "after" as const,
          orientation: "horizontal" as const,
          flexDirection: "row",
          expected: { height: 200, left: 198.5, top: 100, width: 3 },
          description: "after child in horizontal layout",
        },
        {
          placement: "before" as const,
          orientation: "vertical" as const,
          flexDirection: "column",
          expected: { height: 3, left: 100, top: 198.5, width: 200 },
          description: "before child in vertical layout",
        },
        {
          placement: "after" as const,
          orientation: "vertical" as const,
          flexDirection: "column",
          expected: { height: 3, left: 100, top: 198.5, width: 200 },
          description: "after child in vertical layout",
        },
      ])(
        "calculates correct position for $description",
        ({ placement, orientation, flexDirection, expected }) => {
          Object.defineProperty(window, "getComputedStyle", {
            value: () => ({ flexDirection, gap: "10px" }),
          })

          const result = calculateIndicatorPosition({
            placement,
            orientation,
            containerElement: mockNodeEl,
            childElement: mockChildEl,
            canvasElement: mockCanvasEl,
          })

          expect(result).toEqual(expected)
        },
      )
    })

    describe("child element with next sibling (inBetween)", () => {
      beforeEach(() => {
        mockChildEl = {
          getBoundingClientRect: () => new DOMRect(120, 120, 80, 80),
          nextElementSibling: {},
        } as unknown as HTMLElement
      })

      it.each([
        {
          placement: "before" as const,
          orientation: "horizontal" as const,
          flexDirection: "row",
          expected: { height: 200, left: 203.5, top: 100, width: 3 },
          description: "before child in horizontal layout with gap",
        },
        {
          placement: "after" as const,
          orientation: "horizontal" as const,
          flexDirection: "row",
          expected: { height: 200, left: 203.5, top: 100, width: 3 },
          description: "after child in horizontal layout with gap",
        },
        {
          placement: "before" as const,
          orientation: "vertical" as const,
          flexDirection: "column",
          expected: { height: 3, left: 100, top: 203.5, width: 200 },
          description: "before child in vertical layout with gap",
        },
        {
          placement: "after" as const,
          orientation: "vertical" as const,
          flexDirection: "column",
          expected: { height: 3, left: 100, top: 203.5, width: 200 },
          description: "after child in vertical layout with gap",
        },
      ])(
        "calculates correct position for $description",
        ({ placement, orientation, flexDirection, expected }) => {
          Object.defineProperty(window, "getComputedStyle", {
            value: () => ({ flexDirection, gap: "10px" }),
          })

          const result = calculateIndicatorPosition({
            placement,
            orientation,
            containerElement: mockNodeEl,
            childElement: mockChildEl,
            canvasElement: mockCanvasEl,
          })

          expect(result).toEqual(expected)
        },
      )
    })

    it("calculates position with child element", () => {
      const result = calculateIndicatorPosition({
        placement: "before",
        orientation: "horizontal",
        containerElement: mockNodeEl,
        childElement: mockChildEl,
        canvasElement: mockCanvasEl,
      })

      expect(result).toEqual({
        top: 100,
        left: 198.5,
        width: 3,
        height: 200,
      })
    })

    it("handles container with padding correctly", () => {
      // Mock container with padding
      const mockNodeWithPadding = {
        getBoundingClientRect: () => new DOMRect(100, 100, 200, 200),
        parentElement: {
          style: { flexDirection: "row", gap: "10px" },
        },
        previousElementSibling: {},
        nextElementSibling: {},
      } as unknown as HTMLElement

      Object.defineProperty(window, "getComputedStyle", {
        value: () => ({
          flexDirection: "row",
          gap: "10px",
          paddingTop: "20px",
          paddingLeft: "15px",
          paddingRight: "15px",
          paddingBottom: "20px",
        }),
      })

      const result = calculateIndicatorPosition({
        placement: "before",
        orientation: "horizontal",
        containerElement: mockNodeWithPadding,
        childElement: mockChildEl,
        canvasElement: mockCanvasEl,
      })

      expect(result).toEqual({
        top: 120, // 100 + 20 (paddingTop)
        left: 198.5, // childRect.right (200) - LINE_WIDTH/2 (1.5)
        width: 3,
        height: 160, // 200 - 20 - 20 (paddingTop - paddingBottom)
      })
    })
  })
})
