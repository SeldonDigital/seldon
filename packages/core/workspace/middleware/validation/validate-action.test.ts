import { describe, expect, it } from "bun:test"
import { FONT_COLLECTION_COMPONENT_CATALOG_IDS } from "../../helpers/components/resource-component-catalog-ids"
import { validateAction } from "./validate-action"
import { WorkspaceValidationError } from "./workspace-validation-error"
import type { Workspace } from "../../types"

function minimalWorkspace(overrides: Partial<Workspace> = {}): Workspace {
  return {
    metadata: { owner: "", label: "", version: 0 },
    components: {},
    nodes: {},
    themes: {},
    "font-collections": {},
    "icon-sets": {},
    media: {},
    ...overrides,
  } as Workspace
}

describe("validateAction", () => {
  it("rejects unknown font collection catalog ids", () => {
    const workspace = minimalWorkspace()
    const catalogId = [...FONT_COLLECTION_COMPONENT_CATALOG_IDS][0]

    expect(() =>
      validateAction(workspace, {
        type: "add_font_collection",
        payload: { catalogId: "not-a-real-catalog" },
      }),
    ).toThrow(WorkspaceValidationError)
  })

  it("allows add_font_collection for packaged catalogs", () => {
    const workspace = minimalWorkspace()
    const catalogId = [...FONT_COLLECTION_COMPONENT_CATALOG_IDS][0]

    expect(() =>
      validateAction(workspace, {
        type: "add_font_collection",
        payload: { catalogId },
      }),
    ).not.toThrow()
  })

  it("requires existing node for duplicate_node", () => {
    const workspace = minimalWorkspace()

    expect(() =>
      validateAction(workspace, {
        type: "duplicate_node",
        payload: { nodeId: "missing-node" },
      }),
    ).toThrow(/not found/)
  })

  it("requires component or playground board for add_variant", () => {
    const workspace = minimalWorkspace({
      components: {
        themeBoard: {
          type: "theme",
          level: "module",
          catalogId: "default",
          label: "Theme",
          author: "Seldon Digital",
          componentTheme: "default",
          boardChromeId: "theme",
          componentProperties: {},
          variants: [],
        },
      },
    })

    expect(() =>
      validateAction(workspace, {
        type: "add_variant",
        payload: { componentKey: "themeBoard" },
      }),
    ).toThrow(/component or playground board/)
  })
})
