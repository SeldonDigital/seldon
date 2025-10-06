import { describe, expect, it } from "bun:test"
import { getClassName } from "./class-name"

describe("getClassName", () => {
  it("should return className from nodeIdToClass mapping", () => {
    const nodeIdToClass = {
      "variant-button-default": "sdn-button",
      "child-icon-1": "sdn-icon",
      "variant-card-featured": "sdn-card-featured",
    }

    expect(getClassName("variant-button-default", nodeIdToClass)).toBe(
      "sdn-button",
    )
    expect(getClassName("child-icon-1", nodeIdToClass)).toBe("sdn-icon")
    expect(getClassName("variant-card-featured", nodeIdToClass)).toBe(
      "sdn-card-featured",
    )
  })

  it("should return undefined for non-existent nodeId", () => {
    const nodeIdToClass = {
      "variant-button-default": "sdn-button",
    }

    expect(getClassName("non-existent-node", nodeIdToClass)).toBeUndefined()
  })

  it("should handle empty nodeIdToClass mapping", () => {
    const nodeIdToClass = {}

    expect(
      getClassName("variant-button-default", nodeIdToClass),
    ).toBeUndefined()
  })

  it("should handle nodeIdToClass with empty string values", () => {
    const nodeIdToClass = {
      "variant-button-default": "",
      "child-icon-1": "sdn-icon",
    }

    expect(getClassName("variant-button-default", nodeIdToClass)).toBe("")
    expect(getClassName("child-icon-1", nodeIdToClass)).toBe("sdn-icon")
  })

  it("should handle nodeIdToClass with null values", () => {
    const nodeIdToClass = {
      "variant-button-default": null,
      "child-icon-1": "sdn-icon",
    }

    expect(getClassName("variant-button-default", nodeIdToClass)).toBeNull()
    expect(getClassName("child-icon-1", nodeIdToClass)).toBe("sdn-icon")
  })

  it("should handle nodeIdToClass with undefined values", () => {
    const nodeIdToClass = {
      "variant-button-default": undefined,
      "child-icon-1": "sdn-icon",
    }

    expect(
      getClassName("variant-button-default", nodeIdToClass),
    ).toBeUndefined()
    expect(getClassName("child-icon-1", nodeIdToClass)).toBe("sdn-icon")
  })

  it("should handle nodeIdToClass with complex class names", () => {
    const nodeIdToClass = {
      "variant-button-primary": "sdn-button sdn-button--primary",
      "child-icon-arrow": "sdn-icon sdn-icon--arrow",
      "variant-card-product-featured":
        "sdn-card sdn-card--product sdn-card--featured",
    }

    expect(getClassName("variant-button-primary", nodeIdToClass)).toBe(
      "sdn-button sdn-button--primary",
    )
    expect(getClassName("child-icon-arrow", nodeIdToClass)).toBe(
      "sdn-icon sdn-icon--arrow",
    )
    expect(getClassName("variant-card-product-featured", nodeIdToClass)).toBe(
      "sdn-card sdn-card--product sdn-card--featured",
    )
  })

  it("should handle nodeIdToClass with special characters in class names", () => {
    const nodeIdToClass = {
      "variant-button-default": "sdn-button--default",
      "child-icon-arrow-right": "sdn-icon--arrow-right",
      "variant-card-product-featured": "sdn-card--product-featured",
    }

    expect(getClassName("variant-button-default", nodeIdToClass)).toBe(
      "sdn-button--default",
    )
    expect(getClassName("child-icon-arrow-right", nodeIdToClass)).toBe(
      "sdn-icon--arrow-right",
    )
    expect(getClassName("variant-card-product-featured", nodeIdToClass)).toBe(
      "sdn-card--product-featured",
    )
  })

  it("should handle nodeIdToClass with numbers in class names", () => {
    const nodeIdToClass = {
      "variant-button-1": "sdn-button--1",
      "child-icon-2": "sdn-icon--2",
      "variant-card-3": "sdn-card--3",
    }

    expect(getClassName("variant-button-1", nodeIdToClass)).toBe(
      "sdn-button--1",
    )
    expect(getClassName("child-icon-2", nodeIdToClass)).toBe("sdn-icon--2")
    expect(getClassName("variant-card-3", nodeIdToClass)).toBe("sdn-card--3")
  })

  it("should handle nodeIdToClass with mixed case class names", () => {
    const nodeIdToClass = {
      "variant-button-default": "sdn-button--default",
      "child-icon-arrow": "sdn-icon--arrow",
      "variant-card-featured": "sdn-card--featured",
    }

    expect(getClassName("variant-button-default", nodeIdToClass)).toBe(
      "sdn-button--default",
    )
    expect(getClassName("child-icon-arrow", nodeIdToClass)).toBe(
      "sdn-icon--arrow",
    )
    expect(getClassName("variant-card-featured", nodeIdToClass)).toBe(
      "sdn-card--featured",
    )
  })

  it("should handle nodeIdToClass with very long class names", () => {
    const nodeIdToClass = {
      "variant-button-default":
        "sdn-button--very-long-class-name-with-many-words",
      "child-icon-arrow":
        "sdn-icon--another-very-long-class-name-with-many-words",
    }

    expect(getClassName("variant-button-default", nodeIdToClass)).toBe(
      "sdn-button--very-long-class-name-with-many-words",
    )
    expect(getClassName("child-icon-arrow", nodeIdToClass)).toBe(
      "sdn-icon--another-very-long-class-name-with-many-words",
    )
  })

  it("should handle nodeIdToClass with duplicate values", () => {
    const nodeIdToClass = {
      "variant-button-1": "sdn-button",
      "variant-button-2": "sdn-button",
      "child-icon-1": "sdn-icon",
      "child-icon-2": "sdn-icon",
    }

    expect(getClassName("variant-button-1", nodeIdToClass)).toBe("sdn-button")
    expect(getClassName("variant-button-2", nodeIdToClass)).toBe("sdn-button")
    expect(getClassName("child-icon-1", nodeIdToClass)).toBe("sdn-icon")
    expect(getClassName("child-icon-2", nodeIdToClass)).toBe("sdn-icon")
  })

  it("should handle nodeIdToClass with empty string keys", () => {
    const nodeIdToClass = {
      "": "sdn-empty",
      "variant-button-default": "sdn-button",
    }

    expect(getClassName("", nodeIdToClass)).toBe("sdn-empty")
    expect(getClassName("variant-button-default", nodeIdToClass)).toBe(
      "sdn-button",
    )
  })

  it("should handle nodeIdToClass with special characters in keys", () => {
    const nodeIdToClass = {
      "variant-button-default": "sdn-button--default",
      "child-icon-arrow-right": "sdn-icon--arrow-right",
      "variant-card-product-featured": "sdn-card--product-featured",
    }

    expect(getClassName("variant-button-default", nodeIdToClass)).toBe(
      "sdn-button--default",
    )
    expect(getClassName("child-icon-arrow-right", nodeIdToClass)).toBe(
      "sdn-icon--arrow-right",
    )
    expect(getClassName("variant-card-product-featured", nodeIdToClass)).toBe(
      "sdn-card--product-featured",
    )
  })
})
