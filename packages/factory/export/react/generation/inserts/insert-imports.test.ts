import { describe, expect, it } from "vitest"

import { ComponentToExport } from "../../../types"
import { insertImports } from "./insert-imports"

const frameComponent = (): ComponentToExport =>
  ({
    name: "Container",
    config: { react: { returns: "Frame" } },
    tree: { dataBinding: { props: {} } },
  }) as unknown as ComponentToExport

describe("insertImports", () => {
  it("prepends imports before the original source", () => {
    const out = insertImports("const body = 1", frameComponent())
    expect(out.endsWith("const body = 1")).toBe(true)
  })

  it("imports HTMLAttributes from react for a Frame component", () => {
    const out = insertImports("body", frameComponent())
    expect(out).toContain('import {HTMLAttributes} from "react"')
  })

  it("imports the Frame component from the frames folder", () => {
    const out = insertImports("body", frameComponent())
    expect(out).toContain('import {Frame} from "../frames/Frame"')
  })

  it("always imports the combineClassNames utility", () => {
    const out = insertImports("body", frameComponent())
    expect(out).toContain(
      'import {combineClassNames} from "../utils/class-name"',
    )
  })

  it("does not import applyRef for a childless component", () => {
    const out = insertImports("body", frameComponent())
    expect(out).not.toContain("apply-ref")
  })
})
