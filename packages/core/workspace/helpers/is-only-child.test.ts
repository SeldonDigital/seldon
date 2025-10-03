import { describe, expect, it } from "bun:test"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import { isOnlyChild } from "./is-only-child"

describe("isOnlyChild", () => {
  it("should return false for child with siblings", () => {
    expect(isOnlyChild("child-icon-K3GlMKHA", WORKSPACE_FIXTURE)).toBe(false)
  })

  it("should return false for another child with siblings", () => {
    expect(isOnlyChild("child-label-wCHRir3I", WORKSPACE_FIXTURE)).toBe(false)
  })

  it("should return true for only child", () => {
    // Create a minimal workspace with a single child
    const workspace = {
      version: 1,
      boards: {
        button: {
          id: "button",
          label: "Buttons",
          theme: "default",
          variants: ["variant-button-only"],
          properties: {},
          order: 0,
        },
      },
      byId: {
        "variant-button-only": {
          id: "variant-button-only",
          component: "button",
          level: "element",
          label: "Button",
          isChild: false,
          fromSchema: true,
          theme: null,
          type: "defaultVariant",
          properties: {},
          children: ["only-child"],
        },
        "only-child": {
          id: "only-child",
          component: "icon",
          level: "primitive",
          label: "Only Child",
          isChild: true,
          fromSchema: true,
          theme: null,
          variant: "variant-icon-default",
          instanceOf: "variant-icon-default",
          properties: {},
          children: [],
        },
      },
      customTheme: {},
    }

    expect(isOnlyChild("only-child", workspace)).toBe(true)
  })

  it("should throw error for non-existent child", () => {
    expect(() => {
      isOnlyChild("child-button-nonexistent", WORKSPACE_FIXTURE)
    }).toThrow()
  })
})
