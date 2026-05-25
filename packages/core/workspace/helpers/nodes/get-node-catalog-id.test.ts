import { describe, expect, it } from "bun:test"
import { ComponentId } from "@seldon/core/components/constants"
import { getNodeCatalogId } from "./get-node-catalog-id"

describe("getNodeCatalogId", () => {
  it("resolves catalog id through node template links", () => {
    const workspace = {
      nodes: {
        "component-label-default": {
          id: "component-label-default",
          type: "default" as const,
          level: "primitive" as const,
          label: "Label",
          theme: null,
          template: "catalog:label",
          overrides: {},
        },
        "component-label-SXcfZVe6": {
          id: "component-label-SXcfZVe6",
          type: "instance" as const,
          level: "primitive" as const,
          label: "Label",
          theme: null,
          template: "node:component-label-default",
          overrides: {},
        },
      },
    }

    expect(
      getNodeCatalogId(workspace.nodes["component-label-SXcfZVe6"] as any, workspace as any),
    ).toBe(ComponentId.LABEL)
  })
})
