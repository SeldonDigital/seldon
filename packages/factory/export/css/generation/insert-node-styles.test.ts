import { describe, expect, it } from "bun:test"
import { Classes } from "../types"
import { insertNodeStyles } from "./insert-node-styles"

// Using real implementations instead of mocks to avoid test interference

describe("insertNodeStyles", () => {
  it("should insert node styles into empty stylesheet", () => {
    const classes: Classes = {
      "sdn-button": {
        backgroundColor: "red",
        color: "white",
      },
    }

    const result = insertNodeStyles("", classes)

    expect(result).toContain("Component styles")
    expect(result).toContain(".sdn-button")
    expect(result).toContain("background-color: red")
    expect(result).toContain("color: white")
  })

  it("should append node styles to existing stylesheet", () => {
    const existingStylesheet =
      "/* Existing styles */\n.existing { color: red; }"
    const classes: Classes = {
      "sdn-button": {
        backgroundColor: "red",
        color: "white",
      },
    }

    const result = insertNodeStyles(existingStylesheet, classes)

    expect(result).toContain("/* Existing styles */")
    expect(result).toContain(".existing { color: red; }")
    expect(result).toContain("Component styles")
    expect(result).toContain(".sdn-button")
  })

  it("should handle multiple classes", () => {
    const classes: Classes = {
      "sdn-button": {
        backgroundColor: "red",
        color: "white",
      },
      "sdn-card": {
        backgroundColor: "blue",
        color: "black",
      },
    }

    const result = insertNodeStyles("", classes)

    expect(result).toContain(".sdn-button")
    expect(result).toContain(".sdn-card")
    expect(result).toContain("background-color: red")
    expect(result).toContain("background-color: blue")
  })

  it("should handle empty classes object", () => {
    const classes: Classes = {}

    const result = insertNodeStyles("", classes)

    expect(result).toContain("Component styles")
    expect(result).not.toContain(".sdn-")
  })

  it("should sort classes with tree depth information", () => {
    const classes: Classes = {
      "sdn-button-abc123": {
        backgroundColor: "red",
        color: "white",
      },
      "sdn-button": {
        backgroundColor: "blue",
        color: "black",
      },
    }

    const classNameToNodeId = {
      "sdn-button-abc123": "variant-button-1",
      "sdn-button": "variant-button-base",
    }

    const nodeTreeDepths = {
      "variant-button-1": 1,
      "variant-button-base": 0,
    }

    const result = insertNodeStyles(
      "",
      classes,
      classNameToNodeId,
      nodeTreeDepths,
    )

    expect(result).toContain("Component styles")
    expect(result).toContain(".sdn-button")
    expect(result).toContain(".sdn-button-abc123")
  })

  it("should handle classes without tree depth information", () => {
    const classes: Classes = {
      "sdn-button-abc123": {
        backgroundColor: "red",
        color: "white",
      },
      "sdn-card-def456": {
        backgroundColor: "blue",
        color: "black",
      },
    }

    const result = insertNodeStyles("", classes)

    expect(result).toContain("Component styles")
    expect(result).toContain(".sdn-button-abc123")
    expect(result).toContain(".sdn-card-def456")
  })

  it("should include proper CSS structure", () => {
    const classes: Classes = {
      "sdn-button": {
        backgroundColor: "red",
        color: "white",
      },
    }

    const result = insertNodeStyles("", classes)

    expect(result).toContain("/********************************************")
    expect(result).toContain("*             Component styles             *")
    expect(result).toContain("********************************************/")
  })

  it("should handle classes with complex CSS properties", () => {
    const classes: Classes = {
      "sdn-button": {
        backgroundColor: "red",
        color: "white",
        padding: "10px",
        margin: "5px",
        borderRadius: "4px",
      },
    }

    const result = insertNodeStyles("", classes)

    expect(result).toContain(".sdn-button")
    expect(result).toContain("background-color: red")
    expect(result).toContain("color: white")
  })

  it("should maintain consistent ordering for same component classes", () => {
    const classes: Classes = {
      "sdn-button-abc123": {
        backgroundColor: "red",
        color: "white",
      },
      "sdn-button-def456": {
        backgroundColor: "blue",
        color: "black",
      },
    }

    const result = insertNodeStyles("", classes)

    expect(result).toContain("Component styles")
    expect(result).toContain(".sdn-button-abc123")
    expect(result).toContain(".sdn-button-def456")
  })
})
