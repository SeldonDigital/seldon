import { describe, expect, it } from "vitest"

import {
  formatNodeCatalog,
  formatNodeLink,
  getThemeTemplateThemeId,
  normalizeThemeTemplateRef,
  parseNodeCatalog,
  parseNodeLink,
  parseNodeTemplate,
  parseThemeTemplate,
} from "./template-ref"

describe("parseNodeTemplate", () => {
  it("parses catalog and node refs", () => {
    expect(parseNodeTemplate("catalog:button")).toEqual({
      kind: "catalog",
      componentId: "button",
    })
    expect(parseNodeTemplate("node:abc")).toEqual({
      kind: "node",
      nodeId: "abc",
    })
  })

  it("returns null for malformed or unknown refs", () => {
    expect(parseNodeTemplate("bogus")).toBeNull()
    expect(parseNodeTemplate("a:b:c")).toBeNull()
    expect(parseNodeTemplate(":x")).toBeNull()
    expect(parseNodeTemplate("x:")).toBeNull()
    expect(parseNodeTemplate("other:x")).toBeNull()
  })
})

describe("parseNodeCatalog / parseNodeLink", () => {
  it("narrows to one kind only", () => {
    expect(parseNodeCatalog("catalog:button")).toEqual({
      kind: "catalog",
      componentId: "button",
    })
    expect(parseNodeCatalog("node:abc")).toBeNull()
    expect(parseNodeLink("node:abc")).toEqual({ kind: "node", nodeId: "abc" })
    expect(parseNodeLink("catalog:button")).toBeNull()
  })
})

describe("format helpers round-trip", () => {
  it("formats and re-parses node refs", () => {
    expect(formatNodeCatalog("button")).toBe("catalog:button")
    expect(formatNodeLink("abc")).toBe("node:abc")
    expect(parseNodeCatalog(formatNodeCatalog("button"))?.componentId).toBe(
      "button",
    )
    expect(parseNodeLink(formatNodeLink("abc"))?.nodeId).toBe("abc")
  })
})

describe("theme template refs", () => {
  it("parses catalog and theme refs", () => {
    expect(parseThemeTemplate("catalog:seldon")).toEqual({
      kind: "catalog",
      themeCatalogId: "seldon",
    })
    expect(parseThemeTemplate("theme:abc")).toEqual({
      kind: "theme",
      themeId: "abc",
    })
  })

  it("reduces refs to bare ids and reads theme ids", () => {
    expect(normalizeThemeTemplateRef("catalog:seldon")).toBe("seldon")
    expect(normalizeThemeTemplateRef("theme:abc")).toBe("abc")
    expect(normalizeThemeTemplateRef("plain")).toBe("plain")
    expect(getThemeTemplateThemeId("theme:abc")).toBe("abc")
    expect(getThemeTemplateThemeId("catalog:seldon")).toBeNull()
  })
})
