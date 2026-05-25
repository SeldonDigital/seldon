import { describe, expect, it } from "bun:test"
import { createEmptyWorkspace } from "../../../helpers/create-empty-workspace"
import { migrateConsolidateAdComponents } from "./migrate-consolidate-ad-components"

describe("migrateConsolidateAdComponents", () => {
  it("removes legacy platform ad boards and remaps catalog templates", () => {
    const workspace = {
      ...createEmptyWorkspace(),
      components: {
        adInstagram: {
          type: "component" as const,
          level: "part" as const,
          catalogId: "adInstagram",
          label: "Instagram Ad",
          author: "Seldon Digital",
          componentTheme: "theme-seldon-default",
          boardChromeId: "board-chrome-component-default",
          componentProperties: {},
          variants: [{ id: "component-adInstagram-default" }],
        },
      },
      nodes: {
        "component-adInstagram-default": {
          id: "component-adInstagram-default",
          type: "default" as const,
          level: "part" as const,
          label: "Instagram Ad",
          theme: null,
          template: "catalog:adInstagram",
          overrides: {},
        },
      },
    }

    const migrated = migrateConsolidateAdComponents(workspace)

    expect(migrated.components.adInstagram).toBeUndefined()
    expect(migrated.nodes["component-adInstagram-default"]).toBeUndefined()
    expect(migrated.nodes["component-adInstagram-remapped"]?.template).toBe(
      undefined,
    )
  })

  it("remaps catalog templates on nodes that referenced removed ad components", () => {
    const workspace = {
      ...createEmptyWorkspace(),
      nodes: {
        "instance-ad-1": {
          id: "instance-ad-1",
          type: "instance" as const,
          level: "part" as const,
          label: "Instagram Ad",
          theme: null,
          template: "catalog:adInstagram",
          overrides: {},
        },
      },
    }

    const migrated = migrateConsolidateAdComponents(workspace)

    expect(migrated.nodes["instance-ad-1"]?.template).toBe(
      "catalog:adSocialMedia",
    )
  })
})
