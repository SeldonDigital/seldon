import { describe, expect, test } from "bun:test"
import { getNodeIdForEventTarget } from "./get-node-id-for-event-target"

interface MockElement {
  tagName: string
  attributes: Record<string, string>
  parentElement: MockElement | null
  getAttribute: (name: string) => string | null
  setAttribute: (name: string, value: string) => void
}

describe("getNodeIdForEventTarget", () => {
  // Create mock elements that behave like DOM elements
  function createMockElement(
    tagName: string,
    attributes: Record<string, string> = {},
  ): MockElement {
    const element: MockElement = {
      tagName: tagName.toUpperCase(),
      attributes: { ...attributes },
      parentElement: null,
      getAttribute: (name: string) => element.attributes[name] || null,
      setAttribute: (name: string, value: string) => {
        element.attributes[name] = value
      },
    }
    return element
  }

  function createMockElementWithParent(
    tagName: string,
    attributes: Record<string, string> = {},
    parent?: MockElement,
  ): MockElement {
    const element = createMockElement(tagName, attributes)
    element.parentElement = parent || null
    return element
  }

  test("returns the node ID when the target element has a data-canvas-node-id", () => {
    const targetElement = createMockElement("div", {
      "data-canvas-node-id": "child-avatar-abc123",
    })
    const result = getNodeIdForEventTarget(
      targetElement as unknown as HTMLDivElement,
    )
    expect(result).toBe("child-avatar-abc123")
  })

  test("returns the closest ancestor's node ID when the target element doesn't have a data-canvas-node-id", () => {
    const parentElement = createMockElement("div", {
      "data-canvas-node-id": "child-avatar-def456",
    })
    const targetElement = createMockElementWithParent("span", {}, parentElement)
    const result = getNodeIdForEventTarget(
      targetElement as unknown as HTMLDivElement,
    )
    expect(result).toBe("child-avatar-def456")
  })

  test("returns null when no element with data-canvas-node-id is found", () => {
    const targetElement = createMockElement("div")
    const result = getNodeIdForEventTarget(
      targetElement as unknown as HTMLDivElement,
    )
    expect(result).toBeNull()
  })

  test("returns the correct node ID when there are multiple nested elements with data-canvas-node-id", () => {
    const grandParentElement = createMockElement("div", {
      "data-canvas-node-id": "child-avatar-ghi789",
    })
    const parentElement = createMockElementWithParent(
      "div",
      {
        "data-canvas-node-id": "child-avatar-jkl012",
      },
      grandParentElement,
    )
    const targetElement = createMockElementWithParent("span", {}, parentElement)
    const result = getNodeIdForEventTarget(
      targetElement as unknown as HTMLDivElement,
    )
    expect(result).toBe("child-avatar-jkl012")
  })
})
