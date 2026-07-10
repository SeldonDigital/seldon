import { describe, expect, it } from "vitest"

import { ExportOptions } from "../../types"
import { getUtilityFileContents } from "./generate-utility-file-contents"

const options = {
  output: { componentsFolder: "/src/components" },
} as unknown as ExportOptions

describe("getUtilityFileContents", () => {
  it("emits the class-name, apply-ref, icon-registry, and resize utility files", () => {
    const files = getUtilityFileContents(options)
    expect(files.map((f) => f.path)).toEqual([
      "/src/components/utils/class-name.ts",
      "/src/components/utils/apply-ref.ts",
      "/src/components/utils/icon-registry.ts",
      "/src/components/utils/resize.ts",
    ])
  })

  it("exports the resize helpers from the resize file", () => {
    const file = getUtilityFileContents(options).find((f) =>
      f.path.endsWith("resize.ts"),
    )
    expect(file?.content).toContain("export function getResizeHandleStyle")
    expect(file?.content).toContain("export function computeResizedRect")
    expect(file?.content).toContain("export function createResizeHandle")
  })

  it("exports the icon registry helpers from the icon-registry file", () => {
    const file = getUtilityFileContents(options).find((f) =>
      f.path.endsWith("icon-registry.ts"),
    )
    expect(file?.content).toContain("export function registerIcon")
    expect(file?.content).toContain("export function getRegisteredIcon")
  })

  it("exports combineClassNames from the class-name file", () => {
    const file = getUtilityFileContents(options).find((f) =>
      f.path.endsWith("class-name.ts"),
    )
    expect(file?.content).toContain("export function combineClassNames")
  })

  it("imports combineClassNames into the apply-ref file", () => {
    const file = getUtilityFileContents(options).find((f) =>
      f.path.endsWith("apply-ref.ts"),
    )
    expect(file?.content).toContain(
      'import { combineClassNames } from "./class-name"',
    )
    expect(file?.content).toContain("export function applyRef")
  })
})
