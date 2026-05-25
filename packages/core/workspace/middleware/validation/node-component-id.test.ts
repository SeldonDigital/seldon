import { describe, expect, it } from "bun:test"
import { ComponentId } from "@seldon/core/components/constants"
import { getNodeComponentId } from "./node-component-id"
import type { EntryNode, Workspace } from "../../types"

describe("getNodeComponentId", () => {
  it("resolves catalog id from a catalog template", () => {
    const node: EntryNode = {
      id: "component-button-default",
      type: "default",
      level: "element",
      label: "Button",
      theme: null,
      template: "catalog:button",
      overrides: {},
    }

    expect(getNodeComponentId(node, { nodes: { [node.id]: node } } as Workspace)).toBe(
      ComponentId.BUTTON,
    )
  })

  it("throws when template does not resolve to a catalog component", () => {
    const node: EntryNode = {
      id: "broken-node",
      type: "instance",
      level: "element",
      label: "Broken",
      theme: null,
      template: "catalog:unknown-component",
      overrides: {},
    }

    expect(() =>
      getNodeComponentId(node, { nodes: { [node.id]: node } } as Workspace),
    ).toThrow(/Invalid template/)
  })
})
