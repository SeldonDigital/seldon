import { describe, expect, it } from "vitest"

import { ExportOptions } from "../../types"
import { getUtilityFileContents } from "./generate-utility-file-contents"

const options = {
  output: { componentsFolder: "/src/components" },
} as unknown as ExportOptions

describe("getUtilityFileContents", () => {
  it("emits the class-name and apply-ref utility files", () => {
    const files = getUtilityFileContents(options)
    expect(files.map((f) => f.path)).toEqual([
      "/src/components/utils/class-name.ts",
      "/src/components/utils/apply-ref.ts",
    ])
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
    expect(file?.content).toContain('import { combineClassNames } from "./class-name"')
    expect(file?.content).toContain("export function applyRef")
  })
})
