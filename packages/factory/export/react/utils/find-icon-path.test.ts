import { IconId } from "@seldon/core/icon-sets"
import { describe, expect, it } from "vitest"

import { getIconSourcePath, resolveIconExport } from "./find-icon-path"

describe("resolveIconExport", () => {
  it("returns the default icon export for the default id", () => {
    expect(resolveIconExport("__default__" as IconId, "/any/root")).toEqual({
      componentName: "IconDefault",
      relativePath: "IconDefault",
    })
  })

  it("returns null when no catalog file matches", () => {
    expect(
      resolveIconExport(
        "seldon-iconDoesNotExist" as IconId,
        "/nonexistent/root",
      ),
    ).toBeNull()
  })
})

describe("getIconSourcePath", () => {
  it("joins the catalog dir with the relative path and extension", () => {
    const resolved = {
      componentName: "IconDefault",
      relativePath: "IconDefault",
    }
    expect(getIconSourcePath(resolved, "/root")).toBe(
      "/root/packages/core/icon-sets/catalog/IconDefault.tsx",
    )
  })
})
