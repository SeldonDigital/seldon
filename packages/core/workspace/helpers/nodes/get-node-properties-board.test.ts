import { describe, expect, it } from "bun:test"
import { ValueType } from "@seldon/core"
import type { Workspace } from "../../types"
import { getNodeProperties } from "./get-node-properties"

describe("getNodeProperties for boards", () => {
  it("merges screen-like defaults into component board properties", () => {
    const workspace = {
      metadata: { version: 0, label: "", owner: "", lastUpdate: "", intent: "", tags: [] },
      components: {
        calendar: {
          type: "component" as const,
          level: "module" as const,
          catalogId: "calendar",
          label: "Calendars",
          author: "Test",
          componentTheme: "default",
          componentProperties: {},
          variants: [{ id: "component-calendar-default" }],
        },
      },
      nodes: {},
      themes: {},
      "font-collections": {},
      "icon-sets": {},
      media: {},
    } satisfies Workspace

    const props = getNodeProperties(workspace.components.calendar, workspace)

    expect(props.background).toEqual([
      expect.objectContaining({
        color: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.white",
        },
      }),
    ])
    expect(props.padding?.top?.value).toBe("@padding.comfortable")
  })
})
